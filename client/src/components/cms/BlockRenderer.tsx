import { HeroVideo } from '@/components/sections/hero-video';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { CountersRibbon } from '@/components/sections/counters-ribbon';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';

interface Block {
  id: string;
  type: string;
  position: number;
  payload: Record<string, any>;
  published: boolean;
}

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  const sortedBlocks = blocks.sort((a, b) => a.position - b.position);

  return (
    <>
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'hero-video':
            return (
              <HeroVideo 
                key={block.id}
                {...block.payload}
              />
            );
          
          case 'hero-image':
            return (
              <div 
                key={block.id}
                className="relative h-screen flex items-center justify-center text-white"
                style={{
                  backgroundImage: `url(${block.payload.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {block.payload.overlay && (
                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                )}
                <div className="relative z-10 text-center px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {block.payload.title}
                  </h1>
                  {block.payload.subtitle && (
                    <p className="text-xl md:text-2xl opacity-90">
                      {block.payload.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );

          case 'split-block':
            return (
              <section key={block.id} className="py-16 bg-white">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        {block.payload.title}
                      </h2>
                      {block.payload.description && (
                        <p className="text-lg text-gray-600 mb-6">
                          {block.payload.description}
                        </p>
                      )}
                      {block.payload.bullets && (
                        <ul className="space-y-3">
                          {block.payload.bullets.map((bullet: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              <span className="text-gray-700">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {block.payload.image && (
                      <div>
                        <img 
                          src={block.payload.image} 
                          alt={block.payload.imageAlt || block.payload.title}
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );

          case 'feature-blocks':
            return <FeatureBlocks key={block.id} {...block.payload} />;
          
          case 'counters-ribbon':
            return <CountersRibbon key={block.id} {...block.payload} />;
          
          case 'testimonials':
            return <Testimonials key={block.id} {...block.payload} />;
          
          case 'newsletter':
            return <Newsletter key={block.id} {...block.payload} />;
          
          case 'faq':
            return <FAQ key={block.id} {...block.payload} />;

          default:
            console.warn(`Tipo de bloco não reconhecido: ${block.type}`);
            return null;
        }
      })}
    </>
  );
}