import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export function Experiences() {
  const { t } = useLanguage();

  const experiences = [
    {
      title: 'Pesca Esportiva All-Inclusive',
      description: 'Pescaria de dourados gigantes em águas cristalinas com guias especializados e equipamentos de primeira linha.',
      price: 'R$ 2.000',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop', // Barco no rio Cuiabá
      alt: 'Barco no rio Cuiabá para pesca esportiva',
    },
    {
      title: 'Safári Fotográfico & Birdwatching',
      description: 'Observe onças-pintadas, ariranhas e mais de 166 espécies de aves em seu habitat natural.',
      price: 'R$ 1.500',
      image: 'https://images.unsplash.com/photo-1551969014-7d2c4786d7a6?q=80&w=800&auto=format&fit=crop', // Onça-pintada close-up
      alt: 'Onça-pintada no Pantanal',
    },
    {
      title: 'Passeio ao Entardecer',
      description: 'Contemple o pôr-do-sol mais espetacular do Brasil navegando pelas baías pantaneiras.',
      price: 'R$ 350',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop', // Pôr-do-sol nas baías
      alt: 'Pôr-do-sol nas baías do Pantanal',
    },
  ];

  return (
    <section id="experiencias" className="py-20 bg-itaicy-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="playfair text-4xl md:text-5xl font-bold text-itaicy-charcoal mb-6">
            {t('experiences.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('experiences.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <Card key={index} className="overflow-hidden shadow-lg card-hover bg-white border-0">
              <div className="relative">
                <img 
                  src={experience.image} 
                  alt={experience.alt}
                  className="w-full h-64 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="playfair text-2xl font-semibold mb-3 text-itaicy-charcoal">
                  {experience.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {experience.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-itaicy-secondary font-semibold text-lg">
                    {t('experiences.startingFrom')} {experience.price}
                  </span>
                  <Button variant="ghost" className="text-itaicy-primary hover:text-itaicy-secondary font-semibold p-0">
                    {t('experiences.learnMore')} →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
