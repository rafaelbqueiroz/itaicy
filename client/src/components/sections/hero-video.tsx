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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="hero-video absolute inset-0 z-0"
        poster="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
      >
        <source 
          src="https://sample-videos.com/zip/10/webm/SampleVideo_1280x720_1mb.webm" 
          type="video/webm" 
        />
        <source 
          src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" 
          type="video/mp4" 
        />
        {/* Fallback image if video doesn't load */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
      </video>
      
      {/* Overlay */}
      <div className="overlay-gradient absolute inset-0 z-10" />
      
      {/* Hero Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="playfair text-5xl md:text-7xl font-bold mb-6 animate-fade-up">
          {t('hero.title')}<br />
          <span className="text-itaicy-secondary">{t('hero.subtitle')}</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg"
            className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
            onClick={scrollToBooking}
          >
            {t('hero.reserveNow')}
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-itaicy-primary px-8 py-4 text-lg font-semibold transition-all duration-200"
            onClick={() => document.getElementById('experiencias')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('hero.knowExperiences')}
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
