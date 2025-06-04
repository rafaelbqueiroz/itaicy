import { Router } from 'express';
import { z } from 'zod';
import { InternalLinkService } from '../../services/internal-links.js';

const router = Router();

// Internal link request schema
const internalLinkRequestSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  contentType: z.string().optional(),
  excludeSlug: z.string().optional(),
});

/**
 * POST /api/automation/internal-links/suggestions
 * Generate internal link suggestions for content
 */
router.post('/suggestions', async (req, res) => {
  try {
    const request = internalLinkRequestSchema.parse(req.body);
    
    console.log('🔗 Generating internal link suggestions...');

    // Generate suggestions using AI and content matching
    const suggestions = await InternalLinkService.generateSuggestions(request);

    res.json({
      success: true,
      suggestions,
      count: suggestions.length,
      message: `Generated ${suggestions.length} link suggestions`,
    });

  } catch (error) {
    console.error('❌ Failed to generate link suggestions:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate link suggestions',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/internal-links/popular-targets
 * Get popular internal link targets
 */
router.get('/popular-targets', async (req, res) => {
  try {
    console.log('📊 Getting popular link targets...');

    const targets = await InternalLinkService.getPopularTargets();

    res.json({
      success: true,
      targets,
      count: targets.length,
    });

  } catch (error) {
    console.error('❌ Failed to get popular targets:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get popular targets',
      message: error.message,
    });
  }
});

/**
 * POST /api/automation/internal-links/validate
 * Validate internal link suggestions
 */
router.post('/validate', async (req, res) => {
  try {
    const { urls } = z.object({
      urls: z.array(z.string().url()),
    }).parse(req.body);

    console.log(`🔍 Validating ${urls.length} URLs...`);

    const validationResults = await Promise.all(
      urls.map(async (url) => {
        try {
          // Check if URL is internal and exists
          const isInternal = url.includes('itaicy.com.br') || url.startsWith('/');
          
          if (!isInternal) {
            return {
              url,
              valid: false,
              reason: 'External URL',
            };
          }

          // For internal URLs, we could check if the content exists
          // This is a simplified validation
          return {
            url,
            valid: true,
            reason: 'Valid internal URL',
          };

        } catch (error) {
          return {
            url,
            valid: false,
            reason: error.message,
          };
        }
      })
    );

    const validCount = validationResults.filter(r => r.valid).length;

    res.json({
      success: true,
      results: validationResults,
      summary: {
        total: urls.length,
        valid: validCount,
        invalid: urls.length - validCount,
      },
    });

  } catch (error) {
    console.error('❌ Failed to validate URLs:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to validate URLs',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/internal-links/stats
 * Get internal linking statistics
 */
router.get('/stats', async (req, res) => {
  try {
    console.log('📈 Getting internal link statistics...');

    // This could be expanded to track actual link usage
    const stats = {
      totalSuggestions: 0, // Would track from database
      totalClicks: 0, // Would track from analytics
      popularKeywords: [], // Would analyze from usage data
      topTargets: [], // Would get from analytics
    };

    res.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('❌ Failed to get link stats:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get link statistics',
      message: error.message,
    });
  }
});

export default router;
