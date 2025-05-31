import { cn } from '@/lib/utils'

interface HeroProps {
  title: string
  description?: string
  image: string
  overlayColor?: string
  className?: string
  imageClassName?: string
}

export function Hero({
  title,
  description,
  image,
  overlayColor = 'bg-pantanal-green-900/40',
  className,
  imageClassName
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Background Image */}
      <div
        className={cn(
          "absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat",
          imageClassName
        )}
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className={cn("absolute inset-0", overlayColor)} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-cloud-white-0">
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title}
        </h1>
        {description && (
          <p className="font-lato text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
