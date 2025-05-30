import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function FeatureBlocks() {
  const features = [
    {
      id: 'pesca',
      title: 'Pesca esportiva 100% cota-zero',
      description: 'Barcos rápidos, guias premiados e águas pouco batidas para fisgar dourados troféu.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'left',
      link: '/experiencias/pesca'
    },
    {
      id: 'safari',
      title: 'Safari & Birdwatching',
      description: '166 espécies registradas, trilhas ao amanhecer e pôr-do-sol sobre lagoas azul-celeste.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'right',
      link: '/experiencias/ecoturismo'
    },
    {
      id: 'gastronomia',
      title: 'Sabores de origem',
      description: 'Buffet pantaneiro, petiscos no deck e cerveja servida gelada ao som do rio.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'left',
      link: '/gastronomia'
    },
    {
      id: 'historia',
      title: 'Ruínas da Usina Itaicy (1897)',
      description: 'Hospede-se onde a energia do passado encontrou a natureza bruta.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'right',
      link: '/sobre-nos'
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <div 
            key={feature.id} 
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 last:mb-0 ${
              feature.imagePosition === 'right' ? 'lg:grid-flow-col-dense' : ''
            }`}
          >
            {/* Content */}
            <div className={`space-y-6 ${feature.imagePosition === 'right' ? 'lg:col-start-1' : ''}`}>
              <h2 className="playfair text-3xl md:text-4xl font-bold text-[#064737] leading-tight">
                {feature.title}
              </h2>
              <p className="text-lg text-[#64748B] leading-relaxed max-w-md" style={{ fontFamily: 'Lato, sans-serif' }}>
                {feature.description}
              </p>
              <Link href={feature.link}>
                <Button 
                  variant="outline"
                  className="border-2 border-[#C97A2C] text-[#C97A2C] hover:bg-[#C97A2C] hover:text-white transition-all duration-300 font-medium uppercase tracking-wide"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Saiba mais
                </Button>
              </Link>
            </div>

            {/* Image */}
            <div className={`relative ${feature.imagePosition === 'right' ? 'lg:col-start-2' : ''}`}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}