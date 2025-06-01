import React, { useEffect, useState } from 'react';
import { useLocation, useRoute, useRouter } from 'wouter';
import { supabase, CMSService, Page, Block } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Home, 
  Eye, 
  Save, 
  Upload, 
  LogOut,
  Settings,
  Image,
  AlertCircle
} from 'lucide-react';
import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';
import { BlockForm } from '@/components/cms/BlockForm';
import { BlockRenderer } from '@/components/cms/BlockRenderer';

// Definição do store Zustand para o CMS
interface CMSStore {
  pages: Page[];
  currentPage: Page | null;
  blocks: Block[];
  selectedBlockId: string | null;
  isPreviewMode: boolean;
  isDirty: boolean;
  isLoading: boolean;
  fetchPages: () => Promise<void>;
  fetchPageBlocks: (slug: string) => Promise<void>;
  selectBlock: (blockId: string | null) => void;
  updateBlockPayload: (blockId: string, payload: Record<string, any>) => Promise<void>;
  publishBlock: (blockId: string) => Promise<void>;
  publishPage: () => Promise<void>;
  togglePreviewMode: () => void;
  reorderBlocks: (blockId: string, newPosition: number) => Promise<void>;
}

const useCMSStore = create<CMSStore>((set, get) => ({
  pages: [],
  currentPage: null,
  blocks: [],
  selectedBlockId: null,
  isPreviewMode: false,
  isDirty: false,
  isLoading: false,
  
  fetchPages: async () => {
    set({ isLoading: true });
    try {
      const pages = await CMSService.getPages();
      set({ pages, isLoading: false });
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as páginas',
        variant: 'destructive'
      });
      set({ isLoading: false });
    }
  },
  
  fetchPageBlocks: async (slug: string) => {
    set({ isLoading: true, selectedBlockId: null });
    try {
      const pageData = await CMSService.getPageWithBlocks(slug);
      if (pageData) {
        set({ 
          currentPage: pageData.page, 
          blocks: pageData.blocks,
          isLoading: false,
          isDirty: false
        });
      } else {
        set({ currentPage: null, blocks: [], isLoading: false });
        toast({
          title: 'Página não encontrada',
          description: `A página "${slug}" não existe`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching page blocks:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os blocos da página',
        variant: 'destructive'
      });
      set({ isLoading: false });
    }
  },
  
  selectBlock: (blockId: string | null) => {
    set({ selectedBlockId: blockId });
  },
  
  updateBlockPayload: async (blockId: string, payload: Record<string, any>) => {
    try {
      const blocks = get().blocks;
      const blockIndex = blocks.findIndex(b => b.id === blockId);
      
      if (blockIndex === -1) return;
      
      // Atualiza localmente primeiro (otimista)
      const updatedBlocks = [...blocks];
      updatedBlocks[blockIndex] = {
        ...updatedBlocks[blockIndex],
        payload,
        updated_at: new Date().toISOString()
      };
      
      set({ blocks: updatedBlocks, isDirty: true });
      
      // Atualiza no servidor
      await CMSService.updateBlock(blockId, payload);
      
      toast({
        title: 'Sucesso',
        description: 'Bloco atualizado com sucesso',
      });
    } catch (error) {
      console.error('Error updating block:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o bloco',
        variant: 'destructive'
      });
    }
  },
  
  publishBlock: async (blockId: string) => {
    try {
      const blocks = get().blocks;
      const blockIndex = blocks.findIndex(b => b.id === blockId);
      
      if (blockIndex === -1) return;
      
      // Publica o bloco (copia payload para published)
      const block = blocks[blockIndex];
      const updatedBlock = await CMSService.updateBlock(blockId, {
        ...block.payload,
        published: block.payload
      });
      
      // Atualiza localmente
      const updatedBlocks = [...blocks];
      updatedBlocks[blockIndex] = updatedBlock;
      
      set({ blocks: updatedBlocks, isDirty: false });
      
      toast({
        title: 'Sucesso',
        description: 'Bloco publicado com sucesso',
      });
    } catch (error) {
      console.error('Error publishing block:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível publicar o bloco',
        variant: 'destructive'
      });
    }
  },
  
  publishPage: async () => {
    const { currentPage, blocks } = get();
    if (!currentPage) return;
    
    try {
      set({ isLoading: true });
      
      // Publica todos os blocos da página
      await CMSService.publishPage(currentPage.id);
      
      // Atualiza blocos localmente
      const updatedBlocks = blocks.map(block => ({
        ...block,
        published: block.payload
      }));
      
      set({ blocks: updatedBlocks, isDirty: false, isLoading: false });
      
      toast({
        title: 'Sucesso',
        description: 'Página publicada com sucesso',
      });
    } catch (error) {
      console.error('Error publishing page:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível publicar a página',
        variant: 'destructive'
      });
      set({ isLoading: false });
    }
  },
  
  togglePreviewMode: () => {
    set(state => ({ isPreviewMode: !state.isPreviewMode }));
  },
  
  reorderBlocks: async (blockId: string, newPosition: number) => {
    const { blocks, currentPage } = get();
    if (!currentPage) return;
    
    try {
      // Reordena localmente primeiro
      const blocksCopy = [...blocks];
      const blockIndex = blocksCopy.findIndex(b => b.id === blockId);
      
      if (blockIndex === -1) return;
      
      const block = blocksCopy[blockIndex];
      blocksCopy.splice(blockIndex, 1);
      blocksCopy.splice(newPosition - 1, 0, block);
      
      // Atualiza posições
      const updatedBlocks = blocksCopy.map((b, idx) => ({
        ...b,
        position: idx + 1
      }));
      
      set({ blocks: updatedBlocks, isDirty: true });
      
      // Atualiza no servidor
      await CMSService.updateBlockPosition(blockId, newPosition);
    } catch (error) {
      console.error('Error reordering blocks:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reordenar os blocos',
        variant: 'destructive'
      });
    }
  }
}));

