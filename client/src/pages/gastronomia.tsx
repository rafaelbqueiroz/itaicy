import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Clock, Users, Utensils } from 'lucide-react';

export default function Gastronomia() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="playfair text-5xl md:text-6xl font-bold text-itaicy-charcoal mb-6">
              Gastronomia Pantaneira
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sabores autênticos do Pantanal preparados com ingredientes locais e técnicas tradicionais
            </p>
          </div>
        </div>
      </section>

      {/* Restaurant Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
                Do Rio à Mesa
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Nossa cozinha celebra os sabores únicos do Pantanal, combinando receitas tradicionais 
                com técnicas culinárias modernas. Utilizamos ingredientes frescos da região, peixes 
                do rio e produtos orgânicos locais.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O restaurante funciona em sistema all-inclusive, oferecendo café da manhã, almoço 
                e jantar com opções para todos os gostos, incluindo pratos vegetarianos e veganos.
              </p>
              <Button className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 font-semibold">
                Ver Cardápio Completo
              </Button>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Restaurante do Itaicy com vista para o Pantanal"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Pratos Especiais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Especialidades criadas pelo nosso chef com os melhores ingredientes do Pantanal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden shadow-lg border-0">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Pintado grelhado"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="playfair text-xl font-bold mb-2 text-itaicy-charcoal">
                  Pintado Grelhado
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Peixe nobre do Pantanal grelhado na brasa, servido com risotto de banana verde 
                  e legumes da horta orgânica.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg border-0">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Carne seca com mandioca"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="playfair text-xl font-bold mb-2 text-itaicy-charcoal">
                  Carne Seca Pantaneira
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tradicional carne seca temperada com especiarias locais, acompanhada de 
                  mandioca assada e vinagrete de pequi.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg border-0">
              <img 
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Sobremesa de buriti"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="playfair text-xl font-bold mb-2 text-itaicy-charcoal">
                  Doce de Buriti
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sobremesa artesanal feita com a polpa do buriti, fruta típica do Cerrado, 
                  servida com sorvete de castanha de baru.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dining Experience */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-2 border-itaicy-primary/20">
              <div className="w-16 h-16 bg-itaicy-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-itaicy-primary" />
              </div>
              <h3 className="playfair text-xl font-bold mb-4 text-itaicy-charcoal">
                Sistema All-Inclusive
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Todas as refeições incluídas na sua estadia, com buffet variado e pratos à la carte.
              </p>
            </Card>

            <Card className="p-8 text-center border-2 border-itaicy-primary/20">
              <div className="w-16 h-16 bg-itaicy-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-itaicy-primary" />
              </div>
              <h3 className="playfair text-xl font-bold mb-4 text-itaicy-charcoal">
                Horários Flexíveis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Café das 6h às 10h, almoço das 12h às 15h e jantar das 19h às 22h.
              </p>
            </Card>

            <Card className="p-8 text-center border-2 border-itaicy-primary/20">
              <div className="w-16 h-16 bg-itaicy-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-itaicy-primary" />
              </div>
              <h3 className="playfair text-xl font-bold mb-4 text-itaicy-charcoal">
                Experiências Gastronômicas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Jantares temáticos, aulas de culinária pantaneira e degustações especiais.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Chef's Table */}
      <section className="py-20 bg-itaicy-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="playfair text-4xl font-bold mb-6">
            Experiência Chef's Table
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Uma experiência gastronômica exclusiva com menu degustação e harmonização especial.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="playfair text-xl font-semibold mb-2">Menu 7 Tempos</h3>
              <p className="opacity-80 text-sm">Pratos autorais com ingredientes locais</p>
            </div>
            <div>
              <h3 className="playfair text-xl font-semibold mb-2">Harmonização</h3>
              <p className="opacity-80 text-sm">Vinhos selecionados e drinks autorais</p>
            </div>
            <div>
              <h3 className="playfair text-xl font-semibold mb-2">Experiência Exclusiva</h3>
              <p className="opacity-80 text-sm">Máximo 8 pessoas por noite</p>
            </div>
          </div>
          <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
            Reservar Chef's Table
          </Button>
        </div>
      </section>
    </div>
  );
}
