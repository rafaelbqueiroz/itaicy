import { Router } from 'express';
import { z } from 'zod';
import { GoogleSearchConsoleService } from '../../services/google-search-console.js';

const router = Router();

// GSC configuration schema
const gscConfigSchema = z.object({
  siteVerificationToken: z.string().optional(),
  propertyUrl: z.string().url().optional(),
  serviceAccountKey: z.string().optional(),
  enabled: z.boolean().default(false),
});

/**
 * GET /api/automation/google-search-console/config
 * Get Google Search Console configuration
 */
router.get('/config', async (req, res) => {
  try {
    console.log('⚙️ Getting GSC configuration...');

    const config = await GoogleSearchConsoleService.getConfig();
    const status = await GoogleSearchConsoleService.isConfigured();

    res.json({
      success: true,
      config: {
        ...config,
        // Don't expose sensitive data
        serviceAccountKey: config.serviceAccountKey ? '[CONFIGURED]' : undefined,
      },
      status,
    });

  } catch (error) {
    console.error('❌ Failed to get GSC config:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get GSC configuration',
      message: error.message,
    });
  }
});

/**
 * PUT /api/automation/google-search-console/config
 * Update Google Search Console configuration
 */
router.put('/config', async (req, res) => {
  try {
    const config = gscConfigSchema.parse(req.body);
    
    console.log('⚙️ Updating GSC configuration...');

    // Validate verification token if provided
    if (config.siteVerificationToken && 
        !GoogleSearchConsoleService.validateVerificationToken(config.siteVerificationToken)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid site verification token format',
      });
    }

    await GoogleSearchConsoleService.updateConfig(config);

    res.json({
      success: true,
      message: 'GSC configuration updated successfully',
    });

  } catch (error) {
    console.error('❌ Failed to update GSC config:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid configuration data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update GSC configuration',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/google-search-console/verification-tag
 * Get site verification meta tag
 */
router.get('/verification-tag', async (req, res) => {
  try {
    console.log('🏷️ Getting verification tag...');

    const tag = await GoogleSearchConsoleService.generateVerificationTag();

    if (tag) {
      res.json({
        success: true,
        tag,
        message: 'Verification tag generated',
      });
    } else {
      res.json({
        success: false,
        message: 'No verification token configured',
      });
    }

  } catch (error) {
    console.error('❌ Failed to get verification tag:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get verification tag',
      message: error.message,
    });
  }
});

/**
 * POST /api/automation/google-search-console/submit-sitemap
 * Submit sitemap to Google Search Console
 */
router.post('/submit-sitemap', async (req, res) => {
  try {
    const { sitemapUrl } = z.object({
      sitemapUrl: z.string().url().optional(),
    }).parse(req.body);

    console.log('📤 Submitting sitemap to GSC...');

    const result = await GoogleSearchConsoleService.submitSitemap(sitemapUrl);

    if (result.success) {
      res.json({
        success: true,
        result,
        message: 'Sitemap submitted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        result,
        error: 'Sitemap submission failed',
      });
    }

  } catch (error) {
    console.error('❌ Failed to submit sitemap:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit sitemap',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/google-search-console/indexing-status
 * Get indexing status from GSC
 */
router.get('/indexing-status', async (req, res) => {
  try {
    console.log('📊 Getting indexing status...');

    const status = await GoogleSearchConsoleService.checkIndexingStatus();

    res.json({
      success: true,
      status,
    });

  } catch (error) {
    console.error('❌ Failed to get indexing status:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get indexing status',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/google-search-console/search-performance
 * Get search performance data from GSC
 */
router.get('/search-performance', async (req, res) => {
  try {
    const { days } = z.object({
      days: z.coerce.number().min(1).max(365).default(30),
    }).parse(req.query);

    console.log(`📈 Getting search performance for ${days} days...`);

    const performance = await GoogleSearchConsoleService.getSearchPerformance(days);

    res.json({
      success: true,
      performance,
      period: `${days} days`,
    });

  } catch (error) {
    console.error('❌ Failed to get search performance:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get search performance',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/google-search-console/submission-logs
 * Get GSC submission logs
 */
router.get('/submission-logs', async (req, res) => {
  try {
    const { limit } = z.object({
      limit: z.coerce.number().min(1).max(100).default(50),
    }).parse(req.query);

    console.log(`📋 Getting ${limit} submission logs...`);

    const logs = await GoogleSearchConsoleService.getSubmissionLogs(limit);

    res.json({
      success: true,
      logs,
      count: logs.length,
    });

  } catch (error) {
    console.error('❌ Failed to get submission logs:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get submission logs',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/google-search-console/dashboard-url
 * Get GSC dashboard URL
 */
router.get('/dashboard-url', async (req, res) => {
  try {
    const url = GoogleSearchConsoleService.getDashboardUrl();

    res.json({
      success: true,
      url,
    });

  } catch (error) {
    console.error('❌ Failed to get dashboard URL:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard URL',
      message: error.message,
    });
  }
});

export default router;
