import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

export class ImageProcessor {
  constructor() {
    // Simplified version without Squoosh for now
  }

  /**
   * Detecta orientação da imagem (paisagem ou retrato)
   */
  async detectOrientation(buffer) {
    const metadata = await sharp(buffer).metadata();
    const { width = 0, height = 0 } = metadata;
    return width > height ? 'landscape' : 'portrait';
  }

  /**
   * Define breakpoints baseado na orientação e opções
   */
  getBreakpoints(orientation, options) {
    const baseBreakpoints = {
      landscape: [
        { width: 1920, height: 1280, suffix: 'xl', quality: 85 },
        { width: 1280, height: 853, suffix: 'lg', quality: 85 },
        { width: 1024, height: 683, suffix: 'md', quality: 85 },
        { width: 768, height: 512, suffix: 'sm', quality: 85 },
        { width: 400, height: 267, suffix: 'xs', quality: 80 }
      ],
      portrait: [
        { width: 1280, height: 1920, suffix: 'xl', quality: 85 },
        { width: 853, height: 1280, suffix: 'lg', quality: 85 },
        { width: 683, height: 1024, suffix: 'md', quality: 85 },
        { width: 512, height: 768, suffix: 'sm', quality: 85 },
        { width: 267, height: 400, suffix: 'xs', quality: 80 }
      ]
    };

    let breakpoints = baseBreakpoints[orientation];

    // Adicionar thumb quadrado se solicitado
    if (options.isThumb || options.forceSquare) {
      breakpoints.push({ width: 300, height: 300, suffix: 'thumb', quality: 80 });
    }

    return breakpoints;
  }

  /**
   * Processa uma imagem em múltiplos formatos e tamanhos
   */
  async processImage(originalBuffer, filename, options = { isThumb: false, forceSquare: false }) {
    const orientation = await this.detectOrientation(originalBuffer);
    const breakpoints = this.getBreakpoints(orientation, options);
    const baseFilename = filename.replace(/\.[^/.]+$/, '');
    
    const variants = [];
    
    // Upload da imagem original
    const supabaseClient = getSupabaseClient();
    const originalPath = `media/originals/${filename}`;
    const { error: originalError } = await supabaseClient.storage
      .from('media')
      .upload(originalPath, originalBuffer, {
        contentType: this.getContentType(filename),
        upsert: true
      });

    if (originalError) throw originalError;

    const { data: { publicUrl: originalUrl } } = supabaseClient.storage
      .from('media')
      .getPublicUrl(originalPath);

    // Processar cada breakpoint (versão simplificada)
    for (const breakpoint of breakpoints) {
      const isSquareCrop = options.forceSquare && breakpoint.suffix === 'thumb';

      // Redimensionar com Sharp
      let sharpInstance = sharp(originalBuffer);

      if (isSquareCrop) {
        sharpInstance = sharpInstance.resize(breakpoint.width, breakpoint.height, {
          fit: 'cover',
          position: 'center'
        });
      } else {
        sharpInstance = sharpInstance.resize(breakpoint.width, breakpoint.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Gerar apenas JPEG por enquanto (sem Squoosh)
      const jpegBuffer = await sharpInstance.jpeg({ quality: breakpoint.quality }).toBuffer();

      const jpegPath = `media/processed/${baseFilename}_${breakpoint.suffix}.jpg`;
      const { error } = await supabaseClient.storage
        .from('media')
        .upload(jpegPath, jpegBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (!error) {
        const { data: { publicUrl } } = supabaseClient.storage
          .from('media')
          .getPublicUrl(jpegPath);

        variants.push({
          url: publicUrl,
          format: 'jpeg',
          size: breakpoint.suffix,
          width: breakpoint.width,
          height: breakpoint.height,
          fileSize: jpegBuffer.byteLength
        });
      }
    }

    return {
      original: originalUrl,
      variants
    };
  }

  /**
   * Determina o content-type baseado na extensão
   */
  getContentType(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    const types = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'avif': 'image/avif'
    };
    return types[ext || ''] || 'image/jpeg';
  }
}

export const imageProcessor = new ImageProcessor();
