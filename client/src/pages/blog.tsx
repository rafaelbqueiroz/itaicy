import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/use-language';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, Search, Tag } from 'lucide-react';

export default function Blog() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Mock blog data - in production this would come from the API
  const blogPosts = [
    {
      id: 1,
      title: 'Pantanal na Cheia vs Seca: Qual Época Escolher?',
      slug: 'pantanal-cheia-vs-seca',
      excerpt: 'Descubra as diferenças entre visitar o Pantanal durante a estação seca e chuvosa, e qual é a melhor época para cada tipo de experiência.',
      content: 'Conteúdo completo do post...',
      author: 'Ana Ferreira',
      category: 'Dicas de Viagem',
      tags: ['pantanal', 'clima', 'melhor-epoca'],
      featuredImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      published: true,
      publishedAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      title: 'Catch & Release: 5 Mandamentos para Quem Pesca Dourado',
      slug: 'catch-release-pesca-dourado',
      excerpt: 'Aprenda as melhores práticas de pesca sustentável e como contribuir para a preservação dos peixes do Pantanal.',
      content: 'Conteúdo completo do post...',
      author: 'João Santos',
      category: 'Pesca Esportiva',
      tags: ['pesca', 'sustentabilidade', 'dourado'],
      featuredImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      published: true,
      publishedAt: '2024-01-10T14:30:00Z',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
    {
      id: 3,
      title: 'Guia de 10 Aves-Alvo para Fotografar em 48h',
      slug: 'guia-aves-fotografar-48h',
      excerpt: 'Lista essencial das aves mais espetaculares do Pantanal que você pode fotografar em uma estadia de fim de semana.',
      content: 'Conteúdo completo do post...',
      author: 'Maria Cuiabá',
      category: 'Birdwatching',
      tags: ['aves', 'fotografia', 'birdwatching'],
      featuredImage: 'https://images.unsplash.com/photo-1594736797933-d0a4390d327e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      published: true,
      publishedAt: '2024-01-05T09:15:00Z',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z',
    },
    {
      id: 4,
      title: 'Sustentabilidade no Turismo: O Papel dos Eco Lodges',
      slug: 'sustentabilidade-turismo-eco-lodges',
      excerpt: 'Como os eco lodges contribuem para a conservação ambiental e o desenvolvimento sustentável das comunidades locais.',
      content: 'Conteúdo completo do post...',
      author: 'Carlos Itaicy',
      category: 'Sustentabilidade',
      tags: ['sustentabilidade', 'eco-lodge', 'conservacao'],
      featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      published: true,
      publishedAt: '2024-01-01T16:45:00Z',
      createdAt: '2024-01-01T16:45:00Z',
      updatedAt: '2024-01-01T16:45:00Z',
    },
    {
      id: 5,
      title: 'Culinária Pantaneira: Sabores Únicos do Cerrado',
      slug: 'culinaria-pantaneira-sabores-cerrado',
      excerpt: 'Explore os ingredientes típicos da região e aprenda sobre os pratos tradicionais que servimos no Itaicy.',
      content: 'Conteúdo completo do post...',
      author: 'João Santos',
      category: 'Gastronomia',
      tags: ['culinaria', 'pantanal', 'tradicional'],
      featuredImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      published: true,
      publishedAt: '2023-12-28T11:20:00Z',
      createdAt: '2023-12-28T11:20:00Z',
      updatedAt: '2023-12-28T11:20:00Z',
    },
    {
      id: 6,
      title: 'Onças-Pintadas: Como Avistar o Maior Felino das Américas',
      slug: 'oncas-pintadas-avistar-felino',
      excerpt: 'Dicas essenciais para aumentar suas chances de avistar onças-pintadas durante seu safári fotográfico no Pantanal.',
      content: 'Conteúdo completo do post...',
      author: 'Maria Cuiabá',
      category: 'Vida Selvagem',
      tags: ['oncas', 'safari', 'vida-selvagem'],
      featuredImage: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      published: true,
      publishedAt: '2023-12-25T08:30:00Z',
      createdAt: '2023-12-25T08:30:00Z',
      updatedAt: '2023-12-25T08:30:00Z',
    },
  ];

  const categories = [
    { value: 'todos', label: 'Todos os Posts' },
    { value: 'Dicas de Viagem', label: 'Dicas de Viagem' },
    { value: 'Pesca Esportiva', label: 'Pesca Esportiva' },
    { value: 'Birdwatching', label: 'Birdwatching' },
    { value: 'Sustentabilidade', label: 'Sustentabilidade' },
    { value: 'Gastronomia', label: 'Gastronomia' },
    { value: 'Vida Selvagem', label: 'Vida Selvagem' },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="playfair text-5xl md:text-6xl font-bold text-itaicy-charcoal mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Histórias, dicas e conhecimentos sobre o Pantanal, vida selvagem e turismo sustentável
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`${
                    selectedCategory === category.value
                      ? 'bg-itaicy-primary text-white'
                      : 'border-itaicy-primary text-itaicy-primary hover:bg-itaicy-primary hover:text-white'
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden shadow-xl border-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative">
                  <img 
                    src={filteredPosts[0].featuredImage} 
                    alt={filteredPosts[0].title}
                    className="w-full h-80 lg:h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-itaicy-secondary text-white">
                    Destaque
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-itaicy-primary/10 text-itaicy-primary">
                    {filteredPosts[0].category}
                  </Badge>
                  <h2 className="playfair text-3xl font-bold mb-4 text-itaicy-charcoal">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{filteredPosts[0].author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(filteredPosts[0].publishedAt)}</span>
                  </div>
                  <Button className="w-fit bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white">
                    Ler Artigo Completo
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="playfair text-2xl font-bold text-itaicy-charcoal mb-4">
                Nenhum post encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar seus filtros ou termo de busca.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden shadow-lg border-0 card-hover">
                  <div className="relative">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-itaicy-primary/90 text-white">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="playfair text-xl font-bold mb-3 text-itaicy-charcoal line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full border-itaicy-primary text-itaicy-primary hover:bg-itaicy-primary hover:text-white">
                      Ler Mais
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-itaicy-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="playfair text-4xl font-bold mb-6">
            Não Perca Nenhuma Novidade
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Inscreva-se em nossa newsletter e receba os melhores conteúdos sobre o Pantanal
          </p>
          <Button size="lg" className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white px-8 py-4 text-lg font-semibold">
            Inscrever-se na Newsletter
          </Button>
        </div>
      </section>
    </div>
  );
}
