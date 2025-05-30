import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { useLanguage } from '@/hooks/use-language';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Filter, X } from 'lucide-react';

export default function Galeria() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock gallery data - in production this would come from the API
  const galleryItems = [
    {
      id: 1,
      title: 'Dourado Trophy',
      description: 'Pescador com dourado de 15kg capturado e solto',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'pesca',
      alt: 'Pesca de dourado no Pantanal',
      featured: true,
    },
    {
      id: 2,
      title: 'Onça-Pintada',
      description: 'Majestosa onça observada durante safári fotográfico',
      imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'natureza',
      alt: 'Onça-pintada no Pantanal',
      featured: true,
    },
    {
      id: 3,
      title: 'Apartamento Superior',
      description: 'Vista do apartamento superior com varanda para o rio',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'lodge',
      alt: 'Quarto do eco lodge',
      featured: false,
    },
    {
      id: 4,
      title: 'Tuiuiú',
      description: 'Ave símbolo do Pantanal em seu habitat natural',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0a4390d327e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'natureza',
      alt: 'Tuiuiú no Pantanal',
      featured: true,
    },
    {
      id: 5,
      title: 'Equipe de Guias',
      description: 'Nossa equipe experiente de guias especializados',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'equipe',
      alt: 'Guias do Itaicy',
      featured: false,
    },
    {
      id: 6,
      title: 'Pôr do Sol',
      description: 'Espetacular pôr do sol no Rio Cuiabá',
      imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'natureza',
      alt: 'Pôr do sol no Pantanal',
      featured: true,
    },
    {
      id: 7,
      title: 'Restaurante',
      description: 'Ambiente acolhedor do nosso restaurante',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'lodge',
      alt: 'Restaurante do lodge',
      featured: false,
    },
    {
      id: 8,
      title: 'Piranha Pescada',
      description: 'Piranha vermelha capturada durante pescaria',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'pesca',
      alt: 'Pesca de piranha',
      featured: false,
    },
    {
      id: 9,
      title: 'Vista Aérea',
      description: 'Vista aérea do lodge e da paisagem pantaneira',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'lodge',
      alt: 'Vista aérea do lodge',
      featured: true,
    },
    {
      id: 10,
      title: 'Capivaras',
      description: 'Família de capivaras às margens do rio',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'natureza',
      alt: 'Capivaras no Pantanal',
      featured: false,
    },
    {
      id: 11,
      title: 'Chef João',
      description: 'Chef executivo preparando especialidades pantaneiras',
      imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'equipe',
      alt: 'Chef do restaurante',
      featured: false,
    },
    {
      id: 12,
      title: 'Barco de Pesca',
      description: 'Embarcação moderna para pesca esportiva',
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      category: 'pesca',
      alt: 'Barco de pesca',
      featured: false,
    },
  ];

  const categories = [
    { value: 'todos', label: 'Todas as Fotos', count: galleryItems.length },
    { value: 'pesca', label: 'Pesca', count: galleryItems.filter(item => item.category === 'pesca').length },
    { value: 'natureza', label: 'Natureza', count: galleryItems.filter(item => item.category === 'natureza').length },
    { value: 'lodge', label: 'Lodge', count: galleryItems.filter(item => item.category === 'lodge').length },
    { value: 'equipe', label: 'Equipe', count: galleryItems.filter(item => item.category === 'equipe').length },
  ];

  const filteredItems = selectedCategory === 'todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-sand-beige-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-river-slate-800 mb-4 sm:mb-6 leading-tight">
              Galeria
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-river-slate-600 max-w-3xl mx-auto leading-relaxed">
              Momentos únicos capturados no coração do Pantanal - desde pescarias emocionantes até encontros com a vida selvagem
            </p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={`${
                  selectedCategory === category.value
                    ? 'bg-itaicy-primary text-white'
                    : 'border-itaicy-primary text-itaicy-primary hover:bg-itaicy-primary hover:text-white'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-lg border-0 card-hover">
                <div className="relative group cursor-pointer">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div onClick={() => setSelectedImage(item.imageUrl)}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.alt}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                        {item.featured && (
                          <Badge className="absolute top-4 left-4 bg-itaicy-secondary text-white">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full p-0">
                      <div className="relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.alt}
                          className="w-full h-auto max-h-[80vh] object-contain"
                        />
                        <div className="p-6">
                          <h3 className="playfair text-2xl font-bold mb-2 text-itaicy-charcoal">
                            {item.title}
                          </h3>
                          <p className="text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardContent className="p-4">
                  <h3 className="playfair text-lg font-bold mb-2 text-itaicy-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-itaicy-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="playfair text-4xl font-bold mb-6">
            Crie Suas Próprias Memórias
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Venha viver experiências únicas no Pantanal e criar suas próprias histórias para contar
          </p>
          <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
            Reserve Sua Aventura
          </Button>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  );
}
