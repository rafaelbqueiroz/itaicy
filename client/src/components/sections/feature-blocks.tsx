import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

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
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        {features.map((feature, index) => (
          <article
            key={feature.id}
            className={`flex flex-col md:${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            } items-center gap-8`}
          >
            {/* Image */}
            <figure className="w-full md:w-1/2">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full max-h-72 object-cover rounded-md"
              />
            </figure>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-2">
              <h3 className="font-playfair text-2xl leading-tight text-pantanal-green-900">
                {feature.title}
              </h3>
              <p className="font-lato text-lg leading-relaxed text-river-slate-800">
                {feature.description}
              </p>
              <Link href={feature.link}>
                <Button 
                  variant="outline"
                  className="inline-flex items-center border border-pantanal-green-900 text-pantanal-green-900 bg-transparent hover:bg-sand-beige-400 font-lato font-medium uppercase text-sm tracking-wider px-6 py-2 rounded-md transition-all duration-300"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}