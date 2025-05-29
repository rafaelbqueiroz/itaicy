import { useLanguage } from '@/hooks/use-language';
import { Fish, Leaf, History, Award } from 'lucide-react';

export function Highlights() {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: Fish,
      title: t('highlights.species'),
      description: t('highlights.speciesDesc'),
    },
    {
      icon: Leaf,
      title: t('highlights.sustainable'),
      description: t('highlights.sustainableDesc'),
    },
    {
      icon: History,
      title: t('highlights.history'),
      description: t('highlights.historyDesc'),
    },
    {
      icon: Award,
      title: t('highlights.guides'),
      description: t('highlights.guidesDesc'),
    },
  ];

  return (
    <section className="py-20 bg-itaicy-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="playfair text-4xl md:text-5xl font-bold mb-6">
            {t('highlights.title')}
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('highlights.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-itaicy-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <highlight.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="playfair text-xl font-semibold mb-2">
                {highlight.title}
              </h3>
              <p className="opacity-80 leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
