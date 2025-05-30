import { HeroVideo } from '@/components/sections/hero-video';
import { BookingWidget } from '@/components/sections/booking-widget';
import { Experiences } from '@/components/sections/experiences';
import { LodgeOverview } from '@/components/sections/lodge-overview';
import { Highlights } from '@/components/sections/highlights';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { FAQ } from '@/components/sections/faq';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroVideo />
      <BookingWidget variant="floating" />
      <Experiences />
      <LodgeOverview />
      <Highlights />
      <Testimonials />
      <Newsletter />
      <FAQ />
    </div>
  );
}
