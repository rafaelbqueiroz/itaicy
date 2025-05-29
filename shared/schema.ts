import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(), // 'pesca', 'ecoturismo', 'birdwatching'
  duration: text("duration").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  includes: text("includes").array().notNull(),
  images: text("images").array().notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
  amenities: text("amenities").array().notNull(),
  images: text("images").array().notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  featuredImage: text("featured_image"),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // 'pesca', 'natureza', 'lodge', 'equipe'
  alt: text("alt").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests").notNull(),
  experienceType: text("experience_type").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'cancelled'
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  interests: text("interests").array().notNull(),
  preferredDates: text("preferred_dates"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // 'new', 'contacted', 'converted'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  createdAt: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
