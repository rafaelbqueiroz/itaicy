import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, Edit, Save, Plus, Upload, Image, FileText, 
  FolderOpen, Search, Eye, Settings, BarChart3
} from 'lucide-react';

export default function CMSPage() {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [activeSection, setActiveSection] = useState<string>('content');
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Itaicy CMS</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Editando:</span>
              <span className="font-medium text-gray-900 capitalize">{selectedPage}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Site Map */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <SiteMapPanel 
              selectedPage={selectedPage}
              onPageSelect={setSelectedPage}
            />
          </div>
        </aside>

        {/* Center Panel - Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <ContentCanvas pageSlug={selectedPage} />
          </div>
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <PropertiesPanel pageSlug={selectedPage} />
          </div>
        </aside>
      </div>
    </div>
  );
}

// Painel esquerdo - Mapa do site
function SiteMapPanel({ selectedPage, onPageSelect }: {
  selectedPage: string;
  onPageSelect: (page: string) => void;
}) {
  const sitePages = [
    { slug: 'home', name: 'Página Inicial', icon: Home, description: 'Hero, estatísticas, experiências' },
    { slug: 'acomodacoes', name: 'Acomodações', icon: Home, description: 'Suítes e hospedagem' },
    { slug: 'experiencias', name: 'Experiências', icon: FolderOpen, description: 'Pesca, birdwatching' },
    { slug: 'galeria', name: 'Galeria', icon: Image, description: 'Fotos e vídeos' },
    { slug: 'contato', name: 'Contato', icon: FileText, description: 'Formulário e informações' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Páginas do Site</h3>
        <p className="text-sm text-gray-600 mb-4">Selecione uma página para editar</p>
      </div>
      
      <nav className="space-y-2">
        {sitePages.map((page) => {
          const Icon = page.icon;
          const isSelected = selectedPage === page.slug;
          return (
            <button
              key={page.slug}
              onClick={() => onPageSelect(page.slug)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {page.name}
                  </h4>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                    {page.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Ferramentas</h4>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Image className="h-4 w-4 mr-2" />
            Biblioteca de Mídia
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}

// Painel central - Canvas de conteúdo 
function ContentCanvas({ pageSlug }: { pageSlug: string }) {
  const { data: page } = useQuery({
    queryKey: [`/api/cms/pages/slug/${pageSlug}`],
  });

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: [`/api/cms/pages/${page?.id}/blocks`],
    enabled: !!page?.id,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando blocos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Editando:</span>
        <span className="font-medium text-gray-900 capitalize">
          {pageSlug.replace('-', ' ')}
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1)}
        </h2>
        <p className="text-gray-600">
          {blocks.length} blocos de conteúdo
        </p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.map((block: any, index: number) => (
          <VisualBlockCard
            key={block.id}
            block={block}
            index={index}
            total={blocks.length}
          />
        ))}
        
        {/* Add Block Button */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
          <Plus className="h-8 w-8 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Adicionar Novo Bloco</h3>
          <p className="text-gray-600">
            Clique para adicionar um novo bloco de conteúdo
          </p>
        </div>
      </div>
    </div>
  );
}

