import { BookingWidget } from '@/components/sections/booking-widget';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';
import { DynamicBlockRenderer } from '@/components/cms/DynamicBlockRenderer';
import { usePublishedBlocks } from '@/hooks/useCMSData';

export default function Home() {
  const { data: blocks, isLoading, error } = usePublishedBlocks('home');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando página...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar página: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Conteúdo dinâmico do CMS */}
      {blocks && <DynamicBlockRenderer blocks={blocks} />}
      
      {/* Componentes que permanecem estáticos */}
      <BookingWidget variant="floating" />
      <Testimonials />
      <Newsletter />
      <FAQ />
      <MobileBookingBar />
    </div>
  );
}
