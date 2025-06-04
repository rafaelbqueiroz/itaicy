import { Router } from 'express';
import { db } from '../../db.js';
import { blogPosts } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1),
  readTimeMinutes: z.number().optional(),
  isPublished: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.date().optional()
});

const updateBlogPostSchema = createBlogPostSchema.partial();

/**
 * GET /api/cms/blog
 * Get all blog posts with pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;

    const offset = (page - 1) * limit;

    let query = db.select().from(blogPosts);

    if (search) {
      // Add search functionality when needed
    }

    if (category) {
      // Add category filter when needed
    }

    const allBlogPosts = await query
      .orderBy(desc(blogPosts.updatedAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      blogPosts: allBlogPosts,
      pagination: {
        page,
        limit,
        total: allBlogPosts.length
      }
    });

  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar posts do blog'
    });
  }
});

/**
 * GET /api/cms/blog/:id
 * Get single blog post by ID
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

    const [blogPost] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        error: 'Post do blog não encontrado'
      });
    }

    res.json({
      success: true,
      blogPost
    });

  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar post do blog'
    });
  }
});

/**
 * POST /api/cms/blog
 * Create new blog post
 */
router.post('/', async (req, res) => {
  try {
    const blogPostData = createBlogPostSchema.parse(req.body);

    const [newBlogPost] = await db
      .insert(blogPosts)
      .values(blogPostData)
      .returning();

    res.status(201).json({
      success: true,
      blogPost: newBlogPost,
      message: 'Post do blog criado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar post do blog'
    });
  }
});

/**
 * PUT /api/cms/blog/:id
 * Update blog post
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

    const updates = updateBlogPostSchema.parse(req.body);

    const [updatedBlogPost] = await db
      .update(blogPosts)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!updatedBlogPost) {
      return res.status(404).json({
        success: false,
        error: 'Post do blog não encontrado'
      });
    }

    res.json({
      success: true,
      blogPost: updatedBlogPost,
      message: 'Post do blog atualizado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar post do blog'
    });
  }
});

/**
 * DELETE /api/cms/blog/:id
 * Delete blog post
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    const [deletedBlogPost] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();

    if (!deletedBlogPost) {
      return res.status(404).json({
        success: false,
        error: 'Post do blog não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Post do blog excluído com sucesso'
    });

  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir post do blog'
    });
  }
});

export default router;
