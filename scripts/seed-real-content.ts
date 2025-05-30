#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { RealContentExtractor } from './extract-real-content.js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_ANON_KEY é necessária');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedRealContent() {
  console.log('🔍 Verificando se já existem dados...');
  
  // Verificar se já existem blocos
  const { data: existingBlocks, error: countError } = await supabase
    .from('blocks')
    .select('id', { count: 'exact' });
    
  if (countError) {
    console.error('Erro ao verificar blocos existentes:', countError);
    return;
  }

  if (existingBlocks && existingBlocks.length > 0) {
    console.log(`⚠️ Já existem ${existingBlocks.length} blocos. Pulando seed para preservar dados.`);
    return;
  }

  console.log('📦 Tabelas vazias. Iniciando seed com conteúdo real...');
  
  const extractor = new RealContentExtractor();
  const pages = extractor.extractAllPages();

  // Inserir páginas
  for (const pageData of pages) {
    console.log(`📄 Inserindo página: ${pageData.name}`);
    
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        slug: pageData.slug,
        name: pageData.name,
        template: pageData.template,
        priority: pages.indexOf(pageData)
      })
      .select()
      .single();

    if (pageError) {
      console.error(`Erro ao inserir página ${pageData.slug}:`, pageError);
      continue;
    }

    // Inserir blocos da página
    for (const blockData of pageData.blocks) {
      const { error: blockError } = await supabase
        .from('blocks')
        .insert({
          page_id: page.id,
          type: blockData.type,
          position: blockData.position,
          payload: blockData.data,
          published: blockData.published ? blockData.data : null
        });

      if (blockError) {
        console.error(`Erro ao inserir bloco ${blockData.type}:`, blockError);
      } else {
        console.log(`  ✅ Bloco ${blockData.type} inserido`);
      }
    }
  }

  // Inserir configurações globais se não existirem
  const globalSettings = [
    {
      key: 'header_logo',
      value: { url: '/logos/itaicy-wordmark-primary.png', alt: 'Itaicy Pantanal Eco Lodge' }
    },
    {
      key: 'footer_logo', 
      value: { url: '/logos/itaicy-wordmark-secondary.png', alt: 'Itaicy Pantanal Eco Lodge' }
    },
    {
      key: 'contact_phone',
      value: { number: '+55 65 99999-9999', display: '(65) 99999-9999' }
    },
    {
      key: 'contact_email',
      value: { address: 'contato@itaicy.com.br', display: 'contato@itaicy.com.br' }
    },
    {
      key: 'social_media',
      value: { instagram: '@itaicypantanal', facebook: 'itaicypantanal', youtube: 'itaicypantanal' }
    }
  ];

  for (const setting of globalSettings) {
    const { error } = await supabase
      .from('global_settings')
      .upsert(setting, { onConflict: 'key' });
      
    if (error) {
      console.error(`Erro ao inserir configuração ${setting.key}:`, error);
    }
  }

  console.log('✅ Seed concluído com dados reais!');
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRealContent().catch(console.error);
}

export { seedRealContent };