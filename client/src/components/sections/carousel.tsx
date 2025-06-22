import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CarouselProps {
  title?: string;
  subtitle?: string;
  slides: {
    image: {
      url: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    title?: string;
    description?: string;
    cta?: {
      label?: string;
      href?: string;
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    };
    overlayColor?: 'none' | 'dark' | 'light' | 'gradient';
  }[];
  settings?: {
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    height?: 'small' | 'medium' | 'large' | 'full';
    effect?: 'slide' | 'fade' | 'zoom';
  };
}

const Carousel: React.FC<CarouselProps> = ({
  title,
  subtitle,
  slides = [],
  settings = {},
}) => {
  const {
    autoplay = true,
    interval = 5000,
    showArrows = true,
    showDots = true,
    height = 'medium',
    effect = 'slide',
  } = settings || {};

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Configuração de altura baseada na propriedade height
  const heightClasses = {
    small: 'h-[300px] md:h-[400px]',
    medium: 'h-[400px] md:h-[500px]',
    large: 'h-[500px] md:h-[600px]',
    full: 'h-[calc(100vh-80px)]',
  };

  // Configuração de efeito de transição
  const effectClasses = {
    slide: 'transition-transform duration-500',
    fade: 'transition-opacity duration-500',
    zoom: 'transition-all duration-500 transform',
  };

  // Avançar para o próximo slide
  const nextSlide = () => {
    if (isAnimating || slides.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    
    // Reset do estado de animação após a transição
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Voltar para o slide anterior
  const prevSlide = () => {
    if (isAnimating || slides.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    
    // Reset do estado de animação após a transição
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Ir para um slide específico
  const goToSlide = (index: number) => {
    if (isAnimating || currentSlide === index) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    
    // Reset do estado de animação após a transição
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Configurar autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay && slides.length > 1) {
      interval = setInterval(() => {
        nextSlide();
      }, interval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, currentSlide, slides.length]);

  // Se não houver slides, não renderizar nada
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Título e subtítulo da seção */}
      {(title || subtitle) && (
        <div className="container mx-auto px-4 py-8 text-center">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      {/* Container do carrossel */}
      <div className={cn(
        "relative overflow-hidden w-full",
        heightClasses[height]
      )}>
        {/* Slides */}
        <div className="h-full">
          {slides.map((slide, index) => (
            <div
              key={`slide-${index}`}
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                index === currentSlide ? "z-10" : "z-0",
                effectClasses[effect],
                effect === 'fade' && index !== currentSlide && "opacity-0",
                effect === 'zoom' && index !== currentSlide && "scale-110 opacity-0"
              )}
              style={{
                transform: effect === 'slide' ? 
                  `translateX(${(index - currentSlide) * 100}%)` : undefined
              }}
            >
              {/* Imagem de fundo */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image.url}
                  alt={slide.image.alt || ''}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                
                {/* Overlay */}
                {slide.overlayColor && slide.overlayColor !== 'none' && (
                  <div className={cn(
                    "absolute inset-0",
                    slide.overlayColor === 'dark' && "bg-black/50",
                    slide.overlayColor === 'light' && "bg-white/30",
                    slide.overlayColor === 'gradient' && "bg-gradient-to-t from-black/70 to-transparent"
                  )} />
                )}
              </div>
              
              {/* Conteúdo do slide */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-xl text-white">
                    {slide.title && (
                      <h3 className="text-3xl md:text-4xl font-bold mb-3">{slide.title}</h3>
                    )}
                    {slide.description && (
                      <p className="text-lg mb-6">{slide.description}</p>
                    )}
                    {slide.cta?.label && slide.cta.href && (
                      <Button
                        variant={slide.cta.variant || 'primary'}
                        asChild
                      >
                        <a href={slide.cta.href}>{slide.cta.label}</a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Setas de navegação */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
              aria-label="Slide anterior"
              disabled={isAnimating}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
              aria-label="Próximo slide"
              disabled={isAnimating}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Indicadores */}
        {showDots && slides.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Ir para slide ${index + 1}`}
                disabled={isAnimating}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel; 