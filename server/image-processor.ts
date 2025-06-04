/**
 * Sistema de processamento de imagens para o CMS
 * Implementa redimensionamento automático e otimização conforme Sprint 1
 */

import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Configurações de processamento baseadas nos breakpoints especificados
const IMAGE_SIZES = {
  // Hero images (full-width) - proporção 3:2
  hero_desktop: { width: 1920, height: 1280 },
  hero_tablet: { width: 1280, height: 853 },
  hero_mobile: { width: 768, height: 512 },

  // Galerias e cards - proporção 3:2
  gallery: { width: 1024, height: 683 },

  // Thumbs (preview) - proporção 3:2
  thumb: { width: 400, height: 267 },

  // Miniaturas 1:1 (corte centralizado)
  miniature: { width: 300, height: 300 }
};

const QUALITY_SETTINGS = {
  webp: 75,
  jpeg: 75,
  avif: 65
};

interface ProcessedImage {
  size: string;
  width: number;
  height: number;
  format: string;
  url: string;
  fileSize: number;
}

interface ImageProcessingResult {
  originalUrl: string;
  variants: ProcessedImage[];
  metadata: {
    originalWidth: number;
    originalHeight: number;
    originalFormat: string;
    originalSize: number;
    orientation: 'landscape' | 'portrait' | 'square';
  };
}

export class ImageProcessor {
  private supabase: any;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Processa uma imagem gerando múltiplas variações
   */
  async processImage(
    imageBuffer: Buffer,
    originalFilename: string,
    basePath: string = 'processed'
  ): Promise<ImageProcessingResult> {
    try {
      // Obter metadados da imagem original
      const metadata = await sharp(imageBuffer).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new Error('Não foi possível obter dimensões da imagem');
      }

      const orientation = this.getOrientation(metadata.width, metadata.height);
      const fileExtension = path.extname(originalFilename);
      const baseName = path.basename(originalFilename, fileExtension);
      
      // Upload da imagem original
      const originalPath = `${basePath}/original/${baseName}${fileExtension}`;
      const { error: originalError } = await this.supabase.storage
        .from('media')
        .upload(originalPath, imageBuffer, {
          contentType: `image/${metadata.format}`,
          upsert: true
        });

      if (originalError) throw originalError;

      const originalUrl = this.getPublicUrl(originalPath);
      
      // Processar variações
      const variants: ProcessedImage[] = [];
      
      for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
        // Ajustar dimensões baseado na orientação
        const targetDimensions = this.adjustDimensions(
          dimensions,
          orientation,
          metadata.width,
          metadata.height,
          sizeName
        );

        // Gerar variações em diferentes formatos
        const formats = ['webp', 'jpeg'];
        if (sizeName === 'miniature' || sizeName === 'thumb') {
          formats.unshift('avif'); // AVIF prioritário para miniaturas e thumbs
        }

        for (const format of formats) {
          const processedBuffer = await this.resizeAndOptimize(
            imageBuffer,
            targetDimensions,
            format as 'webp' | 'jpeg' | 'avif',
            sizeName
          );

          const processedPath = `${basePath}/${sizeName}/${baseName}-${sizeName}.${format}`;
          
          const { error: uploadError } = await this.supabase.storage
            .from('media')
            .upload(processedPath, processedBuffer, {
              contentType: `image/${format}`,
              upsert: true
            });

          if (!uploadError) {
            variants.push({
              size: sizeName,
              width: targetDimensions.width,
              height: targetDimensions.height,
              format,
              url: this.getPublicUrl(processedPath),
              fileSize: processedBuffer.length
            });
          }
        }
      }

