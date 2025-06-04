import { Router } from 'express';
import { db } from '../../db.js';
import { pages, pageBlocks } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
  template: z.string().default('page')
});

const updatePageSchema = createPageSchema.partial();

/**
 * GET /api/cms/pages
 * Get all pages with pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const offset = (page - 1) * limit;

    let query = db.select().from(pages);

    if (search) {
      // Add search functionality when needed
    }

    const allPages = await query
      .orderBy(desc(pages.updatedAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      pages: allPages,
      pagination: {
        page,
        limit,
        total: allPages.length
      }
    });

  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar páginas'
    });
  }
});

/**
 * GET /api/cms/pages/:id
 * Get single page by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, id))
      .limit(1);

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Página não encontrada'
      });
    }

    // Get page blocks
    const blocks = await db
      .select()
      .from(pageBlocks)
      .where(eq(pageBlocks.pageId, id))
      .orderBy(pageBlocks.position);

    res.json({
      success: true,
      page: {
        ...page,
        blocks
      }
    });

  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar página'
    });
  }
});

/**
 * POST /api/cms/pages
 * Create new page
 */
router.post('/', async (req, res) => {
  try {
    const pageData = createPageSchema.parse(req.body);

    const [newPage] = await db
      .insert(pages)
      .values(pageData)
      .returning();

    res.status(201).json({
      success: true,
      page: newPage,
      message: 'Página criada com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Create page error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar página'
    });
  }
});

/**
 * PUT /api/cms/pages/:id
 * Update page
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    const updates = updatePageSchema.parse(req.body);

    const [updatedPage] = await db
      .update(pages)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(pages.id, id))
      .returning();

    if (!updatedPage) {
      return res.status(404).json({
        success: false,
        error: 'Página não encontrada'
      });
    }

    res.json({
      success: true,
      page: updatedPage,
      message: 'Página atualizada com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update page error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar página'
    });
  }
});

export default router;
