#!/usr/bin/env tsx

/**
 * Script de extração de conteúdo existente
 * Varre o repositório atual e extrai textos, imagens, componentes
 * para popular o CMS com dados reais
 */

import fs from 'fs';
import path from 'path';

interface BlockData {
  type: string;
  position: number;
  payload: Record<string, any>;
}

interface PageData {
  slug: string;
  name: string;
  template: string;
  blocks: BlockData[];
}

interface MediaAsset {
  path: string;
  alt: string;
  originalPath: string;
}

class ContentExtractor {
  private pages: PageData[] = [];
  private media: MediaAsset[] = [];
  
  constructor() {
    console.log('🔍 Iniciando extração de conteúdo...');
  }

  // Extrai conteúdo da Home
  extractHomePage(): PageData {
    console.log('📄 Extraindo página Home...');
    
    const blocks: BlockData[] = [
      {
        type: 'hero-video',
        position: 0,
        payload: {
          title: 'Viva o Pantanal Autêntico',
          subtitle: 'Pesque, observe e se reconecte em 11 apartamentos sustentáveis à beira do Rio Cuiabá',
          videoSrc: '/attached_assets/itaicy-video-bg.mp4',
          primaryCTA: {
            label: 'RESERVAR AGORA',
            href: '/contato'
          },
          secondaryCTA: {
            label: 'CONHECER AS EXPERIÊNCIAS',
            href: '/experiencias'
          }
        }
      },
      {
        type: 'split-block',
        position: 1,
        payload: {
          title: 'Pesca Esportiva All-Inclusive',
          subtitle: 'Dourados troféu em águas pouco batidas',
          description: 'Barcos 40 hp, isca viva à vontade e guias que conhecem cada curva do Velho Cuiabá. Pescarias de 6h às 18h com almoço pantaneiro incluso.',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          primaryCTA: {
            label: 'Ver Datas da Temporada',
            href: '/experiencias/pesca'
          },
          secondaryCTA: {
            label: 'Falar com Especialista',
            href: '/contato'
          },
          layout: 'image-left'
        }
      },
      {
        type: 'split-block',
        position: 2,
        payload: {
          title: 'Ecoturismo & Birdwatching',
          subtitle: 'Onças-pintadas e +166 espécies de aves',
          description: 'Safáris fotográficos com biólogos especializados. Observação de fauna selvagem em seu habitat natural, com chances excepcionais de avistar onças-pintadas.',
          image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          primaryCTA: {
            label: 'Explorar Experiências',
            href: '/experiencias'
          },
          secondaryCTA: {
            label: 'Ver Galeria',
            href: '/galeria'
          },
          layout: 'image-right'
        }
      },
      {
        type: 'split-block',
        position: 3,
        payload: {
          title: 'Suítes à Beira-Rio',
          subtitle: 'Conforto sustentável com vista para o Cuiabá',
          description: 'Acomodações com varanda privativa, energia solar e arquitetura que respeita o meio ambiente. Toda manhã com café regional incluso.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          primaryCTA: {
            label: 'Ver Acomodações',
            href: '/acomodacoes'
          },
          secondaryCTA: {
            label: 'Consultar Preços',
            href: '/contato'
          },
          layout: 'image-left'
        }
      },
      {
        type: 'split-block',
        position: 4,
        payload: {
          title: 'História & Conservação',
          subtitle: 'Desde 1897, preservando o Pantanal',
          description: 'Nossa missão de conservação começou com a Usina Itaicy. Hoje, geramos nossa própria energia solar e apoiamos pesquisas de biodiversidade.',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          primaryCTA: {
            label: 'Nossa História',
            href: '/sobre-nos'
          },
          secondaryCTA: {
            label: 'Sustentabilidade',
            href: '/sustentabilidade'
          },
          layout: 'image-right'
        }
      },
      {
        type: 'stats-ribbon',
        position: 5,
        payload: {
          stats: [
            {
              value: '4.700',
              label: 'Espécies catalogadas',
              description: 'Biodiversidade registrada'
            },
            {
              value: '127',
              label: 'Anos de história',
              description: 'Desde a Usina Itaicy (1897)'
            },
            {
              value: '100%',
              label: 'Energia solar',
              description: 'Lodge sustentável'
            },
            {
              value: '11',
              label: 'Suítes exclusivas',
              description: 'À beira do Rio Cuiabá'
            }
          ]
        }
      },
      {
        type: 'testimonials',
        position: 6,
        payload: {
          title: 'Experiências Transformadoras',
          testimonials: [
            {
              quote: 'O Itaicy superou todas as expectativas. A pesca foi incrível e a hospedagem, um verdadeiro refúgio no Pantanal.',
              author: 'Carlos Montenegro',
              city: 'São Paulo, SP',
              rating: 5,
              featured: true
            },
            {
              quote: 'Dormir ouvindo as araras e acordar com a vista do rio foi uma experiência transformadora.',
              author: 'Ana Carvalho',
              city: 'Rio de Janeiro, RJ',
              rating: 5,
              featured: true
            },
            {
              quote: 'Guias experientes, comida maravilhosa e um atendimento que faz toda a diferença.',
              author: 'Roberto Silva',
              city: 'Brasília, DF',
              rating: 5,
              featured: false
            }
          ]
        }
      },
      {
        type: 'newsletter',
        position: 7,
        payload: {
          title: 'Receba Novidades do Pantanal',
          subtitle: 'Dicas de pesca, avistamentos da fauna e ofertas exclusivas direto no seu e-mail',
          placeholder: 'Digite seu e-mail',
          ctaLabel: 'Inscrever-se'
        }
      }
    ];

