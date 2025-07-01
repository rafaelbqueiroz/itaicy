import { CarouselBlock } from './CarouselBlock';
import { TabsBlock } from './TabsBlock';
import { ContactFormBlock } from './ContactFormBlock';

/*
 * ARQUITETURA DE BLOCOS DO CMS
 * 
 * Este arquivo serve como índice central para todos os blocos disponíveis no CMS.
 * A estrutura está organizada em duas categorias:
 * 
 * 1. BLOCOS BÁSICOS (definidos em Pages.ts):
 *    - Estes blocos têm suas definições completas no arquivo collections/Pages.ts
 *    - A separação foi feita para manter Pages.ts mais enxuto e focado
 *    - Aqui apenas exportamos referências com o slug para mapeamento
 * 
 * 2. BLOCOS COMPLEXOS (definidos em arquivos separados):
 *    - CarouselBlock, TabsBlock, ContactFormBlock
 *    - Cada um tem seu próprio arquivo devido à complexidade da configuração
 *    - Permite melhor manutenibilidade e organização do código
 * 
 * Para adicionar um novo bloco:
 * 1. Se for simples: defina em Pages.ts e adicione referência aqui
 * 2. Se for complexo: crie arquivo separado e importe aqui
 * 3. Adicione o slug em allBlocks[]
 * 4. Adicione mapeamento em blockMap{}
 */

// BLOCOS BÁSICOS - Definições completas em collections/Pages.ts
export const HeroImageBlock = {
  slug: 'hero-image',
  // Definição completa: server/cms/collections/Pages.ts (linha ~50)
  // Bloco para hero com imagem de fundo
};

export const HeroVideoBlock = {
  slug: 'hero-video',
  // Definição completa: server/cms/collections/Pages.ts (linha ~150)
  // Bloco para hero com vídeo de fundo
};

export const FeatureBlocksBlock = {
  slug: 'feature-blocks',
  // Definição completa: server/cms/collections/Pages.ts (linha ~250)
  // Grade de blocos de recursos/características
};

export const SplitBlock = {
  slug: 'split-block',
  // Definição completa: server/cms/collections/Pages.ts (linha ~350)
  // Layout dividido com imagem e texto
};

export const TestimonialsBlock = {
  slug: 'testimonials',
  // Definição completa: server/cms/collections/Pages.ts (linha ~450)
  // Seção de depoimentos de clientes
};

export const FAQBlock = {
  slug: 'faq',
  // Definição completa: server/cms/collections/Pages.ts (linha ~550)
  // Perguntas frequentes com accordion
};

export const NewsletterBlock = {
  slug: 'newsletter',
  // Definição completa: server/cms/collections/Pages.ts (linha ~650)
  // Formulário de inscrição em newsletter
};

export const CountersRibbonBlock = {
  slug: 'counters-ribbon',
  // Definição completa: server/cms/collections/Pages.ts (linha ~750)
  // Faixa com contadores animados
};

// Exportar todos os blocos
export {
  CarouselBlock,
  TabsBlock,
  ContactFormBlock,
};

// Exportar lista de todos os blocos disponíveis
export const allBlocks = [
  'hero-image',
  'hero-video',
  'feature-blocks',
  'split-block',
  'testimonials',
  'faq',
  'newsletter',
  'counters-ribbon',
  'carousel',
  'tabs',
  'contact-form',
];

// Exportar mapa de blocos para uso no BlockRenderer
export const blockMap = {
  'hero-image': 'HeroSection',
  'hero-video': 'HeroVideo',
  'feature-blocks': 'FeatureBlocks',
  'split-block': 'SplitBlock',
  'testimonials': 'Testimonials',
  'faq': 'FAQ',
  'newsletter': 'Newsletter',
  'counters-ribbon': 'CountersRibbon',
  'carousel': 'Carousel',
  'tabs': 'Tabs',
  'contact-form': 'ContactForm',
}; 