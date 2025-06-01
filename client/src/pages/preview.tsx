import React, { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase, CMSService, Page, Block } from '@/lib/supabase';
import { BlockRenderer } from '@/components/cms/BlockRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Eye } from 'lucide-react';

// Componente para exibir uma mensagem de erro
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Erro</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Componente para exibir um loading state
const LoadingState: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
    <Skeleton className="h-16 w-3/4 mx-auto" />
    <Skeleton className="h-8 w-1/2 mx-auto" />
    <div className="space-y-12 mt-12">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

// Componente para mostrar uma barra de preview
const PreviewBar: React.FC<{ isDraftMode: boolean; pageSlug: string }> = ({ isDraftMode, pageSlug }) => (
  <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white z-50 p-2 flex items-center justify-between">
    <div className="flex items-center">
      <Eye className="h-4 w-4 mr-2" />
      <span>
        {isDraftMode ? 'Visualizando rascunho' : 'Visualizando versão publicada'}: <strong>{pageSlug}</strong>
      </span>
    </div>
    <div className="text-xs">
      As alterações aparecem em tempo real
    </div>
  </div>
);

// Componente principal de Preview
const Preview: React.FC = () => {
  // Captura o slug da URL
  const [match, params] = useRoute<{ slug?: string }>('/preview/:slug');
  const [, navigate] = useLocation();
  
  // Estados
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDraftMode, setIsDraftMode] = useState(true);
  
  // Obtém o token da URL (para cache busting)
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const draftMode = searchParams.get('draft') !== 'false';
  
  // Carrega a página e seus blocos
  useEffect(() => {
    const loadPageData = async () => {
      if (!match || !params.slug) {
        setError('URL inválida');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      setIsDraftMode(draftMode);
      
      try {
        const pageData = await CMSService.getPageWithBlocks(params.slug);
        
        if (!pageData) {
          setError(`Página "${params.slug}" não encontrada`);
          setLoading(false);
          return;
        }
        
        setPage(pageData.page);
        
        // Processa os blocos para mostrar draft ou published
        const processedBlocks = pageData.blocks.map(block => ({
          ...block,
          // Se estiver em modo draft, usa payload, senão usa published (ou payload se published for null)
          payload: draftMode ? block.payload : (block.published || block.payload)
        }));
        
        setBlocks(processedBlocks);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados da página:', error);
        setError('Não foi possível carregar a página. Tente novamente.');
        setLoading(false);
      }
    };
    
    loadPageData();
  }, [match, params.slug, draftMode]);
  
  // Inscreve-se no canal Realtime para atualizações em tempo real
  useEffect(() => {
    if (!page) return;
    
    // Cria canal para escutar atualizações nos blocos
    const channel = supabase
      .channel(`blocks-${page.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'blocks',
        filter: `page_id=eq.${page.id}`
      }, (payload) => {
        // Atualiza o bloco modificado
        setBlocks(currentBlocks => {
          return currentBlocks.map(block => {
            if (block.id === payload.new.id) {
              return {
                ...block,
                // Se estiver em modo draft, usa payload, senão usa published
                payload: draftMode ? payload.new.payload : (payload.new.published || payload.new.payload),
                published: payload.new.published,
                updated_at: payload.new.updated_at
              };
            }
            return block;
          });
        });
      })
      .subscribe();
    
    // Limpa a inscrição quando o componente é desmontado
    return () => {
      supabase.removeChannel(channel);
    };
  }, [page, draftMode]);
  
  // Renderiza estado de loading
  if (loading) {
    return <LoadingState />;
  }
  
  // Renderiza mensagem de erro
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  // Renderiza a página
  return (
    <div className="min-h-screen">
      {/* Barra de preview */}
      <PreviewBar isDraftMode={isDraftMode} pageSlug={params.slug || ''} />
      
      {/* Espaço para a barra de preview */}
      <div className="pt-10"></div>
      
      {/* Renderiza os blocos */}
      <div className="preview-content">
        {blocks
          .sort((a, b) => a.position - b.position)
          .map(block => (
            <BlockRenderer 
              key={block.id} 
              block={block}
              isPreview={true}
            />
          ))}
      </div>
    </div>
  );
};

export default Preview;
