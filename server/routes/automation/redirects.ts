import { Router } from 'express';
import { z } from 'zod';
import { RedirectService } from '../../services/redirect.js';

const router = Router();

// Redirect creation schema
const createRedirectSchema = z.object({
  fromPath: z.string().min(1, 'From path is required'),
  toPath: z.string().min(1, 'To path is required'),
  statusCode: z.number().int().min(300).max(399).default(301),
  description: z.string().optional(),
});

// Redirect update schema
const updateRedirectSchema = z.object({
  fromPath: z.string().optional(),
  toPath: z.string().optional(),
  statusCode: z.number().int().min(300).max(399).optional(),
  description: z.string().optional(),
});

/**
 * GET /api/automation/redirects
 * Get all active redirects
 */
router.get('/', async (req, res) => {
  try {
    console.log('📋 Getting all redirects...');

    const redirects = await RedirectService.getAllRedirects();

    res.json({
      success: true,
      redirects,
      count: redirects.length,
    });

  } catch (error) {
    console.error('❌ Failed to get redirects:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get redirects',
      message: error.message,
    });
  }
});

/**
 * POST /api/automation/redirects
 * Create a new redirect
 */
router.post('/', async (req, res) => {
  try {
    const data = createRedirectSchema.parse(req.body);
    
    console.log('➕ Creating new redirect:', data);

    // Validate the redirect
    const validation = RedirectService.validateRedirect(data);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid redirect data',
        details: validation.errors,
      });
    }

    // Create the redirect
    await RedirectService.createRedirect(
      data.fromPath,
      data.toPath,
      data.statusCode,
      data.description
    );

    res.status(201).json({
      success: true,
      message: 'Redirect created successfully',
      redirect: data,
    });

  } catch (error) {
    console.error('❌ Failed to create redirect:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create redirect',
      message: error.message,
    });
  }
});

/**
 * PUT /api/automation/redirects/:id
 * Update an existing redirect
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = updateRedirectSchema.parse(req.body);
    
    console.log(`✏️ Updating redirect ${id}:`, updates);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid redirect ID',
      });
    }

    // Validate the updates if they form a complete redirect
    if (updates.fromPath && updates.toPath) {
      const validation = RedirectService.validateRedirect({
        fromPath: updates.fromPath,
        toPath: updates.toPath,
        statusCode: updates.statusCode,
        description: updates.description,
      });

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid redirect data',
          details: validation.errors,
        });
      }
    }

    // Update the redirect
    await RedirectService.updateRedirect(id, updates);

    res.json({
      success: true,
      message: 'Redirect updated successfully',
      id,
      updates,
    });

  } catch (error) {
    console.error('❌ Failed to update redirect:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update redirect',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/automation/redirects/:id
 * Delete (deactivate) a redirect
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    console.log(`🗑️ Deleting redirect ${id}`);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid redirect ID',
      });
    }

    // Delete the redirect
    await RedirectService.deleteRedirect(id);

    res.json({
      success: true,
      message: 'Redirect deleted successfully',
      id,
    });

  } catch (error) {
    console.error('❌ Failed to delete redirect:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to delete redirect',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/redirects/check/:path
 * Check if a path has a redirect
 */
router.get('/check/*', async (req, res) => {
  try {
    const path = '/' + req.params[0]; // Get the full path after /check/
    
    console.log(`🔍 Checking redirect for path: ${path}`);

    const redirect = await RedirectService.getRedirect(path);

    if (redirect) {
      res.json({
        success: true,
        hasRedirect: true,
        redirect: {
          toPath: redirect.toPath,
          statusCode: redirect.statusCode,
        },
      });
    } else {
      res.json({
        success: true,
        hasRedirect: false,
      });
    }

  } catch (error) {
    console.error('❌ Failed to check redirect:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to check redirect',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/redirects/stats
 * Get redirect statistics
 */
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Getting redirect statistics...');

    const stats = await RedirectService.getRedirectStats();

    res.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('❌ Failed to get redirect stats:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get redirect statistics',
      message: error.message,
    });
  }
});

export default router;
