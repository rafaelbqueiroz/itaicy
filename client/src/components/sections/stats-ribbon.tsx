interface StatItem {
  value: string;
  label: string;
  meta?: string;
  tooltip?: string;
}

interface StatsRibbonProps {
  items: StatItem[];
  backgroundColor?: string;
  textColor?: string;
}

export function StatsRibbon({ 
  items, 
  backgroundColor = 'bg-pantanal-green-900',
  textColor = 'text-white'
}: StatsRibbonProps) {
  return (
    <section className={`py-12 sm:py-16 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`font-playfair text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} mb-1 sm:mb-2`}>
                {item.value}
              </div>
              <div className={`font-lato text-xs sm:text-sm uppercase tracking-wide ${textColor}/80`}>
                {item.label}
              </div>
              {item.meta && (
                <div className={`font-lato text-xs ${textColor}/60 mt-1`}>
                  {item.meta}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}