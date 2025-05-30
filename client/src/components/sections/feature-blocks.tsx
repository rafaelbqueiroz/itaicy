import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function FeatureBlocks() {
  const features = [
    {
      id: 'pesca',
      title: 'Pesca catch-and-release 100% cota-zero',
      description: 'Barcos ágeis em águas preservadas; guia local premiado garante emoção sem impacto. Viva a aventura, preserve o Pantanal.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'left',
      link: '/experiencias/pesca'
    },
    {
      id: 'safari',
      title: 'Safáris, trilhas & birdwatching',
      description: 'Mais de 650 aves no Pantanal — 166 registradas em 5 dias na última maratona Itaicy (jan 2024). Sinta o frio na barriga ao avistar tuiuiús e onças.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'right',
      link: '/experiencias/birdwatching'
    },
    {
      id: 'gastronomia',
      title: 'Gastronomia de origem',
      description: 'Buffet pantaneiro com ingredientes colhidos na hora e petiscos ao entardecer. Delicie-se com sabores autênticos e afetivos da região.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'left',
      link: '/gastronomia'
    },
    {
      id: 'historia',
      title: 'História viva – Usina Itaicy (1897)',
      description: 'Passeie pelas relíquias centenárias da antiga usina às margens do Rio Cuiabá. Descubra como evoluímos de geradora de energia a eco-lodge de referência.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&h=600&auto=format&fit=crop',
      imagePosition: 'right',
      link: '/sobre/historia'
    }
  ];

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-24 flex flex-col gap-16">
      {features.map((feature, index) => (
        <article
          key={feature.id}
          className={`grid grid-cols-1 lg:grid-cols-2 items-center max-w-[1440px] mx-auto gap-12 px-4 lg:px-8 ${
            index % 2 === 1 ? 'lg:direction-rtl' : ''
          }`}
          style={index % 2 === 1 ? { direction: 'rtl' } : {}}
        >
          {/* Image */}
          <figure className="w-full" style={{ direction: 'ltr' }}>
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </figure>

          {/* Content */}
          <div className="w-full flex flex-col" style={{ direction: 'ltr' }}>
            <span className="block w-6 h-px bg-sunset-amber-600 mt-1 mb-4"></span>
            <h2 className="font-playfair text-2xl md:text-3xl text-pantanal-green-900 mb-3">
              {feature.title}
            </h2>
            <p className="text-river-slate-800 mb-6 max-w-prose">
              {feature.description.split('. ').map((sentence, sentenceIndex, array) => (
                <span key={sentenceIndex}>
                  {sentence.includes('Viva a aventura') ? (
                    <>
                      {sentence.split('Viva a aventura')[0]}
                      <strong className="text-pantanal-green-900">Viva a aventura, preserve o Pantanal</strong>
                    </>
                  ) : (
                    sentence
                  )}
                  {sentenceIndex < array.length - 1 && '. '}
                </span>
              ))}
            </p>
            <Link href={feature.link}>
              <Button 
                variant="outline"
                className="inline-flex items-center border border-pantanal-green-900 text-pantanal-green-900 bg-transparent hover:bg-sand-beige-400 font-lato font-semibold uppercase text-[0.875rem] tracking-wider px-6 py-3 rounded-lg transition-all duration-200"
              >
                Saiba mais
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}