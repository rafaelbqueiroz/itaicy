import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSubmissionSchema,
  insertNewsletterSubscriptionSchema
} from "@shared/schema";
import { z } from "zod";
import mediaRoutes from "./routes/media.js";
import placeholdersRoutes from "./routes/placeholders.js";
import seoSuggestionsRoutes from "./routes/cms/seo-suggestions.js";
import cmsAuthRoutes from "./routes/cms/auth.js";
import cmsMediaRoutes from "./routes/cms/media.js";
import cmsPagesRoutes from "./routes/cms/pages.js";
import cmsExperiencesRoutes from "./routes/cms/experiences.js";
import cmsAccommodationsRoutes from "./routes/cms/accommodations.js";
import cmsBlogRoutes from "./routes/cms/blog.js";
import cmsGastronomyRoutes from "./routes/cms/gastronomy.js";
import webhooksRoutes from "./routes/automation/webhooks.js";
import internalLinksRoutes from "./routes/automation/internal-links.js";
import redirectsRoutes from "./routes/automation/redirects.js";
import gscRoutes from "./routes/automation/google-search-console.js";
import vitalsRoutes from "./routes/performance/vitals.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple test route
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  // Health check route
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Redirect middleware - temporarily disabled due to db issues
  // app.use(async (req, res, next) => {
  //   try {
  //     const { RedirectService } = await import('./services/redirect.js');
  //     const redirect = await RedirectService.getRedirect(req.path);

  //     if (redirect) {
  //       console.log(`🔀 Redirecting ${req.path} -> ${redirect.toPath} (${redirect.statusCode})`);
  //       return res.redirect(redirect.statusCode, redirect.toPath);
  //     }

  //     next();
  //   } catch (error) {
  //     console.error('Error getting redirect:', error);
  //     next();
  //   }
  // });

  // Media routes
  app.use("/api/media", mediaRoutes);

  // Placeholders routes
  app.use("/api/placeholders", placeholdersRoutes);

  // CMS Authentication routes
  app.use("/api/cms/auth", cmsAuthRoutes);

  // CMS Media routes
  app.use("/api/cms/media", cmsMediaRoutes);

  // CMS Content routes
  app.use("/api/cms/pages", cmsPagesRoutes);
  app.use("/api/cms/experiences", cmsExperiencesRoutes);
  app.use("/api/cms/accommodations", cmsAccommodationsRoutes);
  app.use("/api/cms/blog", cmsBlogRoutes);
  app.use("/api/cms/gastronomy", cmsGastronomyRoutes);

  // CMS SEO routes
  app.use("/api/cms/seo-suggestions", seoSuggestionsRoutes);

  // Sprint 4 Automation routes
  app.use("/api/automation/webhooks", webhooksRoutes);
  app.use("/api/automation/internal-links", internalLinksRoutes);
  app.use("/api/automation/redirects", redirectsRoutes);
  app.use("/api/automation/google-search-console", gscRoutes);

  // Sprint 5 Performance routes
  app.use("/api/vitals", vitalsRoutes);

  // Serve test files
  app.get("/test-image-processing.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../test-image-processing.html"));
  });

  app.get("/test-image-formats.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../test-image-formats.html"));
  });

  app.get("/test-cms-interface.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../test-cms-interface.html"));
  });

  // Populate CMS with site content
  app.post("/api/cms/populate", async (req, res) => {
    try {
      // CONTEÚDO COMPLETO EXTRAÍDO DO SITE
      const mockData = {
        pages: [
          // HOME PAGE
          {
            slug: 'home',
            title: 'Página Inicial',
            content: JSON.stringify({
              template: 'home',
              blocks: [
                {
                  type: 'hero-video',
                  position: 1,
                  data: {
                    title: 'Viva o Pantanal Autêntico',
                    subtitle: 'Pesque, observe e se reconecte em 11 apartamentos sustentáveis à beira do Rio Cuiabá',
                    videoSrc: '/attached_assets/itaicy-video-bg.mp4',
                    primaryCTA: { label: 'VER ACOMODAÇÕES', href: '/acomodacoes' },
                    secondaryCTA: { label: 'RESERVAR AGORA', href: '/contato' }
                  }
                },
                {
                  type: 'stats-ribbon',
                  position: 2,
                  data: {
                    stats: [
                      { value: '11', label: 'Apartamentos' },
                      { value: '78%', label: 'Taxa de avistamento' },
                      { value: '100%', label: 'Energia solar' },
                      { value: '24h', label: 'Atendimento' }
                    ]
                  }
                },
                {
                  type: 'experiences-grid',
                  position: 3,
                  data: {
                    title: 'Por que viver essa experiência no Itaicy Pantanal?',
                    subtitle: 'Mais que um lodge, uma experiência transformadora',
                    experiences: [
                      {
                        title: 'Conforto na natureza',
                        description: 'Apartamentos com vista para o rio',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/459.avif'
                      },
                      {
                        title: 'Ver onças de perto',
                        description: 'Saiba mais →',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/onca.avif'
                      },
                      {
                        title: 'Histórias do Pantanal',
                        description: 'Ler posts →',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/vida_pantaneira.avif'
                      },
                      {
                        title: 'Planeje sua viagem',
                        description: 'Ver guia →',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/19.avif'
                      }
                    ]
                  }
                },
                {
                  type: 'sustainability-section',
                  position: 4,
                  data: {
                    title: 'Compromisso com a Sustentabilidade',
                    description: 'No Itaicy, cada detalhe foi pensado para minimizar nosso impacto na natureza e maximizar a preservação. Somos mais que um lodge.',
                    features: [
                      '100% da energia vem de painéis solares',
                      'Construção com materiais locais',
                      'Gestão responsável de resíduos',
                      'Programas de conservação'
                    ],
                    ctaButton: { label: 'SAIBA MAIS', href: '/sustentabilidade' }
                  }
                },
                {
                  type: 'testimonials',
                  position: 5,
                  data: {
                    title: 'O que nossos hóspedes dizem',
                    testimonials: [
                      {
                        text: 'Uma experiência inesquecível! O lodge oferece o equilíbrio perfeito entre conforto e natureza.',
                        author: 'Carlos Silva',
                        location: 'São Paulo, SP'
                      },
                      {
                        text: 'As pescarias foram incríveis e a hospitalidade da equipe é excepcional.',
                        author: 'Ana Costa',
                        location: 'Rio de Janeiro, RJ'
                      },
                      {
                        text: 'Conseguimos ver onças, jacarés e uma variedade incrível de aves. Recomendo muito!',
                        author: 'Roberto Mendes',
                        location: 'Brasília, DF'
                      }
                    ]
                  }
                },
                {
                  type: 'faq-section',
                  position: 6,
                  data: {
                    title: 'Perguntas Frequentes',
                    faqs: [
                      {
                        question: 'Qual o horário de check-in/check-out?',
                        answer: 'Check-in a partir das 14h e check-out até 12h. Horários flexíveis mediante disponibilidade.'
                      },
                      {
                        question: 'Posso levar equipamento personalizado?',
                        answer: 'Sim! Temos espaço para guardar equipamentos de pesca e fotografia.'
                      },
                      {
                        question: 'Tem desconto para crianças?',
                        answer: 'Crianças até 6 anos não pagam. De 7 a 12 anos pagam 50%.'
                      }
                    ]
                  }
                }
              ]
            }),
            meta_title: 'Itaicy Pantanal Eco Lodge - Sua experiência no Pantanal',
            meta_description: 'Descubra o Pantanal autêntico no Itaicy Eco Lodge. Experiências únicas de pesca, safaris e contato com a natureza.',
            is_published: true
          },

          // EXPERIÊNCIAS PAGE
          {
            slug: 'experiencias',
            title: 'Experiências',
            content: JSON.stringify({
              template: 'page',
              blocks: [
                {
                  type: 'hero-image',
                  position: 1,
                  data: {
                    title: 'Experiências Únicas no Pantanal',
                    subtitle: 'Explore, descubra e conecte-se com a maior planície alagável do mundo',
                    backgroundImage: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/onca.avif'
                  }
                },
                {
                  type: 'experiences-grid',
                  position: 2,
                  data: {
                    title: 'Nossas Experiências',
                    experiences: [
                      {
                        title: 'Dourado Troféu',
                        description: 'Pescaria com guia especializado em busca do dourado',
                        duration: '8 horas',
                        difficulty: 'Intermediário',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/pesca.avif',
                        href: '/experiencias/dourado-trofeu'
                      },
                      {
                        title: 'Onça-Pintada',
                        description: 'Avistamento de onças em seu habitat natural',
                        duration: '6 horas',
                        difficulty: 'Fácil',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/onca.avif',
                        href: '/experiencias/onca-pintada'
                      },
                      {
                        title: 'Apartamento Superior',
                        description: 'Vista do apartamento superior com varanda',
                        duration: 'Hospedagem',
                        difficulty: 'Conforto',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/superior.avif',
                        href: '/acomodacoes/apartamento-superior'
                      },
                      {
                        title: 'Trilha',
                        description: 'Trilhas ecológicas com guia naturalista',
                        duration: '4 horas',
                        difficulty: 'Moderada',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/trilha.avif',
                        href: '/experiencias/trilha'
                      },
                      {
                        title: 'Focagem',
                        description: 'Safari noturno para observação da fauna',
                        duration: '3 horas',
                        difficulty: 'Fácil',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/safari-noturno.avif',
                        href: '/experiencias/focagem'
                      },
                      {
                        title: 'Pôr do Sol',
                        description: 'Experiência contemplativa no Rio Cuiabá',
                        duration: '2 horas',
                        difficulty: 'Fácil',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/por-do-sol.avif',
                        href: '/experiencias/por-do-sol'
                      },
                      {
                        title: 'Restaurante',
                        description: 'Gastronomia pantaneira com ingredientes locais',
                        duration: 'Refeições',
                        difficulty: 'Degustação',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/gastronomia.avif',
                        href: '/gastronomia'
                      },
                      {
                        title: 'Pousada Pesquei',
                        description: 'Experiência completa de pesca esportiva',
                        duration: 'Pacote',
                        difficulty: 'Todos os níveis',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/pesca-pacote.avif',
                        href: '/experiencias/pousada-pesquei'
                      }
                    ]
                  }
                }
              ]
            }),
            meta_title: 'Experiências - Itaicy Pantanal Eco Lodge',
            meta_description: 'Descubra as melhores experiências no Pantanal: pesca esportiva, safaris fotográficos, observação de aves e muito mais.',
            is_published: true
          },

          // ACOMODAÇÕES PAGE
          {
            slug: 'acomodacoes',
            title: 'Acomodações',
            content: JSON.stringify({
              template: 'page',
              blocks: [
                {
                  type: 'hero-image',
                  position: 1,
                  data: {
                    title: 'Seu refúgio de madeira e vento de rio',
                    subtitle: 'Onze apartamentos sustentáveis que harmonizam conforto e natureza',
                    backgroundImage: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/459.avif',
                    primaryCTA: { label: 'VER ACOMODAÇÕES', href: '#acomodacoes' },
                    secondaryCTA: { label: 'RESERVAR AGORA', href: '/contato' }
                  }
                },
                {
                  type: 'accommodations-grid',
                  position: 2,
                  data: {
                    title: 'Explore Nossas Instalações',
                    accommodations: [
                      {
                        title: 'Apartamento Standard',
                        description: 'Conforto e vista para o rio',
                        features: ['Ar condicionado', 'Vista para o rio', 'Varanda privativa'],
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/standard.avif'
                      },
                      {
                        title: 'Apartamento Superior',
                        description: 'Mais espaço e comodidades',
                        features: ['Sala de estar', 'Varanda ampla', 'Vista panorâmica'],
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/superior.avif'
                      },
                      {
                        title: 'Suíte Master',
                        description: 'Máximo conforto e privacidade',
                        features: ['Banheira de hidromassagem', 'Sala privativa', 'Deck exclusivo'],
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/master.avif'
                      }
                    ]
                  }
                },
                {
                  type: 'amenities-section',
                  position: 3,
                  data: {
                    title: 'O que está incluso',
                    amenities: [
                      { icon: '🛏️', label: 'Café da manhã' },
                      { icon: '🎣', label: 'Equipamentos de pesca' },
                      { icon: '🚤', label: 'Lancha com piloteiro' },
                      { icon: '🌿', label: 'Wi-Fi gratuito' }
                    ]
                  }
                },
                {
                  type: 'sustainability-stats',
                  position: 4,
                  data: {
                    title: 'Sustentabilidade em números',
                    stats: [
                      { value: '11', label: 'Apartamentos' },
                      { value: '78%', label: 'Taxa de ocupação' },
                      { value: '100%', label: 'Energia solar' },
                      { value: '24h', label: 'Atendimento' }
                    ]
                  }
                }
              ]
            }),
            meta_title: 'Acomodações - Itaicy Pantanal Eco Lodge',
            meta_description: 'Conheça nossos apartamentos sustentáveis com vista para o Rio Cuiabá. Conforto e natureza em perfeita harmonia.',
            is_published: true
          },

          // GALERIA PAGE
          {
            slug: 'galeria',
            title: 'Galeria',
            content: JSON.stringify({
              template: 'page',
              blocks: [
                {
                  type: 'hero-image',
                  position: 1,
                  data: {
                    title: 'Galeria',
                    subtitle: 'Momentos únicos capturados no coração do Pantanal - desde pescarias emocionantes até encontros com a vida selvagem',
                    backgroundImage: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/galeria-hero.avif'
                  }
                },
                {
                  type: 'gallery-filters',
                  position: 2,
                  data: {
                    filters: [
                      { label: 'Fauna (8)', value: 'fauna', active: true },
                      { label: 'Paisagens (6)', value: 'paisagens' },
                      { label: 'Lodge (5)', value: 'lodge' },
                      { label: 'Experiências (4)', value: 'experiencias' }
                    ]
                  }
                },
                {
                  type: 'gallery-grid',
                  position: 3,
                  data: {
                    images: [
                      {
                        category: 'fauna',
                        title: 'Dourado Troféu',
                        description: 'Pescaria com guia especializado na busca do dourado',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/dourado.avif'
                      },
                      {
                        category: 'fauna',
                        title: 'Onça-Pintada',
                        description: 'Majestosa onça em seu habitat natural',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/onca.avif'
                      },
                      {
                        category: 'paisagens',
                        title: 'Apartamento Superior',
                        description: 'Vista do apartamento superior com varanda',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/superior.avif'
                      },
                      {
                        category: 'experiencias',
                        title: 'Trilha',
                        description: 'Aventura no Pantanal através das trilhas',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/trilha.avif'
                      }
                    ]
                  }
                }
              ]
            }),
            meta_title: 'Galeria - Itaicy Pantanal Eco Lodge',
            meta_description: 'Explore nossa galeria de fotos com momentos únicos do Pantanal: fauna, paisagens, lodge e experiências inesquecíveis.',
            is_published: true
          },

          // BLOG PAGE
          {
            slug: 'blog',
            title: 'Blog',
            content: JSON.stringify({
              template: 'page',
              blocks: [
                {
                  type: 'hero-image',
                  position: 1,
                  data: {
                    title: 'Blog',
                    subtitle: 'Histórias, dicas e conhecimento sobre o Pantanal, vida selvagem e turismo sustentável',
                    backgroundImage: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/blog-hero.avif'
                  }
                },
                {
                  type: 'blog-categories',
                  position: 2,
                  data: {
                    categories: [
                      { label: 'Todos os posts', value: 'all', active: true },
                      { label: 'Fauna & Viagem', value: 'fauna' },
                      { label: 'Pesca Esportiva', value: 'pesca' },
                      { label: 'Birdwatching', value: 'birds' },
                      { label: 'Sustentabilidade', value: 'sustentabilidade' },
                      { label: 'Gastronomia', value: 'gastronomia' }
                    ]
                  }
                },
                {
                  type: 'blog-featured',
                  position: 3,
                  data: {
                    title: 'Post em Destaque',
                    post: {
                      title: 'Pantanal na Cheia vs Seca: Qual Época Escolher?',
                      excerpt: 'Descubra as diferenças entre visitar o Pantanal na época seca e na época da cheia. Cada período oferece experiências únicas e oportunidades diferentes para observar a vida selvagem.',
                      author: 'Ana Viagem',
                      date: '15 de janeiro de 2024',
                      readTime: '8 min de leitura',
                      image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/cheia-seca.avif',
                      href: '/blog/pantanal-cheia-vs-seca'
                    }
                  }
                },
                {
                  type: 'blog-grid',
                  position: 4,
                  data: {
                    posts: [
                      {
                        title: 'Guia de Birdwatching: Melhores Horários para Observar Aves',
                        excerpt: 'Dicas essenciais para observação de aves no Pantanal, incluindo os melhores horários e equipamentos.',
                        category: 'Birdwatching',
                        author: 'Carlos Natureza',
                        date: '10 de janeiro de 2024',
                        readTime: '6 min',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/birdwatching.avif',
                        href: '/blog/guia-birdwatching'
                      },
                      {
                        title: 'Sustentabilidade no Turismo: O Papel dos Eco Lodges',
                        excerpt: 'Como o turismo sustentável contribui para a preservação do Pantanal e desenvolvimento das comunidades locais.',
                        category: 'Sustentabilidade',
                        author: 'Maria Sustentável',
                        date: '5 de janeiro de 2024',
                        readTime: '7 min',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/sustentabilidade.avif',
                        href: '/blog/sustentabilidade-turismo'
                      },
                      {
                        title: 'Culinária Pantaneira: Sabores Únicos do Cerrado',
                        excerpt: 'Explore os sabores típicos da região e aprenda sobre os ingredientes nativos utilizados na gastronomia local.',
                        category: 'Gastronomia',
                        author: 'Chef Pantanal',
                        date: '28 de dezembro de 2023',
                        readTime: '5 min',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/gastronomia.avif',
                        href: '/blog/culinaria-pantaneira'
                      },
                      {
                        title: 'Onças-Pintadas: Como Avistar e Manter Felinos das Américas',
                        excerpt: 'Dicas de especialistas para aumentar suas chances de avistar onças-pintadas durante sua visita ao Pantanal.',
                        category: 'Vida Selvagem',
                        author: 'Dr. Felinos',
                        date: '20 de dezembro de 2023',
                        readTime: '9 min',
                        image: 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media/onca-blog.avif',
                        href: '/blog/oncas-pintadas-avistar'
                      }
                    ]
                  }
                }
              ]
            }),
            meta_title: 'Blog - Itaicy Pantanal Eco Lodge',
            meta_description: 'Descubra histórias, dicas e conhecimento sobre o Pantanal, vida selvagem e turismo sustentável no nosso blog.',
            is_published: true
          },

          // CONTATO PAGE
          {
            slug: 'contato',
            title: 'Fale Conosco',
            content: JSON.stringify({
              template: 'page',
              blocks: [
                {
                  type: 'hero-simple',
                  position: 1,
                  data: {
                    title: 'Fale Conosco',
                    subtitle: 'Estamos prontos para criar a experiência perfeita no Pantanal para você'
                  }
                },
                {
                  type: 'contact-form-section',
                  position: 2,
                  data: {
                    title: 'Planeje Sua Experiência',
                    form: {
                      fields: [
                        { type: 'text', name: 'nome', label: 'Nome Completo', required: true },
                        { type: 'email', name: 'email', label: 'E-mail', required: true },
                        { type: 'tel', name: 'telefone', label: 'Telefone (WhatsApp)', required: true },
                        { type: 'select', name: 'periodo', label: 'Período Preferido', options: ['Seca (Maio-Setembro)', 'Cheia (Outubro-Abril)'] },
                        { type: 'textarea', name: 'mensagem', label: 'Conte-nos sobre sua viagem ideal', rows: 4 }
                      ],
                      submitText: 'ENVIAR SOLICITAÇÃO'
                    },
                    contactInfo: {
                      title: 'Informações de Contato',
                      phone: '+55 (65) 3000-0000',
                      whatsapp: '+55 (65) 99999-0000',
                      email: 'reservas@itaicy.com.br',
                      address: 'Estrada do Itaicy, s/n\nPoconé, MT - Brasil\nCEP: 78175-000',
                      hours: 'Segunda a Sábado: 8h às 18h\nDomingo: 8h às 12h\nAtendimento 24h'
                    }
                  }
                },
                {
                  type: 'map-section',
                  position: 3,
                  data: {
                    title: 'Como Chegar',
                    description: 'Oferecemos transfer localizado de Aeroporto de Cuiabá até o lodge. O trajeto dura aproximadamente 2 horas pela estrada de terra.',
                    mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3851.234567890123!2d-56.789!3d-16.456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI3JzIyLjAiUyA1NsKwNDcnMjAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                    fullWidth: true
                  }
                },
                {
                  type: 'faq-section',
                  position: 4,
                  data: {
                    title: 'Perguntas Frequentes',
                    faqs: [
                      {
                        question: 'Qual o horário de check-in/check-out?',
                        answer: 'Check-in a partir das 14h e check-out até 12h. Horários flexíveis mediante disponibilidade e podem ser ajustados conforme sua chegada.'
                      },
                      {
                        question: 'Posso levar equipamento personalizado?',
                        answer: 'Sim! Temos espaço adequado para guardar equipamentos de pesca e fotografia. Também oferecemos equipamentos completos caso prefira.'
                      },
                      {
                        question: 'Tem desconto para crianças?',
                        answer: 'Crianças até 6 anos não pagam hospedagem. De 7 a 12 anos pagam 50% do valor. Consulte condições especiais para grupos familiares.'
                      },
                      {
                        question: 'Como é o transfer do aeroporto?',
                        answer: 'Oferecemos transfer privativo do Aeroporto de Cuiabá até o lodge. O trajeto dura cerca de 2h pela estrada asfaltada + 30min estrada de terra.'
                      }
                    ]
                  }
                }
              ]
            }),
            meta_title: 'Contato - Itaicy Pantanal Eco Lodge',
            meta_description: 'Entre em contato conosco para planejar sua experiência no Pantanal. Transfer, hospedagem e experiências personalizadas.',
            is_published: true
          }
        ],
        experiences: [
          {
            name: 'Pesca Esportiva do Dourado',
            slug: 'pesca-dourado',
            description: 'Pescaria guiada em busca do famoso dourado do Pantanal',
            duration: '8 horas',
            difficulty: 'Intermediário',
            price: 450,
            maxParticipants: 4,
            category: 'pesca',
            featured: true
          },
          {
            name: 'Safari Fotográfico',
            slug: 'safari-fotografico',
            description: 'Aviste onças, capivaras, jacarés e centenas de aves',
            duration: '6 horas',
            difficulty: 'Fácil',
            price: 380,
            maxParticipants: 6,
            category: 'safari',
            featured: true
          }
        ],
        accommodations: [
          {
            name: 'Apartamento Standard',
            slug: 'apartamento-standard',
            description: 'Acomodação confortável com vista para o rio',
            size: 25,
            capacity: 2,
            pricePerNight: 800,
            featured: false
          },
          {
            name: 'Suíte Master',
            slug: 'suite-master',
            description: 'Nossa acomodação mais luxuosa',
            size: 45,
            capacity: 4,
            pricePerNight: 1800,
            featured: true
          }
        ]
      };

      // Agora vamos REALMENTE salvar os dados no banco
      const results = {
        pages: 0,
        experiences: 0,
        accommodations: 0,
        blogPosts: 0,
        errors: []
      };

      // 1. Salvar páginas
      for (const page of mockData.pages) {
        try {
          await storage.createPage({
            slug: page.slug,
            title: page.title,
            description: `Página ${page.title}`,
            template: 'default',
            publishedAt: page.is_published ? new Date() : null,
            metaTitle: page.meta_title,
            metaDescription: page.meta_description,
            schemaJson: page.content
          });
          results.pages++;
        } catch (error) {
          console.error(`Erro ao salvar página ${page.slug}:`, error);
          results.errors.push(`Página ${page.slug}: ${error.message}`);
        }
      }

      // 2. Salvar experiências
      for (const experience of mockData.experiences) {
        try {
          await storage.createExperience({
            slug: experience.slug,
            title: experience.name,
            shortDescription: experience.description,
            longDescription: experience.description,
            category: experience.category,
            duration: experience.duration,
            pricePerPerson: experience.price,
            includes: experience.includes || [],
            available: experience.is_active
          });
          results.experiences++;
        } catch (error) {
          console.error(`Erro ao salvar experiência ${experience.slug}:`, error);
          results.errors.push(`Experiência ${experience.slug}: ${error.message}`);
        }
      }

      // 3. Salvar acomodações
      for (const accommodation of mockData.accommodations) {
        try {
          await storage.createAccommodation({
            slug: accommodation.name.toLowerCase().replace(/\s+/g, '-'),
            name: accommodation.name,
            shortDescription: accommodation.description,
            longDescription: accommodation.description,
            capacity: accommodation.capacity,
            areaM2: accommodation.area,
            pricePerNight: accommodation.price_per_night,
            amenities: accommodation.amenities || [],
            available: accommodation.is_available
          });
          results.accommodations++;
        } catch (error) {
          console.error(`Erro ao salvar acomodação ${accommodation.name}:`, error);
          results.errors.push(`Acomodação ${accommodation.name}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: 'CMS populado com sucesso!',
        data: {
          pages: results.pages,
          experiences: results.experiences,
          accommodations: results.accommodations,
          blogPosts: results.blogPosts,
          errors: results.errors,
          totalContent: 'Site completo extraído e salvo no banco!'
        }
      });

    } catch (error) {
      console.error('Erro ao popular CMS:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao popular CMS'
      });
    }
  });

  // Serve sitemap.xml from Supabase Storage
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
      const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase.storage
        .from('media')
        .download('sitemap/sitemap.xml');

      if (error || !data) {
        return res.status(404).send('Sitemap not found');
      }

      const sitemapContent = await data.text();
      res.set('Content-Type', 'application/xml');
      res.send(sitemapContent);
    } catch (error) {
      console.error('Error serving sitemap:', error);
      res.status(500).send('Error loading sitemap');
    }
  });

  // Serve rss.xml from Supabase Storage
  app.get("/rss.xml", async (req, res) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
      const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase.storage
        .from('media')
        .download('rss/rss.xml');

      if (error || !data) {
        return res.status(404).send('RSS feed not found');
      }

      const rssContent = await data.text();
      res.set('Content-Type', 'application/rss+xml');
      res.send(rssContent);
    } catch (error) {
      console.error('Error serving RSS:', error);
      res.status(500).send('Error loading RSS feed');
    }
  });

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

  // CMS Dashboard stats endpoint
  app.get("/api/cms/stats", async (req, res) => {
    try {
      const pages = await storage.getPages();
      const experiences = await storage.getExperiences();
      const accommodations = await storage.getAccommodations();
      const blogPosts = await storage.getBlogPosts();

      res.json({
        success: true,
        data: {
          pages: {
            total: pages.length,
            published: pages.filter(p => p.publishedAt !== null).length
          },
          experiences: {
            total: experiences.length,
            active: experiences.filter(e => e.available).length
          },
          accommodations: {
            total: accommodations.length,
            available: accommodations.filter(a => a.available).length
          },
          blogPosts: {
            total: blogPosts.length,
            published: blogPosts.filter(p => p.publishedAt !== null).length
          },
          media: {
            total: 0, // Placeholder - implementar quando tiver media storage
            totalSize: "0 MB"
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas"
      });
    }
  });

  // CMS Recent activity endpoint
  app.get("/api/cms/activity", async (req, res) => {
    try {
      const pages = await storage.getPages();
      const experiences = await storage.getExperiences();
      const accommodations = await storage.getAccommodations();
      const blogPosts = await storage.getBlogPosts();

      // Combinar todas as atividades e ordenar por data
      const activities = [
        ...pages.map(p => ({
          type: 'page',
          title: `Página "${p.title}" ${p.publishedAt ? 'publicada' : 'criada'}`,
          date: p.updatedAt || p.createdAt,
          status: p.publishedAt ? 'published' : 'draft'
        })),
        ...experiences.map(e => ({
          type: 'experience',
          title: `Experiência "${e.title}" ${e.active ? 'ativada' : 'criada'}`,
          date: e.createdAt,
          status: e.active ? 'active' : 'inactive'
        })),
        ...accommodations.map(a => ({
          type: 'accommodation',
          title: `Acomodação "${a.name}" ${a.available ? 'disponibilizada' : 'criada'}`,
          date: a.updatedAt || a.createdAt,
          status: a.available ? 'available' : 'unavailable'
        })),
        ...blogPosts.map(b => ({
          type: 'blog',
          title: `Post "${b.title}" ${b.publishedAt ? 'publicado' : 'criado'}`,
          date: b.updatedAt || b.createdAt,
          status: b.publishedAt ? 'published' : 'draft'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
       .slice(0, 5); // Últimas 5 atividades

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro ao buscar atividades recentes"
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
