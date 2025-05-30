import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface SplitBlockProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
  reverse?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export function SplitBlock({
  imageSrc,
  imageAlt,
  title,
  text,
  ctaLabel,
  ctaHref,
  reverse = false,
  backgroundColor = 'bg-white',
  textColor = 'text-river-slate-800'
}: SplitBlockProps) {
  return (
    <section className={`py-12 sm:py-16 md:py-24 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
          <div className={reverse ? 'md:col-start-2' : ''}>
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className={`space-y-4 sm:space-y-6 ${reverse ? 'md:col-start-1' : ''}`}>
            <h2 className={`font-playfair text-2xl sm:text-3xl md:text-4xl ${textColor} leading-tight`}>
              {title}
            </h2>
            
            <div className={`font-lato text-base sm:text-lg leading-relaxed ${textColor}/80 space-y-3 sm:space-y-4`}>
              {text.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {ctaLabel && ctaHref && (
              <Link href={ctaHref}>
                <Button className="w-full sm:w-auto font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 sm:px-8 rounded-md transition-colors duration-150">
                  {ctaLabel}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}