// CMS local com dados extraídos para teste
export interface Page {
  id: string;
  slug: string;
  name: string;
  template: string;
  priority: number;
  created_at: string;
}

export interface Block {
  id: string;
  page_id: string;
  type: string;
  position: number;
  payload: Record<string, any>;
  published: Record<string, any> | null;
  updated_at: string;
}

// Dados extraídos do site real
const PAGES_DATA: Page[] = [
  {
    id: '1',
    slug: 'home',
    name: 'Página Inicial',
    template: 'transparent-header',
    priority: 0,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'acomodacoes',
    name: 'Acomodações',
    template: 'transparent-header',
    priority: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'experiencias',
    name: 'Experiências',
    template: 'sticky-header',
    priority: 2,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    slug: 'galeria',
    name: 'Galeria',
    template: 'sticky-header',
    priority: 3,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    slug: 'blog',
    name: 'Blog',
    template: 'sticky-header',
    priority: 4,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    slug: 'contato',
    name: 'Contato',
    template: 'sticky-header',
    priority: 5,
    created_at: new Date().toISOString()
  }
];

const BLOCKS_DATA: Block[] = [
  // Home - Página Inicial
  {
    id: 'b1',
    page_id: '1',
    type: 'hero',
    position: 1,
    payload: {
      title: 'Viva o Pantanal Autêntico',
      subtitle: 'Pesque, explore e conecte-se com a natureza mais preservada do mundo no Itaicy Pantanal Eco Lodge.',
      backgroundVideo: 'hero/itaicy-video-bg.mp4',
      cta: 'Reserve Sua Experiência'
    },
    published: {
      title: 'Viva o Pantanal Autêntico',
      subtitle: 'Pesque, explore e conecte-se com a natureza mais preservada do mundo no Itaicy Pantanal Eco Lodge.',
      backgroundVideo: 'hero/itaicy-video-bg.mp4',
      cta: 'Reserve Sua Experiência'
    },
    updated_at: new Date().toISOString()
  },
  {
    id: 'b2',
    page_id: '1',
    type: 'stats',
    position: 2,
    payload: {
      items: [
        { value: '4.700+', label: 'Espécies de fauna e flora' },
        { value: '23.000', label: 'Hectares de natureza preservada' },
        { value: '166', label: 'Espécies de peixes catalogadas' },
        { value: '100%', label: 'Energia solar renovável' }
      ]
    },
    published: {
      items: [
        { value: '4.700+', label: 'Espécies de fauna e flora' },
        { value: '23.000', label: 'Hectares de natureza preservada' },
        { value: '166', label: 'Espécies de peixes catalogadas' },
        { value: '100%', label: 'Energia solar renovável' }
      ]
    },
    updated_at: new Date().toISOString()
  },
  // Acomodações
  {
    id: 'b3',
    page_id: '2',
    type: 'hero',
    position: 1,
    payload: {
      title: 'Seu refúgio de madeira e vento de rio',
      subtitle: 'Acomodações sustentáveis que harmonizam conforto e natureza, com vista privilegiada para o Rio Paraguai.',
      backgroundImage: 'acomodacoes/hero-suite.jpg'
    },
    published: {
      title: 'Seu refúgio de madeira e vento de rio',
      subtitle: 'Acomodações sustentáveis que harmonizam conforto e natureza, com vista privilegiada para o Rio Paraguai.',
      backgroundImage: 'acomodacoes/hero-suite.jpg'
    },
    updated_at: new Date().toISOString()
  },
  {
    id: 'b4',
    page_id: '2',
    type: 'text',
    position: 2,
    payload: {
      content: 'Nossas suítes foram projetadas para oferecer máximo conforto enquanto mantêm total harmonia com o ambiente natural. Cada acomodação conta com vista para o rio, ar-condicionado, frigobar e varanda privativa.'
    },
    published: {
      content: 'Nossas suítes foram projetadas para oferecer máximo conforto enquanto mantêm total harmonia com o ambiente natural. Cada acomodação conta com vista para o rio, ar-condicionado, frigobar e varanda privativa.'
    },
    updated_at: new Date().toISOString()
  }
];

// Store local para simular persistência
let localPages = [...PAGES_DATA];
let localBlocks = [...BLOCKS_DATA];

export class LocalCMSService {
  static async getPages(): Promise<Page[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([...localPages]), 100);
    });
  }

  static async getPageWithBlocks(slug: string): Promise<{ page: Page; blocks: Block[] } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const page = localPages.find(p => p.slug === slug);
        if (!page) {
          resolve(null);
          return;
        }
        
        const blocks = localBlocks
          .filter(b => b.page_id === page.id)
          .sort((a, b) => a.position - b.position);
          
        resolve({ page, blocks });
      }, 100);
    });
  }

  static async updateBlock(blockId: string, payload: Record<string, any>): Promise<Block> {
    return new Promise(resolve => {
      setTimeout(() => {
        const blockIndex = localBlocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          localBlocks[blockIndex] = {
            ...localBlocks[blockIndex],
            payload,
            updated_at: new Date().toISOString()
          };
          resolve(localBlocks[blockIndex]);
        }
      }, 100);
    });
  }

  static async publishBlock(blockId: string): Promise<Block> {
    return new Promise(resolve => {
      setTimeout(() => {
        const blockIndex = localBlocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          localBlocks[blockIndex] = {
            ...localBlocks[blockIndex],
            published: localBlocks[blockIndex].payload,
            updated_at: new Date().toISOString()
          };
          resolve(localBlocks[blockIndex]);
        }
      }, 100);
    });
  }

  static async publishPage(pageId: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        const pageBlocks = localBlocks.filter(b => b.page_id === pageId);
        pageBlocks.forEach(block => {
          const blockIndex = localBlocks.findIndex(b => b.id === block.id);
          if (blockIndex !== -1) {
            localBlocks[blockIndex] = {
              ...localBlocks[blockIndex],
              published: localBlocks[blockIndex].payload,
              updated_at: new Date().toISOString()
            };
          }
        });
        resolve();
      }, 200);
    });
  }
}