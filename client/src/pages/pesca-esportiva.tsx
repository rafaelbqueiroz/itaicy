import { HeroSection } from '@/components/sections/hero-section';
import { StickyBar } from '@/components/sections/sticky-bar';
import { SplitBlock } from '@/components/sections/split-block';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Anchor, Fish, Droplets, Car, Shirt, Wine } from 'lucide-react';

export default function PescaEsportiva() {
  const pricingData = [
    {
      type: "Individual",
      price: "R$ 3.000",
      period: "por pessoa/dia",
      features: ["Lancha exclusiva", "Guia especializado", "Tuviras ilimitadas", "Bebidas premium"]
    },
    {
      type: "Dupla",
      price: "R$ 2.300",
      period: "por pessoa/dia",
      features: ["Lancha compartilhada", "Guia especializado", "Tuviras ilimitadas", "Bebidas premium"],
      popular: true
    },
    {
      type: "Trio",
      price: "R$ 2.000",
      period: "por pessoa/dia",
      features: ["Lancha compartilhada", "Guia especializado", "Tuviras ilimitadas", "Bebidas premium"]
    }
  ];

  const includedServices = [
    { icon: Anchor, text: "Lancha exclusiva ou compartilhada" },
    { icon: Fish, text: "Tuviras ilimitadas" },
    { icon: Wine, text: "Bebidas premium" },
    { icon: Shirt, text: "Lavanderia diária" },
    { icon: Droplets, text: "Água e isotônicos" },
    { icon: Car, text: "Transporte até o pier" }
  ];

  const faqData = [
    {
      question: "Preciso de licença para pescar?",
      answer: "Não é necessário. Nós cuidamos de toda a documentação e licenças necessárias para a pesca esportiva no Pantanal. Você só precisa se preocupar em aproveitar a experiência."
    },
    {
      question: "Posso alugar equipamento de pesca?",
      answer: "Sim, oferecemos equipamentos completos de pesca esportiva de alta qualidade. Varas, molinetes, linhas e iscas artificiais estão inclusos no pacote. Você também pode trazer seus próprios equipamentos se preferir."
    },
    {
      question: "Tem limite de peças capturadas?",
      answer: "Praticamos a pesca esportiva sustentável com catch and release. Você pode fotografar seus troféus e soltar os peixes, contribuindo para a preservação do ecossistema. Algumas espécies menores podem ser mantidas para consumo."
    }
  ];

  return (
    <>
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop"
        title="Dourados troféu em águas pouco batidas"
        subtitle="Barcos 40 hp, isca viva à vontade e guias que conhecem cada curva do Velho Cuiabá."
        primaryCTA={{
          label: "Ver Datas da Temporada",
          href: "/booking"
        }}
        secondaryCTA={{
          label: "Falar com Especialista",
          href: "/contato"
        }}
      />

      <StickyBar 
        variant="availability"
        ctaLabel="Ver Datas da Temporada"
        ctaHref="/booking"
      />

      {/* Tabela de Preços */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-playfair text-3xl md:text-4xl text-center text-river-slate-800 mb-12">
            Pacotes de Pesca Esportiva
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingData.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-lg shadow-lg border-2 p-8 ${
                  plan.popular ? 'border-sunset-amber-600 scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-sunset-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-playfair text-2xl text-river-slate-800 mb-2">{plan.type}</h3>
                  <div className="font-playfair text-4xl text-pantanal-green-900 mb-1">{plan.price}</div>
                  <div className="font-lato text-sm text-river-slate-600">{plan.period}</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-pantanal-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-pantanal-green-600 rounded-full"></div>
                      </div>
                      <span className="font-lato text-river-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/booking">
                  <Button className="w-full font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150">
                    Reservar Agora
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluso */}
      <section className="py-16 bg-sand-beige-100">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-playfair text-3xl text-center text-pantanal-green-900 mb-12">
            O que está incluso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {includedServices.map((service, index) => (
              <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-pantanal-green-100 rounded-full flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-pantanal-green-700" />
                </div>
                <span className="font-lato text-river-slate-800">{service.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SplitBlock
        imageSrc="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
        imageAlt="Guia de pesca experiente"
        title="Guias que Conhecem Cada Segredo do Rio"
        text="Nossos guias locais têm décadas de experiência navegando o Rio Cuiabá. Eles conhecem os melhores pontos de pesca, os horários ideais e as técnicas mais eficazes para cada espécie.

Com barcos equipados com motor 40hp, você alcança rapidamente os locais mais produtivos, maximizando suas chances de capturar troféus memoráveis."
        ctaLabel="Conhecer os Guias"
        ctaHref="/sobre-nos"
        backgroundColor="bg-white"
      />

      {/* FAQ Inline */}
      <section className="py-16 bg-sand-beige-100">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-playfair text-3xl text-center text-pantanal-green-900 mb-12">
            Perguntas Frequentes
          </h3>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-lato font-medium text-river-slate-800 hover:text-pantanal-green-700">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 font-lato text-river-slate-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SplitBlock
        imageSrc="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
        imageAlt="Dourado sendo pescado"
        title="Temporada de Pesca Premium"
        text="A melhor época para pesca no Pantanal é durante a temporada seca, de maio a setembro. Neste período, os peixes se concentram nos rios principais, proporcionando pescarias mais produtivas.

Reserve com antecedência para garantir suas datas preferidas na alta temporada."
        ctaLabel="Ver Calendário"
        ctaHref="/booking"
        backgroundColor="bg-white"
        reverse
      />
    </>
  );
}