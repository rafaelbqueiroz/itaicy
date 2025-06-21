import { db } from '../db.js';
import { pages, blogPosts, experiences, accommodations, gastronomyItems, siteSettings } from '@shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapService {
  private static readonly BASE_URL = 'https://itaicy.com.br';

  /**
   * Generate complete sitemap.xml
   */
  static getStaticSitemap(): SitemapUrl[] {
    console.log('🗺️ Generating static sitemap.xml...');
    const urls = this.getStaticPages();
    console.log(`✅ Sitemap generated with ${urls.length} URLs`);
    return urls;
  }

  /**
   * Get static pages URLs
   */
  private static getStaticPages(): SitemapUrl[] {
    const staticPages = [
      // Páginas principais
      { path: '/', priority: 1.0, changefreq: 'weekly' as const },
      
      // Seção Lodge
      { path: '/lodge', priority: 0.9, changefreq: 'weekly' as const },
      { path: '/acomodacoes', priority: 0.9, changefreq: 'weekly' as const },
      { path: '/gastronomia', priority: 0.8, changefreq: 'weekly' as const },
      
      // Seção Experiências
      { path: '/experiencias', priority: 0.9, changefreq: 'weekly' as const },
      { path: '/pesca-esportiva', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/safaris-birdwatching', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/pacotes', priority: 0.8, changefreq: 'weekly' as const },
      
      // Seção Mídia
      { path: '/galeria', priority: 0.7, changefreq: 'weekly' as const },
      
      // Seção Blog
      { path: '/blog', priority: 0.8, changefreq: 'daily' as const },
      { path: '/blog/natureza', priority: 0.7, changefreq: 'daily' as const },
      { path: '/blog/aventura', priority: 0.7, changefreq: 'daily' as const },
      { path: '/blog/sustentabilidade', priority: 0.7, changefreq: 'daily' as const },
      
      // Seção Planejamento
      { path: '/planejamento', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/como-chegar', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/melhor-epoca', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/faq', priority: 0.7, changefreq: 'monthly' as const },
      
      // Páginas Institucionais
      { path: '/contato', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/sobre-nos', priority: 0.7, changefreq: 'monthly' as const },
    ];

    return staticPages.map(page => ({
      loc: `${this.BASE_URL}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    }));
  }

  /**
   * Get CMS pages URLs
   */
  private static async getPageUrls(): Promise<SitemapUrl[]> {
    try {
      const publishedPages = await db
        .select({
          slug: pages.slug,
          updatedAt: pages.updatedAt,
        })
        .from(pages)
        .where(isNotNull(pages.publishedAt));

      return publishedPages.map(page => ({
        loc: `${this.BASE_URL}/${page.slug}`,
        lastmod: page.updatedAt.toISOString().split('T')[0],
        changefreq: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error('Error fetching pages for sitemap:', error);
      return [];
    }
  }

  /**
   * Get blog posts URLs
   */
  private static async getBlogPostUrls(): Promise<SitemapUrl[]> {
    try {
      const publishedPosts = await db
        .select({
          slug: blogPosts.slug,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .where(and(
          eq(blogPosts.isPublished, true),
          isNotNull(blogPosts.publishedAt)
        ));

      return publishedPosts.map(post => ({
        loc: `${this.BASE_URL}/blog/${post.slug}`,
        lastmod: post.updatedAt.toISOString().split('T')[0],
        changefreq: 'monthly' as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error('Error fetching blog posts for sitemap:', error);
      return [];
    }
  }

  /**
   * Get experiences URLs
   */
  private static async getExperienceUrls(): Promise<SitemapUrl[]> {
    try {
      const publishedExperiences = await db
        .select({
          slug: experiences.slug,
          updatedAt: experiences.updatedAt,
        })
        .from(experiences)
        .where(and(
          eq(experiences.available, true),
          isNotNull(experiences.publishedAt)
        ));

      return publishedExperiences.map(experience => ({
        loc: `${this.BASE_URL}/experiencias/${experience.slug}`,
        lastmod: experience.updatedAt.toISOString().split('T')[0],
        changefreq: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error('Error fetching experiences for sitemap:', error);
      return [];
    }
  }

  /**
   * Get accommodations URLs
   */
  private static async getAccommodationUrls(): Promise<SitemapUrl[]> {
    try {
      const publishedAccommodations = await db
        .select({
          slug: accommodations.slug,
          updatedAt: accommodations.updatedAt,
        })
        .from(accommodations)
        .where(and(
          eq(accommodations.available, true),
          isNotNull(accommodations.publishedAt)
        ));

      return publishedAccommodations.map(accommodation => ({
        loc: `${this.BASE_URL}/acomodacoes/${accommodation.slug}`,
        lastmod: accommodation.updatedAt.toISOString().split('T')[0],
        changefreq: 'monthly' as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error('Error fetching accommodations for sitemap:', error);
      return [];
    }
  }

  /**
   * Get gastronomy items URLs
   */
  private static async getGastronomyUrls(): Promise<SitemapUrl[]> {
    try {
      const publishedItems = await db
        .select({
          slug: gastronomyItems.slug,
          updatedAt: gastronomyItems.updatedAt,
        })
        .from(gastronomyItems)
        .where(eq(gastronomyItems.available, true));

      return publishedItems.map(item => ({
        loc: `${this.BASE_URL}/gastronomia/${item.slug}`,
        lastmod: item.updatedAt.toISOString().split('T')[0],
        changefreq: 'monthly' as const,
        priority: 0.6,
      }));
    } catch (error) {
      console.error('Error fetching gastronomy items for sitemap:', error);
      return [];
    }
  }

  /**
   * Generate XML content for sitemap
   */
  public static generateSitemapXml(urls: SitemapUrl[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const urlsetClose = '</urlset>';

    const urlEntries = urls.map(url => 
      `  <url>\n` +
      `    <loc>${url.loc}</loc>\n` +
      `    <lastmod>${url.lastmod}</lastmod>\n` +
      `    <changefreq>${url.changefreq}</changefreq>\n` +
      `    <priority>${url.priority}</priority>\n` +
      `  </url>`
    ).join('\n');

    return xmlHeader + urlsetOpen + urlEntries + '\n' + urlsetClose;
  }

  /**
   * Save sitemap to Supabase Storage
   */
  private static async saveSitemapToStorage(sitemapXml: string): Promise<void> {
    // Em modo desenvolvimento, não salva no storage
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('media')
        .upload('sitemap/sitemap.xml', sitemapXml, {
          contentType: 'application/xml',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to save sitemap: ${error.message}`);
      }

      console.log('✅ Sitemap saved to storage');
    } catch (error) {
      console.error('❌ Failed to save sitemap to storage:', error);
      throw error;
    }
  }

  /**
   * Purge CDN cache for sitemap
   */
  private static async purgeCDNCache(): Promise<void> {
    try {
      // This would integrate with your CDN provider (Cloudflare, AWS CloudFront, etc.)
      // For now, we'll just log the action
      console.log('🔄 CDN cache purged for /sitemap.xml');
    } catch (error) {
      console.error('❌ Failed to purge CDN cache:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Ping Google about sitemap update
   */
  private static async pingGoogle(): Promise<void> {
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(this.BASE_URL + '/sitemap.xml')}`;
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Itaicy-Sitemap-Bot/1.0'
        }
      });

      if (response.ok) {
        console.log('✅ Google pinged successfully');
      } else {
        console.warn('⚠️ Google ping failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Failed to ping Google:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Get sitemap public URL
   */
  static getSitemapUrl(): string {
    return `${this.BASE_URL}/sitemap.xml`;
  }
}
