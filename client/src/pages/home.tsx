import { HeroVideo } from '@/components/sections/hero-video';
import { BookingWidget } from '@/components/sections/booking-widget';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { Highlights } from '@/components/sections/highlights';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroVideo />
      <BookingWidget variant="floating" />
      <FeatureBlocks />
      <Highlights />
      <Testimonials />
      <Newsletter />
      <FAQ />
    </div>
  );
}
