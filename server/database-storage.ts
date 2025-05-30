import { eq, like, and } from 'drizzle-orm';
import { db } from './db';
import { 
  users, experiences, accommodations, blogPosts, gallery, bookings, 
  contactSubmissions, newsletterSubscriptions,
  type User, type InsertUser, type Experience, type InsertExperience,
  type Accommodation, type InsertAccommodation, type BlogPost, type InsertBlogPost,
  type GalleryItem, type InsertGalleryItem, type Booking, type InsertBooking,
  type ContactSubmission, type InsertContactSubmission,
  type NewsletterSubscription, type InsertNewsletterSubscription
} from "@shared/schema";
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.active, true));
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
    return result[0];
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const result = await db.insert(experiences).values(insertExperience).returning();
    return result[0];
  }

  // Accommodation methods
  async getAccommodations(): Promise<Accommodation[]> {
    return await db.select().from(accommodations).where(eq(accommodations.active, true));
  }

  async getAccommodationById(id: number): Promise<Accommodation | undefined> {
    const result = await db.select().from(accommodations).where(eq(accommodations.id, id)).limit(1);
    return result[0];
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const result = await db.insert(accommodations).values(insertAccommodation).returning();
    return result[0];
  }

  // Blog methods
  async getBlogPosts(category?: string, search?: string): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts).where(eq(blogPosts.published, true));
    
    const conditions = [eq(blogPosts.published, true)];
    
    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }
    
    if (search) {
      conditions.push(
        like(blogPosts.title, `%${search}%`)
      );
    }
    
    return await db.select().from(blogPosts).where(and(...conditions));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1);
    return result[0];
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(insertBlogPost).returning();
    return result[0];
  }

  // Gallery methods
  async getGalleryItems(category?: string): Promise<GalleryItem[]> {
    if (category) {
      return await db.select().from(gallery).where(eq(gallery.category, category));
    }
    return await db.select().from(gallery);
  }

  async createGalleryItem(insertGalleryItem: InsertGalleryItem): Promise<GalleryItem> {
    const result = await db.insert(gallery).values(insertGalleryItem).returning();
    return result[0];
  }

  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(insertBooking).returning();
    return result[0];
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  // Contact methods
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  // Newsletter methods
  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check for duplicate email
    const existing = await db.select().from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, insertSubscription.email))
      .limit(1);
    
    if (existing.length > 0) {
      throw new Error('Email already subscribed to newsletter (duplicate)');
    }

    const result = await db.insert(newsletterSubscriptions).values(insertSubscription).returning();
    return result[0];
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.active, true));
  }

  // CMS Suite methods using direct SQL queries
  async getCmsSuites(): Promise<any[]> {
    try {
      const result = await db.execute(`
        SELECT id, label as name, size_m2 as size, capacity, amenities, 
               price, description, sort_order, active, 
               created_at, updated_at
        FROM suites 
        WHERE active = true 
        ORDER BY sort_order ASC
      `);
      return result.rows as any[];
    } catch (error) {
      console.error('Error fetching suites:', error);
      return [];
    }
  }

  async getCmsSuiteById(id: number): Promise<any | undefined> {
    try {
      const result = await db.execute(`
        SELECT id, label as name, size_m2 as size, capacity, amenities, 
               price, description, sort_order, active, 
               created_at, updated_at
        FROM suites 
        WHERE id = $1 AND active = true
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching suite by id:', error);
      return undefined;
    }
  }

  async createCmsSuite(insertSuite: any): Promise<any> {
    try {
      const result = await db.execute(`
        INSERT INTO suites (label, slug, size_m2, capacity, amenities, price, description, sort_order, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        insertSuite.name, 
        insertSuite.slug || insertSuite.name.toLowerCase().replace(/\s+/g, '-'),
        insertSuite.size, 
        insertSuite.capacity, 
        insertSuite.amenities, 
        insertSuite.price, 
        insertSuite.description,
        insertSuite.sortOrder || 0,
        insertSuite.isActive ?? true
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating suite:', error);
      throw error;
    }
  }

  async updateCmsSuite(id: number, updateData: any): Promise<any> {
    try {
      const result = await db.execute(`
        UPDATE suites 
        SET label = $2, size_m2 = $3, capacity = $4, amenities = $5, 
            price = $6, description = $7, sort_order = $8, 
            updated_at = NOW()
        WHERE id = $1 AND active = true
        RETURNING *
      `, [
        id,
        updateData.name,
        updateData.size,
        updateData.capacity,
        updateData.amenities,
        updateData.price,
        updateData.description,
        updateData.sortOrder
      ]);
      
      if (!result.rows[0]) {
        throw new Error(`Suite with id ${id} not found`);
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating suite:', error);
      throw error;
    }
  }
}