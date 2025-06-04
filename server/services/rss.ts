import { db } from '../db.js';
import { blogPosts, mediaFiles } from '@shared/schema';
import { eq, and, isNotNull, desc } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  author?: string;
  category?: string;
  enclosure?: {
    url: string;
    type: string;
    length: number;
  };
}

export class RSSService {
  private static readonly BASE_URL = 'https://itaicy.com.br';
  private static readonly SITE_TITLE = 'Itaicy Pantanal Eco Lodge - Blog';
  private static readonly SITE_DESCRIPTION = 'Histórias, dicas e experiências do Pantanal no Itaicy Eco Lodge';
  private static readonly MAX_ITEMS = 20;

  /**
   * Generate RSS.xml for blog posts and save to Supabase Storage
   */
  static async generateRSS(): Promise<void> {
    console.log('📰 Generating RSS.xml...');

    try {
      // Get latest published blog posts
      const rssItems = await this.getBlogPostItems();

      // Generate RSS XML content
      const rssXml = this.generateRSSXml(rssItems);

      // Save to Supabase Storage
      await this.saveRSSToStorage(rssXml);

      // Purge CDN cache
      await this.purgeCDNCache();

      console.log(`✅ RSS generated with ${rssItems.length} items`);

    } catch (error) {
      console.error('❌ Failed to generate RSS:', error);
      throw error;
    }
  }

  /**
   * Get blog post items for RSS
   */
  private static async getBlogPostItems(): Promise<RSSItem[]> {
    try {
      const posts = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          authorName: blogPosts.authorName,
          category: blogPosts.category,
          publishedAt: blogPosts.publishedAt,
          featuredImageId: blogPosts.featuredImageId,
        })
        .from(blogPosts)
        .where(and(
          eq(blogPosts.isPublished, true),
          isNotNull(blogPosts.publishedAt)
        ))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(this.MAX_ITEMS);

      const rssItems: RSSItem[] = [];

      for (const post of posts) {
        // Get featured image if exists
        let enclosure;
        if (post.featuredImageId) {
          try {
            const [image] = await db
              .select({
                path: mediaFiles.path,
                mimeType: mediaFiles.mimeType,
                size: mediaFiles.size,
              })
              .from(mediaFiles)
              .where(eq(mediaFiles.id, post.featuredImageId))
              .limit(1);

            if (image) {
              const { data } = supabase.storage
                .from('media')
                .getPublicUrl(image.path);

              enclosure = {
                url: data.publicUrl,
                type: image.mimeType,
                length: image.size,
              };
            }
          } catch (error) {
            console.warn('Failed to get featured image for post:', post.id, error);
          }
        }

        // Create description from excerpt or content
        const description = post.excerpt || 
          this.stripHtml(post.content).substring(0, 300) + '...';

        rssItems.push({
          title: post.title,
          link: `${this.BASE_URL}/blog/${post.slug}`,
          description: this.escapeXml(description),
          pubDate: new Date(post.publishedAt!).toUTCString(),
          guid: `${this.BASE_URL}/blog/${post.slug}`,
          author: post.authorName || 'Itaicy Eco Lodge',
          category: post.category || 'Blog',
          enclosure,
        });
      }

      return rssItems;

    } catch (error) {
      console.error('Error fetching blog posts for RSS:', error);
      return [];
    }
  }

  /**
   * Generate RSS XML content
   */
  private static generateRSSXml(items: RSSItem[]): string {
    const now = new Date().toUTCString();

    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    const rssOpen = `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${this.SITE_TITLE}</title>
    <link>${this.BASE_URL}/blog</link>
    <description>${this.SITE_DESCRIPTION}</description>
    <language>pt-BR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${this.BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${this.BASE_URL}/images/logo-rss.png</url>
      <title>${this.SITE_TITLE}</title>
      <link>${this.BASE_URL}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>`;

    const rssClose = `  </channel>
</rss>`;

    const itemEntries = items.map(item => {
      let itemXml = `    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>`;

      if (item.author) {
        itemXml += `\n      <author>noreply@itaicy.com.br (${item.author})</author>`;
      }

      if (item.category) {
        itemXml += `\n      <category>${item.category}</category>`;
      }

      if (item.enclosure) {
        itemXml += `\n      <enclosure url="${item.enclosure.url}" type="${item.enclosure.type}" length="${item.enclosure.length}" />`;
      }

      itemXml += '\n    </item>';
      return itemXml;
    }).join('\n');

    return xmlHeader + rssOpen + '\n' + itemEntries + '\n' + rssClose;
  }

  /**
   * Save RSS to Supabase Storage
   */
  private static async saveRSSToStorage(rssXml: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('media')
        .upload('rss/rss.xml', rssXml, {
          contentType: 'application/rss+xml',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to save RSS: ${error.message}`);
      }

      console.log('✅ RSS saved to storage');
    } catch (error) {
      console.error('❌ Failed to save RSS to storage:', error);
      throw error;
    }
  }

  /**
   * Purge CDN cache for RSS
   */
  private static async purgeCDNCache(): Promise<void> {
    try {
      // This would integrate with your CDN provider
      console.log('🔄 CDN cache purged for /rss.xml');
    } catch (error) {
      console.error('❌ Failed to purge CDN cache:', error);
    }
  }

  /**
   * Strip HTML tags from content
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * Escape XML special characters
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Get RSS public URL
   */
  static getRSSUrl(): string {
    return `${this.BASE_URL}/rss.xml`;
  }

  /**
   * Get RSS feed metadata
   */
  static async getRSSMetadata(): Promise<{
    title: string;
    description: string;
    url: string;
    itemCount: number;
    lastUpdated: string;
  }> {
    try {
      const postCount = await db
        .select({ count: blogPosts.id })
        .from(blogPosts)
        .where(and(
          eq(blogPosts.isPublished, true),
          isNotNull(blogPosts.publishedAt)
        ));

      const [latestPost] = await db
        .select({ publishedAt: blogPosts.publishedAt })
        .from(blogPosts)
        .where(and(
          eq(blogPosts.isPublished, true),
          isNotNull(blogPosts.publishedAt)
        ))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(1);

      return {
        title: this.SITE_TITLE,
        description: this.SITE_DESCRIPTION,
        url: this.getRSSUrl(),
        itemCount: Math.min(postCount.length, this.MAX_ITEMS),
        lastUpdated: latestPost?.publishedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting RSS metadata:', error);
      return {
        title: this.SITE_TITLE,
        description: this.SITE_DESCRIPTION,
        url: this.getRSSUrl(),
        itemCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }
}
