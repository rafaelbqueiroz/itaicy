import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { 
  cmsPages, 
  cmsMedia, 
  cmsVirtualTours, 
  cmsTestimonials, 
  cmsBlogPosts, 
  cmsSettings,
  type CmsPage,
  type CmsMedia,
  type CmsVirtualTour,
  type CmsTestimonial,
  type CmsBlogPost,
  type CmsSetting,
  type InsertCmsPage,
  type InsertCmsMedia,
  type InsertCmsVirtualTour,
  type InsertCmsTestimonial,
  type InsertCmsBlogPost,
  type InsertCmsSetting
} from "@shared/schema";

export class CmsStorage {
  // Pages
  async getPages(): Promise<CmsPage[]> {
    return await db.select().from(cmsPages).orderBy(desc(cmsPages.updatedAt));
  }

  async getPageBySlug(slug: string): Promise<CmsPage | undefined> {
    const result = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
    return result[0];
  }

  async createPage(data: InsertCmsPage): Promise<CmsPage> {
    const result = await db.insert(cmsPages).values(data).returning();
    return result[0];
  }

  async updatePage(id: number, data: Partial<InsertCmsPage>): Promise<CmsPage> {
    const result = await db.update(cmsPages).set({ ...data, updatedAt: new Date() }).where(eq(cmsPages.id, id)).returning();
    return result[0];
  }

  // Media
  async getMedia(): Promise<CmsMedia[]> {
    return await db.select().from(cmsMedia).orderBy(desc(cmsMedia.uploadedAt));
  }

  async getMediaById(id: number): Promise<CmsMedia | undefined> {
    const result = await db.select().from(cmsMedia).where(eq(cmsMedia.id, id)).limit(1);
    return result[0];
  }

  async createMedia(data: InsertCmsMedia): Promise<CmsMedia> {
    const result = await db.insert(cmsMedia).values(data).returning();
    return result[0];
  }

  // Virtual Tours
  async getVirtualTours(category?: string): Promise<CmsVirtualTour[]> {
    const query = db.select().from(cmsVirtualTours);
    
    if (category) {
      return await query.where(and(eq(cmsVirtualTours.category, category), eq(cmsVirtualTours.isActive, true)))
        .orderBy(cmsVirtualTours.sortOrder);
    }
    
    return await query.where(eq(cmsVirtualTours.isActive, true)).orderBy(cmsVirtualTours.sortOrder);
  }

  async createVirtualTour(data: InsertCmsVirtualTour): Promise<CmsVirtualTour> {
    const result = await db.insert(cmsVirtualTours).values(data).returning();
    return result[0];
  }

  async updateVirtualTour(id: number, data: Partial<InsertCmsVirtualTour>): Promise<CmsVirtualTour> {
    const result = await db.update(cmsVirtualTours).set({ ...data, updatedAt: new Date() }).where(eq(cmsVirtualTours.id, id)).returning();
    return result[0];
  }

  // Testimonials
  async getTestimonials(featured?: boolean): Promise<CmsTestimonial[]> {
    if (featured !== undefined) {
      return await db.select().from(cmsTestimonials)
        .where(and(eq(cmsTestimonials.isActive, true), eq(cmsTestimonials.featured, featured)))
        .orderBy(desc(cmsTestimonials.createdAt));
    }
    
    return await db.select().from(cmsTestimonials)
      .where(eq(cmsTestimonials.isActive, true))
      .orderBy(desc(cmsTestimonials.createdAt));
  }

  async createTestimonial(data: InsertCmsTestimonial): Promise<CmsTestimonial> {
    const result = await db.insert(cmsTestimonials).values(data).returning();
    return result[0];
  }

  // Blog Posts
  async getBlogPosts(category?: string, published?: boolean): Promise<CmsBlogPost[]> {
    const conditions = [];
    if (published !== undefined) {
      conditions.push(eq(cmsBlogPosts.isPublished, published));
    }
    if (category) {
      conditions.push(eq(cmsBlogPosts.category, category));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(cmsBlogPosts)
        .where(and(...conditions))
        .orderBy(desc(cmsBlogPosts.publishedAt));
    }
    
    return await db.select().from(cmsBlogPosts).orderBy(desc(cmsBlogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<CmsBlogPost | undefined> {
    const result = await db.select().from(cmsBlogPosts)
      .where(and(eq(cmsBlogPosts.slug, slug), eq(cmsBlogPosts.isPublished, true)))
      .limit(1);
    return result[0];
  }

  async createBlogPost(data: InsertCmsBlogPost): Promise<CmsBlogPost> {
    const result = await db.insert(cmsBlogPosts).values(data).returning();
    return result[0];
  }

  async updateBlogPost(id: number, data: Partial<InsertCmsBlogPost>): Promise<CmsBlogPost> {
    const result = await db.update(cmsBlogPosts).set({ ...data, updatedAt: new Date() }).where(eq(cmsBlogPosts.id, id)).returning();
    return result[0];
  }

  // Settings
  async getSettings(): Promise<CmsSetting[]> {
    return await db.select().from(cmsSettings).orderBy(cmsSettings.key);
  }

  async getSettingByKey(key: string): Promise<CmsSetting | undefined> {
    const result = await db.select().from(cmsSettings).where(eq(cmsSettings.key, key)).limit(1);
    return result[0];
  }

  async setSetting(data: InsertCmsSetting): Promise<CmsSetting> {
    const existing = await this.getSettingByKey(data.key);
    
    if (existing) {
      const result = await db.update(cmsSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(cmsSettings.key, data.key))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(cmsSettings).values(data).returning();
      return result[0];
    }
  }
}

export const cmsStorage = new CmsStorage();