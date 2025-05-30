#!/usr/bin/env tsx

/**
 * Script para criar tabelas do CMS no Supabase
 */

import { createClient } from '@supabase/supabase-js';

class DatabaseSetup {
  private supabase: any;

  constructor() {
    const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseKey) {
      throw new Error('SUPABASE_ANON_KEY é necessária');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createTables(): Promise<void> {
    console.log('🔧 Criando tabelas do CMS...');

    // SQL para criar todas as tabelas
    const createTablesSQL = `
      -- Páginas publicáveis
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        template TEXT NOT NULL DEFAULT 'default',
        priority INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Blocos flexíveis (draft / published)
      CREATE TABLE IF NOT EXISTS blocks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        position INTEGER NOT NULL,
        payload JSONB NOT NULL,
        published JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(page_id, position)
      );

      -- Mídia (metadados)
      CREATE TABLE IF NOT EXISTS media_library (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        path TEXT NOT NULL,
        alt TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Suítes (inventário específico)
      CREATE TABLE IF NOT EXISTS suites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        capacity INTEGER,
        area_m2 INTEGER,
        price NUMERIC(10,2),
        description TEXT,
        images UUID[]
      );

      -- Testemunhos
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author TEXT,
        city TEXT,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        quote TEXT,
        is_featured BOOLEAN DEFAULT FALSE
      );
    `;

    try {
      const { error } = await this.supabase.rpc('exec_sql', { sql: createTablesSQL });
      
      if (error) {
        console.error('Erro ao criar tabelas:', error);
        throw error;
      }

      console.log('✅ Tabelas criadas com sucesso!');
    } catch (error) {
      console.error('❌ Erro durante criação das tabelas:', error);
      throw error;
    }
  }

  async setup(): Promise<void> {
    console.log('🚀 Configurando banco de dados do CMS...');
    
    try {
      await this.createTables();
      console.log('✅ Setup do banco concluído!');
    } catch (error) {
      console.error('❌ Falha no setup:', error);
      process.exit(1);
    }
  }
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new DatabaseSetup();
  setup.setup().catch(console.error);
}

export { DatabaseSetup };