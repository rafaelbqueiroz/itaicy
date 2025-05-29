import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Snowflake, Wifi, Waves, Palmtree } from 'lucide-react';

export function LodgeOverview() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Snowflake,
      label: t('lodge.airConditioning'),
    },
    {
      icon: Wifi,
      label: t('lodge.wifi'),
    },
    {
      icon: Waves,
      label: t('lodge.pool'),
    },
    {
      icon: Palmtree,
      label: t('lodge.hammock'),
    },
  ];

  return (
    <section id="acomodacoes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="playfair text-4xl md:text-5xl font-bold text-itaicy-charcoal">
              Seu Refúgio no<br />
              <span className="text-itaicy-primary">Coração do Pantanal</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Conforte-se em 11 apartamentos recém-renovados, entre acomodações, equipamentos, confort com vida privilegiada e vista para o Rio Cuiabá
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-itaicy-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-itaicy-primary" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
            
            <Button className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 font-semibold">
              {t('lodge.viewAccommodations')}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Main room image - spans 2 rows */}
            <div className="col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Seu Refúgio no Coração do Pantanal"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            {/* Two smaller images */}
            <img 
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Acomodação com vista para o Rio Cuiabá"
              className="w-full h-32 object-cover rounded-xl shadow-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Varanda com rede e vista panorâmica"
              className="w-full h-32 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
