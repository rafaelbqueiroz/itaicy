import { HeroVideo } from '@/components/sections/hero-video';
import { BookingWidget } from '@/components/sections/booking-widget';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { FeatureBlocks } from '@/components/sections/feature-blocks';
import { CountersRibbon } from '@/components/sections/counters-ribbon';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';

export default function Home() {
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
