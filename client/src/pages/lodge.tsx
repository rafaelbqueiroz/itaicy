import { HeroSection } from '@/components/sections/hero-section';
import { StickyBar } from '@/components/sections/sticky-bar';
import { SplitBlock } from '@/components/sections/split-block';
import { StatsRibbon } from '@/components/sections/stats-ribbon';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { Check, Wifi, Car, Coffee, Shirt, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

export default function Lodge() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      alt: "Apartamento com varanda e rede"
    },
    {
      src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
      alt: "Piscina de borda infinita"
    },
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      alt: "Vista aérea do lodge"
    },
    {
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      alt: "Área comum e recepção"
    },
    {
      src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      alt: "Restaurante com vista para o rio"
    },
    {
      src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
      alt: "Suíte master com hidromassagem"
    }
  ];

  const statsData = [
    { value: "11", label: "Apartamentos", meta: "Climatizados" },
    { value: "78%", label: "Energia Solar", meta: "Consumo anual" },
    { value: "100%", label: "Wi-Fi Satelital", meta: "Todo o lodge" },
    { value: "24h", label: "Atendimento", meta: "Disponível" }
  ];

  const includedServices = [
    { icon: Coffee, text: "Café premium" },
    { icon: Shirt, text: "Lavanderia para roupas de pesca" },
    { icon: Car, text: "Estacionamento gratuito" },
    { icon: Wifi, text: "Wi-Fi satelital" },
    { icon: UtensilsCrossed, text: "Refeições completas" }
  ];

  return (
    <>
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop"
        title="Seu refúgio de madeira e vento de rio"
        subtitle="Onze apartamentos climatizados, varanda com rede, Wi-Fi satelital e piscina de borda infinita sobre o Rio Cuiabá."
        primaryCTA={{
          label: "Ver Acomodações",
          href: "/acomodacoes"
        }}
        secondaryCTA={{
          label: "Reservar Agora",
          href: "/booking"
        }}
      />

      <StickyBar 
        variant="booking"
        ctaLabel="Verificar Disponibilidade"
        ctaHref="/booking"
      />

      {/* Galeria em Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-center text-river-slate-800 mb-8 sm:mb-12">
            Explore Nossas Instalações
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedImage(image.src)}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-lato text-sm">
                    Clique para ampliar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluso */}
      <section className="py-12 sm:py-16 bg-sand-beige-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg">
            <h3 className="font-playfair text-xl sm:text-2xl text-center text-pantanal-green-900 mb-6 sm:mb-8">
              O que está incluso
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {includedServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pantanal-green-100 rounded-full flex items-center justify-center">
                    <service.icon className="w-4 h-4 text-pantanal-green-700" />
                  </div>
                  <span className="font-lato text-sm sm:text-base text-river-slate-800">{service.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatsRibbon items={statsData} />

      <SplitBlock
        imageSrc="https://images.unsplash.com/photo-1497436072909-f5e4be8b3be1?w=800&h=600&fit=crop"
        imageAlt="Energia solar no lodge"
        title="Compromisso com a Sustentabilidade"
        text="Nossa energia solar cobre 78% do consumo anual, reduzindo nossa pegada de carbono e preservando o Pantanal para as próximas gerações. 

Cada detalhe do lodge foi pensado para minimizar o impacto ambiental sem comprometer o conforto dos nossos hóspedes."
        ctaLabel="Saiba Mais"
        ctaHref="/sustentabilidade"
        backgroundColor="bg-white"
      />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img 
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-full object-contain"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-sunset-amber-400 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <MobileBookingBar />
    </>
  );
}