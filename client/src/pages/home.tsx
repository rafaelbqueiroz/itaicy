import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeroVideo } from '@/components/sections/hero-video';
import { BookingWidget } from '@/components/sections/booking-widget';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { CountersRibbon } from '@/components/sections/counters-ribbon';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';

// Componente para renderizar blocos dinâmicos do CMS
function DynamicBlock({ block }: { block: any }) {
  switch (block.type) {
    case 'hero_video':
      return (
        <HeroVideo 
          title={block.props?.title}
          subtitle={block.props?.subtitle}
          videoUrl={block.props?.videoUrl}
        />
      );
    case 'feature_blocks':
      return <FeatureBlocks />;
    case 'counters_ribbon':
      return <CountersRibbon />;
    case 'testimonials':
      return <Testimonials />;
    case 'newsletter':
      return <Newsletter />;
    case 'faq':
      return <FAQ />;
    default:
      return null;
  }
}

export default function Home() {
  const [isPreview, setIsPreview] = useState(false);

  // Detecta se está em modo preview
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsPreview(urlParams.has('preview'));
  }, []);

  // Busca conteúdo dinâmico do CMS
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ['/api/cms/content/home'],
    refetchInterval: isPreview ? 2000 : false, // Auto-refresh em modo preview
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner de preview se estiver em modo de visualização */}
      {isPreview && (
        <div className="bg-orange-500 text-white text-center py-2 text-sm">
          🔍 Modo Preview - Versão de teste, não indexada pelos buscadores
        </div>
      )}

      {/* Renderiza blocos dinâmicos se houver dados do CMS */}
      {pageContent?.blocks && pageContent.blocks.length > 0 ? (
        <>
          {pageContent.blocks.map((block: any, index: number) => (
            <DynamicBlock key={block.id || index} block={block} />
          ))}
        </>
      ) : (
        // Fallback para conteúdo estático se CMS não tiver dados
        <>
          <HeroVideo />
          <FeatureBlocks />
          <CountersRibbon />
          <Testimonials />
          <Newsletter />
          <FAQ />
        </>
      )}

      {/* Widgets sempre presentes */}
      <BookingWidget variant="floating" />
      <MobileBookingBar />

      {/* Indicador de sincronização para preview */}
      {isPreview && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Sincronizado com CMS</span>
          </div>
        </div>
      )}
    </div>
  );
}
