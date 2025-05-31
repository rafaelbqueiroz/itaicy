import { cn } from '@/lib/utils'

interface Feature {
  title: string
  description: string
  image: string
}

interface FeatureBlocksProps {
  title?: string
  description?: string
  features: Feature[]
  className?: string
}

export function FeatureBlocks({
  title,
  description,
  features,
  className
}: FeatureBlocksProps) {
  return (
    <section className={cn("container mx-auto px-4", className)}>
      {(title || description) && (
        <div className="text-center mb-16">
          {title && (
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-pantanal-green-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-river-slate-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg bg-cloud-white-0 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-playfair text-xl font-semibold mb-2 text-pantanal-green-900">
                {feature.title}
              </h3>
              <p className="text-river-slate-600">
                {feature.description}
              </p>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-sunset-amber-600/0 group-hover:bg-sunset-amber-600/10 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </section>
  )
}
