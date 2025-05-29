import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export function Experiences() {
  const { t } = useLanguage();

  const experiences = [
    {
      title: t('experiences.pescaTitle'),
      description: t('experiences.pescaDescription'),
      price: 'R$ 2.000',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      alt: 'Pesca esportiva no Pantanal',
    },
    {
      title: t('experiences.ecoturismoTitle'),
      description: t('experiences.ecoturismoDescription'),
      price: 'R$ 1.500',
      image: 'https://images.unsplash.com/photo-1594736797933-d0a4390d327e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      alt: 'Birdwatching no Pantanal',
    },
    {
      title: t('experiences.porDoSolTitle'),
      description: t('experiences.porDoSolDescription'),
      price: 'R$ 350',
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      alt: 'Passeio ao entardecer no Pantanal',
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
