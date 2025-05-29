import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Star } from 'lucide-react';

export function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      rating: 5,
      text: "Guias excepcionais e experiência inesquecível no Rio Cuiabá. Pescaria incrível com toda estrutura necessária.",
      author: "Roberto Ferreira",
      location: "São Paulo, SP",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      rating: 5,
      text: "O safari fotográfico superou expectativas. Onças, ariranhas e centenas de aves. Sustentabilidade admirável do projeto.",
      author: "Ana Carolina Silva", 
      location: "Rio de Janeiro, RJ",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      rating: 5,
      text: "Pesca esportiva excepcional! Dourados gigantes e estrutura de primeiro mundo. Voltaremos certamente.",
      author: "Carlos Mendonça",
      location: "Brasília, DF", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
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
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
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
