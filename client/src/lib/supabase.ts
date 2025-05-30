import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface MediaItem {
  id: string;
  path: string;
  alt: string | null;
  created_at: string;
}

// Funções para o CMS
export class CMSService {
  static async getPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('priority', { ascending: true });

    if (error) throw error;
    return data || [];
  }

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

  static async updateBlock(blockId: string, payload: Record<string, any>): Promise<Block> {
    const { data, error } = await supabase
      .from('blocks')
      .update({ 
        payload,
        updated_at: new Date().toISOString()
      })
      .eq('id', blockId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async publishBlock(blockId: string): Promise<Block> {
    // Copia o payload para published
    const { data: block, error: fetchError } = await supabase
      .from('blocks')
      .select('*')
      .eq('id', blockId)
      .single();

    if (fetchError || !block) throw fetchError;

    const { data, error } = await supabase
      .from('blocks')
      .update({ 
        published: block.payload,
        updated_at: new Date().toISOString()
      })
      .eq('id', blockId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async publishPage(pageId: string): Promise<void> {
    // Publica todos os blocos da página
    const { data: blocks, error: fetchError } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', pageId);

    if (fetchError) throw fetchError;

    for (const block of blocks || []) {
      await this.publishBlock(block.id);
    }
  }

  static async getMediaLibrary(): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async uploadMedia(file: File): Promise<MediaItem> {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `media/${fileName}`;

    // Upload para o bucket
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Salva metadados na biblioteca
    const { data, error } = await supabase
      .from('media_library')
      .insert({
        path: filePath,
        alt: file.name.replace(/\.[^/.]+$/, "")
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}