import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Carrega variáveis de ambiente do Vite ou usa fallbacks para desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    process.env.SUPABASE_URL || 
                    'https://hcmrlpevcpkclqubnmmf.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                         process.env.SUPABASE_ANON_KEY || 
                         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

// URL base do site para links absolutos
const siteUrl = import.meta.env.VITE_SITE_URL || 
                process.env.SITE_URL || 
                'http://localhost:5173';

// Cloudflare API para purge de cache (opcional)
const cloudflareToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN || 
                         process.env.CLOUDFLARE_API_TOKEN || 
                         '';
const cloudflareZoneId = import.meta.env.VITE_CLOUDFLARE_ZONE_ID || 
                          process.env.CLOUDFLARE_ZONE_ID || 
                          '';

// Singleton para o cliente Supabase
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'itaicy-cms',
        },
      },
    });
  }
  return supabaseClient;
}

export const supabase = getSupabaseClient();

// Tipos para o CMS
export interface Page {
  id: string;
  slug: string;
  name: string;
  template: string;
  priority: number;
  created_at: string;
}

export interface Block {
  id: string;
  page_id: string;
  type: string;
  position: number;
  payload: Record<string, any>;
  published: Record<string, any> | null;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  content_md: string | null;
  published: boolean;
  created_at: string;
}

export interface GlobalSetting {
  id: string;
  key: string;
  value: Record<string, any>;
}

export interface MediaItem {
  id: string;
  path: string;
  alt: string | null;
  mime_type?: string;
  size?: number;
  width?: number;
  height?: number;
  caption?: string;
  created_at: string;
}

// Funções para o CMS
export class CMSService {
  /**
   * Obtém todas as páginas ordenadas por prioridade
   */
  static async getPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('priority', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtém uma página pelo slug com todos os seus blocos
   */
  static async getPageWithBlocks(slug: string): Promise<{ page: Page; blocks: Block[] } | null> {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pageError || !page) return null;

    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true });

    if (blocksError) throw blocksError;

    return { page, blocks: blocks || [] };
  }

  /**
   * Atualiza o payload de um bloco (versão draft)
   */
  static async updateBlock(blockId: string, payload: Record<string, any>): Promise<Block> {
    const { data: updatedBlock, error } = await supabase
      .from('blocks')
      .update({ 
        payload,
        updated_at: new Date().toISOString()
      })
      .eq('id', blockId)
      .select()
      .single();

    if (error) throw error;
    return updatedBlock;
  }

  /**
   * Publica um bloco (copia payload para published)
   */
  static async publishBlock(blockId: string): Promise<Block> {
    // Primeiro obtém o bloco atual para copiar o payload para published
    const { data: block, error: fetchError } = await supabase
      .from('blocks')
      .select('*')
      .eq('id', blockId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Atualiza o bloco copiando payload para published
    const { data: updatedBlock, error } = await supabase
      .from('blocks')
      .update({ 
        published: block.payload, // Copia o payload para published
        updated_at: new Date().toISOString()
      })
      .eq('id', blockId)
      .select()
      .single();

    if (error) throw error;
    
    // Purge cache se configurado
    const pageSlug = await this.getPageSlugByBlockId(blockId);
    if (pageSlug) {
      await this.purgeCache(pageSlug);
    }
    
    return updatedBlock;
  }

  /**
   * Publica todos os blocos de uma página
   */
  static async publishPage(pageId: string): Promise<void> {
    // Obtém a página para purge de cache
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', pageId)
      .single();
      
    if (pageError) throw pageError;
    
    // Obtém todos os blocos da página
    const { data: blocks, error: fetchError } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', pageId);

    if (fetchError) throw fetchError;

    // Publica cada bloco (copia payload para published)
    for (const block of blocks || []) {
      const { error } = await supabase
        .from('blocks')
        .update({ 
          published: block.payload, 
          updated_at: new Date().toISOString()
        })
        .eq('id', block.id);
        
      if (error) throw error;
    }
    
    // Purge cache
    if (page?.slug) {
      await this.purgeCache(page.slug);
    }
  }

  /**
   * Obtém o slug da página de um bloco
   */
  private static async getPageSlugByBlockId(blockId: string): Promise<string | null> {
    const { data: block, error: blockError } = await supabase
      .from('blocks')
      .select('page_id')
      .eq('id', blockId)
      .single();
      
    if (blockError) return null;
    
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', block.page_id)
      .single();
      
    if (pageError) return null;
    
    return page?.slug || null;
  }

  /**
   * Limpa o cache do Cloudflare para uma página
   */
  static async purgeCache(slug: string): Promise<boolean> {
    if (!cloudflareToken || !cloudflareZoneId) {
      console.log('Cloudflare não configurado. Pulando purge de cache.');
      return false;
    }
    
    try {
      const pageUrl = `${siteUrl}/${slug === 'home' ? '' : slug}`;
      
      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [pageUrl],
        }),
      });
      
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Erro ao purgar cache:', error);
      return false;
    }
  }

  /**
   * Atualiza a posição de um bloco
   */
  static async updateBlockPosition(blockId: string, position: number): Promise<void> {
    const { error } = await supabase
      .from('blocks')
      .update({ position, updated_at: new Date().toISOString() })
      .eq('id', blockId);

    if (error) throw error;
  }

  /**
   * Obtém uma página pelo slug
   */
  static async getPageBySlug(slug: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Obtém todas as configurações globais
   */
  static async getGlobalSettings(): Promise<GlobalSetting[]> {
    const { data, error } = await supabase
      .from('global_settings')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  /**
   * Atualiza ou cria uma configuração global
   */
  static async updateGlobalSetting(key: string, value: Record<string, any>): Promise<GlobalSetting> {
    const { data, error } = await supabase
      .from('global_settings')
      .upsert({ key, value })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtém todos os itens da biblioteca de mídia
   */
  static async getMediaLibrary(): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Faz upload de um arquivo para a biblioteca de mídia
   */
  static async uploadMedia(file: File): Promise<MediaItem> {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `uploads/${fileName}`;

    // Upload para o bucket
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obtém o tipo MIME e tamanho
    const mimeType = file.type;
    const size = file.size;

    // Salva metadados na biblioteca
    const { data, error } = await supabase
      .from('media_library')
      .insert({
        path: filePath,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        mime_type: mimeType,
        size: size
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtém a URL pública de um arquivo
   */
  static getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}
