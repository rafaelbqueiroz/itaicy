import { db } from '../db.js';
import { siteSettings } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface GSCConfig {
  siteVerificationToken?: string;
  propertyUrl?: string;
  serviceAccountKey?: string;
  enabled: boolean;
}

export interface GSCSubmissionResult {
  success: boolean;
  message: string;
  submittedAt: string;
  error?: string;
}

export class GoogleSearchConsoleService {
  private static readonly BASE_URL = 'https://itaicy.com.br';

  /**
   * Get Google Search Console configuration
   */
  static async getConfig(): Promise<GSCConfig> {
    try {
      const [config] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, 'google_search_console'))
        .limit(1);

      return config?.value as GSCConfig || {
        enabled: false,
      };
    } catch (error) {
      console.error('Failed to get GSC config:', error);
      return { enabled: false };
    }
  }

  /**
   * Update Google Search Console configuration
   */
  static async updateConfig(config: Partial<GSCConfig>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const updatedConfig = { ...currentConfig, ...config };

      await db
        .insert(siteSettings)
        .values({
          key: 'google_search_console',
          value: updatedConfig,
          description: 'Google Search Console configuration',
          category: 'seo',
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: updatedConfig,
            updatedAt: new Date(),
          },
        });

      console.log('✅ GSC configuration updated');
    } catch (error) {
      console.error('❌ Failed to update GSC config:', error);
      throw error;
    }
  }

  /**
   * Generate site verification meta tag
   */
  static async generateVerificationTag(): Promise<string | null> {
    try {
      const config = await this.getConfig();
      
      if (!config.siteVerificationToken) {
        return null;
      }

      return `<meta name="google-site-verification" content="${config.siteVerificationToken}" />`;
    } catch (error) {
      console.error('Failed to generate verification tag:', error);
      return null;
    }
  }

  /**
   * Submit sitemap to Google Search Console
   */
  static async submitSitemap(sitemapUrl?: string): Promise<GSCSubmissionResult> {
    try {
      const config = await this.getConfig();
      
      if (!config.enabled) {
        return {
          success: false,
          message: 'Google Search Console integration is disabled',
          submittedAt: new Date().toISOString(),
        };
      }

      const sitemap = sitemapUrl || `${this.BASE_URL}/sitemap.xml`;
      
      // For now, we'll use the ping method since it doesn't require authentication
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Itaicy-GSC-Bot/1.0',
        },
      });

      if (response.ok) {
        console.log('✅ Sitemap submitted to Google successfully');
        
        // Log the submission
        await this.logSubmission('sitemap', sitemap, true);
        
        return {
          success: true,
          message: 'Sitemap submitted successfully',
          submittedAt: new Date().toISOString(),
        };
      } else {
        const error = `HTTP ${response.status}: ${response.statusText}`;
        console.warn('⚠️ Sitemap submission failed:', error);
        
        await this.logSubmission('sitemap', sitemap, false, error);
        
        return {
          success: false,
          message: 'Failed to submit sitemap',
          submittedAt: new Date().toISOString(),
          error,
        };
      }

    } catch (error) {
      console.error('❌ Sitemap submission error:', error);
      
      await this.logSubmission('sitemap', sitemapUrl || 'unknown', false, error.message);
      
      return {
        success: false,
        message: 'Sitemap submission failed',
        submittedAt: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check indexing status (placeholder for future GSC API integration)
   */
  static async checkIndexingStatus(): Promise<{
    totalPages: number;
    indexedPages: number;
    errors: number;
    warnings: number;
  }> {
    try {
      // This would use the GSC API to get actual indexing data
      // For now, return placeholder data
      return {
        totalPages: 0,
        indexedPages: 0,
        errors: 0,
        warnings: 0,
      };
    } catch (error) {
      console.error('Failed to check indexing status:', error);
      return {
        totalPages: 0,
        indexedPages: 0,
        errors: 0,
        warnings: 0,
      };
    }
  }

  /**
   * Get search performance data (placeholder for future GSC API integration)
   */
  static async getSearchPerformance(days: number = 30): Promise<{
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }> {
    try {
      // This would use the GSC API to get actual performance data
      // For now, return placeholder data
      return {
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
      };
    } catch (error) {
      console.error('Failed to get search performance:', error);
      return {
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
      };
    }
  }

  /**
   * Log GSC submission
   */
  private static async logSubmission(
    type: string,
    url: string,
    success: boolean,
    error?: string
  ): Promise<void> {
    try {
      const logData = {
        type,
        url,
        success,
        error: error || null,
        timestamp: new Date().toISOString(),
      };

      // Get existing logs
      const [existingLogs] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, 'gsc_submission_logs'))
        .limit(1);

      const logs = existingLogs?.value as any[] || [];
      logs.unshift(logData);

      // Keep only last 100 logs
      const trimmedLogs = logs.slice(0, 100);

      await db
        .insert(siteSettings)
        .values({
          key: 'gsc_submission_logs',
          value: trimmedLogs,
          description: 'Google Search Console submission logs',
          category: 'seo',
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: trimmedLogs,
            updatedAt: new Date(),
          },
        });

    } catch (error) {
      console.error('Failed to log GSC submission:', error);
    }
  }

  /**
   * Get submission logs
   */
  static async getSubmissionLogs(limit: number = 50): Promise<any[]> {
    try {
      const [logs] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, 'gsc_submission_logs'))
        .limit(1);

      const allLogs = logs?.value as any[] || [];
      return allLogs.slice(0, limit);

    } catch (error) {
      console.error('Failed to get submission logs:', error);
      return [];
    }
  }

  /**
   * Validate site verification token
   */
  static validateVerificationToken(token: string): boolean {
    // Basic validation for Google site verification token format
    return /^[a-zA-Z0-9_-]{43}$/.test(token);
  }

  /**
   * Get GSC dashboard URL
   */
  static getDashboardUrl(): string {
    return `https://search.google.com/search-console?resource_id=${encodeURIComponent(this.BASE_URL)}`;
  }

  /**
   * Check if GSC is properly configured
   */
  static async isConfigured(): Promise<{
    configured: boolean;
    issues: string[];
  }> {
    try {
      const config = await this.getConfig();
      const issues: string[] = [];

      if (!config.enabled) {
        issues.push('Google Search Console integration is disabled');
      }

      if (!config.siteVerificationToken) {
        issues.push('Site verification token is not set');
      } else if (!this.validateVerificationToken(config.siteVerificationToken)) {
        issues.push('Site verification token format is invalid');
      }

      return {
        configured: issues.length === 0,
        issues,
      };

    } catch (error) {
      console.error('Failed to check GSC configuration:', error);
      return {
        configured: false,
        issues: ['Failed to check configuration'],
      };
    }
  }
}
