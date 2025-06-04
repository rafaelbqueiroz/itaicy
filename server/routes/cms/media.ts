/**
 * Sprint 1 - CMS Media Management Routes
 * Handles file uploads, optimization, and media library management
 */

import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { db } from '../../db';
import { mediaFiles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../services/auth';

const router = Router();

// Supabase client for storage
const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU1OTUzOSwiZXhwIjoyMDY0MTM1NTM5fQ.HZxE0ExPuU8oRhmuLQeD0yJzVN1fYZBf9aZVfUBb3FU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'video/mp4',
      'video/webm'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  }
});

// Image optimization breakpoints
const IMAGE_BREAKPOINTS = [
  { width: 400, suffix: 'thumb' },
  { width: 768, suffix: '768' },
  { width: 1024, suffix: '1024' },
  { width: 1920, suffix: '1920' }
];

/**
 * Generate optimized image variants
 */
async function generateImageVariants(buffer: Buffer, originalName: string, mimeType: string) {
  const variants: Record<string, string> = {};
  const fileId = nanoid();
  const ext = mimeType === 'image/avif' ? 'avif' : 'webp';

  for (const breakpoint of IMAGE_BREAKPOINTS) {
    try {
      let optimized = sharp(buffer)
        .resize(breakpoint.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });

      // Convert to WebP or AVIF for optimization
      if (ext === 'avif') {
        optimized = optimized.avif({ quality: 75 });
      } else {
        optimized = optimized.webp({ quality: 75 });
      }

      const optimizedBuffer = await optimized.toBuffer();
      
      // Upload to Supabase Storage
      const fileName = `${fileId}-${breakpoint.suffix}.${ext}`;
      const filePath = `optimized/${breakpoint.width}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('media')
        .upload(filePath, optimizedBuffer, {
          contentType: `image/${ext}`,
          cacheControl: '31536000' // 1 year cache
        });

      if (!error) {
        variants[breakpoint.suffix] = filePath;
      }
    } catch (error) {
      console.warn(`Failed to generate ${breakpoint.suffix} variant:`, error);
    }
  }

  return variants;
}

/**
 * POST /api/cms/media/upload
 * Upload and process media files
 */
router.post('/upload', requireAuth(), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const { alt, caption } = req.body;

    // Generate unique filename
    const fileId = nanoid();
    const ext = originalname.split('.').pop()?.toLowerCase() || 'bin';
    const filename = `${fileId}.${ext}`;
    const originalPath = `originals/${filename}`;

    // Upload original file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(originalPath, buffer, {
        contentType: mimetype,
        cacheControl: '31536000'
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;
    let variants: Record<string, string> = {};

    if (mimetype.startsWith('image/')) {
      try {
        const metadata = await sharp(buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        // Generate optimized variants for images
        variants = await generateImageVariants(buffer, originalname, mimetype);
      } catch (error) {
        console.warn('Failed to process image metadata:', error);
      }
    }

    // Save to database
    const [mediaFile] = await db
      .insert(mediaFiles)
      .values({
        filename,
        originalName: originalname,
        path: originalPath,
        mimeType: mimetype,
        size,
        width,
        height,
        alt: alt || null,
        caption: caption || null,
        variants: Object.keys(variants).length > 0 ? variants : null
      })
      .returning();

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(originalPath);

    res.status(201).json({
      success: true,
      media: {
        ...mediaFile,
        url: urlData.publicUrl,
        variants: variants
      },
      message: 'Arquivo enviado com sucesso'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload do arquivo'
    });
  }
});

/**
 * GET /api/cms/media
 * Get media library with pagination and filters
 */
router.get('/', requireAuth(), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const type = req.query.type as string; // 'image' or 'video'

    const offset = (page - 1) * limit;

    let query = db.select().from(mediaFiles);

    // Apply filters
    if (search) {
      // Add search filter when implemented
    }

    if (type) {
      // Add type filter when implemented
    }

    const files = await query
      .limit(limit)
      .offset(offset)
      .orderBy(mediaFiles.uploadedAt);

    // Add public URLs
    const filesWithUrls = files.map(file => {
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(file.path);

      return {
        ...file,
        url: urlData.publicUrl
      };
    });

    res.json({
      success: true,
      media: filesWithUrls,
      pagination: {
        page,
        limit,
        total: files.length // TODO: Get actual total count
      }
    });

  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar arquivos de mídia'
    });
  }
});

/**
 * GET /api/cms/media/:id
 * Get single media file
 */
router.get('/:id', requireAuth(), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    const [file] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, id))
      .limit(1);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }

    // Add public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(file.path);

    res.json({
      success: true,
      media: {
        ...file,
        url: urlData.publicUrl
      }
    });

  } catch (error) {
    console.error('Get media file error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar arquivo'
    });
  }
});

/**
 * PUT /api/cms/media/:id
 * Update media file metadata
 */
router.put('/:id', requireAuth(), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    const updateSchema = z.object({
      alt: z.string().optional(),
      caption: z.string().optional()
    });

    const updates = updateSchema.parse(req.body);

    const [updatedFile] = await db
      .update(mediaFiles)
      .set(updates)
      .where(eq(mediaFiles.id, id))
      .returning();

    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }

    res.json({
      success: true,
      media: updatedFile,
      message: 'Arquivo atualizado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar arquivo'
    });
  }
});

/**
 * DELETE /api/cms/media/:id
 * Delete media file
 */
router.delete('/:id', requireAuth('editor'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    // Get file info before deletion
    const [file] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, id))
      .limit(1);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }

    // Delete from Supabase Storage
    await supabase.storage
      .from('media')
      .remove([file.path]);

    // Delete variants if they exist
    if (file.variants) {
      const variantPaths = Object.values(file.variants as Record<string, string>);
      await supabase.storage
        .from('media')
        .remove(variantPaths);
    }

    // Delete from database
    await db
      .delete(mediaFiles)
      .where(eq(mediaFiles.id, id));

    res.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });

  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar arquivo'
    });
  }
});

export default router;
