import { useQuery } from '@tanstack/react-query';
import { CMSService, type Block } from '@/lib/supabase';

export function usePageContent(pageSlug: string) {
  return useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      const page = await CMSService.getPageBySlug(pageSlug);
      if (!page) {
        // Se a página não existe no CMS, retorna estrutura básica
        return {
          id: pageSlug,
          name: pageSlug === 'home' ? 'Página Inicial' : pageSlug,
          slug: pageSlug,
          template: 'default',
          blocks: []
        };
      }
      
      const pageWithBlocks = await CMSService.getPageWithBlocks(page.id);
      return {
        ...pageWithBlocks,
        blocks: pageWithBlocks.blocks.filter((block: Block) => block.published) // Apenas blocos publicados
      };
    },
    staleTime: 1000 * 60 * 1, // 1 minuto para forçar atualizações mais frequentes
    refetchOnWindowFocus: true
  });
}