import { Request, Response } from 'express';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. Image processing will be disabled.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Configurações otimizadas para cada formato
const QUALITY_SETTINGS = {
  avif: {
    quality: 35, // AVIF é muito eficiente, qualidade baixa gera arquivos pequenos
    effort: 4,   // Balanço entre velocidade e compressão
    chromaSubsampling: '4:2:0' // Reduz tamanho mantendo qualidade visual
  },
  webp: {
    quality: 65, // WebP precisa de qualidade um pouco maior
    effort: 4,
    smartSubsample: true
  },
  jpeg: {
    quality: 75, // JPEG padrão
    progressive: true,
    mozjpeg: true
  }
};

// Breakpoints para diferentes tamanhos
const SIZE_BREAKPOINTS = {
  thumb: { width: 300, height: 300, fit: 'cover' as const },
  small: { width: 600, height: 400, fit: 'inside' as const },
  medium: { width: 1024, height: 768, fit: 'inside' as const },
  large: { width: 1920, height: 1280, fit: 'inside' as const },
  original: { fit: 'inside' as const } // Sem redimensionamento, apenas conversão
};

interface ProcessImageRequest {
  buffer: Buffer;
  filename: string;
  alt?: string;
  generateSizes?: (keyof typeof SIZE_BREAKPOINTS)[];
}

interface ProcessedVariant {
  format: 'avif' | 'webp' | 'jpeg';
  size: keyof typeof SIZE_BREAKPOINTS;
  path: string;
  url: string;
  fileSize: number;
  width: number;
  height: number;
}

/**
 * Processa uma imagem gerando múltiplos formatos e tamanhos otimizados
 */
