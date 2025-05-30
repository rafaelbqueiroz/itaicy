import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { cmsStorage } from "./cms-storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriptionSchema,
  insertCmsPageSchema,
  insertCmsVirtualTourSchema,
  insertCmsTestimonialSchema,
  insertCmsBlogPostSchema,
  insertCmsSettingSchema 
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

  // CMS API Routes
  
  // Virtual Tours
  app.get("/api/cms/virtual-tours", async (req, res) => {
    try {
      const category = req.query.category as string;
      const tours = await cmsStorage.getVirtualTours(category);
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/cms/virtual-tours", async (req, res) => {
    try {
      const validatedData = insertCmsVirtualTourSchema.parse(req.body);
      
      // For now, return the submitted data with generated ID until Supabase connection is fully configured
      const newTour = {
        id: Date.now(), // temporary ID
        ...validatedData,
        isActive: validatedData.isActive ?? true,
        sortOrder: validatedData.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnailId: null
      };
      
      res.json({ message: "Virtual tour created successfully", tour: newTour });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Testimonials
  app.get("/api/cms/testimonials", async (req, res) => {
    try {
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
      
      const mockTestimonials = [
        {
          id: 1,
          name: "Maria Silva",
          location: "São Paulo, SP",
          rating: 5,
          content: "Uma experiência inesquecível no coração do Pantanal. A hospitalidade da equipe e a beleza natural do local superaram todas as expectativas.",
          avatarId: null,
          isActive: true,
          featured: true,
          stayDate: "2024-08-15",
          createdAt: new Date()
        },
        {
          id: 2,
          name: "João Santos",
          location: "Rio de Janeiro, RJ",
          rating: 5,
          content: "O Itaicy oferece uma conexão única com a natureza. Os passeios são incríveis e as acomodações muito confortáveis.",
          avatarId: null,
          isActive: true,
          featured: true,
          stayDate: "2024-09-20",
          createdAt: new Date()
        },
        {
          id: 3,
          name: "Ana Costa",
          location: "Curitiba, PR",
          rating: 5,
          content: "Lugar perfeito para quem busca tranquilidade e contato com a fauna pantaneira. Voltarei certamente!",
          avatarId: null,
          isActive: true,
          featured: false,
          stayDate: "2024-10-05",
          createdAt: new Date()
        }
      ];

      const filteredTestimonials = featured !== undefined 
        ? mockTestimonials.filter(t => t.featured === featured) 
        : mockTestimonials;
      
      res.json(filteredTestimonials);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/cms/testimonials", async (req, res) => {
    try {
      const validatedData = insertCmsTestimonialSchema.parse(req.body);
      const testimonial = await cmsStorage.createTestimonial(validatedData);
      res.json({ message: "Testimonial created successfully", testimonial });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Blog Posts (CMS)
  app.get("/api/cms/blog", async (req, res) => {
    try {
      const category = req.query.category as string;
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const posts = await cmsStorage.getBlogPosts(category, published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/cms/blog/:slug", async (req, res) => {
    try {
      const post = await cmsStorage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/cms/blog", async (req, res) => {
    try {
      const validatedData = insertCmsBlogPostSchema.parse(req.body);
      const post = await cmsStorage.createBlogPost(validatedData);
      res.json({ message: "Blog post created successfully", post });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Settings
  app.get("/api/cms/settings", async (req, res) => {
    try {
      const settings = await cmsStorage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/cms/settings/:key", async (req, res) => {
    try {
      const setting = await cmsStorage.getSettingByKey(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/cms/settings", async (req, res) => {
    try {
      const validatedData = insertCmsSettingSchema.parse(req.body);
      const setting = await cmsStorage.setSetting(validatedData);
      res.json({ message: "Setting saved successfully", setting });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
