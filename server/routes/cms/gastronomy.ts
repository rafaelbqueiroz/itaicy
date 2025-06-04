import { Router } from 'express';
import { db } from '../../db.js';
import { gastronomyItems } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createGastronomyItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.number().optional(),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0)
});

const updateGastronomyItemSchema = createGastronomyItemSchema.partial();

/**
 * GET /api/cms/gastronomy
 * Get all gastronomy items with pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;

    const offset = (page - 1) * limit;

    let query = db.select().from(gastronomyItems);

    if (search) {
      // Add search functionality when needed
    }

    if (category) {
      // Add category filter when needed
    }

    const allGastronomyItems = await query
      .orderBy(desc(gastronomyItems.updatedAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      gastronomyItems: allGastronomyItems,
      pagination: {
        page,
        limit,
        total: allGastronomyItems.length
      }
    });

  } catch (error) {
    console.error('Get gastronomy items error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar itens de gastronomia'
    });
  }
});

/**
 * GET /api/cms/gastronomy/:id
 * Get single gastronomy item by ID
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

    const [gastronomyItem] = await db
      .select()
      .from(gastronomyItems)
      .where(eq(gastronomyItems.id, id))
      .limit(1);

    if (!gastronomyItem) {
      return res.status(404).json({
        success: false,
        error: 'Item de gastronomia não encontrado'
      });
    }

    res.json({
      success: true,
      gastronomyItem
    });

  } catch (error) {
    console.error('Get gastronomy item error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar item de gastronomia'
    });
  }
});

/**
 * POST /api/cms/gastronomy
 * Create new gastronomy item
 */
router.post('/', async (req, res) => {
  try {
    const gastronomyItemData = createGastronomyItemSchema.parse(req.body);

    const [newGastronomyItem] = await db
      .insert(gastronomyItems)
      .values(gastronomyItemData)
      .returning();

    res.status(201).json({
      success: true,
      gastronomyItem: newGastronomyItem,
      message: 'Item de gastronomia criado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Create gastronomy item error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar item de gastronomia'
    });
  }
});

/**
 * PUT /api/cms/gastronomy/:id
 * Update gastronomy item
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

    const updates = updateGastronomyItemSchema.parse(req.body);

    const [updatedGastronomyItem] = await db
      .update(gastronomyItems)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(gastronomyItems.id, id))
      .returning();

    if (!updatedGastronomyItem) {
      return res.status(404).json({
        success: false,
        error: 'Item de gastronomia não encontrado'
      });
    }

    res.json({
      success: true,
      gastronomyItem: updatedGastronomyItem,
      message: 'Item de gastronomia atualizado com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update gastronomy item error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar item de gastronomia'
    });
  }
});

/**
 * DELETE /api/cms/gastronomy/:id
 * Delete gastronomy item
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

    const [deletedGastronomyItem] = await db
      .delete(gastronomyItems)
      .where(eq(gastronomyItems.id, id))
      .returning();

    if (!deletedGastronomyItem) {
      return res.status(404).json({
        success: false,
        error: 'Item de gastronomia não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Item de gastronomia excluído com sucesso'
    });

  } catch (error) {
    console.error('Delete gastronomy item error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir item de gastronomia'
    });
  }
});

export default router;
