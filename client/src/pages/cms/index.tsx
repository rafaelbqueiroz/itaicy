import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LocalCMSService as CMSService, type Page, type Block } from '@/lib/cms-local';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Eye, Save, RotateCcw } from 'lucide-react';

export default function CMSPage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todas as páginas
  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ['cms-pages'],
    queryFn: CMSService.getPages,
  });

  // Buscar blocos da página selecionada
  const { data: pageWithBlocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['cms-page-blocks', selectedPage?.slug],
    queryFn: () => selectedPage ? CMSService.getPageWithBlocks(selectedPage.slug) : null,
    enabled: !!selectedPage,
  });

  // Mutação para atualizar bloco
  const updateBlockMutation = useMutation({
    mutationFn: ({ blockId, payload }: { blockId: string; payload: Record<string, any> }) =>
      CMSService.updateBlock(blockId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-page-blocks'] });
      setEditingBlock(null);
      setEditedContent({});
      toast({ title: 'Bloco atualizado com sucesso!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao atualizar bloco',
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Mutação para publicar bloco
  const publishBlockMutation = useMutation({
    mutationFn: (blockId: string) => CMSService.publishBlock(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-page-blocks'] });
      toast({ title: 'Bloco publicado com sucesso!' });
    },
  });

  // Mutação para publicar página completa
  const publishPageMutation = useMutation({
    mutationFn: (pageId: string) => CMSService.publishPage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-page-blocks'] });
      toast({ title: 'Página publicada com sucesso!' });
    },
  });

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block.id);
    setEditedContent(block.payload);
  };

  const handleSaveBlock = (blockId: string) => {
    updateBlockMutation.mutate({ blockId, payload: editedContent });
  };

  const handleCancelEdit = () => {
    setEditingBlock(null);
    setEditedContent({});
  };

  const renderBlockEditor = (block: Block) => {
    const isEditing = editingBlock === block.id;
    const content = isEditing ? editedContent : block.payload;

    return (
      <Card key={block.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{block.type}</CardTitle>
              <CardDescription>Posição: {block.position}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={block.published ? 'default' : 'secondary'}>
                {block.published ? 'Publicado' : 'Rascunho'}
              </Badge>
              {isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleSaveBlock(block.id)}
                    disabled={updateBlockMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => handleEditBlock(block)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => publishBlockMutation.mutate(block.id)}
                    disabled={publishBlockMutation.isPending}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Publicar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderBlockContent(block, content, isEditing)}
        </CardContent>
      </Card>
    );
  };

  const renderBlockContent = (block: Block, content: any, isEditing: boolean) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título Principal</Label>
              {isEditing ? (
                <Input
                  value={content.title || ''}
                  onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                />
              ) : (
                <p className="mt-1 font-semibold">{content.title}</p>
              )}
            </div>
            <div>
              <Label>Subtítulo</Label>
              {isEditing ? (
                <Textarea
                  value={content.subtitle || ''}
                  onChange={(e) => setEditedContent({...editedContent, subtitle: e.target.value})}
                />
              ) : (
                <p className="mt-1">{content.subtitle}</p>
              )}
            </div>
            {content.cta && (
              <div>
                <Label>Chamada para Ação</Label>
                {isEditing ? (
                  <Input
                    value={content.cta || ''}
                    onChange={(e) => setEditedContent({...editedContent, cta: e.target.value})}
                  />
                ) : (
                  <p className="mt-1 text-blue-600">{content.cta}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div>
            <Label>Conteúdo</Label>
            {isEditing ? (
              <Textarea
                value={content.content || ''}
                onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
                rows={6}
              />
            ) : (
              <p className="mt-1 whitespace-pre-wrap">{content.content}</p>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            {content.items?.map((item: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-green-600">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div>
            <Label>Dados JSON</Label>
            {isEditing ? (
              <Textarea
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditedContent(parsed);
                  } catch {}
                }}
                rows={10}
                className="font-mono text-sm"
              />
            ) : (
              <pre className="mt-1 text-sm bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            )}
          </div>
        );
    }
  };

  if (pagesLoading) {
    return <div className="p-8">Carregando páginas...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CMS - Itaicy Pantanal Eco Lodge</h1>
        <p className="text-gray-600">Gerencie o conteúdo do website</p>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Páginas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Páginas</CardTitle>
                  <CardDescription>Selecione uma página para editar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pages.map((page) => (
                    <Button
                      key={page.id}
                      variant={selectedPage?.id === page.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedPage(page)}
                    >
                      {page.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Editor de Blocos */}
            <div className="lg:col-span-2">
              {selectedPage ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{selectedPage.name}</h2>
                    <Button
                      onClick={() => publishPageMutation.mutate(selectedPage.id)}
                      disabled={publishPageMutation.isPending}
                    >
                      Publicar Página Completa
                    </Button>
                  </div>

                  {blocksLoading ? (
                    <div>Carregando blocos...</div>
                  ) : pageWithBlocks?.blocks.length ? (
                    <div>
                      {pageWithBlocks.blocks.map(renderBlockEditor)}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500">
                          Nenhum bloco encontrado para esta página
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">
                      Selecione uma página para começar a editar
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Mídia</CardTitle>
              <CardDescription>Gerencie imagens e vídeos do site</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Funcionalidade de mídia em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>Configurações gerais do website</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Configurações em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}