import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ChevronDown } from 'lucide-react';

export function HeroVideo() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video autoplays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-widget');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[75vh] sm:h-screen flex items-center justify-center overflow-hidden">
      {/* Aerial Drone Background - Pantanal River */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6, 71, 55, 0.53) 0%, rgba(6, 71, 55, 0) 45%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')`
        }}
      />
      
      {/* Hero Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up leading-tight text-[#FAF9F6]">
          Viva o Pantanal<br />
          Autêntico
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-up font-normal text-[#FAF9F6]" style={{ animationDelay: '0.2s', fontFamily: 'Lato, sans-serif' }}>
          Pesque dourados gigantes, fotografe 166 aves e durma embalado pelo canto da mata.
        </p>

      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
