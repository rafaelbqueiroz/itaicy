import { useQuery } from '@tanstack/react-query';
import { CMSService } from '@/lib/supabase';

// Hook para carregar dados de uma página do CMS
export function useCMSPage(slug: string) {
  return useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      const pages = await CMSService.getPages();
      const page = pages.find(p => p.slug === slug);
      
      if (!page) {
        throw new Error(`Página '${slug}' não encontrada`);
      }

      const pageWithBlocks = await CMSService.getPageWithBlocks(page.id);
      return pageWithBlocks;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para carregar apenas blocos publicados de uma página
export function usePublishedBlocks(slug: string) {
  return useQuery({
    queryKey: ['published-blocks', slug],
    queryFn: async () => {
      const pages = await CMSService.getPages();
      const page = pages.find(p => p.slug === slug);
      
      if (!page) {
        return [];
      }

      const pageWithBlocks = await CMSService.getPageWithBlocks(page.id);
      // Filtrar apenas blocos publicados e ordenar por posição
      return pageWithBlocks?.blocks
        .filter(block => Boolean(block.published))
        .sort((a, b) => a.position - b.position) || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para carregar configurações globais do site
export function useGlobalSettings() {
  return useQuery({
    queryKey: ['global-settings'],
    queryFn: () => CMSService.getGlobalSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}