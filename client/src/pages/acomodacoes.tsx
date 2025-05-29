import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { Snowflake, Wifi, Waves, Car, Utensils, Shield, Palmtree, Sun } from 'lucide-react';

export default function Acomodacoes() {
  const { t } = useLanguage();

  const accommodations = [
    {
      id: 1,
      name: 'Apartamento Standard',
      description: 'Nossos apartamentos standard oferecem todo o conforto necessário com vista para o rio.',
      capacity: 2,
      beds: '1 cama de casal',
      size: '25m²',
      pricePerNight: 800,
      amenities: [
        { icon: Snowflake, name: 'Ar condicionado' },
        { icon: Wifi, name: 'Wi-Fi satelital' },
        { icon: Palmtree, name: 'Varanda com rede' },
        { icon: Shield, name: 'Cofre digital' }
      ],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
      ]
    },
    {
      id: 2,
      name: 'Apartamento Superior',
      description: 'Mais espaçoso, com varanda ampliada e vista privilegiada para o Rio Cuiabá.',
      capacity: 3,
      beds: '1 cama de casal + 1 cama solteiro',
      size: '35m²',
      pricePerNight: 1200,
      amenities: [
        { icon: Snowflake, name: 'Ar condicionado' },
        { icon: Wifi, name: 'Wi-Fi satelital' },
        { icon: Palmtree, name: 'Varanda ampliada' },
        { icon: Shield, name: 'Cofre digital' },
        { icon: Sun, name: 'Vista para o rio' }
      ],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
      ]
    },
    {
      id: 3,
      name: 'Suíte Master',
      description: 'Nossa acomodação mais exclusiva, com sala privativa e vista panorâmica.',
      capacity: 4,
      beds: '1 suíte master + sofá-cama',
      size: '50m²',
      pricePerNight: 1800,
      amenities: [
        { icon: Snowflake, name: 'Ar condicionado' },
        { icon: Wifi, name: 'Wi-Fi satelital' },
        { icon: Palmtree, name: 'Varanda panorâmica' },
        { icon: Shield, name: 'Cofre digital' },
        { icon: Sun, name: 'Vista privilegiada' },
        { icon: Utensils, name: 'Minibar' }
      ],
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
      ]
    }
  ];

  const lodgeAmenities = [
    { icon: Waves, name: 'Piscina com vista para o rio' },
    { icon: Utensils, name: 'Restaurante com gastronomia pantaneira' },
    { icon: Car, name: 'Estacionamento gratuito' },
    { icon: Wifi, name: 'Wi-Fi satelital em áreas comuns' },
    { icon: Shield, name: 'Recepção 24h' },
    { icon: Sun, name: 'Deck para contemplação' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="playfair text-5xl md:text-6xl font-bold text-itaicy-charcoal mb-6">
              {t('lodge.title')} <span className="text-itaicy-primary">{t('lodge.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('lodge.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Lodge Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Vista aérea do Itaicy Pantanal Eco Lodge"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
                Um Refúgio Sustentável
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Itaicy Pantanal Eco Lodge combina arquitetura regional com tecnologia sustentável. 
                Construído com madeiras certificadas e alimentado por energia solar, nosso lodge 
                oferece 11 apartamentos confortáveis em harmonia com a natureza.
              </p>
              
              <h3 className="playfair text-2xl font-semibold text-itaicy-charcoal mb-4">
                Facilidades do Lodge
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {lodgeAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-itaicy-primary/10 rounded-lg flex items-center justify-center">
                      <amenity.icon className="h-5 w-5 text-itaicy-primary" />
                    </div>
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Nossas Acomodações
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada apartamento foi projetado para oferecer conforto e uma conexão única com a natureza pantaneira.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {accommodations.map((accommodation) => (
              <Card key={accommodation.id} className="overflow-hidden shadow-xl border-0 bg-white">
                <div className="relative">
                  <img 
                    src={accommodation.images[0]} 
                    alt={accommodation.name}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-itaicy-secondary text-white">
                    {accommodation.capacity} {accommodation.capacity === 1 ? 'Pessoa' : 'Pessoas'}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="playfair text-2xl font-bold mb-3 text-itaicy-charcoal">
                    {accommodation.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {accommodation.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Camas:</span>
                      <p>{accommodation.beds}</p>
                    </div>
                    <div>
                      <span className="font-medium">Tamanho:</span>
                      <p>{accommodation.size}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-itaicy-charcoal mb-3">Comodidades:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {accommodation.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <amenity.icon className="h-4 w-4 mr-3 text-itaicy-primary flex-shrink-0" />
                          {amenity.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-itaicy-secondary">
                          R$ {accommodation.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-gray-600 text-sm block">por noite</span>
                      </div>
                    </div>
                    <Button className="w-full bg-itaicy-primary hover:bg-itaicy-primary/90 text-white font-semibold">
                      Verificar Disponibilidade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-itaicy-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="playfair text-4xl font-bold mb-6">
            Reserve Sua Estadia no Coração do Pantanal
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Desperte com o canto dos pássaros e adormeça com os sons da natureza selvagem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
              Verificar Disponibilidade
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-itaicy-primary px-8 py-4 text-lg font-semibold">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
