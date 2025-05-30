import { useCountUp } from '@/hooks/use-count-up';
import { useLanguage } from '@/hooks/use-language';
import { useState } from 'react';
import { Info } from 'lucide-react';

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
  const fishCount = useCountUp({ end: 325, duration: 2200, delay: 300 });
  const birdsCount = useCountUp({ end: 166, duration: 2000, delay: 400 });
  const historyCount = useCountUp({ end: 1897, duration: 2800, delay: 500 });

  const counters = [
    {
      count: speciesCount.count,
      ref: speciesCount.ref,
      label: t('highlights.speciesLabel'),
      description: t('highlights.speciesDesc'),
      suffix: '+',
    },
    {
      count: fishCount.count,
      ref: fishCount.ref,
      label: t('highlights.fishLabel'),
      description: t('highlights.fishDesc'),
      suffix: '+',
    },
    {
      count: birdsCount.count,
      ref: birdsCount.ref,
      label: t('highlights.birdsLabel'),
      description: t('highlights.birdsDesc'),
      tooltip: t('highlights.birdsTooltip'),
      suffix: ' / 5 dias',
    },
    {
      count: historyCount.count,
      ref: historyCount.ref,
      label: t('highlights.historyLabel'),
      description: t('highlights.historyDesc'),
      suffix: '',
    },
  ];

  return (
    <section 
      id="counters" 
      className="w-full bg-sand-beige-400 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 text-center">
          {counters.map((counter, index) => (
            <div key={index} ref={counter.ref} className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <span 
                  className="font-playfair font-bold italic text-sunset-amber-600 leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
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
                      className="text-pantanal-green-900 hover:text-pantanal-green-700 transition-colors ml-1"
                      aria-label="Como medimos"
                    >
                      <Info className="w-4 h-4" strokeWidth={1.5} />
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
              <h3 className="font-lato font-semibold text-[0.875rem] text-pantanal-green-900 mb-1 uppercase tracking-widest">
                {counter.label}
              </h3>
              <p className="font-lato text-[0.9375rem] text-river-slate-800">
                {counter.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}