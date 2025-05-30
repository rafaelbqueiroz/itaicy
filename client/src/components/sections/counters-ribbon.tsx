import { useCountUp } from '@/hooks/use-count-up';
import { useLanguage } from '@/hooks/use-language';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface CounterItem {
  value: number;
  label: string;
  description: string;
  tooltip?: string;
}

export function CountersRibbon() {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  const speciesCount = useCountUp({ end: 650, duration: 2500, delay: 200 });
  const spottedCount = useCountUp({ end: 166, duration: 2000, delay: 400 });

  const counters = [
    {
      count: speciesCount.count,
      ref: speciesCount.ref,
      label: t('highlights.speciesLabel'),
      description: t('highlights.speciesDesc'),
      suffix: '+',
    },
    {
      count: spottedCount.count,
      ref: spottedCount.ref,
      label: t('highlights.spottedLabel'),
      description: t('highlights.spottedDesc'),
      tooltip: t('highlights.spottedTooltip'),
      suffix: ' / 5 dias',
    },
  ];

  return (
    <section 
      id="counters" 
      className="w-full bg-gradient-to-r from-sunset-amber-600 to-sunset-amber-700 py-16"
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
          {counters.map((counter, index) => (
            <div key={index} ref={counter.ref} className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="font-playfair font-bold text-5xl lg:text-6xl text-white leading-none"
                  data-count={counter.count}
                >
                  {counter.count}{counter.suffix}
                </span>
                {counter.tooltip && (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="text-white hover:text-sand-beige-400 transition-colors"
                      aria-label="Como medimos"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                    {showTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-cloud-white-0 text-pantanal-green-900 text-sm rounded-lg shadow-lg border border-sand-beige-400/20 z-50">
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cloud-white-0"></div>
                        {counter.tooltip}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <h3 className="font-lato font-bold text-lg text-white mb-1 uppercase tracking-wider">
                {counter.label}
              </h3>
              <p className="font-lato text-sand-beige-400 text-sm">
                {counter.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}