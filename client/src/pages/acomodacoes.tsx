import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { useLanguage } from '@/hooks/use-language';
import { Leaf, Waves, Snowflake, Coffee, Wifi, Shield, TreePine, Bath, Wine, Users, Star } from 'lucide-react';

export default function Acomodacoes() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Leaf,
      title: 'Design Sustentável',
      description: 'Materiais locais & energia solar'
    },
    {
      icon: Waves,
      title: 'Varanda com Vista',
      description: 'Rede privativa sobre o rio'
    },
    {
      icon: Snowflake,
      title: 'Climatização 24h',
      description: 'Fresco no verão, aconchegante no inverno'
    },
    {
      icon: Coffee,
      title: 'Café Pantaneiro',
      description: 'Buffet regional incluído'
    }
  ];

  const suites = [
    {
      id: 1,
      name: 'Suíte Compacta',
      size: '28 m²',
      capacity: 2,
      description: 'Conforto essencial com vista para o rio e varanda privativa.',
      price: 800,
      amenities: [
        { icon: TreePine, name: 'Varanda com rede' },
        { icon: Snowflake, name: 'Ar-condicionado' },
        { icon: Wifi, name: 'Wi-Fi satelital' },
        { icon: Shield, name: 'Cofre digital' }
      ],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
    },
    {
      id: 2,
      name: 'Suíte Ampla',
      size: '35 m²',
      capacity: 3,
      description: 'Espaço generoso com varanda ampliada e vista privilegiada.',
      price: 1200,
      amenities: [
        { icon: TreePine, name: 'Varanda ampliada' },
        { icon: Snowflake, name: 'Ar-condicionado' },
        { icon: Wifi, name: 'Wi-Fi satelital' },
        { icon: Shield, name: 'Cofre digital' }
      ],
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
    },
    {
      id: 3,
      name: 'Suíte Master',
      size: '45 m²',
      capacity: 4,
      description: 'Nossa suíte mais exclusiva com varanda panorâmica e comodidades premium.',
      price: 1800,
      amenities: [
        { icon: TreePine, name: 'Varanda panorâmica' },
        { icon: Snowflake, name: 'Ar-condicionado' },
        { icon: Wifi, name: 'Wi-Fi satelital' },
        { icon: Shield, name: 'Cofre digital' },
        { icon: Wine, name: 'Minibar' },
        { icon: Bath, name: 'Banheira dupla' }
      ],
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
    }
  ];

  const inclusions = [
    'Transfer aeroporto ⇄ lodge',
    'Café da manhã pantaneiro',
    'Wi-Fi ilimitado',
    'Estacionamento gratuito',
    'Taxas e ISS inclusos'
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Suítes à Beira-Rio
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-light leading-relaxed">
            Conforto contemporâneo envolto pela mata do Pantanal
          </p>
          <Button className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-8 rounded-md transition-colors duration-150">
            Ver Disponibilidade
          </Button>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-8 sm:py-12 bg-white border-b border-sand-beige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-pantanal-green-100 rounded-lg flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-pantanal-green-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-lato font-semibold text-xs sm:text-sm text-river-slate-800 mb-1 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs text-river-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suites Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-sand-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-river-slate-800 mb-4">
              Escolha sua Suíte
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {suites.map((suite) => (
              <Card key={suite.id} className="overflow-hidden shadow-lg border-0 bg-white">
                <div className="relative">
                  <img 
                    src={suite.image}
                    alt={`Interior da ${suite.name} com varanda e vista para o rio`}
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-river-slate-800 mb-2">
                    {suite.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-river-slate-600 mb-4">
                    {suite.size} • Até {suite.capacity} hóspedes
                  </p>
                  <div className="border-t border-sand-beige-200 pt-4 mb-4">
                    <div className="grid grid-cols-1 gap-2">
                      {suite.amenities.slice(0, 4).map((amenity, index) => (
                        <div key={index} className="flex items-center text-xs sm:text-sm text-river-slate-600">
                          <amenity.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-pantanal-green-600 flex-shrink-0" strokeWidth={1.5} />
                          {amenity.name}
                        </div>
                      ))}
                      {suite.amenities.length > 4 && (
                        <p className="text-xs text-river-slate-500 mt-1">
                          +{suite.amenities.length - 4} comodidades
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-river-slate-800">
                        R$ {suite.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-river-slate-500 block">por noite</span>
                    </div>
                    <Button className="w-full sm:w-auto font-lato font-medium text-xs sm:text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-2 px-4 rounded-md transition-colors duration-150">
                      Ver Datas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-0 bg-sand-beige-50">
              <CardContent className="p-6 sm:p-8">
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-river-slate-800 mb-6 text-center">
                  Tudo isso já vem com sua reserva
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center text-sm sm:text-base text-river-slate-700">
                      <div className="w-2 h-2 bg-pantanal-green-600 rounded-full mr-3 flex-shrink-0"></div>
                      {inclusion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 sm:py-16 bg-sand-beige-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-river-slate-800 mb-6">
            O Que Nossos Hóspedes Dizem
          </h2>
          <blockquote className="text-base sm:text-lg text-river-slate-700 mb-4 italic leading-relaxed">
            "Dormir ouvindo as araras e acordar com a vista do rio foi uma experiência transformadora."
          </blockquote>
          <div className="flex items-center justify-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-river-slate-600 ml-2">
              Ana Carvalho, Rio de Janeiro
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-pantanal-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Últimas datas de alta temporada
          </h2>
          <p className="text-base sm:text-lg mb-6 opacity-90">
            Garanta já sua suíte para setembro
          </p>
          <Button className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-8 rounded-md transition-colors duration-150">
            Ver Pacotes
          </Button>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  );
}
