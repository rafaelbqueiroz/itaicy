import { cmsStorage } from "./cms-storage";

async function seedCmsData() {
  console.log("🌱 Populando dados do CMS...");

  try {
    // Virtual Tours
    console.log("Criando tours virtuais...");
    
    const virtualTours = [
      {
        title: "Master Suite Pantanal",
        description: "Nossa suíte premium com vista panorâmica do Rio Cuiabá e varanda privativa.",
        category: "suite",
        tourUrl: "https://tour.itaicy.com/master-suite",
        capacity: 4,
        amenities: ["Ar condicionado", "Varanda privativa", "Vista para o rio", "Frigobar"],
        isActive: true,
        sortOrder: 1
      },
      {
        title: "Suíte Standard",
        description: "Acomodação confortável com todos os amenities essenciais para sua estadia.",
        category: "suite",
        tourUrl: "https://tour.itaicy.com/standard-suite",
        capacity: 2,
        amenities: ["Ar condicionado", "Wi-Fi", "Frigobar", "Roupão"],
        isActive: true,
        sortOrder: 2
      },
      {
        title: "Restaurante Principal",
        description: "Área gastronômica com especialidades pantaneiras e vista para a natureza.",
        category: "restaurant",
        tourUrl: "https://tour.itaicy.com/restaurant",
        amenities: ["Culinária local", "Vista panorâmica", "Bar", "Terraço"],
        isActive: true,
        sortOrder: 3
      },
      {
        title: "Área da Piscina",
        description: "Deck da piscina com espreguiçadeiras e vista privilegiada do Pantanal.",
        category: "pool",
        tourUrl: "https://tour.itaicy.com/pool-deck",
        amenities: ["Piscina aquecida", "Deck solarium", "Bar molhado", "Vista panorâmica"],
        isActive: true,
        sortOrder: 4
      },
      {
        title: "Lounge Principal",
        description: "Área de convivência com lareira e vista para os jardins nativos.",
        category: "common-area",
        tourUrl: "https://tour.itaicy.com/lounge",
        amenities: ["Lareira", "Wi-Fi", "Biblioteca", "Jogos"],
        isActive: true,
        sortOrder: 5
      },
      {
        title: "Vista Externa do Lodge",
        description: "Visão completa da estrutura do lodge integrada à paisagem pantaneira.",
        category: "exterior",
        tourUrl: "https://tour.itaicy.com/exterior",
        amenities: ["Jardins nativos", "Deck de observação", "Trilhas", "Pier privativo"],
        isActive: true,
        sortOrder: 6
      }
    ];

    for (const tour of virtualTours) {
      await cmsStorage.createVirtualTour(tour);
      console.log(`✓ Tour criado: ${tour.title}`);
    }

    // Testimonials
    console.log("Criando depoimentos...");
    
    const testimonials = [
      {
        name: "Maria Silva",
        location: "São Paulo, SP",
        rating: 5,
        content: "Uma experiência inesquecível no coração do Pantanal. A hospitalidade da equipe e a beleza natural do local superaram todas as expectativas.",
        isActive: true,
        featured: true,
        stayDate: "2024-08-15"
      },
      {
        name: "João Santos",
        location: "Rio de Janeiro, RJ",
        rating: 5,
        content: "O Itaicy oferece uma conexão única com a natureza. Os passeios são incríveis e as acomodações muito confortáveis.",
        isActive: true,
        featured: true,
        stayDate: "2024-09-20"
      },
      {
        name: "Ana Costa",
        location: "Curitiba, PR",
        rating: 5,
        content: "Lugar perfeito para quem busca tranquilidade e contato com a fauna pantaneira. Voltarei certamente!",
        isActive: true,
        featured: false,
        stayDate: "2024-10-05"
      }
    ];

    for (const testimonial of testimonials) {
      await cmsStorage.createTestimonial(testimonial);
      console.log(`✓ Depoimento criado: ${testimonial.name}`);
    }

    // Blog Posts
    console.log("Criando posts do blog...");
    
    const blogPosts = [
      {
        title: "A Biodiversidade Única do Pantanal",
        slug: "biodiversidade-pantanal",
        excerpt: "Descubra a riqueza da fauna e flora pantaneira e como o Itaicy contribui para sua preservação.",
        content: "O Pantanal é uma das maiores planícies inundáveis do mundo e abriga uma biodiversidade impressionante...",
        category: "natureza",
        tags: ["biodiversidade", "conservação", "pantanal"],
        authorName: "Equipe Itaicy",
        authorBio: "Especialistas em turismo sustentável e conservação ambiental",
        isPublished: true,
        publishedAt: new Date("2024-11-01"),
        metaTitle: "Biodiversidade do Pantanal - Itaicy Eco Lodge",
        metaDescription: "Conheça a rica biodiversidade do Pantanal e como o Itaicy contribui para sua preservação",
        readingTime: 8
      },
      {
        title: "Turismo Sustentável: Nossa Missão",
        slug: "turismo-sustentavel",
        excerpt: "Como o Itaicy promove práticas sustentáveis para preservar o Pantanal para futuras gerações.",
        content: "O turismo sustentável é mais do que uma prática, é nossa missão...",
        category: "sustentabilidade",
        tags: ["sustentabilidade", "ecoturismo", "responsabilidade"],
        authorName: "Equipe Itaicy",
        authorBio: "Especialistas em turismo sustentável e conservação ambiental",
        isPublished: true,
        publishedAt: new Date("2024-11-15"),
        metaTitle: "Turismo Sustentável - Itaicy Eco Lodge",
        metaDescription: "Descubra como o Itaicy promove o turismo sustentável no Pantanal",
        readingTime: 6
      }
    ];

    for (const post of blogPosts) {
      await cmsStorage.createBlogPost(post);
      console.log(`✓ Post criado: ${post.title}`);
    }

    // Settings
    console.log("Configurando settings...");
    
    const settings = [
      {
        key: "site_title",
        value: "Itaicy Pantanal Eco Lodge",
        type: "string",
        description: "Título principal do site"
      },
      {
        key: "contact_email",
        value: "contato@itaicy.com.br",
        type: "string",
        description: "Email de contato principal"
      },
      {
        key: "contact_phone",
        value: "+55 (65) 3000-0000",
        type: "string",
        description: "Telefone de contato principal"
      },
      {
        key: "social_instagram",
        value: "@itaicypantanal",
        type: "string",
        description: "Instagram oficial"
      },
      {
        key: "booking_enabled",
        value: "true",
        type: "boolean",
        description: "Habilitar sistema de reservas"
      }
    ];

    for (const setting of settings) {
      await cmsStorage.setSetting(setting);
      console.log(`✓ Setting configurado: ${setting.key}`);
    }

    console.log("🎉 CMS populado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao popular CMS:", error);
    throw error;
  }
}

// Executar se for módulo principal
seedCmsData().then(() => {
  console.log("✅ Processo concluído");
  process.exit(0);
}).catch(error => {
  console.error("💥 Falha:", error);
  process.exit(1);
});

export { seedCmsData };