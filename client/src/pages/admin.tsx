import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { CmsVirtualTour, CmsTestimonial, CmsBlogPost, CmsSetting } from '@shared/schema';

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('tours');

  // Virtual Tours Tab
  const VirtualToursTab = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      tourUrl: '',
      capacity: '',
      amenities: '',
    });

    const { data: tours = [], isLoading } = useQuery<CmsVirtualTour[]>({
      queryKey: ['/api/cms/virtual-tours'],
    });

    const createTourMutation = useMutation({
      mutationFn: (data: any) => apiRequest('/api/cms/virtual-tours', 'POST', data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/cms/virtual-tours'] });
        setIsCreating(false);
        setFormData({ title: '', description: '', category: '', tourUrl: '', capacity: '', amenities: '' });
        toast({ title: "Tour virtual criado com sucesso!" });
      },
      onError: () => {
        toast({ title: "Erro ao criar tour virtual", variant: "destructive" });
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createTourMutation.mutate({
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
        isActive: true,
        sortOrder: 0
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tours Virtuais</h2>
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Tour
          </Button>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Tour Virtual</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suite">Suíte</SelectItem>
                        <SelectItem value="common-area">Área Comum</SelectItem>
                        <SelectItem value="restaurant">Restaurante</SelectItem>
                        <SelectItem value="pool">Piscina</SelectItem>
                        <SelectItem value="exterior">Exterior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tourUrl">URL do Tour</Label>
                    <Input
                      id="tourUrl"
                      type="url"
                      value={formData.tourUrl}
                      onChange={(e) => setFormData({...formData, tourUrl: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidade</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="amenities">Amenidades (separadas por vírgula)</Label>
                  <Input
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                    placeholder="Ar condicionado, Wi-Fi, Frigobar"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={createTourMutation.isPending}>
                    {createTourMutation.isPending ? 'Criando...' : 'Criar Tour'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando tours...</div>
          ) : tours.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum tour encontrado. Clique em "Novo Tour" para criar o primeiro.
            </div>
          ) : (
            tours.map((tour) => (
              <Card key={tour.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{tour.title}</h3>
                      <p className="text-gray-600 mb-2">{tour.description}</p>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline">{tour.category}</Badge>
                        {tour.capacity && <Badge variant="secondary">{tour.capacity} pessoas</Badge>}
                      </div>
                      {tour.amenities && (
                        <div className="flex flex-wrap gap-1">
                          {tour.amenities.slice(0, 3).map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{amenity}</Badge>
                          ))}
                          {tour.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{tour.amenities.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  // Testimonials Tab
  const TestimonialsTab = () => {
    const { data: testimonials = [], isLoading } = useQuery<CmsTestimonial[]>({
      queryKey: ['/api/cms/testimonials'],
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Depoimentos</h2>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Depoimento
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando depoimentos...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum depoimento encontrado.
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                      <div className="flex items-center gap-2 my-2">
                        <div className="flex">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                        {testimonial.featured && <Badge variant="secondary">Destaque</Badge>}
                      </div>
                      <p className="text-gray-700">{testimonial.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie o conteúdo do site Itaicy Pantanal Eco Lodge</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="tours">Tours Virtuais</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="tours">
            <VirtualToursTab />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>

          <TabsContent value="blog">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Blog Posts</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Configurações</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}