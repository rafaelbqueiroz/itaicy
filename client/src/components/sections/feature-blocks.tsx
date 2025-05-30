import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export function FeatureBlocks() {
  const features = [
    {
      id: 'pesca',
      title: '🎣 Pesca catch-and-release 100% cota-zero',
      description: 'Barcos ágeis em águas preservadas; guia local premiado garante emoção sem impacto. Viva a aventura, preserve o Pantanal.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'left',
      link: '/experiencias/pesca'
    },
    {
      id: 'safari',
      title: '🦜 Safáris, trilhas & birdwatching',
      description: 'Mais de 166 espécies já registradas em roteiros ao amanhecer e pôr-do-sol. Sinta o frio na barriga ao avistar tuiuiús e onças.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'right',
      link: '/experiencias/birdwatching'
    },
    {
      id: 'gastronomia',
      title: '🍽️ Gastronomia de origem',
      description: 'Buffet pantaneiro com ingredientes colhidos na hora e petiscos ao entardecer. Delicie-se com sabores autênticos e afetivos da região.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'left',
      link: '/gastronomia'
    },
    {
      id: 'historia',
      title: '🏛️ História viva – Usina Itaicy (1897)',
      description: 'Passeie pelas relíquias centenárias da antiga usina às margens do Rio Cuiabá. Descubra como evoluímos de geradora de energia a eco-lodge de referência.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'right',
      link: '/sobre/historia'
    }
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-24 mt-16">
      <div className="grid gap-12 auto-rows-fr lg:grid-cols-2">
        {features.map((feature, index) => (
          <article
            key={feature.id}
            className={`flex flex-col lg:${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            } items-start gap-6`}
          >
            {/* Image */}
            <figure className="w-full lg:w-1/2">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-60 object-cover rounded-md"
              />
            </figure>

            {/* Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 space-y-3">
              <h3 className="font-playfair text-[1.75rem] leading-[1.2] text-pantanal-green-900 mb-3">
                {feature.title}
              </h3>
              <p className="font-lato text-[1rem] leading-[1.5] text-river-slate-800 mb-4">
                {feature.description.split('. ').map((sentence, index, array) => (
                  <span key={index}>
                    {sentence.includes('166 espécies') ? (
                      <>
                        Mais de <strong className="text-pantanal-green-900">166 espécies</strong> já registradas em roteiros ao amanhecer e pôr-do-sol
                      </>
                    ) : sentence.includes('Viva a aventura') ? (
                      <>
                        {sentence.split('Viva a aventura')[0]}
                        <strong className="text-pantanal-green-900">Viva a aventura, preserve o Pantanal</strong>
                      </>
                    ) : (
                      sentence
                    )}
                    {index < array.length - 1 && '. '}
                  </span>
                ))}
              </p>
              <Link href={feature.link} className="self-start">
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