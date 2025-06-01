import React from 'react';
import { HeroVideo } from '@/components/sections/hero-video';
import { HeroImage } from '@/components/sections/hero-image';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { CountersRibbon } from '@/components/sections/counters-ribbon';
import { StatsRibbon } from '@/components/sections/stats-ribbon';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';
import { SplitBlock } from '@/components/sections/split-block';
import { Gallery } from '@/components/sections/gallery';
import { ContactForm } from '@/components/sections/contact-form';
import { LodgeOverview } from '@/components/sections/lodge-overview';
import { Highlights } from '@/components/sections/highlights';
import { BlogGrid } from '@/components/sections/blog-grid';
import { HeroSimple } from '@/components/sections/hero-simple';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Interface para um bloco individual
export interface Block {
  id: string;
  type: string;
  position: number;
  payload: Record<string, any>;
  published: Record<string, any> | null;
}

// Interface para as props do BlockRenderer
export interface BlockRendererProps {
  block?: Block;           // Um único bloco
  blocks?: Block[];        // Lista de blocos
  isPreview?: boolean;     // Indica se está em modo preview
  showPlaceholders?: boolean; // Mostra placeholders para blocos não renderizáveis
}

// Componente para mostrar um placeholder quando um bloco não pode ser renderizado
const BlockPlaceholder: React.FC<{ type: string; message?: string }> = ({ type, message }) => (
  <Alert variant="destructive" className="max-w-4xl mx-auto my-4 border border-red-200">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      <span className="font-semibold">Bloco não renderizado:</span> {type}
      {message && <div className="text-sm mt-1">{message}</div>}
    </AlertDescription>
  </Alert>
);

// Componente para renderizar um bloco específico
const renderBlock = (block: Block, isPreview: boolean = false): React.ReactNode => {
  // Se o bloco não tiver payload, não renderiza
  if (!block.payload) {
    return isPreview ? <BlockPlaceholder type={block.type} message="Payload não encontrado" /> : null;
  }

  // Renderiza o bloco com base no tipo
  try {
    switch (block.type) {
      case 'hero-video':
        return <HeroVideo key={block.id} {...block.payload} />;
      
      case 'hero-image':
        return <HeroImage key={block.id} {...block.payload} />;

      case 'hero-simple':
        return <HeroSimple key={block.id} {...block.payload} />;

      case 'split-block':
        return <SplitBlock key={block.id} {...block.payload} />;

      case 'feature-blocks':
        return <FeatureBlocks key={block.id} {...block.payload} />;
      
      case 'counters-ribbon':
        return <CountersRibbon key={block.id} {...block.payload} />;
      
      case 'stats-ribbon':
        return <StatsRibbon key={block.id} {...block.payload} />;
      
      case 'testimonials':
        return <Testimonials key={block.id} {...block.payload} />;
      
      case 'newsletter':
        return <Newsletter key={block.id} {...block.payload} />;
      
      case 'gallery':
        return <Gallery key={block.id} {...block.payload} />;
      
      case 'blog-grid':
        return <BlogGrid key={block.id} {...block.payload} />;
      
      case 'contact-form':
        return <ContactForm key={block.id} {...block.payload} />;
      
      case 'lodge-overview':
        return <LodgeOverview key={block.id} {...block.payload} />;
      
      case 'highlights':
        return <Highlights key={block.id} {...block.payload} />;
      
      case 'faq':
        return <FAQ key={block.id} {...block.payload} />;

      default:
        // Para tipos não reconhecidos, mostra um placeholder em modo preview
        // ou tenta renderizar um componente genérico
        if (isPreview) {
          return <BlockPlaceholder type={block.type} message="Tipo de bloco não reconhecido" />;
        }
        
        // Tenta renderizar um bloco genérico baseado nos dados
        if (block.payload.title || block.payload.content) {
          return (
            <section key={block.id} className="py-12 bg-white">
              <div className="container mx-auto px-4">
                {block.payload.title && (
                  <h2 className="text-3xl font-bold mb-6 text-center">{block.payload.title}</h2>
                )}
                {block.payload.content && (
                  <div className="prose max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: block.payload.content }} />
                )}
              </div>
            </section>
          );
        }
        
        // Se não conseguir renderizar, retorna null
        return null;
    }
  } catch (error) {
    // Em caso de erro na renderização, mostra um placeholder em modo preview
    // ou retorna null em modo produção
    console.error(`Erro ao renderizar bloco ${block.type}:`, error);
    return isPreview ? (
      <BlockPlaceholder 
        type={block.type} 
        message={`Erro ao renderizar: ${(error as Error).message}`} 
      />
    ) : null;
  }
};

// Componente principal BlockRenderer
export function BlockRenderer({ block, blocks, isPreview = false, showPlaceholders = true }: BlockRendererProps) {
  // Se receber um único bloco
  if (block) {
    return (
      <div className={`block-wrapper block-type-${block.type}`} data-block-id={block.id}>
        {renderBlock(block, isPreview && showPlaceholders)}
      </div>
    );
  }
  
  // Se receber uma lista de blocos
  if (blocks && blocks.length > 0) {
    const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
    
    return (
      <>
        {sortedBlocks.map((block) => (
          <div key={block.id} className={`block-wrapper block-type-${block.type}`} data-block-id={block.id}>
            {renderBlock(block, isPreview && showPlaceholders)}
          </div>
        ))}
      </>
    );
  }
  
  // Se não receber blocos e estiver em modo preview com placeholders
  if (isPreview && showPlaceholders) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-md">
        <p className="text-gray-500">Nenhum bloco para renderizar</p>
      </div>
    );
  }
  
  // Caso não tenha blocos e não esteja em modo preview
  return null;
}
