import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Leaf, Sun, Droplets, Recycle, TreePine, Shield } from 'lucide-react';

export default function Sustentabilidade() {
  const { t } = useLanguage();

  const commitments = [
    {
      icon: Sun,
      title: 'Energia Solar',
      description: '100% da energia elétrica do lodge é gerada por painéis solares, reduzindo nossa pegada de carbono.',
      metrics: '45kW de potência instalada',
    },
    {
      icon: Droplets,
      title: 'Gestão da Água',
      description: 'Sistema de captação de água da chuva e tratamento biológico de efluentes.',
      metrics: '80% de reuso da água',
    },
    {
      icon: Recycle,
      title: 'Gestão de Resíduos',
      description: 'Separação seletiva, compostagem orgânica e parcerias para reciclagem de materiais.',
      metrics: '85% dos resíduos reciclados',
    },
    {
      icon: TreePine,
      title: 'Conservação Florestal',
      description: 'Preservação de 2.000 hectares de mata nativa e reflorestamento com espécies regionais.',
      metrics: '2.000 hectares preservados',
    },
    {
      icon: Shield,
      title: 'Monitoramento da Fauna',
      description: 'Programa contínuo de monitoramento e proteção da fauna selvagem local.',
      metrics: '166+ espécies catalogadas',
    },
    {
      icon: Leaf,
      title: 'Educação Ambiental',
      description: 'Programas educativos para hóspedes e comunidade local sobre conservação.',
      metrics: '500+ pessoas educadas/ano',
    },
  ];

  const certifications = [
    {
      name: 'ABETA',
      description: 'Associação Brasileira das Empresas de Ecoturismo e Turismo de Aventura',
      image: 'https://via.placeholder.com/200x100/1a4d3a/ffffff?text=ABETA',
    },
    {
      name: 'RAINFOREST ALLIANCE',
      description: 'Certificação para práticas sustentáveis no turismo',
      image: 'https://via.placeholder.com/200x100/b8956b/ffffff?text=RAINFOREST',
    },
    {
      name: 'IESO',
      description: 'Instituto de Ecoturismo Sustentável e Orgânico',
      image: 'https://via.placeholder.com/200x100/1a4d3a/ffffff?text=IESO',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="playfair text-5xl md:text-6xl font-bold text-itaicy-charcoal mb-6">
              Sustentabilidade
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nosso compromisso com a preservação do Pantanal e o turismo responsável
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
                Nossa Missão Ambiental
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                O Itaicy Pantanal Eco Lodge opera sob os princípios do turismo sustentável, 
                buscando minimizar nosso impacto ambiental enquanto oferecemos experiências 
                autênticas e transformadoras aos nossos hóspedes.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Acreditamos que o ecoturismo responsável é uma ferramenta poderosa para a 
                conservação da biodiversidade e o desenvolvimento socioeconômico das 
                comunidades locais.
              </p>
              
              <div className="bg-itaicy-cream p-6 rounded-2xl">
                <h3 className="playfair text-xl font-semibold text-itaicy-charcoal mb-3">
                  Meta 2030
                </h3>
                <p className="text-gray-700">
                  Tornar-se carbono neutro e expandir nossa área de conservação para 
                  5.000 hectares, contribuindo ativamente para a preservação do Pantanal.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Paisagem preservada do Pantanal"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Nossos Compromissos Verdes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ações concretas que implementamos para proteger o meio ambiente e promover a sustentabilidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commitments.map((commitment, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-itaicy-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <commitment.icon className="h-8 w-8 text-itaicy-primary" />
                  </div>
                  <h3 className="playfair text-xl font-bold mb-4 text-itaicy-charcoal">
                    {commitment.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {commitment.description}
                  </p>
                  <div className="bg-itaicy-secondary/10 rounded-lg p-3">
                    <span className="text-itaicy-secondary font-semibold text-sm">
                      {commitment.metrics}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation Impact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Impacto na Conservação
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Resultados mensuráveis do nosso trabalho de preservação e pesquisa científica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-itaicy-secondary mb-2">166+</div>
              <div className="text-lg text-itaicy-charcoal font-semibold mb-2">Espécies de Aves</div>
              <div className="text-gray-600 text-sm">Catalogadas e monitoradas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-itaicy-secondary mb-2">2.000</div>
              <div className="text-lg text-itaicy-charcoal font-semibold mb-2">Hectares</div>
              <div className="text-gray-600 text-sm">De mata preservada</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-itaicy-secondary mb-2">25</div>
              <div className="text-lg text-itaicy-charcoal font-semibold mb-2">Onças Monitoradas</div>
              <div className="text-gray-600 text-sm">Com coleiras GPS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-itaicy-secondary mb-2">0</div>
              <div className="text-lg text-itaicy-charcoal font-semibold mb-2">Carbono Líquido</div>
              <div className="text-gray-600 text-sm">Meta para 2030</div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Certificações e Parcerias
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reconhecimentos e parcerias que validam nosso compromisso com a sustentabilidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="w-full h-20 object-contain mb-4 mx-auto"
                  />
                  <h3 className="playfair text-lg font-bold mb-2 text-itaicy-charcoal">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 font-semibold">
              Ver Todos os Certificados
            </Button>
          </div>
        </div>
      </section>

      {/* Community Involvement */}
      <section className="py-20 bg-itaicy-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="playfair text-4xl font-bold mb-6">
            Envolvimento Comunitário
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Trabalhamos com comunidades locais para promover o desenvolvimento sustentável e a conservação
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="playfair text-2xl font-semibold mb-2">50+</h3>
              <p className="opacity-80">Empregos locais gerados</p>
            </div>
            <div>
              <h3 className="playfair text-2xl font-semibold mb-2">15</h3>
              <p className="opacity-80">Fornecedores da região</p>
            </div>
            <div>
              <h3 className="playfair text-2xl font-semibold mb-2">500+</h3>
              <p className="opacity-80">Pessoas educadas anualmente</p>
            </div>
          </div>
          
          <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
            Conheça Nossos Projetos Sociais
          </Button>
        </div>
      </section>
    </div>
  );
}
