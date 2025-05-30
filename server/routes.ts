import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriptionSchema,
  insertCmsSuiteSchema
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

  // CMS Suites endpoints
  app.get("/api/cms/suites", async (req, res) => {
    try {
      const suites = await storage.getCmsSuites();
      res.json(suites);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  app.get("/api/cms/suites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const suite = await storage.getCmsSuiteById(id);
      if (!suite) {
        res.status(404).json({ message: "Suite not found" });
        return;
      }
      res.json(suite);
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

  // Testimonials routes
  app.get('/api/cms/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/cms/testimonials', async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // FAQ routes
  app.get('/api/cms/faqs', async (req, res) => {
    try {
      const category = req.query.category as string;
      const faqs = await storage.getFaqs(category);
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/cms/faqs', async (req, res) => {
    try {
      const faq = await storage.createFaq(req.body);
      res.status(201).json(faq);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stats routes
  app.get('/api/cms/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put('/api/cms/stats/:code', async (req, res) => {
    try {
      const { value } = req.body;
      const stat = await storage.updateStat(req.params.code, value);
      res.json(stat);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Settings routes
  app.get('/api/cms/settings', async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put('/api/cms/settings', async (req, res) => {
    try {
      const settings = await storage.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Page Content routes
  app.get('/api/cms/pages/:slug/content', async (req, res) => {
    try {
      const content = await storage.getPageContent(req.params.slug);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put('/api/cms/pages/:slug/content', async (req, res) => {
    try {
      const content = await storage.updatePageContent(req.params.slug, req.body);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // SEO routes
  app.get('/api/cms/pages/:slug/seo', async (req, res) => {
    try {
      const seo = await storage.getPageSEO(req.params.slug);
      res.json(seo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put('/api/cms/pages/:slug/seo', async (req, res) => {
    try {
      const seo = await storage.updatePageSEO(req.params.slug, req.body);
      res.json(seo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Media routes
  app.get('/api/cms/media', async (req, res) => {
    try {
      const media = await storage.getMediaFiles();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Page Blocks routes
  app.get('/api/cms/pages/:pageId/blocks', async (req, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      const blocks = await storage.getPageBlocks(pageId);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/cms/pages/:pageId/blocks', async (req, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      const block = await storage.createPageBlock({ ...req.body, pageId });
      res.status(201).json(block);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put('/api/cms/blocks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const block = await storage.updatePageBlock(id, req.body);
      res.json(block);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete('/api/cms/blocks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePageBlock(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Pages routes
  app.get('/api/cms/pages', async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/cms/pages/slug/:slug', async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
