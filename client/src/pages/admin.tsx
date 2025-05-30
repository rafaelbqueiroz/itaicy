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
        <Tabs defaultValue="blocks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="blocks" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Editor de Blocos</span>
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

          {/* Editor de Blocos */}
          <TabsContent value="blocks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Editor de Blocos - Conteúdo Completo do Site</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Edite todo o conteúdo das páginas: textos, títulos, imagens, vídeos, informações de contato e muito mais
                </p>
              </CardHeader>
              <CardContent>
                <BlocksEditor />
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

          {/* SEO Manager */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Gerenciar SEO</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Configure títulos, descrições, palavras-chave e meta tags para todas as páginas
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {['home', 'acomodacoes', 'experiencias', 'galeria', 'contato'].map((page) => (
                    <SEOEditor key={page} pageName={page} />
                  ))}
                </div>
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

// Componente para editar páginas
function PageEditor({ pageName }: { pageName: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: content = {}, isLoading } = useQuery({
    queryKey: [`/api/cms/pages/${pageName}/content`],
  });

  const updateMutation = useMutation({
    mutationFn: async (newContent: any) => {
      const response = await fetch(`/api/cms/pages/${pageName}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cms/pages/${pageName}/content`] });
      toast({ title: "Sucesso", description: "Conteúdo da página atualizado!" });
      setEditing(false);
    },
  });

  const getPageDisplayName = (slug: string) => {
    const names: Record<string, string> = {
      'home': 'Página Inicial',
      'acomodacoes': 'Acomodações',
      'experiencias': 'Experiências',
      'galeria': 'Galeria',
      'contato': 'Contato'
    };
    return names[slug] || slug;
  };

  if (isLoading) return <div className="p-4 border rounded">Carregando...</div>;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{getPageDisplayName(pageName)}</h3>
        <Button size="sm" onClick={() => setEditing(!editing)}>
          <Edit className="h-4 w-4 mr-2" />
          {editing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>
      
      {editing ? (
        <PageContentForm 
          content={content} 
          onSave={(newContent) => updateMutation.mutate(newContent)}
          isLoading={updateMutation.isPending}
        />
      ) : (
        <div className="space-y-2 text-sm">
          {content.hero && (
            <div>
              <strong>Título Hero:</strong> {content.hero.title || 'Não definido'}
            </div>
          )}
          {content.hero && (
            <div>
              <strong>Subtítulo:</strong> {content.hero.subtitle || 'Não definido'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para editar SEO
function SEOEditor({ pageName }: { pageName: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: seo = {}, isLoading } = useQuery({
    queryKey: [`/api/cms/pages/${pageName}/seo`],
  });

  const updateMutation = useMutation({
    mutationFn: async (newSEO: any) => {
      const response = await fetch(`/api/cms/pages/${pageName}/seo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSEO),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cms/pages/${pageName}/seo`] });
      toast({ title: "Sucesso", description: "SEO da página atualizado!" });
      setEditing(false);
    },
  });

  const getPageDisplayName = (slug: string) => {
    const names: Record<string, string> = {
      'home': 'Página Inicial',
      'acomodacoes': 'Acomodações', 
      'experiencias': 'Experiências',
      'galeria': 'Galeria',
      'contato': 'Contato'
    };
    return names[slug] || slug;
  };

  if (isLoading) return <div className="p-4 border rounded">Carregando...</div>;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">SEO - {getPageDisplayName(pageName)}</h3>
        <Button size="sm" onClick={() => setEditing(!editing)}>
          <Edit className="h-4 w-4 mr-2" />
          {editing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>
      
      {editing ? (
        <SEOForm 
          seo={seo} 
          onSave={(newSEO) => updateMutation.mutate(newSEO)}
          isLoading={updateMutation.isPending}
        />
      ) : (
        <div className="space-y-2 text-sm">
          <div><strong>Título:</strong> {seo.title || 'Não definido'}</div>
          <div><strong>Descrição:</strong> {seo.description || 'Não definido'}</div>
          <div><strong>Palavras-chave:</strong> {seo.keywords || 'Não definido'}</div>
        </div>
      )}
    </div>
  );
}

// Formulário para editar conteúdo da página
function PageContentForm({ content, onSave, isLoading }: any) {
  const [formData, setFormData] = useState(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formData.hero && (
        <>
          <div>
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={formData.hero.title || ''}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Textarea
              id="heroSubtitle"
              value={formData.hero.subtitle || ''}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, subtitle: e.target.value }
              })}
              rows={2}
            />
          </div>
        </>
      )}
      
      <Button type="submit" disabled={isLoading} size="sm">
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
}

