import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CMSService, type Page, type Block } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Eye, ExternalLink } from 'lucide-react';
import BlockForm from '@/components/cms/BlockForm';

export default function CMSPage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
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

  const handleSaveBlock = (blockId: string, payload: Record<string, any>) => {
    updateBlockMutation.mutate({ blockId, payload });
  };

  const renderBlockCard = (block: Block) => {
    const isEditing = editingBlock === block.id;

    if (isEditing) {
      return (
        <BlockForm
          key={block.id}
          block={block}
          onSave={(data) => handleSaveBlock(block.id, data)}
          onCancel={() => setEditingBlock(null)}
          isLoading={updateBlockMutation.isPending}
        />
      );
    }

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
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setEditingBlock(block.id)}
              >
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {block.type === 'hero-video' && (
              <div>
                <p><strong>Título:</strong> {block.payload?.title}</p>
                <p><strong>Subtítulo:</strong> {block.payload?.subtitle}</p>
              </div>
            )}
            {block.type === 'split-block' && (
              <div>
                <p><strong>Título:</strong> {block.payload?.title}</p>
                <p><strong>Pontos:</strong> {block.payload?.bullets?.length || 0} itens</p>
              </div>
            )}
            {block.type === 'stats-grid' && (
              <div>
                <p><strong>Estatísticas:</strong> {block.payload?.stats?.length || 0} itens</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
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
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPage.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          Template: {selectedPage.template}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${selectedPage.slug === 'home' ? '' : selectedPage.slug}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Ver Página
                        </Button>
                      </div>
                    </div>
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
                      {pageWithBlocks.blocks.map(renderBlockCard)}
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
              <p className="text-gray-500">Biblioteca de mídia será implementada</p>
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
              <p className="text-gray-500">Configurações globais serão implementadas</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}