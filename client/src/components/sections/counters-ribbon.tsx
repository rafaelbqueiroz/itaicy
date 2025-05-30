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

  const biodiversityCount = useCountUp({ end: 4700, duration: 3000, delay: 100 });
  const birdsCount = useCountUp({ end: 650, duration: 2200, delay: 200 });
  const fishCount = useCountUp({ end: 325, duration: 2000, delay: 300 });
  const checklistCount = useCountUp({ end: 166, duration: 1800, delay: 400 });
  const historyCount = useCountUp({ end: 1897, duration: 2800, delay: 500 });

  const counters = [
    {
      display: `${biodiversityCount.count}+`,
      ref: biodiversityCount.ref,
      label: 'ESPÉCIES',
      description: 'Biodiversidade',
    },
    {
      display: `${birdsCount.count}+`,
      ref: birdsCount.ref,
      label: 'AVES',
      description: 'Lista oficial',
    },
    {
      display: `${fishCount.count}+`,
      ref: fishCount.ref,
      label: 'PEIXES',
      description: 'Dourados etc',
    },
    {
      display: `${checklistCount.count} aves / 5 dias`,
      ref: checklistCount.ref,
      label: 'BIRDS CHECKLIST',
      description: 'Maratona Bird \'24',
      tooltip: '166 espécies registradas em 5 dias (expedição jan 2024).',
    },
    {
      display: `${historyCount.count}`,
      ref: historyCount.ref,
      label: 'DESDE',
      description: 'Patrimônio',
    },
  ];

  return (
    <section className="relative bg-sand-beige-400">
      <div className="absolute inset-0 bg-[radial-gradient(200%_200%_at_80%_40%,rgba(0,0,0,.03),transparent_70%)]" />
      <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-16 px-6 md:px-8 text-center">
        {counters.map((counter, index) => (
          <div key={index} ref={counter.ref}>
            <p 
              className="font-playfair font-bold text-sunset-amber-600 leading-none"
              style={{ fontSize: 'clamp(2rem, 3vw, 3.5rem)' }}
            >
              {counter.display}
              {counter.tooltip && (
                <span className="relative group cursor-help inline-block ml-1">
                  <span className="text-[0.75rem] text-pantanal-green-900">ⓘ</span>
                  <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-white text-pantanal-green-900 text-xs p-3 shadow-lg rounded-md transition-opacity duration-150 w-48 mb-2">
                    {counter.tooltip}
                    <br />
                    <a href="/downloads/checklist-birds-jan24.pdf" className="underline">Baixar lista</a>
                  </span>
                </span>
              )}
            </p>
            <p className="font-medium text-pantanal-green-900 uppercase tracking-wide text-sm">
              {counter.label}
            </p>
            <p className="text-river-slate-800 text-sm">
              {counter.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}