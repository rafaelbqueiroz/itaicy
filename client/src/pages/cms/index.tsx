import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CMSService, type Page, type Block } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Eye, ExternalLink } from 'lucide-react';
import { FormGenerator } from '@/cms/components/FormGenerator';
import { validateBlockPayload, type BlockType } from '@/cms/schemas';
import { CMSLayout, SidebarTree } from '@/cms/components/CMSLayout';
import { DraggableBlockList } from '@/cms/components/DraggableBlockList';
import { LivePreview, usePreviewMode } from '@/cms/components/LivePreview';
import { MediaLibrary } from '@/cms/components/MediaLibrary';

export default function CMSPage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'media'>('editor');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isPreviewMode, previewToken, enablePreview, disablePreview } = usePreviewMode();

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

  // Mutação para reordenar blocos
  const reorderBlocksMutation = useMutation({
    mutationFn: async (blocks: Block[]) => {
      const updates = blocks.map(block => 
        CMSService.updateBlockPosition(block.id, block.position)
      );
      await Promise.all(updates);
      return blocks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-page-blocks'] });
      toast({ title: 'Ordem dos blocos atualizada!' });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao reordenar blocos',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSaveBlock = (blockId: string, blockType: string, payload: Record<string, any>) => {
    // Validar payload antes de salvar
    const validation = validateBlockPayload(blockType as BlockType, payload);
    
    if (!validation.success) {
      toast({
        title: 'Dados inválidos',
        description: 'Verifique os campos obrigatórios e tente novamente.',
        variant: 'destructive'
      });
      return;
    }
    
    updateBlockMutation.mutate({ blockId, payload: validation.data });
  };

  const handleReorderBlocks = (reorderedBlocks: Block[]) => {
    reorderBlocksMutation.mutate(reorderedBlocks);
  };

  const handlePreview = () => {
    if (isPreviewMode) {
      disablePreview();
      setActiveTab('editor');
    } else {
      enablePreview();
      setActiveTab('preview');
    }
  };

  const handleUndo = () => {
    // Implementar funcionalidade de desfazer
    toast({ title: 'Desfazer não implementado ainda' });
  };

  const handlePublishPage = () => {
    if (selectedPage) {
      publishPageMutation.mutate(selectedPage.id);
    }
  };

  const renderBlockCard = (block: Block) => {
    const isEditing = editingBlock === block.id;

    if (isEditing) {
      return (
        <FormGenerator
          key={block.id}
          blockType={block.type as BlockType}
          initialData={block.payload || {}}
          onSave={(data) => handleSaveBlock(block.id, block.type, data)}
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

  // Sidebar content
  const sidebarContent = (
    <SidebarTree
      pages={pages.map(page => ({
        id: page.id,
        name: page.name,
        slug: page.slug,
        hasChanges: false // TODO: implement draft detection
      }))}
      selectedPageId={selectedPage?.id}
      onPageSelect={(pageId) => {
        const page = pages.find(p => p.id === pageId);
        if (page) setSelectedPage(page);
      }}
    />
  );

  // Main content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'preview':
        return selectedPage ? (
          <div className="h-full p-6">
            <LivePreview 
              pageSlug={selectedPage.slug}
              previewToken={previewToken}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione uma página para visualizar</p>
          </div>
        );

      case 'media':
        return (
          <div className="h-full p-6">
            <MediaLibrary />
          </div>
        );

      default: // 'editor'
        return selectedPage ? (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{selectedPage.name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Template: {selectedPage.template}
                </Badge>
              </div>
            </div>

            {blocksLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando blocos...</p>
              </div>
            ) : pageWithBlocks?.blocks.length ? (
              <DraggableBlockList
                blocks={pageWithBlocks.blocks}
                onReorder={handleReorderBlocks}
                renderBlock={renderBlockCard}
              />
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bem-vindo ao CMS
              </h3>
              <p className="text-gray-500 mb-4">
                Selecione uma página na barra lateral para começar a editar
              </p>
              <Button onClick={() => setActiveTab('media')} variant="outline">
                Explorar Biblioteca de Mídia
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <CMSLayout
      sidebar={sidebarContent}
      onPreview={handlePreview}
      onUndo={handleUndo}
      onPublish={handlePublishPage}
      canUndo={false}
      isPublishing={publishPageMutation.isPending}
      selectedPageName={selectedPage?.name}
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
        <div className="border-b bg-white px-6 py-3">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="editor" className="h-full m-0">
          {renderMainContent()}
        </TabsContent>
        
        <TabsContent value="preview" className="h-full m-0">
          {renderMainContent()}
        </TabsContent>
        
        <TabsContent value="media" className="h-full m-0">
          {renderMainContent()}
        </TabsContent>
      </Tabs>
    </CMSLayout>
  );
}