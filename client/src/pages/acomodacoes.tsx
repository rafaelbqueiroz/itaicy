import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wifi, Car, Coffee, AirVent, Bed, 
  Users, Ruler, MapPin, Calendar,
  ChevronLeft, ChevronRight, Star,
  Thermometer, Droplets, Leaf, Shield
} from 'lucide-react';

export default function Acomodacoes() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [isPreview, setIsPreview] = useState(false);

  // Detecta modo preview
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsPreview(urlParams.has('preview'));
  }, []);

  // Busca dados dinâmicos da suíte
  const { data: pageContent } = useQuery({
    queryKey: ['/api/cms/content/acomodacoes'],
    refetchInterval: isPreview ? 2000 : false,
  });

  const suiteImages = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0YzdkNTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzNDU5M2UiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkludGVyaW9yIGRhIFN1w610ZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZGRkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WaXN0YSBwYW50YW5laXJhPC90ZXh0Pjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2ZDhiZGYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YzYzYjMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2IpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZhcmFuZGEgUHJpdmF0aXZhPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeSI9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZGRkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WaXN0YSBwYXJhIG8gcmlvPC90ZXh0Pjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNiMzc2NGYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4NjU3M2EiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2MpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJhbmhlaXJvIFByaXZhdGl2bzwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZGRkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EdWNoYSBwcmVzc3VyaXphZGE8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjk5NDEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjczMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2QpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZpc3RhIE5vdHVybmE8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2RkZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UMO0ci1kby1zb2wgcGFudGFuZWlybzwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImUiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2N2QzOTEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0ZGE2NjQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2UpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVudG9ybm8gTmF0dXJhbDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZGRkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbnRlZ3Jhw6fDo28gY29tIGEgbWF0YTwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNiMzMwN2EiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4MzIzNWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2YpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVudGFyZGVjZXI8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2RkZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VHJhbnF1aWxpZGFkZSBwYW50YW5laXJhPC90ZXh0Pjwvc3ZnPg=='
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % suiteImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + suiteImages.length) % suiteImages.length);
  };

  return (
    <div className="min-h-screen">
      {/* Banner de preview */}
      {isPreview && (
        <div className="bg-orange-500 text-white text-center py-2 text-sm">
          🔍 Modo Preview - Versão de teste, não indexada pelos buscadores
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${suiteImages[0]})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Suíte Pantaneira à Beira-Rio
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Onze unidades privativas para dormir embalado pelo canto da mata
          </p>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full text-lg"
            onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Disponibilidade
          </Button>
        </div>
      </section>

      {/* Por que ficar aqui? - Strip de benefícios */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que ficar aqui?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Materiais Locais</h3>
              <p className="text-sm text-gray-600">Arquitetura sustentável em harmonia com o ambiente</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Varanda sobre o Rio</h3>
              <p className="text-sm text-gray-600">Vista privilegiada do Rio Cuiabá com rede privativa</p>
            </div>
            <div className="flex flex-col items-center">
              <Thermometer className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Climatização 24h</h3>
              <p className="text-sm text-gray-600">Ar-condicionado silencioso para noites tranquilas</p>
            </div>
            <div className="flex flex-col items-center">
              <Coffee className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Café Pantaneiro Incluso</h3>
              <p className="text-sm text-gray-600">Café da manhã no deck com produtos regionais</p>
            </div>
          </div>
        </div>
      </section>

      {/* A Suíte - Seção principal */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Galeria de imagens */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={suiteImages[currentImageIndex]}
                  alt={`Suíte Pantaneira - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full hover:bg-opacity-100 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full hover:bg-opacity-100 shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {suiteImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Fatos rápidos */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">A Suíte</h2>
              
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Fatos Rápidos</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Ruler className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Área</span>
                    </div>
                    <span className="font-semibold">28 m²</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Ocupação</span>
                    </div>
                    <span className="font-semibold">Até 2 hóspedes</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Cama</span>
                    </div>
                    <span className="font-semibold">King size</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Varanda</span>
                    </div>
                    <span className="font-semibold">Rede privativa</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Internet</span>
                    </div>
                    <span className="font-semibold">Wi-Fi satelital</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                28 m² de aconchego, varanda privativa com rede e vista para o Rio Cuiabá. 
                Ar-condicionado silencioso, cama king com lençóis 300 fios, ducha pressurizada. 
                Cada detalhe pensado para conectar você com a natureza sem abrir mão do conforto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifas & Datas */}
      <section id="booking-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tarifas & Disponibilidade</h2>
            <p className="text-xl text-gray-600">Transparência total em nossas tarifas sazonais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Widget de reserva */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Consultar Disponibilidade</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin">Check-in</Label>
                    <Input 
                      id="checkin"
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Check-out</Label>
                    <Input 
                      id="checkout"
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guests">Hóspedes</Label>
                  <select 
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="1">1 hóspede</option>
                    <option value="2">2 hóspedes</option>
                  </select>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                  <Calendar className="h-5 w-5 mr-2" />
                  Verificar Disponibilidade
                </Button>
              </div>
            </Card>

            {/* Tabela de tarifas */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tarifas Sazonais</h3>
              
              <div className="space-y-4">
                <Card className="p-4 border-l-4 border-l-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Temporada Alta</h4>
                      <p className="text-sm text-gray-600">Setembro - Novembro (Seca)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">R$ 900</p>
                      <p className="text-sm text-gray-500">por noite</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Temporada Baixa</h4>
                      <p className="text-sm text-gray-600">Dezembro - Agosto (Cheia)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">R$ 800</p>
                      <p className="text-sm text-gray-500">por noite</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                * Tarifas por suíte, impostos não incluídos. Mínimo 2 diárias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que está incluso */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que está incluso</h2>
            <p className="text-xl text-gray-600">Tudo para uma experiência completa no Pantanal</p>
          </div>

          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <Car className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Transfer Aeroporto</h3>
                  <p className="text-gray-600 text-sm">Transporte 4x4 do aeroporto de Cuiabá até o lodge</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Coffee className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Café Pantaneiro</h3>
                  <p className="text-gray-600 text-sm">Café da manhã completo com produtos regionais</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Wifi className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Wi-Fi Satelital</h3>
                  <p className="text-gray-600 text-sm">Internet de alta velocidade em todo o lodge</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Car className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Estacionamento</h3>
                  <p className="text-gray-600 text-sm">Vaga coberta e segura para seu veículo</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Droplets className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Lavanderia de Pesca</h3>
                  <p className="text-gray-600 text-sm">Limpeza e secagem de equipamentos de pesca</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Segurança 24h</h3>
                  <p className="text-gray-600 text-sm">Monitoramento e segurança em tempo integral</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Depoimento */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-green-50 rounded-2xl p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-light text-gray-900 mb-8 italic">
              "A varanda sobre o rio vale cada quilômetro de viagem. Acordar com o canto dos pássaros e adormecer com o som do rio foi inesquecível."
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">CM</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Carla M.</p>
                <p className="text-gray-600 text-sm">São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de escassez */}
      <section className="py-12 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Apenas 11 suítes disponíveis
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Últimas datas para a temporada de seca - Reserve agora para garantir sua experiência pantaneira
          </p>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full text-lg font-semibold"
          >
            Garanta a sua suíte
          </Button>
        </div>
      </section>

      {/* Indicador de sincronização para preview */}
      {isPreview && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Sincronizado com CMS</span>
          </div>
        </div>
      )}
    </div>
  );
}