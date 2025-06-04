import { Router } from 'express';
import { z } from 'zod';
import { WebhookService } from '../../services/webhook.js';
import { SitemapService } from '../../services/sitemap.js';
import { RSSService } from '../../services/rss.js';

const router = Router();

// Webhook event schema
const webhookEventSchema = z.object({
  event: z.enum(['publish', 'unpublish', 'update', 'delete']),
  contentType: z.enum(['page', 'blog_post', 'experience', 'accommodation', 'gastronomy_item']),
  contentId: z.number(),
  slug: z.string().optional(),
  oldSlug: z.string().optional(),
});

/**
 * POST /api/automation/webhooks/content
 * Process content change webhook
 */
router.post('/content', async (req, res) => {
  try {
    const event = webhookEventSchema.parse(req.body);
    
    console.log('📥 Received webhook event:', event);

    // Process the webhook event
    await WebhookService.processEvent(event);

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      event,
    });

  } catch (error) {
    console.error('❌ Webhook processing failed:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook data',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process webhook',
      message: error.message,
    });
  }
});

/**
 * POST /api/automation/webhooks/generate-sitemap
 * Manually trigger sitemap generation
 */
router.post('/generate-sitemap', async (req, res) => {
  try {
    console.log('🗺️ Manual sitemap generation triggered');

    await SitemapService.generateSitemap();

    res.json({
      success: true,
      message: 'Sitemap generated successfully',
      url: SitemapService.getSitemapUrl(),
    });

  } catch (error) {
    console.error('❌ Manual sitemap generation failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to generate sitemap',
      message: error.message,
    });
  }
});

/**
 * POST /api/automation/webhooks/generate-rss
 * Manually trigger RSS generation
 */
router.post('/generate-rss', async (req, res) => {
  try {
    console.log('📰 Manual RSS generation triggered');

    await RSSService.generateRSS();
    const metadata = await RSSService.getRSSMetadata();

    res.json({
      success: true,
      message: 'RSS generated successfully',
      url: RSSService.getRSSUrl(),
      metadata,
    });

  } catch (error) {
    console.error('❌ Manual RSS generation failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to generate RSS',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/webhooks/status
 * Get webhook system status
 */
router.get('/status', async (req, res) => {
  try {
    const config = await WebhookService.getWebhookConfig();

    res.json({
      success: true,
      config,
      endpoints: {
        sitemap: SitemapService.getSitemapUrl(),
        rss: RSSService.getRSSUrl(),
      },
    });

  } catch (error) {
    console.error('❌ Failed to get webhook status:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get webhook status',
      message: error.message,
    });
  }
});

/**
 * GET /api/automation/webhooks/logs
 * Get recent webhook logs
 */
router.get('/logs', async (req, res) => {
  try {
    const { db } = await import('../../db.js');
    const { webhookLogs } = await import('@shared/schema');
    const { desc } = await import('drizzle-orm');

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    const logs = await db
      .select()
      .from(webhookLogs)
      .orderBy(desc(webhookLogs.executedAt))
      .limit(limit);

    res.json({
      success: true,
      logs,
      total: logs.length,
    });

  } catch (error) {
    console.error('❌ Failed to get webhook logs:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to get webhook logs',
      message: error.message,
    });
  }
});

export default router;
