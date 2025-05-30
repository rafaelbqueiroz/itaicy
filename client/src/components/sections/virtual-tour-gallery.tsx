import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { Play, Maximize2, Eye, MapPin, Bed, Users } from 'lucide-react';
import type { CmsVirtualTour } from '@shared/schema';

interface VirtualTourProps {
  id: string;
  title: string;
  description: string;
  category: 'suite' | 'common-area' | 'restaurant' | 'pool' | 'exterior';
  thumbnailUrl: string;
  tourUrl: string;
  capacity?: number;
  amenities?: string[];
}

const tourData: VirtualTourProps[] = [
  {
    id: 'master-suite',
    title: 'Master Suite Pantanal',
    description: 'Nossa suíte premium com vista panorâmica do Rio Cuiabá e varanda privativa.',
    category: 'suite',
    thumbnailUrl: '/api/placeholder/800/600',
    tourUrl: 'https://tour.itaicy.com/master-suite',
    capacity: 4,
    amenities: ['Ar condicionado', 'Varanda privativa', 'Vista para o rio', 'Frigobar']
  },
  {
    id: 'standard-suite',
    title: 'Suíte Standard',
    description: 'Acomodação confortável com todos os amenities essenciais para sua estadia.',
    category: 'suite',
    thumbnailUrl: '/api/placeholder/800/600',
    tourUrl: 'https://tour.itaicy.com/standard-suite',
    capacity: 2,
    amenities: ['Ar condicionado', 'Wi-Fi', 'Frigobar', 'Roupão']
  },
  {
    id: 'restaurant-area',
    title: 'Restaurante Principal',
    description: 'Área gastronômica com especialidades pantaneiras e vista para a natureza.',
    category: 'restaurant',
    thumbnailUrl: '/api/placeholder/800/600',
    tourUrl: 'https://tour.itaicy.com/restaurant',
    amenities: ['Culinária local', 'Vista panorâmica', 'Bar', 'Terraço']
  },
  {
    id: 'pool-deck',
    title: 'Área da Piscina',
    description: 'Deck da piscina com espreguiçadeiras e vista privilegiada do Pantanal.',
    category: 'pool',
    thumbnailUrl: '/api/placeholder/800/600',
    tourUrl: 'https://tour.itaicy.com/pool-deck',
    amenities: ['Piscina aquecida', 'Deck solarium', 'Bar molhado', 'Vista panorâmica']
  },
  {
    id: 'common-lounge',
    title: 'Lounge Principal',
    description: 'Área de convivência com lareira e vista para os jardins nativos.',
    category: 'common-area',
    thumbnailUrl: '/api/placeholder/800/600',
    tourUrl: 'https://tour.itaicy.com/lounge',
    amenities: ['Lareira', 'Wi-Fi', 'Biblioteca', 'Jogos']
  },
  {
    id: 'exterior-view',
    title: 'Vista Externa do Lodge',
    description: 'Visão completa da estrutura do lodge integrada à paisagem pantaneira.',
    category: 'exterior',
    thumbnailUrl: '/api/placeholder/800/600',
    tourUrl: 'https://tour.itaicy.com/exterior',
    amenities: ['Jardins nativos', 'Deck de observação', 'Trilhas', 'Pier privativo']
  }
];

const categoryFilters = [
  { id: 'all', label: 'Todos', icon: Eye },
  { id: 'suite', label: 'Suítes', icon: Bed },
  { id: 'common-area', label: 'Áreas Comuns', icon: Users },
  { id: 'restaurant', label: 'Restaurante', icon: MapPin },
  { id: 'pool', label: 'Piscina', icon: MapPin },
  { id: 'exterior', label: 'Exterior', icon: MapPin }
];

export function VirtualTourGallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch virtual tours from CMS
  const { data: tours = [], isLoading } = useQuery<CmsVirtualTour[]>({
    queryKey: ['/api/cms/virtual-tours', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all' 
        ? '/api/cms/virtual-tours' 
        : `/api/cms/virtual-tours?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tours');
      return response.json();
    }
  });

  const filteredTours = tours;

  const openTour = (tour: CmsVirtualTour) => {
    // Open 360° tour in new window/iframe
    window.open(tour.tourUrl, '_blank', 'width=1200,height=800');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      suite: 'bg-sunset-amber-600 text-cloud-white-0',
      'common-area': 'bg-pantanal-green-700 text-cloud-white-0',
      restaurant: 'bg-sand-beige-400 text-river-slate-800',
      pool: 'bg-sunset-amber-600 text-cloud-white-0',
      exterior: 'bg-pantanal-green-900 text-cloud-white-0'
    };
    return colors[category as keyof typeof colors] || 'bg-river-slate-800 text-cloud-white-0';
  };

  return (
    <section className="py-24 bg-cloud-white-0">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-pantanal-green-900 mb-6">
            Tour Virtual 360°
          </h2>
          <p className="font-lato text-lg text-river-slate-800 max-w-3xl mx-auto leading-relaxed">
            Explore cada detalhe do Itaicy Pantanal Eco Lodge através de nossos tours virtuais imersivos. 
            Conheça as acomodações, áreas comuns e a beleza natural que cerca nosso lodge.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categoryFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={selectedCategory === filter.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-150 ${
                  selectedCategory === filter.id
                    ? 'bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0'
                    : 'border-river-slate-700/30 text-river-slate-800 hover:bg-sand-beige-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src="/api/placeholder/800/600"
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                
                {/* Category Badge */}
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(tour.category)}`}>
                  {tour.category === 'suite' && 'Suíte'}
                  {tour.category === 'common-area' && 'Área Comum'}
                  {tour.category === 'restaurant' && 'Restaurante'}
                  {tour.category === 'pool' && 'Piscina'}
                  {tour.category === 'exterior' && 'Exterior'}
                </Badge>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() => openTour(tour)}
                    className="bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 rounded-full p-4"
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>

                {/* Capacity Badge */}
                {tour.capacity && (
                  <Badge className="absolute top-3 right-3 bg-cloud-white-0/90 text-pantanal-green-900">
                    <Users className="w-3 h-3 mr-1" />
                    {tour.capacity} pessoas
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-pantanal-green-900 mb-2">
                  {tour.title}
                </h3>
                <p className="font-lato text-river-slate-800 text-sm mb-4 line-clamp-2">
                  {tour.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {tour.amenities?.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-sand-beige-300 text-river-slate-800">
                      {amenity}
                    </Badge>
                  ))}
                  {tour.amenities && tour.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-sand-beige-300 text-river-slate-800">
                      +{tour.amenities.length - 3}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={() => openTour(tour)}
                  className="w-full bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 font-lato font-medium text-sm uppercase tracking-wide py-2"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Iniciar Tour 360°
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-sand-beige-300 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="font-playfair text-2xl font-semibold text-pantanal-green-900 mb-4">
              Quer conhecer pessoalmente?
            </h3>
            <p className="font-lato text-river-slate-800 mb-6">
              Reserve sua estadia e viva esta experiência única no coração do Pantanal brasileiro.
            </p>
            <Button className="bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 font-lato font-medium text-sm uppercase tracking-wide py-3 px-8">
              Fazer Reserva
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}