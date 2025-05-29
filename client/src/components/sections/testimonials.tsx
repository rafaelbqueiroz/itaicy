import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Star } from 'lucide-react';

export function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      rating: 5,
      text: "Uma experiência transformadora! O Itaicy consegue unir perfeitamente o conforto de um lodge de luxo com a autenticidade do Pantanal. As pescarias foram incríveis e a equipe é excepcional.",
      author: "Roberto Ferreira",
      location: "São Paulo, SP",
      initials: "RF",
    },
    {
      rating: 5,
      text: "O safari fotográfico superou todas as expectativas. Conseguimos avistar onças, ariranhas e centenas de aves. A sustentabilidade do projeto é admirável.",
      author: "Ana Carolina Silva",
      location: "Rio de Janeiro, RJ",
      initials: "AC",
    },
  ];

  return (
    <section className="py-20 bg-itaicy-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="playfair text-4xl md:text-5xl font-bold text-itaicy-charcoal mb-6">
            {t('testimonials.title')}
          </h2>
        </div>
        
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-itaicy-secondary">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-itaicy-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-itaicy-charcoal">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
