import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Users, Heart, Award, MapPin } from 'lucide-react';

export default function SobreNos() {
  const { t } = useLanguage();

  const timeline = [
    {
      year: '1897',
      title: 'Usina Itaicy',
      description: 'Construção da Usina Itaicy para processamento de açúcar, marco histórico da região.',
    },
    {
      year: '1970',
      title: 'Hotel de Pesca',
      description: 'Transformação em hotel especializado em pesca esportiva, pioneiro no turismo pantaneiro.',
    },
    {
      year: '2010',
      title: 'Renovação Sustentável',
      description: 'Grande reforma com foco em sustentabilidade e preservação ambiental.',
    },
    {
      year: '2020',
      title: 'Eco Lodge Certificado',
      description: 'Certificação como eco lodge e ampliação dos programas de conservação.',
    },
  ];

  const team = [
    {
      name: 'Carlos Itaicy',
      role: 'Fundador & Diretor',
      description: 'Pioneiro do ecoturismo no Pantanal com mais de 30 anos de experiência.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Ana Ferreira',
      role: 'Bióloga & Coordenadora Ambiental',
      description: 'Especialista em fauna pantaneira, responsável pelos programas de conservação.',
      image: 'https://images.unsplash.com/photo-1594736797933-d0a4390d327e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'João Santos',
      role: 'Chef Executivo',
      description: 'Mestre da culinária pantaneira, criador dos pratos autorais do lodge.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Maria Cuiabá',
      role: 'Guia Naturalista',
      description: 'Especialista em birdwatching com 20 anos de experiência no Pantanal.',
      image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Paixão pela Natureza',
      description: 'Amor genuíno pelo Pantanal e dedicação à sua preservação para futuras gerações.',
    },
    {
      icon: Users,
      title: 'Hospitalidade Autêntica',
      description: 'Acolhimento caloroso com o jeitinho pantaneiro de receber os hóspedes.',
    },
    {
      icon: Award,
      title: 'Excelência em Serviços',
      description: 'Padrão internacional de qualidade mantendo a essência local.',
    },
    {
      icon: MapPin,
      title: 'Compromisso Local',
      description: 'Valorização da cultura e economia regional através do turismo responsável.',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="playfair text-5xl md:text-6xl font-bold text-itaicy-charcoal mb-6">
              Sobre Nós
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma história de paixão pelo Pantanal, preservação ambiental e hospitalidade autêntica
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                O Itaicy Pantanal Eco Lodge nasceu sobre as fundações históricas da Usina Itaicy, 
                construída em 1897. Durante mais de um século, este local testemunhou a evolução 
                da região, transformando-se de centro industrial em refúgio de preservação ambiental.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Nos anos 1970, a família Itaicy transformou as antigas instalações em um hotel 
                de pesca esportiva, pioneiro no turismo pantaneiro. Com o tempo, evoluímos para 
                um conceito mais amplo de ecoturismo, mantendo nossa essência de hospitalidade 
                familiar.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Hoje, somos orgulhosamente um eco lodge certificado, comprometido com a conservação 
                do Pantanal e o desenvolvimento sustentável da região. Nossa missão é oferecer 
                experiências transformadoras enquanto protegemos este patrimônio natural único.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Ruínas históricas da Usina Itaicy"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Nossa Linha do Tempo
            </h2>
            <p className="text-xl text-gray-600">
              Marcos importantes da nossa jornada de mais de 125 anos
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-24 text-right mr-8">
                  <span className="text-2xl font-bold text-itaicy-secondary">{event.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-itaicy-primary rounded-full mt-2 mr-8"></div>
                <div className="flex-1">
                  <h3 className="playfair text-xl font-bold text-itaicy-charcoal mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que guiam nossa forma de trabalhar e nossa relação com o Pantanal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-itaicy-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-itaicy-primary" />
                  </div>
                  <h3 className="playfair text-xl font-bold mb-4 text-itaicy-charcoal">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais apaixonados pelo Pantanal, dedicados a proporcionar experiências inesquecíveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="playfair text-xl font-bold mb-2 text-itaicy-charcoal">
                    {member.name}
                  </h3>
                  <p className="text-itaicy-secondary font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-itaicy-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="playfair text-4xl font-bold mb-8">
            Nossa Missão
          </h2>
          <p className="text-2xl font-light leading-relaxed mb-8 opacity-90">
            "Oferecer experiências autênticas e transformadoras no Pantanal, 
            promovendo a conservação ambiental e o desenvolvimento sustentável 
            das comunidades locais através do ecoturismo responsável."
          </p>
          <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
            Conheça Nossas Experiências
          </Button>
        </div>
      </section>
    </div>
  );
}
