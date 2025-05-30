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
      display: `${speciesCount.count}+`,
      ref: speciesCount.ref,
      label: t('highlights.speciesLabel'),
      description: t('highlights.speciesDesc'),
    },
    {
      display: `${fishCount.count}+`,
      ref: fishCount.ref,
      label: t('highlights.fishLabel'),
      description: t('highlights.fishDesc'),
    },
    {
      display: `${birdsCount.count} aves / 5 dias`,
      ref: birdsCount.ref,
      label: t('highlights.birdsLabel'),
      description: t('highlights.birdsDesc'),
      tooltip: '166 espécies registradas durante expedição guiada (5 dias, jan 2024). Baixe a lista oficial.',
    },
    {
      display: `${historyCount.count}`,
      ref: historyCount.ref,
      label: t('highlights.historyLabel'),
      description: t('highlights.historyDesc'),
    },
  ];

  return (
    <section className="relative bg-sand-beige-400">
      <div className="absolute inset-0 bg-[radial-gradient(200%_200%_at_80%_40%,rgba(0,0,0,.03),transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 py-14 px-6 md:px-8">
        {counters.map((counter, index) => (
          <div key={index} ref={counter.ref} className="text-center">
            <p 
              className="font-playfair italic text-sunset-amber-600 leading-none"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
            >
              {counter.display}
              {counter.tooltip && (
                <span 
                  className="inline-block align-baseline ml-1 text-[0.75rem] text-pantanal-green-900 cursor-help"
                  title={counter.tooltip}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                >
                  ⓘ
                </span>
              )}
            </p>
            {counter.tooltip && showTooltip && (
              <div className="absolute mt-2 w-60 p-3 bg-white text-pantanal-green-900 text-sm rounded-lg shadow-lg border border-sand-beige-400/20 z-50 left-1/2 transform -translate-x-1/2">
                {counter.tooltip}
              </div>
            )}
            <p className="mt-1 text-xs md:text-sm font-semibold uppercase tracking-wide text-pantanal-green-900">
              {counter.label}
            </p>
            <p className="text-[0.75rem] md:text-[0.875rem] text-river-slate-800">
              {counter.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}