import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriptionSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(validatedData);
      res.json({ message: "Subscription successful", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else if (error instanceof Error && error.message.includes('duplicate')) {
        res.status(409).json({ 
          message: "E-mail já cadastrado em nossa newsletter" 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ message: "Contact form submitted successfully", submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get experiences endpoint
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get accommodations endpoint
  app.get("/api/accommodations", async (req, res) => {
    try {
      const accommodations = await storage.getAccommodations();
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get gallery items endpoint
  app.get("/api/gallery", async (req, res) => {
    try {
      const category = req.query.category as string;
      const galleryItems = await storage.getGalleryItems(category);
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get blog posts endpoint
  app.get("/api/blog", async (req, res) => {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;
      const blogPosts = await storage.getBlogPosts(category, search);
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get single blog post endpoint
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blogPost = await storage.getBlogPostBySlug(slug);
      if (!blogPost) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Booking submission endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingSchema = z.object({
        guestName: z.string().min(2),
        guestEmail: z.string().email(),
        guestPhone: z.string().min(10),
        checkIn: z.string().transform(str => new Date(str)),
        checkOut: z.string().transform(str => new Date(str)),
        guests: z.number().min(1),
        experienceType: z.string(),
        specialRequests: z.string().optional(),
        totalPrice: z.number().min(0),
      });

      const validatedData = bookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.json({ message: "Booking created successfully", booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
