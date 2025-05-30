CREATE TABLE "accommodations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"capacity" integer NOT NULL,
	"amenities" text[] NOT NULL,
	"images" text[] NOT NULL,
	"price_per_night" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] NOT NULL,
	"featured_image" text,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_phone" text NOT NULL,
	"check_in" timestamp NOT NULL,
	"check_out" timestamp NOT NULL,
	"guests" integer NOT NULL,
	"experience_type" text NOT NULL,
	"special_requests" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"featured_image_id" integer,
	"category" varchar(100) NOT NULL,
	"tags" text[],
	"author_name" varchar(255) NOT NULL,
	"author_bio" text,
	"author_avatar_id" integer,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"meta_title" varchar(255),
	"meta_description" varchar(500),
	"reading_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cms_blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cms_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"alt" varchar(255),
	"caption" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"meta_title" varchar(255),
	"meta_description" varchar(500),
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cms_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cms_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"type" varchar(50) NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cms_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "cms_testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255),
	"rating" integer NOT NULL,
	"content" text NOT NULL,
	"avatar_id" integer,
	"is_active" boolean DEFAULT true,
	"featured" boolean DEFAULT false,
	"stay_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_virtual_tours" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"thumbnail_id" integer,
	"tour_url" varchar(500) NOT NULL,
	"capacity" integer,
	"amenities" text[],
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"interests" text[] NOT NULL,
	"preferred_dates" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"price" integer NOT NULL,
	"category" text NOT NULL,
	"duration" text NOT NULL,
	"max_participants" integer NOT NULL,
	"includes" text[] NOT NULL,
	"images" text[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"category" text NOT NULL,
	"alt" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cms_blog_posts" ADD CONSTRAINT "cms_blog_posts_featured_image_id_cms_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."cms_media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_blog_posts" ADD CONSTRAINT "cms_blog_posts_author_avatar_id_cms_media_id_fk" FOREIGN KEY ("author_avatar_id") REFERENCES "public"."cms_media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_testimonials" ADD CONSTRAINT "cms_testimonials_avatar_id_cms_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."cms_media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_virtual_tours" ADD CONSTRAINT "cms_virtual_tours_thumbnail_id_cms_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."cms_media"("id") ON DELETE no action ON UPDATE no action;