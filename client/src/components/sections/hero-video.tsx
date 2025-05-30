import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ChevronDown } from 'lucide-react';
import heroVideo from '@assets/itaicy-video-bg.mp4';

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
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      
      {/* Overlay - 10% darkening + gradient */}
      <div className="absolute inset-0 z-10 bg-black/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-pantanal-green-900/30 via-transparent to-pantanal-green-900/20" />
      
      {/* Hero Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up leading-tight text-[#FAF9F6]">
          Viva o Pantanal<br />
          Autêntico
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-up font-normal text-[#FAF9F6]" style={{ animationDelay: '0.2s', fontFamily: 'Lato, sans-serif' }}>
          Pesque dourados gigantes, aviste 650+ aves e adormeça com o canto da mata.
        </p>

      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
