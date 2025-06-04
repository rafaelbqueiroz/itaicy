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
}