export async function processImage(req: Request, res: Response) {
  try {
    if (!supabase) {
      return res.status(503).json({
        error: 'Serviço de processamento de imagem indisponível',
        details: 'Configuração do Supabase não encontrada'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { buffer, originalname } = req.file;
    const { alt = '', generateSizes = ['thumb', 'medium', 'original'] } = req.body;

    console.log(`🔄 Processando imagem: ${originalname}`);
    console.log(`📊 Tamanho original: ${(buffer.length / 1024).toFixed(1)} KB`);

    // Analisar imagem original
    const metadata = await sharp(buffer).metadata();
    console.log(`📐 Dimensões originais: ${metadata.width}x${metadata.height}`);
    console.log(`🎨 Formato original: ${metadata.format}`);

    const timestamp = Date.now();
    const baseName = originalname.replace(/\.[^/.]+$/, '');
    const variants: ProcessedVariant[] = [];

    // Processar cada tamanho solicitado
    for (const sizeKey of generateSizes) {
      const sizeConfig = SIZE_BREAKPOINTS[sizeKey];
      
      console.log(`🔧 Processando tamanho: ${sizeKey}`);

      // Configurar Sharp para este tamanho
      let sharpInstance = sharp(buffer);

      // Aplicar redimensionamento se necessário
      if (sizeConfig.width && sizeConfig.height) {
        sharpInstance = sharpInstance.resize(sizeConfig.width, sizeConfig.height, {
          fit: sizeConfig.fit,
          position: 'center',
          withoutEnlargement: true // Não aumentar imagens pequenas
        });
      } else if (sizeConfig.width || sizeConfig.height) {
        sharpInstance = sharpInstance.resize(sizeConfig.width, sizeConfig.height, {
          fit: sizeConfig.fit,
          withoutEnlargement: true
        });
      }

      // Gerar AVIF (prioridade máxima)
      try {
        const avifBuffer = await sharpInstance
          .clone()
          .avif(QUALITY_SETTINGS.avif)
          .toBuffer();

        const avifPath = `${timestamp}-${baseName}-${sizeKey}.avif`;
        
        const { error: avifError } = await supabase.storage
          .from('media')
          .upload(avifPath, avifBuffer, { 
            contentType: 'image/avif',
            upsert: true 
          });

        if (!avifError) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(avifPath);

          const avifMetadata = await sharp(avifBuffer).metadata();
          
          variants.push({
            format: 'avif',
            size: sizeKey,
            path: avifPath,
            url: publicUrl,
            fileSize: avifBuffer.length,
            width: avifMetadata.width || 0,
            height: avifMetadata.height || 0
          });

          console.log(`✅ AVIF ${sizeKey}: ${(avifBuffer.length / 1024).toFixed(1)} KB`);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao gerar AVIF ${sizeKey}:`, error);
      }

      // Gerar WebP (fallback principal)
      try {
        const webpBuffer = await sharpInstance
          .clone()
          .webp(QUALITY_SETTINGS.webp)
          .toBuffer();

        const webpPath = `${timestamp}-${baseName}-${sizeKey}.webp`;
        
        const { error: webpError } = await supabase.storage
          .from('media')
          .upload(webpPath, webpBuffer, { 
            contentType: 'image/webp',
            upsert: true 
          });

        if (!webpError) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(webpPath);

          const webpMetadata = await sharp(webpBuffer).metadata();
          
          variants.push({
            format: 'webp',
            size: sizeKey,
            path: webpPath,
            url: publicUrl,
            fileSize: webpBuffer.length,
            width: webpMetadata.width || 0,
            height: webpMetadata.height || 0
          });

          console.log(`✅ WebP ${sizeKey}: ${(webpBuffer.length / 1024).toFixed(1)} KB`);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao gerar WebP ${sizeKey}:`, error);
      }

      // Gerar JPEG (fallback universal)
      try {
        const jpegBuffer = await sharpInstance
          .clone()
          .jpeg(QUALITY_SETTINGS.jpeg)
          .toBuffer();

        const jpegPath = `${timestamp}-${baseName}-${sizeKey}.jpg`;
        
        const { error: jpegError } = await supabase.storage
          .from('media')
          .upload(jpegPath, jpegBuffer, { 
            contentType: 'image/jpeg',
            upsert: true 
          });

        if (!jpegError) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(jpegPath);

          const jpegMetadata = await sharp(jpegBuffer).metadata();
          
          variants.push({
            format: 'jpeg',
            size: sizeKey,
            path: jpegPath,
            url: publicUrl,
            fileSize: jpegBuffer.length,
            width: jpegMetadata.width || 0,
            height: jpegMetadata.height || 0
          });

          console.log(`✅ JPEG ${sizeKey}: ${(jpegBuffer.length / 1024).toFixed(1)} KB`);
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao gerar JPEG ${sizeKey}:`, error);
      }
    }

    if (variants.length === 0) {
      throw new Error('Nenhuma variante foi gerada com sucesso');
    }

    // Encontrar a melhor variante para URL principal (AVIF > WebP > JPEG)
    const primaryVariant = variants.find(v => v.format === 'avif' && v.size === 'original') ||
                          variants.find(v => v.format === 'webp' && v.size === 'original') ||
                          variants.find(v => v.format === 'jpeg' && v.size === 'original') ||
                          variants[0];

    // Detectar orientação
    const orientation = metadata.width! > metadata.height! ? 'landscape' : 'portrait';

    // Salvar no banco de dados
    const mediaData = {
      path: primaryVariant.path,
      alt: alt || baseName,
      original_url: primaryVariant.url,
      filename: baseName,
      file_size: buffer.length,
      mime_type: `image/${primaryVariant.format}`,
      orientation,
      processing_completed: true,
      is_thumb: false,
      // URLs diretas para cada formato (do tamanho original)
      avif_url: variants.find(v => v.format === 'avif' && v.size === 'original')?.url || null,
      webp_url: variants.find(v => v.format === 'webp' && v.size === 'original')?.url || null,
      jpeg_url: variants.find(v => v.format === 'jpeg' && v.size === 'original')?.url || null,
      // Paths para deleção
      avif_path: variants.find(v => v.format === 'avif' && v.size === 'original')?.path || null,
      webp_path: variants.find(v => v.format === 'webp' && v.size === 'original')?.path || null,
      jpeg_path: variants.find(v => v.format === 'jpeg' && v.size === 'original')?.path || null
    };

    const { data: mediaItem, error: dbError } = await supabase
      .from('media_library')
      .insert(mediaData)
      .select()
      .single();

    if (dbError) throw dbError;

    // Estatísticas de compressão
    const originalSizeKB = buffer.length / 1024;
    const avifVariant = variants.find(v => v.format === 'avif' && v.size === 'original');
    const compressionRatio = avifVariant ? 
      ((originalSizeKB - (avifVariant.fileSize / 1024)) / originalSizeKB * 100).toFixed(1) : 
      '0';

    console.log(`✅ Processamento concluído!`);
    console.log(`📊 ${variants.length} variantes geradas`);
    console.log(`🗜️ Compressão AVIF: ${compressionRatio}%`);

    res.json({
      success: true,
      data: {
        ...mediaItem,
        variants,
        stats: {
          originalSize: originalSizeKB,
          variantsGenerated: variants.length,
          compressionRatio: parseFloat(compressionRatio),
          formats: [...new Set(variants.map(v => v.format))]
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    res.status(500).json({ 
      error: 'Erro no processamento da imagem',
      details: error.message 
    });
  }
}
