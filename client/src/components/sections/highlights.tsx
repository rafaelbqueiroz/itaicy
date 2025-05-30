import { useLanguage } from '@/hooks/use-language';
import { useCountUp } from '@/hooks/use-count-up';
import { Fish, Leaf, History, Award } from 'lucide-react';

export function Highlights() {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: Fish,
      number: 166,
      suffix: '',
      title: 'Espécies',
      description: 'Aves registradas no Pantanal',
    },
    {
      icon: Leaf,
      number: 100,
      suffix: '%',
      title: 'Sustentável',
      description: 'Compromisso com conservação',
    },
    {
      icon: History,
      number: 1897,
      suffix: '',
      title: 'Desde',
      description: 'História no Rio Cuiabá',
    },
    {
      icon: Award,
      number: 25,
      suffix: '+',
      title: 'Guias Premiados',
      description: 'Anos de experiência',
    },
  ];

  const CounterItem = ({ highlight, index }: { highlight: typeof highlights[0], index: number }) => {
    const { count, ref } = useCountUp({ 
      end: highlight.number, 
      duration: 2000, 
      delay: index * 200 
    });

    return (
      <div className="text-center">
        <div 
          ref={ref}
          className="text-4xl font-bold text-sunset-amber-600 playfair mb-2"
        >
          {count}{highlight.suffix}
        </div>
        <p className="text-sm text-pantanal-green-900 font-medium uppercase tracking-wide mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
          {highlight.title}
        </p>
        <p className="text-xs text-river-slate-800" style={{ fontFamily: 'Lato, sans-serif' }}>
          {highlight.description}
        </p>
      </div>
    );
  };

  return (
    <section className="py-16 bg-sand-beige-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-24">
          {highlights.map((highlight, index) => (
            <CounterItem key={index} highlight={highlight} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
