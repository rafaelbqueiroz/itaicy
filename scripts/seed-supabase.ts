#!/usr/bin/env tsx

/**
 * Script para popular o Supabase com conteúdo extraído
 * Carrega o export.json e insere no banco de dados
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface BlockData {
  type: string;
  position: number;
  payload: Record<string, any>;
}

interface PageData {
  slug: string;
  name: string;
  template: string;
  blocks: BlockData[];
}

interface MediaAsset {
  path: string;
  alt: string;
  originalPath: string;
}

interface ExportData {
  pages: PageData[];
  media: MediaAsset[];
  extractedAt: string;
}

class SupabaseSeeder {
  private supabase: any;

  constructor() {
    // Configuração direta para o projeto Supabase
    const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
    
    console.log('🔗 Conectando ao Supabase...');
    console.log(`URL: ${supabaseUrl}`);
    
    // Vou precisar da SUPABASE_ANON_KEY para conectar
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseKey) {
      throw new Error('SUPABASE_ANON_KEY é necessária para conectar ao CMS');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async loadExportData(): Promise<ExportData> {
    const exportPath = path.join(process.cwd(), 'seed/export.json');
    
    if (!fs.existsSync(exportPath)) {
      throw new Error(`Arquivo de export não encontrado: ${exportPath}\nExecute primeiro: npm run extract`);
    }

    const content = await fs.promises.readFile(exportPath, 'utf-8');
    return JSON.parse(content);
  }

  async seedPages(pages: PageData[]): Promise<void> {
    console.log('📄 Inserindo páginas...');

    for (const page of pages) {
      console.log(`  → ${page.name} (${page.slug})`);

      // Inserir página
      const { data: pageData, error: pageError } = await this.supabase
        .from('pages')
        .insert({
          slug: page.slug,
          name: page.name,
          template: page.template,
          priority: page.slug === 'home' ? 0 : 10
        })
        .select()
        .single();

      if (pageError) {
        console.error(`Erro ao inserir página ${page.slug}:`, pageError);
        continue;
      }

      // Inserir blocos
      for (const block of page.blocks) {
        const { error: blockError } = await this.supabase
          .from('blocks')
          .insert({
            page_id: pageData.id,
            type: block.type,
            position: block.position,
            payload: block.payload,
            published: block.payload // Publicar imediatamente
          });

        if (blockError) {
          console.error(`Erro ao inserir bloco ${block.type}:`, blockError);
        }
      }
    }
  }

  async seedMedia(media: MediaAsset[]): Promise<void> {
    console.log('🖼️ Inserindo mídia...');

    for (const asset of media) {
      console.log(`  → ${asset.path}`);

      const { error } = await this.supabase
        .from('media_library')
        .insert({
          path: asset.path,
          alt: asset.alt
        });

      if (error) {
        console.error(`Erro ao inserir mídia ${asset.path}:`, error);
      }
    }
  }

  async seedTestimonials(): Promise<void> {
    console.log('💬 Inserindo depoimentos...');

    const testimonials = [
      {
        author: 'Carlos Montenegro',
        city: 'São Paulo, SP',
        rating: 5,
        quote: 'O Itaicy superou todas as expectativas. A pesca foi incrível e a hospedagem, um verdadeiro refúgio no Pantanal.',
        is_featured: true
      },
      {
        author: 'Ana Carvalho',
        city: 'Rio de Janeiro, RJ',
        rating: 5,
        quote: 'Dormir ouvindo as araras e acordar com a vista do rio foi uma experiência transformadora.',
        is_featured: true
      },
      {
        author: 'Roberto Silva',
        city: 'Brasília, DF',
        rating: 5,
        quote: 'Guias experientes, comida maravilhosa e um atendimento que faz toda a diferença.',
        is_featured: false
      }
    ];

    for (const testimonial of testimonials) {
      const { error } = await this.supabase
        .from('testimonials')
        .insert(testimonial);

      if (error) {
        console.error('Erro ao inserir depoimento:', error);
      }
    }
  }

  async seedSuites(): Promise<void> {
    console.log('🏨 Inserindo suítes...');

    const suites = [
      {
        name: 'Suíte Compacta',
        capacity: 2,
        area_m2: 28,
        price: 800.00,
        description: 'Conforto essencial com vista para o rio e varanda privativa.'
      },
      {
        name: 'Suíte Ampla',
        capacity: 3,
        area_m2: 35,
        price: 1200.00,
        description: 'Espaço generoso com varanda ampliada e vista privilegiada.'
      },
      {
        name: 'Suíte Master',
        capacity: 4,
        area_m2: 45,
        price: 1800.00,
        description: 'Nossa suíte mais exclusiva com varanda panorâmica e comodidades premium.'
      }
    ];

    for (const suite of suites) {
      const { error } = await this.supabase
        .from('suites')
        .insert(suite);

      if (error) {
        console.error('Erro ao inserir suíte:', error);
      }
    }
  }

  async runSeed(): Promise<void> {
    try {
      console.log('🚀 Iniciando seed do Supabase...');

      // Carregar dados exportados
      const exportData = await this.loadExportData();
      console.log(`📦 Carregados: ${exportData.pages.length} páginas, ${exportData.media.length} mídia`);

      // Limpar dados existentes (cuidado em produção!)
      console.log('🧹 Limpando dados existentes...');
      await this.supabase.from('blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('pages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('media_library').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('suites').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Inserir dados
      await this.seedPages(exportData.pages);
      await this.seedMedia(exportData.media);
      await this.seedTestimonials();
      await this.seedSuites();

      console.log('✅ Seed concluído com sucesso!');
      console.log('🎯 O CMS agora pode ser acessado com todo o conteúdo carregado');

    } catch (error) {
      console.error('❌ Erro durante o seed:', error);
      process.exit(1);
    }
  }
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const seeder = new SupabaseSeeder();
  seeder.runSeed().catch(console.error);
}

export { SupabaseSeeder };