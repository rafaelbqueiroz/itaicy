import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { useLanguage } from '@/hooks/use-language';
import { Clock, Users, MapPin } from 'lucide-react';

export default function Experiencias() {
  const { t } = useLanguage();

  const experiences = [
    {
      id: 1,
      title: 'Pesca Esportiva All-Inclusive',
      description: 'Pescaria de dourados gigantes em águas cristalinas com guias especializados, equipamentos de primeira linha e refeições completas.',
      longDescription: 'Nossa experiência de pesca esportiva oferece acesso exclusivo aos melhores pontos de pesca do Rio Cuiabá. Com barcos modernos e guias premiados, você terá a oportunidade de pescar dourados, pintados, pacus e outras espécies nativas em um ambiente preservado.',
      price: 'R$ 2.000',
      duration: '1 dia completo (6h às 18h)',
      maxParticipants: 3,
      category: 'Pesca',
      includes: [
        'Guia especializado',
        'Barco e combustível',
        'Equipamentos de pesca',
        'Iscas vivas (tuviras)',
        'Café da manhã',
        'Almoço pantaneiro',
        'Bebidas e água',
        'Lavanderia de roupas de pesca'
      ],
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
      ]
    },
    {
      id: 2,
      title: 'Safári Fotográfico & Birdwatching',
      description: 'Observe onças-pintadas, ariranhas e mais de 166 espécies de aves em seu habitat natural com biólogos especializados.',
      longDescription: 'Uma jornada única pela biodiversidade do Pantanal. Acompanhado por biólogos e guias especializados, você explorará diferentes ecossistemas em busca da fauna selvagem. As chances de avistar onças-pintadas são excepcionais.',
      price: 'R$ 1.500',
      duration: '1 dia completo',
      maxParticipants: 6,
      category: 'Ecoturismo',
      includes: [
        'Guia biólogo especializado',
        'Transporte 4x4 ou barco',
        'Binóculos profissionais',
        'Lista de aves atualizada',
        'Café da manhã',
        'Almoço na natureza',
        'Bebidas e água',
        'Seguro de atividade'
      ],
      images: [
        'https://images.unsplash.com/photo-1594736797933-d0a4390d327e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
      ]
    },
    {
      id: 3,
      title: 'Pôr do Sol Pantaneiro',
      description: 'Contemple o espetáculo diário do entardecer pantaneiro em cenários de tirar o fôlego, com drinks e petiscos.',
      longDescription: 'Uma experiência romântica e contemplativa. Durante o golden hour, navegue pelas águas calmas do Rio Cuiabá enquanto observa a vida selvagem se preparando para a noite. O céu pantaneiro oferece um show de cores incomparável.',
      price: 'R$ 350',
      duration: '3 horas (16h às 19h)',
      maxParticipants: 8,
      category: 'Contemplativo',
      includes: [
        'Passeio de barco',
        'Drinks e petiscos',
        'Guia especializado',
        'Observação da fauna',
        'Fotografias do grupo',
        'Transfer ida e volta'
      ],
      images: [
        'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
      ]
    },
    {
      id: 4,
      title: 'Trilha da Serra e Mirante',
      description: 'Caminhada guiada pela serra do Itaicy com vista panorâmica do Pantanal e visita às ruínas históricas.',
      longDescription: 'Explore a história e a geografia únicas da região. A trilha leva até o mirante natural com vista de 360° do Pantanal, passando pelas ruínas da antiga Usina Itaicy de 1897. Uma experiência que combina aventura, história e contemplação.',
      price: 'R$ 200',
      duration: '4 horas (manhã)',
      maxParticipants: 10,
      category: 'Aventura',
      includes: [
        'Guia de trilha especializado',
        'Bastões de caminhada',
        'Água e isotônicos',
        'Lanche energético',
        'Kit primeiros socorros',
        'Visita às ruínas históricas'
      ],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="playfair text-5xl md:text-6xl font-bold text-itaicy-charcoal mb-6">
              {t('experiences.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('experiences.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {experiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden shadow-xl border-0">
                <div className="relative">
                  <img 
                    src={experience.images[0]} 
                    alt={experience.title}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-itaicy-primary text-white">
                    {experience.category}
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <h3 className="playfair text-2xl font-bold mb-3 text-itaicy-charcoal">
                    {experience.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {experience.longDescription}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {experience.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      Até {experience.maxParticipants} pessoas
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="text-itaicy-secondary font-bold text-lg">
                        {experience.price}
                      </span>
                      <span className="block">por pessoa</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-itaicy-charcoal mb-3">Inclui:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {experience.includes.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-itaicy-secondary rounded-full mr-3 flex-shrink-0"></span>
                          {item}
                        </div>
                      ))}
                      {experience.includes.length > 4 && (
                        <div className="text-sm text-itaicy-primary font-medium mt-1">
                          +{experience.includes.length - 4} outros itens
                        </div>
                      )}
                    </div>
                  </div>

                  <Button className="w-full bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white font-semibold">
                    Reservar Experiência
                  </Button>
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
            Pronto para Sua Aventura no Pantanal?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Nossa equipe especializada está pronta para criar a experiência perfeita para você.
          </p>
          <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
            Fale Conosco
          </Button>
        </div>
      </section>
    </div>
  );
}
