import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  const { t } = useLanguage();
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos cartões de crédito, débito, PIX e transferência bancária. Para reservas, cobramos 30% de sinal e o restante pode ser pago na chegada.',
    },
    {
      question: 'Qual a melhor época para visitar o Pantanal?',
      answer: 'O Pantanal oferece experiências únicas o ano todo. Na seca (maio a setembro), a observação da fauna é mais fácil. Na cheia (dezembro a março), a paisagem fica mais exuberante e a pesca é mais produtiva.',
    },
    {
      question: 'É necessário experiência prévia para a pesca esportiva?',
      answer: 'Não! Nossos guias especializados oferecem instruções completas para iniciantes e também atendem pescadores experientes. Fornecemos todos os equipamentos necessários.',
    },
    {
      question: 'O lodge aceita crianças?',
      answer: 'Sim, crianças são muito bem-vindas! Oferecemos atividades adequadas para todas as idades, sempre com supervisão e segurança. Temos tarifas especiais para menores de 12 anos.',
    },
    {
      question: 'Como funciona o transporte até o lodge?',
      answer: 'Oferecemos transfer do aeroporto de Cuiabá até o lodge. O trajeto dura aproximadamente 2 horas. Também podemos organizar transporte de outras cidades mediante consulta.',
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-20 bg-itaicy-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="playfair text-4xl md:text-5xl font-bold text-itaicy-charcoal mb-6">
            {t('faq.title')}
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-sm border border-gray-100">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center font-semibold text-itaicy-charcoal hover:bg-gray-50 rounded-lg"
                >
                  <span>{faq.question}</span>
                  {openItem === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
                {openItem === index && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
