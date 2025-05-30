import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  FileText, 
  Image, 
  Eye, 
  Save,
  Home,
  Building,
  Camera,
  MessageSquare
} from 'lucide-react';

interface Block {
  id: string;
  type: string;
  position: number;
  payload: Record<string, any>;
  published: Record<string, any> | null;
}

interface Page {
  id: string;
  slug: string;
  name: string;
  template: string;
  blocks: Block[];
}

export default function CMS() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Carregar dados extraídos do export.json
  useEffect(() => {
    const loadCMSData = async () => {
      try {
        // Carregar conteúdo real extraído do site
        const response = await fetch('/seed/export.json');
        const exportData = await response.json();
        
        const loadedPages: Page[] = exportData.pages.map((page: any, pageIndex: number) => ({
          id: `page-${pageIndex}`,
          slug: page.slug,
          name: page.name,
          template: page.template,
          blocks: page.blocks.map((block: any, blockIndex: number) => ({
            id: `block-${pageIndex}-${blockIndex}`,
            type: block.type,
            position: block.position,
            payload: block.payload,
            published: block.payload // Inicialmente, published = payload
          }))
        }));

        setPages(loadedPages);
        setSelectedPage(loadedPages[0]);
      } catch (error) {
        console.error('Erro ao carregar dados do CMS:', error);
      }
    };

    loadCMSData();
  }, []);

  const updateBlockField = (blockId: string, field: string, value: any) => {
    if (!selectedPage) return;

    const updatedBlocks = selectedPage.blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          payload: {
            ...block.payload,
            [field]: value
          }
        };
      }
      return block;
    });

    setSelectedPage({
      ...selectedPage,
      blocks: updatedBlocks
    });

    setHasUnsavedChanges(true);
  };

  const updateNestedField = (blockId: string, parentField: string, childField: string, value: any) => {
    if (!selectedPage) return;

    const updatedBlocks = selectedPage.blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          payload: {
            ...block.payload,
            [parentField]: {
              ...block.payload[parentField],
              [childField]: value
            }
          }
        };
      }
      return block;
    });

    setSelectedPage({
      ...selectedPage,
      blocks: updatedBlocks
    });

    setHasUnsavedChanges(true);
  };

  const publishChanges = () => {
    if (!selectedPage) return;

    const updatedBlocks = selectedPage.blocks.map(block => ({
      ...block,
      published: { ...block.payload }
    }));

    setSelectedPage({
      ...selectedPage,
      blocks: updatedBlocks
    });

    setHasUnsavedChanges(false);
    
    console.log('Publicando alterações para:', selectedPage.slug);
  };

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case 'hero-video':
        return (
          <Card key={block.id} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Hero Principal com Vídeo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título Principal</label>
                <input
                  type="text"
                  value={block.payload.title || ''}
                  onChange={(e) => updateBlockField(block.id, 'title', e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Título principal da página"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <textarea
                  value={block.payload.subtitle || ''}
                  onChange={(e) => updateBlockField(block.id, 'subtitle', e.target.value)}
                  className="w-full p-3 border rounded-md h-24 focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição que aparece abaixo do título"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Botão Primário - Texto</label>
                  <input
                    type="text"
                    value={block.payload.primaryCTA?.label || ''}
                    onChange={(e) => updateNestedField(block.id, 'primaryCTA', 'label', e.target.value)}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Botão Primário - Link</label>
                  <input
                    type="text"
                    value={block.payload.primaryCTA?.href || ''}
                    onChange={(e) => updateNestedField(block.id, 'primaryCTA', 'href', e.target.value)}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Botão Secundário - Texto</label>
                  <input
                    type="text"
                    value={block.payload.secondaryCTA?.label || ''}
                    onChange={(e) => updateNestedField(block.id, 'secondaryCTA', 'label', e.target.value)}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Botão Secundário - Link</label>
                  <input
                    type="text"
                    value={block.payload.secondaryCTA?.href || ''}
                    onChange={(e) => updateNestedField(block.id, 'secondaryCTA', 'href', e.target.value)}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'stats-ribbon':
        return (
          <Card key={block.id} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Faixa de Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {block.payload.stats?.map((stat: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Estatística {index + 1}</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Valor</label>
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...block.payload.stats];
                            newStats[index] = { ...stat, value: e.target.value };
                            updateBlockField(block.id, 'stats', newStats);
                          }}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 4.700, 100%, 127"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Título</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...block.payload.stats];
                            newStats[index] = { ...stat, label: e.target.value };
                            updateBlockField(block.id, 'stats', newStats);
                          }}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Espécies catalogadas"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <input
                          type="text"
                          value={stat.description || ''}
                          onChange={(e) => {
                            const newStats = [...block.payload.stats];
                            newStats[index] = { ...stat, description: e.target.value };
                            updateBlockField(block.id, 'stats', newStats);
                          }}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Biodiversidade registrada"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'split-block':
        return (
          <Card key={block.id} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Bloco 50/50 - {block.payload.title || 'Sem título'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={block.payload.title || ''}
                  onChange={(e) => updateBlockField(block.id, 'title', e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <input
                  type="text"
                  value={block.payload.subtitle || ''}
                  onChange={(e) => updateBlockField(block.id, 'subtitle', e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={block.payload.description || ''}
                  onChange={(e) => updateBlockField(block.id, 'description', e.target.value)}
                  className="w-full p-3 border rounded-md h-24 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Botão Primário - Texto</label>
                  <input
                    type="text"
                    value={block.payload.primaryCTA?.label || ''}
                    onChange={(e) => updateNestedField(block.id, 'primaryCTA', 'label', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Botão Primário - Link</label>
                  <input
                    type="text"
                    value={block.payload.primaryCTA?.href || ''}
                    onChange={(e) => updateNestedField(block.id, 'primaryCTA', 'href', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card key={block.id} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {block.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Editor para {block.type} em desenvolvimento. Dados preservados.
              </p>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(block.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">CMS Itaicy</h1>
            {selectedPage && (
              <Badge variant="outline">
                Editando: {selectedPage.name}
              </Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="destructive">
                Alterações não salvas
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(`/${selectedPage?.slug || ''}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={publishChanges}
              disabled={!hasUnsavedChanges}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Páginas do Site</h2>
            <nav className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    selectedPage?.id === page.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page.slug === 'home' ? (
                    <Home className="h-4 w-4" />
                  ) : page.slug === 'acomodacoes' ? (
                    <Building className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {page.name}
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {page.blocks.length}
                  </Badge>
                </button>
              ))}
            </nav>

            <Separator className="my-6" />

            <h2 className="font-semibold text-gray-900 mb-4">Ferramentas</h2>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50">
                <Image className="h-4 w-4" />
                Biblioteca de Mídia
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50">
                <Settings className="h-4 w-4" />
                SEO
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedPage ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPage.name}
                </h2>
                <p className="text-gray-600">
                  Editando /{selectedPage.slug} • Template: {selectedPage.template} • {selectedPage.blocks.length} blocos
                </p>
              </div>

              <div className="space-y-4">
                {selectedPage.blocks
                  .sort((a, b) => a.position - b.position)
                  .map(renderBlockEditor)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma página
                </h3>
                <p className="text-gray-600">
                  Escolha uma página na barra lateral para começar a editar
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}