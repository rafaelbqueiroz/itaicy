import { 
  users, experiences, accommodations, blogPosts, gallery, bookings, 
  contactSubmissions, newsletterSubscriptions, cmsSuites,
  type User, type InsertUser, type Experience, type InsertExperience,
  type Accommodation, type InsertAccommodation, type BlogPost, type InsertBlogPost,
  type GalleryItem, type InsertGalleryItem, type Booking, type InsertBooking,
  type ContactSubmission, type InsertContactSubmission,
  type NewsletterSubscription, type InsertNewsletterSubscription,
  type CmsSuite, type InsertCmsSuite
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Experience methods
  getExperiences(): Promise<Experience[]>;
  getExperienceById(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;

  // Accommodation methods
  getAccommodations(): Promise<Accommodation[]>;
  getAccommodationById(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;

  // Blog methods
  getBlogPosts(category?: string, search?: string): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;

  // Gallery methods
  getGalleryItems(category?: string): Promise<GalleryItem[]>;
  createGalleryItem(galleryItem: InsertGalleryItem): Promise<GalleryItem>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | undefined>;

  // Contact methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Newsletter methods
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;

  // CMS Suite methods
  getCmsSuites(): Promise<any[]>;
  getCmsSuiteById(id: number): Promise<any | undefined>;
  createCmsSuite(suite: any): Promise<any>;
  updateCmsSuite(id: number, suite: any): Promise<any>;
  
  // Testimonials methods
  getTestimonials(): Promise<any[]>;
  createTestimonial(testimonial: any): Promise<any>;
  
  // FAQ methods
  getFaqs(category?: string): Promise<any[]>;
  createFaq(faq: any): Promise<any>;
  
  // Stats methods
  getStats(): Promise<any[]>;
  updateStat(code: string, value: number): Promise<any>;
  
  // Settings methods
  getSettings(): Promise<any>;
  updateSettings(settings: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private experiences: Map<number, Experience>;
  private accommodations: Map<number, Accommodation>;
  private blogPosts: Map<number, BlogPost>;
  private galleryItems: Map<number, GalleryItem>;
  private bookings: Map<number, Booking>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private cmsSuites: Map<number, any>;
  private testimonials: Map<number, any>;
  private faqs: Map<number, any>;
  private stats: Map<string, any>;
  private settings: any;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.experiences = new Map();
    this.accommodations = new Map();
    this.blogPosts = new Map();
    this.galleryItems = new Map();
    this.bookings = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
    this.cmsSuites = new Map();
    this.testimonials = new Map();
    this.faqs = new Map();
    this.stats = new Map();
    this.settings = {};
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample experiences
    const sampleExperiences: InsertExperience[] = [
      {
        title: 'Pesca Esportiva All-Inclusive',
        description: 'Pescaria de dourados gigantes em águas cristalinas com guias especializados e equipamentos de primeira linha.',
        shortDescription: 'Pesca esportiva com guias premiados',
        price: 200000,
        category: 'pesca',
        duration: '1 dia completo',
        maxParticipants: 3,
        includes: ['Guia especializado', 'Barco e combustível', 'Equipamentos de pesca', 'Iscas vivas'],
        images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&h=600'],
      },
      {
        title: 'Safári Fotográfico & Birdwatching',
        description: 'Observe onças-pintadas, ariranhas e mais de 166 espécies de aves em seu habitat natural.',
        shortDescription: 'Safari fotográfico com biólogos',
        price: 150000,
        category: 'ecoturismo',
        duration: '1 dia completo',
        maxParticipants: 6,
        includes: ['Guia biólogo', 'Transporte 4x4', 'Binóculos profissionais', 'Lista de aves'],
        images: ['https://images.unsplash.com/photo-1594736797933-d0a4390d327e?auto=format&fit=crop&w=800&h=600'],
      },
    ];

    sampleExperiences.forEach(exp => this.createExperience(exp));

    // Sample accommodations
    const sampleAccommodations: InsertAccommodation[] = [
      {
        name: 'Apartamento Standard',
        description: 'Apartamento confortável com vista para o rio',
        capacity: 2,
        amenities: ['Ar condicionado', 'Wi-Fi satelital', 'Varanda com rede'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=600'],
        pricePerNight: 80000,
      },
      {
        name: 'Suíte Master',
        description: 'Nossa acomodação mais exclusiva com vista panorâmica',
        capacity: 4,
        amenities: ['Ar condicionado', 'Wi-Fi satelital', 'Varanda panorâmica', 'Minibar'],
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&h=600'],
        pricePerNight: 180000,
      },
    ];

    sampleAccommodations.forEach(acc => this.createAccommodation(acc));

    // Sample CMS Suites with realistic data
    const sampleSuites: InsertCmsSuite[] = [
      {
        name: 'Suíte Compacta',
        size: '28 m²',
        capacity: 2,
        description: 'Conforto essencial com vista para o rio e varanda privativa com rede para contemplação.',
        price: 80000, // R$ 800.00 in cents
        amenities: ['Varanda com rede', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Frigobar', 'Banheiro privativo'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ],
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Suíte Ampla',
        size: '35 m²',
        capacity: 3,
        description: 'Espaço generoso com varanda ampliada e vista privilegiada para o Rio Cuiabá e mata ciliar.',
        price: 120000, // R$ 1.200.00 in cents
        amenities: ['Varanda ampliada', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Frigobar', 'Vista para o rio', 'Cama extra', 'Mesa de trabalho'],
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ],
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Suíte Master',
        size: '45 m²',
        capacity: 4,
        description: 'Nossa suíte mais exclusiva com varanda panorâmica, sala de estar e comodidades premium para máximo conforto.',
        price: 180000, // R$ 1.800.00 in cents
        amenities: ['Varanda panorâmica', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Minibar premium', 'Banheira dupla', 'Sala de estar', 'Vista privilegiada', 'Roupões', 'Amenities premium'],
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ],
        sortOrder: 3,
        isActive: true,
      },
    ];

    sampleSuites.forEach(suite => this.createCmsSuite(suite));

    // Initialize testimonials
    const sampleTestimonials = [
      {
        name: 'Ana Carvalho',
        city: 'Rio de Janeiro',
        rating: 5,
        quote: 'Dormir ouvindo as araras e acordar com a vista do rio foi uma experiência transformadora.',
        featured: true,
        stayDate: '2024-08-15'
      },
      {
        name: 'Carlos Silva',
        city: 'São Paulo', 
        rating: 5,
        quote: 'A pesca esportiva superou todas as expectativas. Guias experientes e peixes gigantes!',
        featured: true,
        stayDate: '2024-07-22'
      },
      {
        name: 'Maria Santos',
        city: 'Brasília',
        rating: 5,
        quote: 'Lugar mágico para desconectar e se reconectar com a natureza. Voltaremos em breve!',
        featured: false,
        stayDate: '2024-09-10'
      }
    ];

    sampleTestimonials.forEach(testimonial => this.createTestimonial(testimonial));

    // Initialize FAQs
    const sampleFaqs = [
      {
        category: 'geral',
        question: 'Qual a melhor época para visitar?',
        answer: 'A temporada de pesca vai de março a outubro, com águas mais claras. Para birdwatching, recomendamos maio a setembro quando as aves estão mais ativas.',
        sortOrder: 1
      },
      {
        category: 'hospedagem',
        question: 'As suítes têm ar-condicionado?',
        answer: 'Sim, todas as suítes possuem ar-condicionado, Wi-Fi satelital e varanda privativa com rede para contemplação.',
        sortOrder: 2
      },
      {
        category: 'pesca',
        question: 'Preciso levar equipamentos de pesca?',
        answer: 'Não é necessário. Fornecemos todos os equipamentos profissionais: varas, molinetes, iscas vivas e acessórios para pesca esportiva.',
        sortOrder: 3
      },
      {
        category: 'transporte',
        question: 'Como chegar ao lodge?',
        answer: 'Oferecemos transfer gratuito do aeroporto de Cuiabá. O trajeto dura aproximadamente 2h30 por estrada asfaltada até nosso píer privativo.',
        sortOrder: 4
      }
    ];

    sampleFaqs.forEach(faq => this.createFaq(faq));

    // Initialize stats
    const sampleStats = [
      { code: 'BIRD_SPECIES', value: 4700, unit: 'espécies' },
      { code: 'FISH_SPECIES', value: 400, unit: 'espécies' },
      { code: 'SINCE_YEAR', value: 1897, unit: null },
      { code: 'PROTECTED_AREA', value: 650, unit: 'hectares' }
    ];

    sampleStats.forEach(stat => {
      this.stats.set(stat.code, stat);
    });

    // Initialize settings
    this.settings = {
      primaryColor: '#C97A2C',
      accentColor: '#064737',
      email: 'reservas@itaicy.com.br',
      phone: '+55 65 9999-9999',
      whatsapp: '+55 65 9999-9999'
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || 'user',
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(exp => exp.active);
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const experience: Experience = {
      ...insertExperience,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.experiences.set(id, experience);
    return experience;
  }

  // Accommodation methods
  async getAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(acc => acc.active);
  }

  async getAccommodationById(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentId++;
    const accommodation: Accommodation = {
      ...insertAccommodation,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  // Blog methods
  async getBlogPosts(category?: string, search?: string): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values()).filter(post => post.published);
    
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return posts.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug && post.published);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      featuredImage: insertBlogPost.featuredImage || null,
      published: insertBlogPost.published || false,
      publishedAt: insertBlogPost.publishedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  // Gallery methods
  async getGalleryItems(category?: string): Promise<GalleryItem[]> {
    let items = Array.from(this.galleryItems.values());
    
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    return items.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createGalleryItem(insertGalleryItem: InsertGalleryItem): Promise<GalleryItem> {
    const id = this.currentId++;
    const galleryItem: GalleryItem = {
      ...insertGalleryItem,
      id,
      description: insertGalleryItem.description || null,
      featured: insertGalleryItem.featured || false,
      createdAt: new Date(),
    };
    this.galleryItems.set(id, galleryItem);
    return galleryItem;
  }

  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const booking: Booking = {
      ...insertBooking,
      id,
      specialRequests: insertBooking.specialRequests || null,
      status: 'pending',
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  // Contact methods
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      phone: insertSubmission.phone || null,
      preferredDates: insertSubmission.preferredDates || null,
      status: 'new',
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Newsletter methods
  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check for duplicate email
    const existingSubscription = Array.from(this.newsletterSubscriptions.values())
      .find(sub => sub.email === insertSubscription.email);
    
    if (existingSubscription) {
      throw new Error('Email already subscribed to newsletter (duplicate)');
    }

    const id = this.currentId++;
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).filter(sub => sub.active);
  }

  // CMS Suite methods
  async getCmsSuites(): Promise<CmsSuite[]> {
    return Array.from(this.cmsSuites.values())
      .filter(suite => suite.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getCmsSuiteById(id: number): Promise<CmsSuite | undefined> {
    return this.cmsSuites.get(id);
  }

  async createCmsSuite(insertSuite: InsertCmsSuite): Promise<CmsSuite> {
    const id = this.currentId++;
    const suite: CmsSuite = {
      ...insertSuite,
      id,
      sortOrder: insertSuite.sortOrder ?? 0,
      isActive: insertSuite.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cmsSuites.set(id, suite);
    return suite;
  }

  async updateCmsSuite(id: number, updateData: Partial<InsertCmsSuite>): Promise<CmsSuite> {
    const suite = this.cmsSuites.get(id);
    if (!suite) {
      throw new Error(`Suite with id ${id} not found`);
    }
    
    const updatedSuite: CmsSuite = {
      ...suite,
      ...updateData,
      updatedAt: new Date(),
    };
    this.cmsSuites.set(id, updatedSuite);
    return updatedSuite;
  }

  // Testimonials methods
  async getTestimonials(): Promise<any[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: any): Promise<any> {
    const id = this.currentId++;
    const newTestimonial = { id, ...testimonial, createdAt: new Date() };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  // FAQ methods
  async getFaqs(category?: string): Promise<any[]> {
    const faqs = Array.from(this.faqs.values());
    return category ? faqs.filter(faq => faq.category === category) : faqs;
  }

  async createFaq(faq: any): Promise<any> {
    const id = this.currentId++;
    const newFaq = { id, ...faq, createdAt: new Date() };
    this.faqs.set(id, newFaq);
    return newFaq;
  }

  // Stats methods
  async getStats(): Promise<any[]> {
    return Array.from(this.stats.values());
  }

  async updateStat(code: string, value: number): Promise<any> {
    const existing = this.stats.get(code);
    const updated = { ...existing, code, value, updatedAt: new Date() };
    this.stats.set(code, updated);
    return updated;
  }

  // Settings methods
  async getSettings(): Promise<any> {
    return this.settings;
  }

  async updateSettings(newSettings: any): Promise<any> {
    this.settings = { ...this.settings, ...newSettings, updatedAt: new Date() };
    return this.settings;
  }
}

import { DatabaseStorage } from './database-storage';

// Use memory storage temporarily while fixing Supabase connection
export const storage = new MemStorage();