// Painel direito - Propriedades
function PropertiesPanel({ pageSlug }: { pageSlug: string }) {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Propriedades</h3>
        <p className="text-sm text-gray-600">Configure esta página</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Configurações da Página</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="page-title" className="text-xs font-medium">Título da Página</Label>
                <Input
                  id="page-title"
                  defaultValue={pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="page-status" className="text-xs font-medium">Status</Label>
                <select
                  id="page-status"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  defaultValue="published"
                >
                  <option value="draft">Rascunho</option>
                  <option value="review">Em Revisão</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Biblioteca de Mídia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Upload de Arquivos</p>
                <p className="text-xs text-gray-600 mb-4">
                  Arraste imagens ou clique para selecionar
                </p>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Arquivos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOPropertiesCard pageSlug={pageSlug} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Card visual para cada bloco
function VisualBlockCard({ block, index, total }: { block: any; index: number; total: number }) {
  const getBlockIcon = (type: string) => {
    const icons: Record<string, any> = {
      'hero_video': '🎬',
      'hero_image': '🖼️',
      'page_header': '📝',
      'stats_strip': '📊',
      'experiences_grid': '🎯',
      'image_gallery': '🖼️',
      'contact_info': '📞',
      'contact_form': '📝'
    };
    return icons[type] || '📄';
  };

  const getBlockTitle = (type: string) => {
    const titles: Record<string, string> = {
      'hero_video': 'Vídeo Principal',
      'hero_image': 'Imagem Principal',
      'page_header': 'Cabeçalho da Página',
      'stats_strip': 'Estatísticas',
      'experiences_grid': 'Grade de Experiências',
      'image_gallery': 'Galeria de Imagens',
      'contact_info': 'Informações de Contato',
      'contact_form': 'Formulário de Contato'
    };
    return titles[type] || type;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getBlockIcon(block.type)}</span>
            <div>
              <h4 className="font-medium text-gray-900">{getBlockTitle(block.type)}</h4>
              <p className="text-sm text-gray-500">Posição {index + 1} de {total}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
        
        <div className="bg-gray-50 rounded p-3">
          <BlockContentPreview block={block} />
        </div>
      </div>
    </div>
  );
}

// Preview do conteúdo do bloco
function BlockContentPreview({ block }: { block: any }) {
  const { props } = block;
  
  if (block.type === 'hero_video' || block.type === 'page_header') {
    return (
      <div className="space-y-2">
        <div className="font-medium text-sm text-gray-900">{props.title}</div>
        {props.subtitle && (
          <div className="text-sm text-gray-600 line-clamp-2">{props.subtitle}</div>
        )}
      </div>
    );
  }

  if (block.type === 'contact_info') {
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><strong>Email:</strong> {props.email}</div>
        <div><strong>Tel:</strong> {props.phone}</div>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-600">
      Clique para editar este bloco
    </div>
  );
}

// Card de propriedades SEO
function SEOPropertiesCard({ pageSlug }: { pageSlug: string }) {
  const { data: seo } = useQuery({
    queryKey: [`/api/cms/pages/${pageSlug}/seo`],
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Otimização SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="seo-title" className="text-xs font-medium">Título SEO</Label>
          <Input
            id="seo-title"
            defaultValue={seo?.title || ''}
            placeholder="Título otimizado para busca"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            {seo?.title?.length || 0}/60 caracteres
          </p>
        </div>
        
        <div>
          <Label htmlFor="seo-description" className="text-xs font-medium">Meta Description</Label>
          <Textarea
            id="seo-description"
            defaultValue={seo?.description || ''}
            placeholder="Descrição para resultados de busca"
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            {seo?.description?.length || 0}/160 caracteres
          </p>
        </div>

        <Button size="sm" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Salvar SEO
        </Button>
      </CardContent>
    </Card>
  );
}

function PageContentEditor({ pageSlug }: { pageSlug: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: page } = useQuery({
    queryKey: [`/api/cms/pages/slug/${pageSlug}`],
  });

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: [`/api/cms/pages/${page?.id}/blocks`],
    enabled: !!page?.id,
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
      queryClient.invalidateQueries({ queryKey: [`/api/cms/pages/${page?.id}/blocks`] });
      toast({ title: "Sucesso", description: "Conteúdo atualizado!" });
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando conteúdo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 capitalize">
          Editando: {pageSlug.replace('-', ' ')}
        </h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Bloco
        </Button>
      </div>

      <div className="space-y-6">
        {blocks.map((block: any) => (
          <ContentBlock
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

function ContentBlock({ block, onUpdate, isLoading }: any) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(block);

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const getBlockTitle = (type: string) => {
    const titles: Record<string, string> = {
      'hero_video': 'Vídeo Principal',
      'hero_image': 'Imagem Principal',
      'page_header': 'Cabeçalho da Página',
      'stats_strip': 'Estatísticas',
      'experiences_grid': 'Grade de Experiências',
      'image_gallery': 'Galeria de Imagens',
      'contact_info': 'Informações de Contato',
      'contact_form': 'Formulário de Contato'
    };
    return titles[type] || type;
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{getBlockTitle(block.type)}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Ordem: {block.order}</p>
          </div>
          <Button
            variant={editing ? "outline" : "default"}
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <BlockEditForm
              blockType={block.type}
              props={formData.props}
              onChange={(newProps) => setFormData({ ...formData, props: newProps })}
            />
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <BlockPreview blockType={block.type} props={block.props} />
        )}
      </CardContent>
    </Card>
  );
}

function BlockEditForm({ blockType, props, onChange }: any) {
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  if (blockType === 'hero_video' || blockType === 'page_header') {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">Título Principal</Label>
          <Input
            id="title"
            value={props.title || ''}
            onChange={(e) => updateProp('title', e.target.value)}
            className="mt-1"
            placeholder="Digite o título principal..."
          />
        </div>
        <div>
          <Label htmlFor="subtitle" className="text-sm font-medium">Subtítulo</Label>
          <Textarea
            id="subtitle"
            value={props.subtitle || ''}
            onChange={(e) => updateProp('subtitle', e.target.value)}
            className="mt-1"
            rows={3}
            placeholder="Digite o subtítulo explicativo..."
          />
        </div>
        {blockType === 'page_header' && (
          <div>
            <Label htmlFor="description" className="text-sm font-medium">Descrição Completa</Label>
            <Textarea
              id="description"
              value={props.description || ''}
              onChange={(e) => updateProp('description', e.target.value)}
              className="mt-1"
              rows={4}
              placeholder="Digite uma descrição mais detalhada..."
            />
          </div>
        )}
        {blockType === 'hero_video' && (
          <div>
            <Label htmlFor="videoUrl" className="text-sm font-medium">URL do Vídeo</Label>
            <Input
              id="videoUrl"
              value={props.videoUrl || ''}
              onChange={(e) => updateProp('videoUrl', e.target.value)}
              className="mt-1"
              placeholder="/assets/video.mp4"
            />
          </div>
        )}
      </div>
    );
  }

  if (blockType === 'contact_info') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={props.email || ''}
            onChange={(e) => updateProp('email', e.target.value)}
            className="mt-1"
            placeholder="contato@itaicy.com.br"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
          <Input
            id="phone"
            value={props.phone || ''}
            onChange={(e) => updateProp('phone', e.target.value)}
            className="mt-1"
            placeholder="+55 65 9999-9999"
          />
        </div>
        <div>
          <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={props.whatsapp || ''}
            onChange={(e) => updateProp('whatsapp', e.target.value)}
            className="mt-1"
            placeholder="+55 65 9999-9999"
          />
        </div>
        <div>
          <Label htmlFor="address" className="text-sm font-medium">Endereço</Label>
          <Input
            id="address"
            value={props.address || ''}
            onChange={(e) => updateProp('address', e.target.value)}
            className="mt-1"
            placeholder="Rio Cuiabá, Pantanal - MT"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="hours" className="text-sm font-medium">Horário de Atendimento</Label>
          <Input
            id="hours"
            value={props.hours || ''}
            onChange={(e) => updateProp('hours', e.target.value)}
            className="mt-1"
            placeholder="Atendimento: 8h às 18h"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-500">
      <Edit className="h-8 w-8 mx-auto mb-3 opacity-50" />
      <p>Editor específico para este tipo de bloco será implementado</p>
    </div>
  );
}

function BlockPreview({ blockType, props }: { blockType: string; props: any }) {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="space-y-3">
        {blockType === 'hero_video' && (
          <>
            <div className="text-lg font-semibold">{props.title}</div>
            <div className="text-gray-600">{props.subtitle}</div>
            <div className="text-sm text-blue-600">{props.videoUrl}</div>
          </>
        )}
        {blockType === 'page_header' && (
          <>
            <div className="text-lg font-semibold">{props.title}</div>
            <div className="text-gray-600">{props.subtitle}</div>
            <div className="text-sm text-gray-500">{props.description}</div>
          </>
        )}
        {blockType === 'contact_info' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Email:</strong> {props.email}</div>
            <div><strong>Telefone:</strong> {props.phone}</div>
            <div><strong>WhatsApp:</strong> {props.whatsapp}</div>
            <div><strong>Endereço:</strong> {props.address}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MediaLibrary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="h-5 w-5" />
          <span>Biblioteca de Mídia</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload de Arquivos</h3>
          <p className="text-gray-600 mb-6">
            Arraste e solte imagens, vídeos ou documentos aqui
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Escolher Arquivos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SEOEditor({ pageSlug }: { pageSlug: string }) {
  const { data: seo, isLoading } = useQuery({
    queryKey: [`/api/cms/pages/${pageSlug}/seo`],
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando configurações de SEO...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>SEO - {pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="seo-title">Título SEO</Label>
          <Input
            id="seo-title"
            value={seo?.title || ''}
            placeholder="Título otimizado para mecanismos de busca"
          />
          <p className="text-sm text-gray-500 mt-1">
            Caracteres: {seo?.title?.length || 0}/60 (recomendado)
          </p>
        </div>
        
        <div>
          <Label htmlFor="seo-description">Meta Description</Label>
          <Textarea
            id="seo-description"
            value={seo?.description || ''}
            rows={3}
            placeholder="Descrição que aparecerá nos resultados de busca"
          />
          <p className="text-sm text-gray-500 mt-1">
            Caracteres: {seo?.description?.length || 0}/160 (recomendado)
          </p>
        </div>

        <div>
          <Label htmlFor="seo-keywords">Palavras-chave</Label>
          <Input
            id="seo-keywords"
            value={seo?.keywords || ''}
            placeholder="pantanal, ecoturismo, pesca esportiva, lodge"
          />
        </div>

        <Button>
          <Save className="h-4 w-4 mr-2" />
          Salvar SEO
        </Button>
      </CardContent>
    </Card>
  );
}

function SiteSettings() {
  const { data: settings } = useQuery({
    queryKey: ['/api/cms/settings'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Configurações do Site</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primary-color">Cor Principal</Label>
            <Input
              id="primary-color"
              type="color"
              value={settings?.primaryColor || '#C97A2C'}
            />
          </div>
          <div>
            <Label htmlFor="accent-color">Cor de Destaque</Label>
            <Input
              id="accent-color"
              type="color"
              value={settings?.accentColor || '#064737'}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="site-email">E-mail Principal</Label>
          <Input
            id="site-email"
            type="email"
            value={settings?.email || ''}
            placeholder="contato@itaicy.com.br"
          />
        </div>

        <Button>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
}