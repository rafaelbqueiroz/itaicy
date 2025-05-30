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
    <section className={`py-16 md:py-24 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
          <div className={reverse ? 'md:col-start-2' : ''}>
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className={`space-y-6 ${reverse ? 'md:col-start-1' : ''}`}>
            <h2 className={`font-playfair text-3xl md:text-4xl ${textColor}`}>
              {title}
            </h2>
            
            <div className={`font-lato text-lg leading-relaxed ${textColor}/80 space-y-4`}>
              {text.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {ctaLabel && ctaHref && (
              <Link href={ctaHref}>
                <Button className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-8 rounded-md transition-colors duration-150">
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