// Formulário para editar SEO
function SEOForm({ seo, onSave, isLoading }: any) {
  const [formData, setFormData] = useState(seo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título SEO</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Título que aparece no Google"
        />
      </div>
      <div>
        <Label htmlFor="description">Descrição SEO</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Descrição que aparece no Google"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="keywords">Palavras-chave</Label>
        <Input
          id="keywords"
          value={formData.keywords || ''}
          onChange={(e) => setFormData({...formData, keywords: e.target.value})}
          placeholder="palavra1, palavra2, palavra3"
        />
      </div>
      <Button type="submit" disabled={isLoading} size="sm">
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
}

// Componente principal do editor de blocos
function BlocksEditor() {
  const [selectedPage, setSelectedPage] = useState('home');
  const { data: pages = [] } = useQuery({
    queryKey: ['/api/cms/pages'],
  });

  const pageOptions = [
    { value: 'home', label: 'Página Inicial' },
    { value: 'acomodacoes', label: 'Acomodações' },
    { value: 'experiencias', label: 'Experiências' },
    { value: 'galeria', label: 'Galeria' },
    { value: 'contato', label: 'Contato' }
  ];

  const selectedPageData = pages.find((p: any) => p.slug === selectedPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Label htmlFor="page-select">Selecionar Página:</Label>
        <select
          id="page-select"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {pageOptions.map(page => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      {selectedPageData && (
        <PageBlocksManager pageId={selectedPageData.id} pageName={selectedPage} />
      )}
    </div>
  );
}

// Componente para gerenciar blocos de uma página específica
function PageBlocksManager({ pageId, pageName }: { pageId: number; pageName: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: [`/api/cms/pages/${pageId}/blocks`],
  });

  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/cms/blocks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cms/pages/${pageId}/blocks`] });
      toast({ title: "Sucesso", description: "Bloco atualizado!" });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando blocos...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Editando: {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
      </h3>
      
      <div className="space-y-4">
        {blocks.map((block: any) => (
          <BlockEditor
            key={block.id}
            block={block}
            onUpdate={(data) => updateBlockMutation.mutate({ id: block.id, data })}
            isLoading={updateBlockMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para editar um bloco específico
function BlockEditor({ block, onUpdate, isLoading }: any) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(block);

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const getBlockTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'hero_video': 'Vídeo Hero',
      'hero_image': 'Imagem Hero',
      'page_header': 'Cabeçalho da Página',
      'stats_strip': 'Faixa de Estatísticas',
      'experiences_grid': 'Grade de Experiências',
      'image_gallery': 'Galeria de Imagens',
      'contact_info': 'Informações de Contato',
      'contact_form': 'Formulário de Contato'
    };
    return labels[type] || type;
  };

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-semibold text-lg">{getBlockTypeLabel(block.type)}</h4>
          <p className="text-sm text-gray-600">Ordem: {block.order}</p>
        </div>
        <Button size="sm" onClick={() => setEditing(!editing)}>
          <Edit className="h-4 w-4 mr-2" />
          {editing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {editing ? (
        <div className="space-y-4">
          <DynamicBlockForm
            blockType={block.type}
            props={formData.props}
            onChange={(newProps) => setFormData({ ...formData, props: newProps })}
          />
          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <BlockPreview blockType={block.type} props={block.props} />
      )}
    </div>
  );
}

// Componente para preview do bloco
function BlockPreview({ blockType, props }: { blockType: string; props: any }) {
  return (
    <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
      <div className="space-y-2 text-sm">
        {blockType === 'hero_video' && (
          <>
            <div><strong>Título:</strong> {props.title}</div>
            <div><strong>Subtítulo:</strong> {props.subtitle}</div>
            <div><strong>Vídeo:</strong> {props.videoUrl}</div>
          </>
        )}
        {blockType === 'page_header' && (
          <>
            <div><strong>Título:</strong> {props.title}</div>
            <div><strong>Subtítulo:</strong> {props.subtitle}</div>
            <div><strong>Descrição:</strong> {props.description}</div>
          </>
        )}
        {blockType === 'contact_info' && (
          <>
            <div><strong>Email:</strong> {props.email}</div>
            <div><strong>Telefone:</strong> {props.phone}</div>
            <div><strong>WhatsApp:</strong> {props.whatsapp}</div>
            <div><strong>Endereço:</strong> {props.address}</div>
          </>
        )}
        {blockType === 'stats_strip' && (
          <div><strong>Título:</strong> {props.title}</div>
        )}
        {blockType === 'experiences_grid' && (
          <>
            <div><strong>Título:</strong> {props.title}</div>
            <div><strong>Subtítulo:</strong> {props.subtitle}</div>
            <div><strong>Cards:</strong> {props.cards?.length || 0} experiências</div>
          </>
        )}
      </div>
    </div>
  );
}

// Componente para formulário dinâmico baseado no tipo de bloco
function DynamicBlockForm({ blockType, props, onChange }: any) {
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  if (blockType === 'hero_video' || blockType === 'page_header') {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={props.title || ''}
            onChange={(e) => updateProp('title', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Textarea
            id="subtitle"
            value={props.subtitle || ''}
            onChange={(e) => updateProp('subtitle', e.target.value)}
            rows={2}
          />
        </div>
        {blockType === 'page_header' && (
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={props.description || ''}
              onChange={(e) => updateProp('description', e.target.value)}
              rows={3}
            />
          </div>
        )}
        {blockType === 'hero_video' && (
          <div>
            <Label htmlFor="videoUrl">URL do Vídeo</Label>
            <Input
              id="videoUrl"
              value={props.videoUrl || ''}
              onChange={(e) => updateProp('videoUrl', e.target.value)}
            />
          </div>
        )}
      </div>
    );
  }

  if (blockType === 'contact_info') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={props.email || ''}
            onChange={(e) => updateProp('email', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={props.phone || ''}
            onChange={(e) => updateProp('phone', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={props.whatsapp || ''}
            onChange={(e) => updateProp('whatsapp', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={props.address || ''}
            onChange={(e) => updateProp('address', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="hours">Horário de Atendimento</Label>
          <Input
            id="hours"
            value={props.hours || ''}
            onChange={(e) => updateProp('hours', e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (blockType === 'stats_strip') {
    return (
      <div>
        <Label htmlFor="title">Título da Seção</Label>
        <Input
          id="title"
          value={props.title || ''}
          onChange={(e) => updateProp('title', e.target.value)}
        />
      </div>
    );
  }

  if (blockType === 'experiences_grid') {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={props.title || ''}
            onChange={(e) => updateProp('title', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            value={props.subtitle || ''}
            onChange={(e) => updateProp('subtitle', e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4 text-gray-500">
      Editor específico para este tipo de bloco em desenvolvimento
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