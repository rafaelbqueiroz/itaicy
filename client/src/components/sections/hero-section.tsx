import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  overlay?: boolean;
  height?: string;
}

export function HeroSection({
  backgroundImage,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  overlay = true,
  height = "90vh"
}: HeroSectionProps) {
  return (
    <section 
      className="relative flex items-center justify-center text-center text-white"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height
      }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="font-lato text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && (
            <Link href={primaryCTA.href}>
              <Button className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-8 rounded-md transition-colors duration-150">
                {primaryCTA.label}
              </Button>
            </Link>
          )}
          
          {secondaryCTA && (
            <Link href={secondaryCTA.href}>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black py-3 px-8 rounded-md transition-colors duration-150">
                {secondaryCTA.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}