import { Router } from 'express';
import { db } from '../../db.js';
import { experiences } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas - matching actual database schema
const createExperienceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  price: z.number().min(0),
  category: z.string().min(1),
  duration: z.string().min(1),
  maxParticipants: z.number().min(1),
  includes: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  active: z.boolean().default(true)
});

const updateExperienceSchema = createExperienceSchema.partial();

/**
 * GET /api/cms/experiences
 * Get all experiences with pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const offset = (page - 1) * limit;

    let query = db.select().from(experiences);

    if (search) {
      // Add search functionality when needed
    }

    const allExperiences = await query
      .orderBy(desc(experiences.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      experiences: allExperiences,
      pagination: {
        page,
        limit,
        total: allExperiences.length
      }
    });

  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar experiências'
    });
  }
});

/**
 * GET /api/cms/experiences/:id
 * Get single experience by ID
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

    const [experience] = await db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .limit(1);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experiência não encontrada'
      });
    }

    res.json({
      success: true,
      experience
    });

  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar experiência'
    });
  }
});

/**
 * POST /api/cms/experiences
 * Create new experience
 */
router.post('/', async (req, res) => {
  try {
    const experienceData = createExperienceSchema.parse(req.body);

    const [newExperience] = await db
      .insert(experiences)
      .values(experienceData)
      .returning();

    res.status(201).json({
      success: true,
      experience: newExperience,
      message: 'Experiência criada com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Create experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar experiência'
    });
  }
});

/**
 * PUT /api/cms/experiences/:id
 * Update experience
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

    const updates = updateExperienceSchema.parse(req.body);

    const [updatedExperience] = await db
      .update(experiences)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(experiences.id, id))
      .returning();

    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        error: 'Experiência não encontrada'
      });
    }

    res.json({
      success: true,
      experience: updatedExperience,
      message: 'Experiência atualizada com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar experiência'
    });
  }
});

/**
 * DELETE /api/cms/experiences/:id
 * Delete experience
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

    const [deletedExperience] = await db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();

    if (!deletedExperience) {
      return res.status(404).json({
        success: false,
        error: 'Experiência não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Experiência excluída com sucesso'
    });

  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir experiência'
    });
  }
});

export default router;
