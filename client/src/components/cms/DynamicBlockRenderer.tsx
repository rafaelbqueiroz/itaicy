import { Block } from '@/lib/supabase';
import { HeroVideo } from '@/components/sections/hero-video';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { CountersRibbon } from '@/components/sections/counters-ribbon';

interface DynamicBlockRendererProps {
  blocks: Block[];
}

export function DynamicBlockRenderer({ blocks }: DynamicBlockRendererProps) {
  const renderBlock = (block: Block) => {
    const payload = block.payload;

    switch (block.type) {
      case 'hero-video':
        return (
          <HeroVideo
            key={block.id}
            title={payload?.title}
            subtitle={payload?.subtitle}
            videoSrc={payload?.videoSrc || payload?.videoUrl}
            primaryCTA={payload?.primaryCTA}
            secondaryCTA={payload?.secondaryCTA}
          />
        );

      case 'hero-image':
        return (
          <div 
            key={block.id}
            className="relative h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${payload?.backgroundImage})` }}
          >
            {payload?.overlay && (
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            )}
            <div className="relative z-10 text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {payload?.title}
              </h1>
              {payload?.subtitle && (
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                  {payload?.subtitle}
                </p>
              )}
            </div>
          </div>
        );

      case 'split-block':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {payload?.layout === 'image-left' ? (
                  <>
                    <div>
                      <img 
                        src={payload?.image} 
                        alt={payload?.title}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4">{payload?.title}</h2>
                      {payload?.subtitle && (
                        <p className="text-xl text-gray-600 mb-6">{payload?.subtitle}</p>
                      )}
                      {payload?.description && (
                        <p className="text-gray-700 mb-6">{payload?.description}</p>
                      )}
                      {payload?.bullets && (
                        <ul className="space-y-2">
                          {payload.bullets.map((bullet: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h2 className="text-3xl font-bold mb-4">{payload?.title}</h2>
                      {payload?.subtitle && (
                        <p className="text-xl text-gray-600 mb-6">{payload?.subtitle}</p>
                      )}
                      {payload?.description && (
                        <p className="text-gray-700 mb-6">{payload?.description}</p>
                      )}
                      {payload?.bullets && (
                        <ul className="space-y-2">
                          {payload.bullets.map((bullet: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <img 
                        src={payload?.image} 
                        alt={payload?.title}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        );

      case 'stats-grid':
        return (
          <CountersRibbon 
            key={block.id}
            stats={payload?.stats}
          />
        );

      case 'feature-blocks':
        return (
          <FeatureBlocks 
            key={block.id}
            blocks={payload?.blocks}
          />
        );

      default:
        console.warn(`Tipo de bloco não suportado: ${block.type}`);
        return null;
    }
  };

  return (
    <div>
      {blocks.map(renderBlock)}
    </div>
  );
}