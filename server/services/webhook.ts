import { db } from '../db.js';
import { webhookLogs, siteSettings } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface WebhookEvent {
  event: 'publish' | 'unpublish' | 'update' | 'delete';
  contentType: 'page' | 'blog_post' | 'experience' | 'accommodation' | 'gastronomy_item';
  contentId: number;
  slug?: string;
  oldSlug?: string;
}

export class WebhookService {
  /**
   * Process a webhook event and trigger appropriate actions
   */
  static async processEvent(event: WebhookEvent): Promise<void> {
    console.log(`🔔 Processing webhook event:`, event);

    try {
      // Log the webhook event
      await db.insert(webhookLogs).values({
        event: event.event,
        contentType: event.contentType,
        contentId: event.contentId,
        status: 'pending',
      });

      // Handle different event types
      switch (event.event) {
        case 'publish':
        case 'unpublish':
        case 'update':
          await this.handleContentChange(event);
          break;
        case 'delete':
          await this.handleContentDeletion(event);
          break;
      }

      // Update webhook log status
      await this.updateWebhookStatus(event, 'success');
      console.log(`✅ Webhook event processed successfully`);

    } catch (error) {
      console.error(`❌ Webhook event failed:`, error);
      await this.updateWebhookStatus(event, 'error', error.message);
      throw error;
    }
  }

  /**
   * Handle content changes (publish, unpublish, update)
   */
  private static async handleContentChange(event: WebhookEvent): Promise<void> {
    const tasks = [];

    // Always regenerate sitemap for any content change
    tasks.push(this.regenerateSitemap());

    // Regenerate RSS if it's a blog post
    if (event.contentType === 'blog_post') {
      tasks.push(this.regenerateRSS());
    }

    // Handle slug changes for redirects
    if (event.oldSlug && event.slug && event.oldSlug !== event.slug) {
      tasks.push(this.createRedirect(event.oldSlug, event.slug));
    }

    await Promise.all(tasks);
  }

  /**
   * Handle content deletion
   */
  private static async handleContentDeletion(event: WebhookEvent): Promise<void> {
    // Regenerate sitemap to remove deleted content
    await this.regenerateSitemap();

    // Regenerate RSS if it's a blog post
    if (event.contentType === 'blog_post') {
      await this.regenerateRSS();
    }
  }

  /**
   * Regenerate sitemap.xml
   */
  private static async regenerateSitemap(): Promise<void> {
    console.log('🗺️ Regenerating sitemap.xml...');
    
    try {
      // This will be implemented in the sitemap service
      const { SitemapService } = await import('./sitemap.js');
      await SitemapService.generateSitemap();
      console.log('✅ Sitemap regenerated successfully');
    } catch (error) {
      console.error('❌ Failed to regenerate sitemap:', error);
      throw error;
    }
  }

  /**
   * Regenerate RSS.xml
   */
  private static async regenerateRSS(): Promise<void> {
    console.log('📰 Regenerating RSS.xml...');
    
    try {
      // This will be implemented in the RSS service
      const { RSSService } = await import('./rss.js');
      await RSSService.generateRSS();
      console.log('✅ RSS regenerated successfully');
    } catch (error) {
      console.error('❌ Failed to regenerate RSS:', error);
      throw error;
    }
  }

  /**
   * Create redirect for slug changes
   */
  private static async createRedirect(oldSlug: string, newSlug: string): Promise<void> {
    console.log(`🔀 Creating redirect: ${oldSlug} -> ${newSlug}`);
    
    try {
      const { RedirectService } = await import('./redirect.js');
      await RedirectService.createRedirect(oldSlug, newSlug);
      console.log('✅ Redirect created successfully');
    } catch (error) {
      console.error('❌ Failed to create redirect:', error);
      throw error;
    }
  }

  /**
   * Update webhook log status
   */
  private static async updateWebhookStatus(
    event: WebhookEvent, 
    status: 'success' | 'error', 
    error?: string
  ): Promise<void> {
    try {
      await db.update(webhookLogs)
        .set({ 
          status, 
          error: error || null,
          response: status === 'success' ? { message: 'Processed successfully' } : null
        })
        .where(eq(webhookLogs.contentId, event.contentId));
    } catch (logError) {
      console.error('Failed to update webhook log:', logError);
    }
  }

  /**
   * Get webhook configuration from site settings
   */
  static async getWebhookConfig(): Promise<any> {
    try {
      const [config] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, 'webhook_config'))
        .limit(1);

      return config?.value || {
        enabled: true,
        sitemapEnabled: true,
        rssEnabled: true,
        redirectsEnabled: true,
        googlePingEnabled: true
      };
    } catch (error) {
      console.error('Failed to get webhook config:', error);
      return { enabled: false };
    }
  }
}
