import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, date } from "drizzle-orm/pg-core";
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

// CMS Content Management Tables
export const cmsPages = pgTable("cms_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cmsMedia = pgTable("cms_media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  caption: text("caption"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const cmsVirtualTours = pgTable("cms_virtual_tours", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  thumbnailId: integer("thumbnail_id").references(() => cmsMedia.id),
  tourUrl: varchar("tour_url", { length: 500 }).notNull(),
  capacity: integer("capacity"),
  amenities: text("amenities").array(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cmsTestimonials = pgTable("cms_testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  avatarId: integer("avatar_id").references(() => cmsMedia.id),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  stayDate: date("stay_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cmsBlogPosts = pgTable("cms_blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImageId: integer("featured_image_id").references(() => cmsMedia.id),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags").array(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorBio: text("author_bio"),
  authorAvatarId: integer("author_avatar_id").references(() => cmsMedia.id),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  readingTime: integer("reading_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cmsSettings = pgTable("cms_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// CMS Insert schemas
export const insertCmsPageSchema = createInsertSchema(cmsPages).pick({
  slug: true,
  title: true,
  content: true,
  metaTitle: true,
  metaDescription: true,
  isPublished: true,
});

export const insertCmsMediaSchema = createInsertSchema(cmsMedia).pick({
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
  url: true,
  alt: true,
  caption: true,
});

export const insertCmsVirtualTourSchema = createInsertSchema(cmsVirtualTours).pick({
  title: true,
  description: true,
  category: true,
  thumbnailId: true,
  tourUrl: true,
  capacity: true,
  amenities: true,
  isActive: true,
  sortOrder: true,
});

export const insertCmsTestimonialSchema = createInsertSchema(cmsTestimonials).pick({
  name: true,
  location: true,
  rating: true,
  content: true,
  avatarId: true,
  isActive: true,
  featured: true,
  stayDate: true,
});

export const insertCmsBlogPostSchema = createInsertSchema(cmsBlogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImageId: true,
  category: true,
  tags: true,
  authorName: true,
  authorBio: true,
  authorAvatarId: true,
  isPublished: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  readingTime: true,
});

export const insertCmsSettingSchema = createInsertSchema(cmsSettings).pick({
  key: true,
  value: true,
  type: true,
  description: true,
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

// CMS Types
export type CmsPage = typeof cmsPages.$inferSelect;
export type InsertCmsPage = z.infer<typeof insertCmsPageSchema>;

export type CmsMedia = typeof cmsMedia.$inferSelect;
export type InsertCmsMedia = z.infer<typeof insertCmsMediaSchema>;

export type CmsVirtualTour = typeof cmsVirtualTours.$inferSelect;
export type InsertCmsVirtualTour = z.infer<typeof insertCmsVirtualTourSchema>;

export type CmsTestimonial = typeof cmsTestimonials.$inferSelect;
export type InsertCmsTestimonial = z.infer<typeof insertCmsTestimonialSchema>;

export type CmsBlogPost = typeof cmsBlogPosts.$inferSelect;
export type InsertCmsBlogPost = z.infer<typeof insertCmsBlogPostSchema>;

export type CmsSetting = typeof cmsSettings.$inferSelect;
export type InsertCmsSetting = z.infer<typeof insertCmsSettingSchema>;
