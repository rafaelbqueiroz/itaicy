import { Router } from 'express';
import { db } from '../../db.js';
import { accommodations } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createAccommodationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  capacity: z.number().min(1),
  areaM2: z.number().optional(),
  pricePerNight: z.number().optional(),
  roomType: z.string().min(1),
  amenities: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

const updateAccommodationSchema = createAccommodationSchema.partial();

/**
 * GET /api/cms/accommodations
 * Get all accommodations with pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const offset = (page - 1) * limit;

    let query = db.select().from(accommodations);

    if (search) {
      // Add search functionality when needed
    }

    const allAccommodations = await query
      .orderBy(desc(accommodations.updatedAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      accommodations: allAccommodations,
      pagination: {
        page,
        limit,
        total: allAccommodations.length
      }
    });

  } catch (error) {
    console.error('Get accommodations error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar acomodações'
    });
  }
});

/**
 * GET /api/cms/accommodations/:id
 * Get single accommodation by ID
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

    const [accommodation] = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.id, id))
      .limit(1);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Acomodação não encontrada'
      });
    }

    res.json({
      success: true,
      accommodation
    });

  } catch (error) {
    console.error('Get accommodation error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar acomodação'
    });
  }
});

/**
 * POST /api/cms/accommodations
 * Create new accommodation
 */
router.post('/', async (req, res) => {
  try {
    const accommodationData = createAccommodationSchema.parse(req.body);

    const [newAccommodation] = await db
      .insert(accommodations)
      .values(accommodationData)
      .returning();

    res.status(201).json({
      success: true,
      accommodation: newAccommodation,
      message: 'Acomodação criada com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Create accommodation error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar acomodação'
    });
  }
});

/**
 * PUT /api/cms/accommodations/:id
 * Update accommodation
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

    const updates = updateAccommodationSchema.parse(req.body);

    const [updatedAccommodation] = await db
      .update(accommodations)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(accommodations.id, id))
      .returning();

    if (!updatedAccommodation) {
      return res.status(404).json({
        success: false,
        error: 'Acomodação não encontrada'
      });
    }

    res.json({
      success: true,
      accommodation: updatedAccommodation,
      message: 'Acomodação atualizada com sucesso'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    console.error('Update accommodation error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar acomodação'
    });
  }
});

/**
 * DELETE /api/cms/accommodations/:id
 * Delete accommodation
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

    const [deletedAccommodation] = await db
      .delete(accommodations)
      .where(eq(accommodations.id, id))
      .returning();

    if (!deletedAccommodation) {
      return res.status(404).json({
        success: false,
        error: 'Acomodação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Acomodação excluída com sucesso'
    });

  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir acomodação'
    });
  }
});

export default router;