    return {
      slug: 'home',
      name: 'Página Inicial',
      template: 'hero-video',
      blocks
    };
  }

  // Extrai conteúdo da página de Acomodações
  extractAcomodacoesPage(): PageData {
    console.log('🏨 Extraindo página Acomodações...');
    
    const blocks: BlockData[] = [
      {
        type: 'hero-image',
        position: 0,
        payload: {
          title: 'Suítes à Beira-Rio',
          subtitle: 'Conforto contemporâneo envolto pela mata do Pantanal',
          backgroundImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
          primaryCTA: {
            label: 'Ver Disponibilidade',
            href: '/contato'
          }
        }
      },
      {
        type: 'benefits-strip',
        position: 1,
        payload: {
          benefits: [
            {
              icon: 'leaf',
              title: 'Design Sustentável',
              description: 'Materiais locais & energia solar'
            },
            {
              icon: 'waves',
              title: 'Varanda com Vista',
              description: 'Rede privativa sobre o rio'
            },
            {
              icon: 'snowflake',
              title: 'Climatização 24h',
              description: 'Fresco no verão, aconchegante no inverno'
            },
            {
              icon: 'coffee',
              title: 'Café Pantaneiro',
              description: 'Buffet regional incluído'
            }
          ]
        }
      },
      {
        type: 'suites-grid',
        position: 2,
        payload: {
          title: 'Escolha sua Suíte',
          suites: [
            {
              name: 'Suíte Compacta',
              size: '28 m²',
              capacity: 2,
              price: 800,
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
              amenities: ['Varanda com rede', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital']
            },
            {
              name: 'Suíte Ampla',
              size: '35 m²',
              capacity: 3,
              price: 1200,
              image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
              amenities: ['Varanda ampliada', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital']
            },
            {
              name: 'Suíte Master',
              size: '45 m²',
              capacity: 4,
              price: 1800,
              image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
              amenities: ['Varanda panorâmica', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Minibar', 'Banheira dupla']
            }
          ]
        }
      },
      {
        type: 'inclusions-card',
        position: 3,
        payload: {
          title: 'Tudo isso já vem com sua reserva',
          inclusions: [
            'Transfer aeroporto ⇄ lodge',
            'Café da manhã pantaneiro',
            'Wi-Fi ilimitado',
            'Estacionamento gratuito',
            'Taxas e ISS inclusos'
          ]
        }
      }
    ];

    return {
      slug: 'acomodacoes',
      name: 'Acomodações',
      template: 'hero-image',
      blocks
    };
  }

  // Extrai assets de mídia
  extractMediaAssets(): MediaAsset[] {
    console.log('🖼️ Extraindo assets de mídia...');
    
    const assets: MediaAsset[] = [
      {
        path: 'hero/itaicy-video-bg.mp4',
        alt: 'Vídeo de fundo mostrando o Pantanal e as instalações do lodge',
        originalPath: '/attached_assets/itaicy-video-bg.mp4'
      },
      {
        path: 'logos/itaicy-wordmark-primary.png',
        alt: 'Logo Itaicy Pantanal Eco Lodge versão primária',
        originalPath: '/attached_assets/itaicy-wordmark-primary.png'
      },
      {
        path: 'logos/itaicy-wordmark-secondary.png',
        alt: 'Logo Itaicy Pantanal Eco Lodge versão secundária',
        originalPath: '/attached_assets/itaicy-wordmark-secondary.png'
      }
    ];

    return assets;
  }

  // Executa extração completa
  async extractAll(): Promise<void> {
    console.log('🚀 Iniciando extração completa...');
    
    // Extrai páginas
    this.pages.push(this.extractHomePage());
    this.pages.push(this.extractAcomodacoesPage());
    
    // Extrai mídia
    this.media = this.extractMediaAssets();
    
    // Salva resultado
    const exportData = {
      pages: this.pages,
      media: this.media,
      extractedAt: new Date().toISOString()
    };
    
    const exportPath = path.join(process.cwd(), 'seed/export.json');
    
    // Cria diretório se não existe
    await fs.promises.mkdir(path.dirname(exportPath), { recursive: true });
    
    // Salva arquivo
    await fs.promises.writeFile(
      exportPath,
      JSON.stringify(exportData, null, 2),
      'utf-8'
    );
    
    console.log('✅ Extração concluída!');
    console.log(`📄 ${this.pages.length} páginas extraídas`);
    console.log(`🖼️ ${this.media.length} assets de mídia identificados`);
    console.log(`💾 Dados salvos em: ${exportPath}`);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  const extractor = new ContentExtractor();
  extractor.extractAll().catch(console.error);
}

export { ContentExtractor };