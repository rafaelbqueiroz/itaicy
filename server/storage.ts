import {
  users, experiences, accommodations, blogPosts, gallery, bookings,
  contactSubmissions, newsletterSubscriptions, pages,
  type User, type InsertUser, type Experience, type InsertExperience,
  type Accommodation, type InsertAccommodation, type BlogPost, type InsertBlogPost,
  type GalleryItem, type InsertGalleryItem, type Booking, type InsertBooking,
  type ContactSubmission, type InsertContactSubmission,
  type NewsletterSubscription, type InsertNewsletterSubscription,
  type Page, type InsertPage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Page methods
  getPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pages: Map<number, Page>;
  private experiences: Map<number, Experience>;
  private accommodations: Map<number, Accommodation>;
  private blogPosts: Map<number, BlogPost>;
  private galleryItems: Map<number, GalleryItem>;
  private bookings: Map<number, Booking>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.pages = new Map();
    this.experiences = new Map();
    this.accommodations = new Map();
    this.blogPosts = new Map();
    this.galleryItems = new Map();
    this.bookings = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
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

  // Page methods
  async getPages(): Promise<Page[]> {
    return Array.from(this.pages.values());
  }

  async getPublishedPages(): Promise<Page[]> {
    return Array.from(this.pages.values()).filter(page => page.publishedAt !== null);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    return Array.from(this.pages.values()).find(page => page.slug === slug);
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const id = this.currentId++;
    const page: Page = {
      ...insertPage,
      id,
      description: insertPage.description || null,
      template: insertPage.template || 'default',
      priority: insertPage.priority || 0,
      publishedAt: insertPage.publishedAt || null,
      metaTitle: insertPage.metaTitle || null,
      metaDescription: insertPage.metaDescription || null,
      ogImageId: insertPage.ogImageId || null,
      canonicalUrl: insertPage.canonicalUrl || null,
      schemaJson: insertPage.schemaJson || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pages.set(id, page);
    return page;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getAvailableExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(exp => exp.available);
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const experience: Experience = {
      ...insertExperience,
      id,
      shortDescription: insertExperience.shortDescription || null,
      longDescription: insertExperience.longDescription || null,
      duration: insertExperience.duration || null,
      groupSize: insertExperience.groupSize || null,
      pricePerPerson: insertExperience.pricePerPerson || null,
      includes: insertExperience.includes || null,
      cardImageId: insertExperience.cardImageId || null,
      hoverImageId: insertExperience.hoverImageId || null,
      galleryImages: insertExperience.galleryImages || null,
      available: insertExperience.available !== false,
      featured: insertExperience.featured || false,
      sortOrder: insertExperience.sortOrder || 0,
      metaTitle: insertExperience.metaTitle || null,
      metaDescription: insertExperience.metaDescription || null,
      ogImageId: insertExperience.ogImageId || null,
      canonicalUrl: insertExperience.canonicalUrl || null,
      schemaJson: insertExperience.schemaJson || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.experiences.set(id, experience);
    return experience;
  }

  // Accommodation methods
  async getAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAvailableAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(acc => acc.available);
  }

  async getAccommodationById(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentId++;
    const accommodation: Accommodation = {
      ...insertAccommodation,
      id,
      shortDescription: insertAccommodation.shortDescription || null,
      longDescription: insertAccommodation.longDescription || null,
      areaM2: insertAccommodation.areaM2 || null,
      pricePerNight: insertAccommodation.pricePerNight || null,
      images: insertAccommodation.images || null,
      amenities: insertAccommodation.amenities || null,
      available: insertAccommodation.available !== false,
      featured: insertAccommodation.featured || false,
      sortOrder: insertAccommodation.sortOrder || 0,
      metaTitle: insertAccommodation.metaTitle || null,
      metaDescription: insertAccommodation.metaDescription || null,
      ogImageId: insertAccommodation.ogImageId || null,
      canonicalUrl: insertAccommodation.canonicalUrl || null,
      schemaJson: insertAccommodation.schemaJson || null,
      createdAt: new Date(),
      updatedAt: new Date(),
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
}

// Temporarily use memory storage until database connection is resolved
export const storage = new MemStorage();
