import { CarouselBlock } from './CarouselBlock';
import { TabsBlock } from './TabsBlock';
import { ContactFormBlock } from './ContactFormBlock';

// Blocos básicos
export const HeroImageBlock = {
  slug: 'hero-image',
  // Este bloco está definido em Pages.ts
};

export const HeroVideoBlock = {
  slug: 'hero-video',
  // Este bloco está definido em Pages.ts
};

export const FeatureBlocksBlock = {
  slug: 'feature-blocks',
  // Este bloco está definido em Pages.ts
};

export const SplitBlock = {
  slug: 'split-block',
  // Este bloco está definido em Pages.ts
};

export const TestimonialsBlock = {
  slug: 'testimonials',
  // Este bloco está definido em Pages.ts
};

export const FAQBlock = {
  slug: 'faq',
  // Este bloco está definido em Pages.ts
};

export const NewsletterBlock = {
  slug: 'newsletter',
  // Este bloco está definido em Pages.ts
};

export const CountersRibbonBlock = {
  slug: 'counters-ribbon',
  // Este bloco está definido em Pages.ts
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