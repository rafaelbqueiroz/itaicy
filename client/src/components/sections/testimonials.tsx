import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface TestimonialsProps {
  className?: string
}

const testimonials = {
  'pt-BR': [
    {
      name: "João Silva",
      role: "Fotógrafo Profissional",
      content: "Uma experiência incrível! A natureza exuberante e o conforto do lodge superaram todas as expectativas.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Amante da Natureza",
      content: "O lugar perfeito para se desconectar e reconectar com a natureza. A equipe é excepcional!",
      rating: 5
    },
    {
      name: "Roberto Martins",
      role: "Biólogo",
      content: "A riqueza da fauna e flora do Pantanal é impressionante. Experiência única e inesquecível.",
      rating: 5
    }
  ],
  'en-US': [
    {
      name: "John Smith",
      role: "Professional Photographer",
      content: "An incredible experience! The lush nature and lodge comfort exceeded all expectations.",
      rating: 5
    },
    {
      name: "Mary Santos",
      role: "Nature Lover",
      content: "The perfect place to disconnect and reconnect with nature. The staff is exceptional!",
      rating: 5
    },
    {
      name: "Robert Martin",
      role: "Biologist",
      content: "The richness of Pantanal's fauna and flora is impressive. Unique and unforgettable experience.",
      rating: 5
    }
  ],
  'es-ES': [
    {
      name: "Juan Silva",
      role: "Fotógrafo Profesional",
      content: "¡Una experiencia increíble! La exuberante naturaleza y la comodidad del lodge superaron todas las expectativas.",
      rating: 5
    },
    {
      name: "María Santos",
      role: "Amante de la Naturaleza",
      content: "El lugar perfecto para desconectarse y reconectarse con la naturaleza. ¡El equipo es excepcional!",
      rating: 5
    },
    {
      name: "Roberto Martínez",
      role: "Biólogo",
      content: "La riqueza de la fauna y flora del Pantanal es impresionante. Experiencia única e inolvidable.",
      rating: 5
    }
  ]
}

export function Testimonials({ className }: TestimonialsProps) {
  const { language } = useLanguage()
  const reviews = testimonials[language] || testimonials['pt-BR']

  return (
    <section className={cn("container mx-auto px-4", className)}>
      <div className="text-center mb-12">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-pantanal-green-900">
          {language === 'en-US' ? 'Guest Reviews' : 
           language === 'es-ES' ? 'Opiniones de Huéspedes' : 
           'Avaliações dos Hóspedes'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-cloud-white-0 p-6 rounded-lg shadow-lg"
          >
            {/* Rating */}
            <div className="flex items-center mb-4">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-sunset-amber-500 fill-sunset-amber-500"
                />
              ))}
            </div>

            {/* Content */}
            <blockquote>
              <p className="text-river-slate-700 mb-4 italic">
                "{review.content}"
              </p>
            </blockquote>

            {/* Author */}
            <div>
              <cite className="not-italic">
                <span className="font-semibold text-pantanal-green-900 block">
                  {review.name}
                </span>
                <span className="text-sm text-river-slate-600">
                  {review.role}
                </span>
              </cite>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
