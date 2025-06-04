import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, date, real } from "drizzle-orm/pg-core";
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

// Legacy tables - keeping for compatibility with existing data
export const accommodationsLegacy = pgTable("accommodations_legacy", {
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

export const blogPostsLegacy = pgTable("blog_posts_legacy", {
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

// Sprint 1 Core Tables - CMS Content Management System

// Site Settings - Global configuration
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).default("general"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Webhook Logs - Track webhook executions
export const webhookLogs = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 50 }).notNull(), // 'publish', 'unpublish', 'update'
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'page', 'blog_post', etc.
  contentId: integer("content_id").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'success', 'error', 'pending'
  response: jsonb("response"), // Store webhook response data
  error: text("error"), // Store error message if failed
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

// Web Vitals - Track performance metrics (Sprint 5)
export const webVitals = pgTable("web_vitals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), // 'CLS', 'FID', 'LCP', etc.
  value: real("value").notNull(), // Metric value
  delta: real("delta"), // Delta from previous measurement
  metricId: varchar("metric_id", { length: 100 }).notNull(), // Unique metric ID
  url: text("url").notNull(), // Page URL
  userAgent: text("user_agent").notNull(), // Browser user agent
  connectionType: varchar("connection_type", { length: 20 }), // Connection type
  deviceType: varchar("device_type", { length: 20 }).notNull(), // 'mobile', 'tablet', 'desktop'
  sessionId: varchar("session_id", { length: 100 }).notNull(), // User session ID
  timestamp: timestamp("timestamp").defaultNow().notNull(), // When metric was recorded
});

// Pages - Main content pages with blocks
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  template: varchar("template", { length: 50 }).default("default"),
  priority: integer("priority").default(0),
  publishedAt: timestamp("published_at"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  ogImageId: integer("og_image_id").references(() => mediaFiles.id),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  schemaJson: text("schema_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Page Blocks - Draggable content blocks for pages
export const pageBlocks = pgTable("page_blocks", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pages.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // hero-video, hero-image, text-block, etc.
  position: integer("position").notNull(),
  content: jsonb("content").notNull(), // Block-specific content
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Media Files - Central media management
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  path: varchar("path", { length: 500 }).notNull(), // Supabase Storage path
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(), // in bytes
  width: integer("width"),
  height: integer("height"),
  alt: varchar("alt", { length: 255 }),
  caption: text("caption"),
  // Optimized versions
  variants: jsonb("variants"), // { "768": "path/to/768.webp", "1024": "path/to/1024.webp" }
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Experiences - Tourism activities and packages (matching actual DB schema)
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  duration: text("duration").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  includes: text("includes").array().notNull(),
  images: text("images").array().notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Accommodations - Hotel rooms and suites
export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  longDescription: text("long_description"), // Rich text content
  areaM2: integer("area_m2"),
  capacity: integer("capacity").notNull(),
  pricePerNight: integer("price_per_night"), // em centavos
  images: jsonb("images"), // array de IDs de mediaFiles
  amenities: jsonb("amenities"), // array de strings
  available: boolean("available").default(true),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  // SEO fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  ogImageId: integer("og_image_id").references(() => mediaFiles.id),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  schemaJson: text("schema_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog Posts - Content marketing and stories
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // Rich text content
  coverImageId: integer("cover_image_id").references(() => mediaFiles.id),
  authorId: integer("author_id").references(() => cmsUsers.id).notNull(),
  categories: jsonb("categories"), // array de strings
  tags: jsonb("tags"), // array de strings
  publishedAt: timestamp("published_at"),
  // SEO fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  ogImageId: integer("og_image_id").references(() => mediaFiles.id),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  schemaJson: text("schema_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Gastronomy Items - Menu items and culinary offerings
export const gastronomyItems = pgTable("gastronomy_items", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price"), // em centavos
  imageId: integer("image_id").references(() => mediaFiles.id),
  ingredients: jsonb("ingredients"), // array de strings
  preparationTime: varchar("preparation_time", { length: 50 }),
  available: boolean("available").default(true),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  // SEO fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  ogImageId: integer("og_image_id").references(() => mediaFiles.id),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  schemaJson: text("schema_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CMS Users - Content management system users with roles
export const cmsUsers = pgTable("cms_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("redator"), // admin, editor, redator
  supabaseUserId: varchar("supabase_user_id", { length: 36 }).unique(),
  active: boolean("active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Redirects - URL redirections management
export const redirects = pgTable("redirects", {
  id: serial("id").primaryKey(),
  fromPath: varchar("from_path", { length: 255 }).notNull().unique(),
  toPath: varchar("to_path", { length: 255 }).notNull(),
  statusCode: integer("status_code").default(301),
  active: boolean("active").default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertAccommodationLegacySchema = createInsertSchema(accommodationsLegacy).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostLegacySchema = createInsertSchema(blogPostsLegacy).omit({
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

// Sprint 1 Insert Schemas
export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  description: true,
  category: true,
});

export const insertPageSchema = createInsertSchema(pages).pick({
  slug: true,
  title: true,
  description: true,
  template: true,
  priority: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  ogImageId: true,
  canonicalUrl: true,
  schemaJson: true,
});

export const insertPageBlockSchema = createInsertSchema(pageBlocks).pick({
  pageId: true,
  type: true,
  position: true,
  content: true,
  published: true,
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).pick({
  filename: true,
  originalName: true,
  path: true,
  mimeType: true,
  size: true,
  width: true,
  height: true,
  alt: true,
  caption: true,
  variants: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  title: true,
  description: true,
  shortDescription: true,
  price: true,
  category: true,
  duration: true,
  maxParticipants: true,
  includes: true,
  images: true,
  active: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).pick({
  slug: true,
  name: true,
  shortDescription: true,
  longDescription: true,
  areaM2: true,
  capacity: true,
  pricePerNight: true,
  images: true,
  amenities: true,
  available: true,
  featured: true,
  sortOrder: true,
  metaTitle: true,
  metaDescription: true,
  ogImageId: true,
  canonicalUrl: true,
  schemaJson: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImageId: true,
  authorId: true,
  categories: true,
  tags: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  ogImageId: true,
  canonicalUrl: true,
  schemaJson: true,
});

export const insertGastronomyItemSchema = createInsertSchema(gastronomyItems).pick({
  slug: true,
  name: true,
  description: true,
  price: true,
  imageId: true,
  ingredients: true,
  preparationTime: true,
  available: true,
  featured: true,
  sortOrder: true,
  metaTitle: true,
  metaDescription: true,
  ogImageId: true,
  canonicalUrl: true,
  schemaJson: true,
});

export const insertCmsUserSchema = createInsertSchema(cmsUsers).pick({
  email: true,
  name: true,
  role: true,
  supabaseUserId: true,
  active: true,
});

export const insertRedirectSchema = createInsertSchema(redirects).pick({
  fromPath: true,
  toPath: true,
  statusCode: true,
  active: true,
  description: true,
});

export const insertWebhookLogSchema = createInsertSchema(webhookLogs).pick({
  event: true,
  contentType: true,
  contentId: true,
  status: true,
  response: true,
  error: true,
});

// Sprint 1 TypeScript Types
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

export type PageBlock = typeof pageBlocks.$inferSelect;
export type InsertPageBlock = typeof pageBlocks.$inferInsert;

export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = typeof accommodations.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export type GastronomyItem = typeof gastronomyItems.$inferSelect;
export type InsertGastronomyItem = typeof gastronomyItems.$inferInsert;

export type CmsUser = typeof cmsUsers.$inferSelect;
export type InsertCmsUser = typeof cmsUsers.$inferInsert;

export type Redirect = typeof redirects.$inferSelect;
export type InsertRedirect = typeof redirects.$inferInsert;

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

export type WebVital = typeof webVitals.$inferSelect;
export type InsertWebVital = typeof webVitals.$inferInsert;

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
