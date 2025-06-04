import { db } from '../db.js';
import { redirects } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export interface RedirectRule {
  fromPath: string;
  toPath: string;
  statusCode?: number;
  description?: string;
}

export class RedirectService {
  /**
   * Create a new redirect rule
   */
  static async createRedirect(
    fromPath: string, 
    toPath: string, 
    statusCode: number = 301,
    description?: string
  ): Promise<void> {
    console.log(`🔀 Creating redirect: ${fromPath} -> ${toPath}`);

    try {
      // Normalize paths
      const normalizedFromPath = this.normalizePath(fromPath);
      const normalizedToPath = this.normalizePath(toPath);

      // Check if redirect already exists
      const existing = await db
        .select()
        .from(redirects)
        .where(eq(redirects.fromPath, normalizedFromPath))
        .limit(1);

      if (existing.length > 0) {
        // Update existing redirect
        await db
          .update(redirects)
          .set({
            toPath: normalizedToPath,
            statusCode,
            description: description || `Auto-generated redirect from slug change`,
            active: true,
            updatedAt: new Date(),
          })
          .where(eq(redirects.fromPath, normalizedFromPath));

        console.log(`✅ Updated existing redirect: ${normalizedFromPath} -> ${normalizedToPath}`);
      } else {
        // Create new redirect
        await db.insert(redirects).values({
          fromPath: normalizedFromPath,
          toPath: normalizedToPath,
          statusCode,
          description: description || `Auto-generated redirect from slug change`,
          active: true,
        });

        console.log(`✅ Created new redirect: ${normalizedFromPath} -> ${normalizedToPath}`);
      }

    } catch (error) {
      console.error('❌ Failed to create redirect:', error);
      throw error;
    }
  }

  /**
   * Get redirect for a given path
   */
  static async getRedirect(path: string): Promise<{
    toPath: string;
    statusCode: number;
  } | null> {
    try {
      const normalizedPath = this.normalizePath(path);

      const [redirect] = await db
        .select({
          toPath: redirects.toPath,
          statusCode: redirects.statusCode,
        })
        .from(redirects)
        .where(and(
          eq(redirects.fromPath, normalizedPath),
          eq(redirects.active, true)
        ))
        .limit(1);

      return redirect || null;

    } catch (error) {
      console.error('Error getting redirect:', error);
      return null;
    }
  }

  /**
   * Get all active redirects
   */
  static async getAllRedirects(): Promise<Array<{
    id: number;
    fromPath: string;
    toPath: string;
    statusCode: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>> {
    try {
      return await db
        .select({
          id: redirects.id,
          fromPath: redirects.fromPath,
          toPath: redirects.toPath,
          statusCode: redirects.statusCode,
          description: redirects.description,
          createdAt: redirects.createdAt,
          updatedAt: redirects.updatedAt,
        })
        .from(redirects)
        .where(eq(redirects.active, true))
        .orderBy(redirects.createdAt);

    } catch (error) {
      console.error('Error getting all redirects:', error);
      return [];
    }
  }

  /**
   * Delete a redirect
   */
  static async deleteRedirect(id: number): Promise<void> {
    try {
      await db
        .update(redirects)
        .set({ active: false })
        .where(eq(redirects.id, id));

      console.log(`✅ Deactivated redirect with ID: ${id}`);

    } catch (error) {
      console.error('❌ Failed to delete redirect:', error);
      throw error;
    }
  }

  /**
   * Update a redirect
   */
  static async updateRedirect(
    id: number,
    updates: Partial<RedirectRule>
  ): Promise<void> {
    try {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (updates.fromPath) {
        updateData.fromPath = this.normalizePath(updates.fromPath);
      }

      if (updates.toPath) {
        updateData.toPath = this.normalizePath(updates.toPath);
      }

      if (updates.statusCode) {
        updateData.statusCode = updates.statusCode;
      }

      if (updates.description !== undefined) {
        updateData.description = updates.description;
      }

      await db
        .update(redirects)
        .set(updateData)
        .where(eq(redirects.id, id));

      console.log(`✅ Updated redirect with ID: ${id}`);

    } catch (error) {
      console.error('❌ Failed to update redirect:', error);
      throw error;
    }
  }

  /**
   * Create redirects for content type slug changes
   */
  static async createContentRedirect(
    contentType: string,
    oldSlug: string,
    newSlug: string
  ): Promise<void> {
    const pathMappings = {
      'page': (slug: string) => `/${slug}`,
      'blog_post': (slug: string) => `/blog/${slug}`,
      'experience': (slug: string) => `/experiencias/${slug}`,
      'accommodation': (slug: string) => `/acomodacoes/${slug}`,
      'gastronomy_item': (slug: string) => `/gastronomia/${slug}`,
    };

    const pathGenerator = pathMappings[contentType as keyof typeof pathMappings];
    
    if (!pathGenerator) {
      console.warn(`Unknown content type for redirect: ${contentType}`);
      return;
    }

    const fromPath = pathGenerator(oldSlug);
    const toPath = pathGenerator(newSlug);

    await this.createRedirect(
      fromPath,
      toPath,
      301,
      `Auto-generated redirect for ${contentType} slug change: ${oldSlug} -> ${newSlug}`
    );
  }

  /**
   * Normalize path by ensuring it starts with / and doesn't end with /
   */
  private static normalizePath(path: string): string {
    // Remove leading/trailing whitespace
    path = path.trim();

    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Remove trailing slash (except for root path)
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // Convert to lowercase for consistency
    return path.toLowerCase();
  }

  /**
   * Validate redirect rule
   */
  static validateRedirect(rule: RedirectRule): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check fromPath
    if (!rule.fromPath || rule.fromPath.trim() === '') {
      errors.push('From path is required');
    }

    // Check toPath
    if (!rule.toPath || rule.toPath.trim() === '') {
      errors.push('To path is required');
    }

    // Check for circular redirect
    if (rule.fromPath && rule.toPath) {
      const normalizedFrom = this.normalizePath(rule.fromPath);
      const normalizedTo = this.normalizePath(rule.toPath);
      
      if (normalizedFrom === normalizedTo) {
        errors.push('From path and to path cannot be the same');
      }
    }

    // Check status code
    if (rule.statusCode && ![301, 302, 307, 308].includes(rule.statusCode)) {
      errors.push('Status code must be 301, 302, 307, or 308');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get redirect statistics
   */
  static async getRedirectStats(): Promise<{
    totalActive: number;
    totalInactive: number;
    byStatusCode: Record<number, number>;
  }> {
    try {
      const allRedirects = await db
        .select({
          active: redirects.active,
          statusCode: redirects.statusCode,
        })
        .from(redirects);

      const stats = {
        totalActive: 0,
        totalInactive: 0,
        byStatusCode: {} as Record<number, number>,
      };

      allRedirects.forEach(redirect => {
        if (redirect.active) {
          stats.totalActive++;
        } else {
          stats.totalInactive++;
        }

        const statusCode = redirect.statusCode || 301;
        stats.byStatusCode[statusCode] = (stats.byStatusCode[statusCode] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('Error getting redirect stats:', error);
      return {
        totalActive: 0,
        totalInactive: 0,
        byStatusCode: {},
      };
    }
  }
}