      return {
        originalUrl,
        variants,
        metadata: {
          originalWidth: metadata.width,
          originalHeight: metadata.height,
          originalFormat: metadata.format || 'unknown',
          originalSize: imageBuffer.length,
          orientation
        }
      };

    } catch (error) {
      console.error('Erro no processamento de imagem:', error);
      throw error;
    }
  }

  /**
   * Redimensiona e otimiza uma imagem
   */
  private async resizeAndOptimize(
    buffer: Buffer,
    dimensions: { width: number; height: number },
    format: 'webp' | 'jpeg' | 'avif',
    sizeName?: string
  ): Promise<Buffer> {
    // Para miniaturas 1:1, usar crop centralizado
    const resizeOptions = sizeName === 'miniature'
      ? {
          fit: 'cover' as const,
          position: 'center' as const
        }
      : {
          fit: 'cover' as const,
          position: 'center' as const
        };

    let pipeline = sharp(buffer)
      .resize(dimensions.width, dimensions.height, resizeOptions);

    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ 
          quality: QUALITY_SETTINGS.webp,
          effort: 4 
        });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ 
          quality: QUALITY_SETTINGS.jpeg,
          progressive: true 
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({ 
          quality: QUALITY_SETTINGS.avif,
          effort: 4 
        });
        break;
    }

    return pipeline.toBuffer();
  }

  /**
   * Determina orientação da imagem
   */
  private getOrientation(width: number, height: number): 'landscape' | 'portrait' | 'square' {
    if (width === height) return 'square';
    return width > height ? 'landscape' : 'portrait';
  }

  /**
   * Ajusta dimensões baseado na orientação e tipo de imagem
   */
  private adjustDimensions(
    baseDimensions: { width: number; height: number },
    orientation: 'landscape' | 'portrait' | 'square',
    originalWidth: number,
    originalHeight: number,
    sizeName: string
  ): { width: number; height: number } {
    // Miniaturas sempre mantêm 1:1 (corte centralizado)
    if (sizeName === 'miniature') {
      return { width: 300, height: 300 };
    }

    // Para imagens portrait, inverter as dimensões (mantendo proporção 3:2 → 2:3)
    if (orientation === 'portrait') {
      // Hero images portrait
      if (sizeName.startsWith('hero_')) {
        switch (sizeName) {
          case 'hero_desktop': return { width: 1280, height: 1920 }; // 2:3
          case 'hero_tablet': return { width: 853, height: 1280 };   // 2:3
          case 'hero_mobile': return { width: 512, height: 768 };    // 2:3
        }
      }

      // Gallery e thumb portrait
      if (sizeName === 'gallery') return { width: 683, height: 1024 }; // 2:3
      if (sizeName === 'thumb') return { width: 267, height: 400 };     // 2:3
    }

    // Para landscape e square, usar dimensões base (proporção 3:2)
    return baseDimensions;
  }

  /**
   * Gera URL pública do Supabase Storage
   */
  private getPublicUrl(path: string): string {
    const { data } = this.supabase.storage
      .from('media')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Processa imagem a partir de arquivo
   */
  async processImageFile(file: File, basePath?: string): Promise<ImageProcessingResult> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return this.processImage(buffer, file.name, basePath);
  }

  /**
   * Gera srcset para imagens responsivas baseado nos breakpoints
   */
  generateSrcSet(variants: ProcessedImage[], format: 'webp' | 'jpeg' = 'webp', usage: 'hero' | 'gallery' | 'thumb' = 'gallery'): string {
    let relevantVariants: ProcessedImage[] = [];

    switch (usage) {
      case 'hero':
        // Para hero images, usar os três breakpoints principais
        relevantVariants = variants.filter(v =>
          v.format === format &&
          (v.size === 'hero_desktop' || v.size === 'hero_tablet' || v.size === 'hero_mobile')
        );
        break;
      case 'gallery':
        // Para galerias, usar gallery e thumb
        relevantVariants = variants.filter(v =>
          v.format === format &&
          (v.size === 'gallery' || v.size === 'thumb')
        );
        break;
      case 'thumb':
        // Para thumbs, usar thumb e miniature
        relevantVariants = variants.filter(v =>
          v.format === format &&
          (v.size === 'thumb' || v.size === 'miniature')
        );
        break;
    }

    return relevantVariants
      .sort((a, b) => a.width - b.width)
      .map(variant => `${variant.url} ${variant.width}w`)
      .join(', ');
  }

  /**
   * Gera picture element completo com breakpoints responsivos
   */
  generatePictureElement(
    variants: ProcessedImage[],
    alt: string,
    usage: 'hero' | 'gallery' | 'thumb' = 'gallery',
    className?: string
  ): string {
    const webpSrcSet = this.generateSrcSet(variants, 'webp', usage);
    const jpegSrcSet = this.generateSrcSet(variants, 'jpeg', usage);

    // Escolher fallback baseado no uso
    let fallbackImage: ProcessedImage | undefined;
    switch (usage) {
      case 'hero':
        fallbackImage = variants.find(v => v.format === 'jpeg' && v.size === 'hero_tablet');
        break;
      case 'gallery':
        fallbackImage = variants.find(v => v.format === 'jpeg' && v.size === 'gallery');
        break;
      case 'thumb':
        fallbackImage = variants.find(v => v.format === 'jpeg' && v.size === 'thumb');
        break;
    }

    // Gerar sizes attribute baseado no uso
    let sizes = '';
    switch (usage) {
      case 'hero':
        sizes = '(min-width: 1280px) 1920px, (min-width: 768px) 1280px, 768px';
        break;
      case 'gallery':
        sizes = '(min-width: 1024px) 1024px, 400px';
        break;
      case 'thumb':
        sizes = '(min-width: 400px) 400px, 300px';
        break;
    }

    return `
      <picture${className ? ` class="${className}"` : ''}>
        <source srcset="${webpSrcSet}" type="image/webp" sizes="${sizes}">
        <source srcset="${jpegSrcSet}" type="image/jpeg" sizes="${sizes}">
        <img src="${fallbackImage?.url || ''}" alt="${alt}" loading="lazy" width="${fallbackImage?.width || ''}" height="${fallbackImage?.height || ''}">
      </picture>
    `.trim();
  }

  /**
   * Limpa variações antigas de uma imagem
   */
  async cleanupImageVariants(baseName: string, basePath: string = 'processed'): Promise<void> {
    const pathsToDelete: string[] = [];

    // Coletar todos os caminhos possíveis
    for (const sizeName of Object.keys(IMAGE_SIZES)) {
      for (const format of ['webp', 'jpeg', 'avif']) {
        pathsToDelete.push(`${basePath}/${sizeName}/${baseName}-${sizeName}.${format}`);
      }
    }

    // Deletar em lote
    const { error } = await this.supabase.storage
      .from('media')
      .remove(pathsToDelete);

    if (error) {
      console.warn('Erro ao limpar variações antigas:', error);
    }
  }
}
