import { HeroVideo } from '@/components/sections/hero-video';
import { BookingWidget } from '@/components/sections/booking-widget';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { CountersRibbon } from '@/components/sections/counters-ribbon';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';
import { BlockRenderer } from '@/components/cms/BlockRenderer';
import { usePageContent } from '@/hooks/usePageContent';

export default function Home() {
  const { data: pageContent, isLoading, error } = usePageContent('home');

  // Se há dados do CMS e blocos publicados, renderizar dinamicamente
  if (pageContent && pageContent.blocks.length > 0) {
    return (
      <div className="min-h-screen">
        <BlockRenderer blocks={pageContent.blocks} />
        <BookingWidget variant="floating" />
        <MobileBookingBar />
      </div>
    );
  }

  // Fallback: conteúdo original estático para preservar dados existentes
  return (
    <div className="min-h-screen">
      <HeroVideo />
      <BookingWidget variant="floating" />
      <FeatureBlocks />
      <CountersRibbon />
      <Testimonials />
      <Newsletter />
      <FAQ />
      <MobileBookingBar />
    </div>
  );
}
