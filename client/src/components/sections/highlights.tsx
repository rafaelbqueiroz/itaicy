import { useLanguage } from '@/hooks/use-language';
import { Fish, Leaf, History, Award } from 'lucide-react';

export function Highlights() {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: Fish,
      number: '166',
      title: 'Espécies',
      description: 'Aves registradas no Pantanal',
    },
    {
      icon: Leaf,
      number: '100%',
      title: 'Sustentável',
      description: 'Compromisso com conservação',
    },
    {
      icon: History,
      number: '1897',
      title: 'Desde',
      description: 'História no Rio Cuiabá',
    },
    {
      icon: Award,
      number: '⭐',
      title: 'Guias Premiados',
      description: 'Especialistas certificados',
    },
  ];

  return (
    <section className="py-20 bg-itaicy-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#C97A2C] playfair mb-2">
                {highlight.number}
              </div>
              <p className="text-sm text-white font-medium uppercase tracking-wide mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                {highlight.title}
              </p>
              <p className="text-xs text-white/80" style={{ fontFamily: 'Lato, sans-serif' }}>
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
