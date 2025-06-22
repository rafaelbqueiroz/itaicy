import React from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica de componentes para melhorar performance
const HeroSection = dynamic(() => import('../sections/hero-section'));
const HeroVideo = dynamic(() => import('../sections/hero-video'));
const FeatureBlocks = dynamic(() => import('../sections/feature-blocks'));
const SplitBlock = dynamic(() => import('../sections/split-block'));
const Testimonials = dynamic(() => import('../sections/testimonials'));
const FAQ = dynamic(() => import('../sections/faq-section'));
const Newsletter = dynamic(() => import('../sections/newsletter'));
const CountersRibbon = dynamic(() => import('../sections/counters-ribbon'));
const BookingWidget = dynamic(() => import('../sections/booking-widget'));

// Importação dinâmica dos blocos avançados
const Carousel = dynamic(() => import('../sections/carousel'));
const Tabs = dynamic(() => import('../sections/tabs'));
const ContactForm = dynamic(() => import('../sections/contact-form'));

// Mapa de tipos de blocos para componentes
const blockComponents = {
  'hero-image': HeroSection,
  'hero-video': HeroVideo,
  'feature-blocks': FeatureBlocks,
  'split-block': SplitBlock,
  'testimonials': Testimonials,
  'faq': FAQ,
  'newsletter': Newsletter,
  'counters-ribbon': CountersRibbon,
  'booking-widget': BookingWidget,
  'carousel': Carousel,
  'tabs': Tabs,
  'contact-form': ContactForm,
};

// Componente de fallback para blocos não encontrados
const BlockNotFound = ({ blockType }: { blockType: string }) => (
  <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
    <p>Bloco não encontrado: {blockType}</p>
  </div>
);

interface BlockRendererProps {
  blocks: any[];
  isStatic?: boolean;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks, isStatic = false }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        // Determinar o tipo de bloco (formato diferente entre estático e CMS)
        const blockType = isStatic ? block.type : block.blockType;
        
        // Dados do bloco (formato diferente entre estático e CMS)
        const blockData = isStatic ? block.data : block;
        
        // Obter o componente correspondente ao tipo de bloco
        const BlockComponent = blockComponents[blockType] || BlockNotFound;
        
        // Renderizar o componente com os dados do bloco
        return (
          <div key={`block-${blockType}-${index}`} id={`block-${index}`} className="block-wrapper">
            <BlockComponent {...blockData} blockType={blockType} />
          </div>
        );
      })}
    </>
  );
};

export default BlockRenderer; 