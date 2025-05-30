import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Save, Settings, BarChart3, MessageSquare, HelpCircle, Home, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [, setLocation] = useLocation();

  // Verificar se está logado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      setLocation('/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    setLocation('/');
  };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);

  // Queries para buscar dados do CMS
  const { data: suites = [], isLoading: suitesLoading } = useQuery({
    queryKey: ['/api/cms/suites'],
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['/api/cms/testimonials'],
  });

  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ['/api/cms/faqs'],
  });

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['/api/cms/stats'],
  });

  const { data: settings = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/cms/settings'],
  });

  // Mutations para atualizar dados
  const updateSuiteMutation = useMutation({
    mutationFn: async (suite: any) => {
      const response = await fetch(`/api/cms/suites/${suite.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suite),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/suites'] });
      toast({ title: "Sucesso", description: "Suíte atualizada com sucesso!" });
      setEditingItem(null);
    },
  });

  const updateStatMutation = useMutation({
    mutationFn: async ({ code, value }: { code: string; value: number }) => {
      const response = await fetch(`/api/cms/stats/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/stats'] });
      toast({ title: "Sucesso", description: "Estatística atualizada!" });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/settings'] });
      toast({ title: "Sucesso", description: "Configurações salvas!" });
    },
  });

  const handleSaveSuite = (suite: any) => {
    updateSuiteMutation.mutate(suite);
  };

  const handleUpdateStat = (code: string, value: number) => {
    updateStatMutation.mutate({ code, value });
  };

  const handleSaveSettings = (newSettings: any) => {
    updateSettingsMutation.mutate(newSettings);
  };

  return (
    <div className="min-h-screen bg-sand-beige-50">
      {/* Header Administrativo */}
      <div className="bg-forest-green-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6" />
            <h1 className="text-xl font-bold">Painel Administrativo - Itaicy Lodge</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-forest-green-800 border-white hover:bg-white"
              onClick={() => setLocation('/')}>
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Site
            </Button>
            <Button variant="outline" size="sm" className="text-forest-green-800 border-white hover:bg-white"
              onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Páginas</span>
            </TabsTrigger>
            <TabsTrigger value="suites" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Suítes</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Depoimentos</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>SEO</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </TabsTrigger>
          </TabsList>

          {/* Editar Páginas */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Editor de Conteúdo das Páginas</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Edite textos, títulos, descrições e conteúdo de todas as páginas do site
                </p>
              </CardHeader>
              <CardContent>
                <PageContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gerenciar Suítes */}
          <TabsContent value="suites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Gerenciar Suítes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suitesLoading ? (
                  <div className="text-center py-8">Carregando suítes...</div>
                ) : (
                  <div className="space-y-4">
                    {suites.map((suite: any) => (
                      <div key={suite.id} className="border rounded-lg p-4">
                        {editingItem?.id === suite.id ? (
                          <SuiteEditForm 
                            suite={suite} 
                            onSave={handleSaveSuite}
                            onCancel={() => setEditingItem(null)}
                            isLoading={updateSuiteMutation.isPending}
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{suite.name}</h3>
                              <p className="text-sm text-gray-600">{suite.size} • {suite.capacity} pessoas</p>
                              <p className="text-lg font-bold text-forest-green-700">
                                R$ {Math.floor((suite.price || 0) / 100).toLocaleString()}/noite
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingItem(suite)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gerenciar Estatísticas */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Estatísticas do Lodge</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="text-center py-8">Carregando estatísticas...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((stat: any) => (
                      <StatEditor 
                        key={stat.code}
                        stat={stat}
                        onUpdate={handleUpdateStat}
                        isLoading={updateStatMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gerenciar Depoimentos */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Depoimentos dos Hóspedes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="text-center py-8">Carregando depoimentos...</div>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((testimonial: any) => (
                      <div key={testimonial.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-sm text-gray-600">{testimonial.city}</p>
                            <p className="mt-2 italic">"{testimonial.quote}"</p>
                            <div className="flex items-center mt-2">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className="text-yellow-400">★</span>
                              ))}
                            </div>
                          </div>
                          {testimonial.featured && (
                            <Badge variant="secondary">Destaque</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações Gerais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="text-center py-8">Carregando configurações...</div>
                ) : (
                  <SettingsForm 
                    settings={settings}
                    onSave={handleSaveSettings}
                    isLoading={updateSettingsMutation.isPending}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componente para editar suíte
function SuiteEditForm({ suite, onSave, onCancel, isLoading }: any) {
  const [formData, setFormData] = useState(suite);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome da Suíte</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="price">Preço por Noite (R$)</Label>
          <Input
            id="price"
            type="number"
            value={Math.floor((formData.price || 0) / 100)}
            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) * 100})}
          />
        </div>
        <div>
          <Label htmlFor="size">Tamanho</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({...formData, size: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacidade</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// Componente para editar estatísticas
function StatEditor({ stat, onUpdate, isLoading }: any) {
  const [value, setValue] = useState(stat.value);

  const handleSave = () => {
    onUpdate(stat.code, value);
  };

  const getStatLabel = (code: string) => {
    const labels: Record<string, string> = {
      'BIRD_SPECIES': 'Espécies de Aves',
      'FISH_SPECIES': 'Espécies de Peixes', 
      'SINCE_YEAR': 'Desde',
      'PROTECTED_AREA': 'Área Protegida (hectares)'
    };
    return labels[code] || code;
  };

  return (
    <div className="border rounded-lg p-4">
      <Label>{getStatLabel(stat.code)}</Label>
      <div className="flex space-x-2 mt-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value) || 0)}
        />
        <Button size="sm" onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente para configurações
function SettingsForm({ settings, onSave, isLoading }: any) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">E-mail de Contato</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp || ''}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </form>
  );
}