// Componente de Sidebar com tree de páginas
const Sidebar: React.FC = () => {
  const { pages, currentPage, fetchPages } = useCMSStore();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);
  
  return (
    <div className="w-64 border-r h-[calc(100vh-64px)] bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Páginas</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-2">
          {pages.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              Nenhuma página encontrada
            </div>
          ) : (
            <ul className="space-y-1">
              {pages
                .sort((a, b) => a.priority - b.priority)
                .map(page => (
                  <li key={page.id}>
                    <Button
                      variant={currentPage?.id === page.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => navigate(`/cms/${page.slug}`)}
                    >
                      {page.slug === 'home' ? (
                        <Home className="mr-2 h-4 w-4" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      {page.name}
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/cms/media')}
        >
          <Image className="mr-2 h-4 w-4" />
          Biblioteca de Mídia
        </Button>
      </div>
    </div>
  );
};

// Componente de Preview
const Preview: React.FC = () => {
  const { currentPage } = useCMSStore();
  
  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Selecione uma página para visualizar</p>
      </div>
    );
  }
  
  // URL para preview da página atual
  const previewUrl = `/preview/${currentPage.slug}?token=${Date.now()}`;
  
  return (
    <div className="h-full w-full">
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title={`Preview de ${currentPage.name}`}
      />
    </div>
  );
};

// Componente de lista de blocos
const BlockList: React.FC = () => {
  const { blocks, selectedBlockId, selectBlock, isLoading } = useCMSStore();
  
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          Esta página não possui blocos
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 p-4">
      {blocks
        .sort((a, b) => a.position - b.position)
        .map(block => (
          <div
            key={block.id}
            className={`border rounded-md p-4 cursor-pointer transition-colors ${
              selectedBlockId === block.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'
            }`}
            onClick={() => selectBlock(block.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="font-medium capitalize">
                  {block.type.replace(/-/g, ' ')}
                </div>
                {block.payload !== block.published && (
                  <div className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                    Não publicado
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Posição: {block.position}
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground truncate">
              {block.payload.title || block.payload.subtitle || 'Sem título'}
            </div>
          </div>
        ))}
    </div>
  );
};

// Componente principal do CMS Admin
const CMSAdmin: React.FC = () => {
  const [match, params] = useRoute<{ slug?: string }>('/cms/:slug?');
  const [, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    fetchPageBlocks,
    currentPage,
    selectedBlockId,
    blocks,
    isPreviewMode,
    isDirty,
    togglePreviewMode,
    publishPage,
    selectBlock
  } = useCMSStore();
  
  // Verifica autenticação e permissões
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/cms/login');
        return;
      }
      
      // Verifica se o usuário tem role de admin
      const { data: userRoleData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (error || !userRoleData || userRoleData.role !== 'admin') {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar o CMS',
          variant: 'destructive'
        });
        await supabase.auth.signOut();
        navigate('/cms/login');
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  // Carrega blocos da página atual
  useEffect(() => {
    if (match && params.slug) {
      fetchPageBlocks(params.slug);
    } else if (match) {
      // Redireciona para home se nenhuma página for especificada
      navigate('/cms/home');
    }
  }, [match, params.slug, fetchPageBlocks, navigate]);
  
  // Manipula logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/cms/login');
  };
  
  // Exibe loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
      </div>
    );
  }
  
  // Obtém o bloco selecionado
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Itaicy CMS</h1>
          {currentPage && (
            <div className="ml-4 text-muted-foreground">
              Editando: <span className="font-medium">{currentPage.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {currentPage && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreviewMode}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Editar' : 'Preview'}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={publishPage}
                disabled={!isDirty}
              >
                <Upload className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 h-[calc(100vh-64px)]">
          {isPreviewMode ? (
            <Preview />
          ) : (
            <div className="grid grid-cols-[300px_1fr] h-full">
              {/* Sidebar de blocos */}
              <div className="border-r overflow-auto">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Blocos</h2>
                </div>
                <BlockList />
              </div>
              
              {/* Área de edição */}
              <div className="overflow-auto">
                {selectedBlock ? (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 capitalize">
                      Editar {selectedBlock.type.replace(/-/g, ' ')}
                    </h2>
                    <BlockForm 
                      block={selectedBlock}
                      onSave={(payload) => {
                        useCMSStore.getState().updateBlockPayload(selectedBlock.id, payload);
                      }}
                      onPublish={() => {
                        useCMSStore.getState().publishBlock(selectedBlock.id);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="bg-muted rounded-full p-3 inline-block mb-4">
                        <ChevronLeft className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">Selecione um bloco</h3>
                      <p className="text-sm text-muted-foreground">
                        Escolha um bloco na lista para editar seu conteúdo
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CMSAdmin;
