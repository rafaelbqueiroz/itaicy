import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Wifi, Car, Coffee, Waves, TreePine, Leaf } from 'lucide-react';

export default function Acomodacoes() {
  const { t } = useLanguage();

  const includedItems = [
    'Café premium',
    'Lavanderia para roupas de pesca',
    'Estacionamento gratuito',
    'Wi-Fi satelital',
    'Piscina de borda infinita',
    'Ar condicionado'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&h=900&auto=format&fit=crop")'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#064737]/70 to-transparent"></div>
        
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-[#FAF9F6]">
            Seu refúgio de madeira<br />
            e vento de rio
          </h1>
        </div>
      </section>

      {/* Descriptive Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-[#64748B] leading-relaxed mb-12" style={{ fontFamily: 'Lato, sans-serif' }}>
            Onze apartamentos climatizados, varanda com rede, Wi-Fi satelital e piscina de borda infinita sobre o Rio Cuiabá.
          </p>
          
          <Button 
            size="lg"
            className="bg-[#C97A2C] hover:bg-[#C97A2C]/92 text-[#FAF9F6] px-8 py-4 text-[0.9rem] font-medium uppercase tracking-[0.06em] rounded-lg"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Ver acomodações
          </Button>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&h=600&auto=format&fit=crop', alt: 'Suíte com vista do rio' },
              { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&h=600&auto=format&fit=crop', alt: 'Varanda com rede' },
              { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&h=600&auto=format&fit=crop', alt: 'Piscina infinita' },
              { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&h=600&auto=format&fit=crop', alt: 'Vista aérea do lodge' },
              { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&h=600&auto=format&fit=crop', alt: 'Área de convivência' },
              { src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&h=600&auto=format&fit=crop', alt: 'Deck sobre o rio' }
            ].map((image, index) => (
              <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="playfair text-3xl md:text-4xl font-bold text-[#064737] text-center mb-12">
            O que está incluso
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {includedItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#C97A2C] rounded-full"></div>
                <span className="text-lg text-[#064737]" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Highlight */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-8 border-2 border-[#C97A2C]/20 bg-gradient-to-r from-[#FAF9F6] to-[#D9CEB3]/20">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-[#C97A2C] rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="playfair text-2xl font-bold text-[#064737]">
                Energia solar cobre 78% do consumo anual
              </h3>
              <p className="text-[#64748B]" style={{ fontFamily: 'Lato, sans-serif' }}>
                Compromisso com a sustentabilidade e preservação do Pantanal
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}