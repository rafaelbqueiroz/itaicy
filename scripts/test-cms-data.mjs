#!/usr/bin/env zx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('🔍 Testando dados do CMS...');

// Verificar páginas
const { data: pages, error: pagesError } = await supabase
  .from('pages')
  .select('*')
  .order('priority');

if (pagesError) {
  console.error('❌ Erro ao buscar páginas:', pagesError.message);
} else {
  console.log('📄 Páginas encontradas:');
  pages.forEach(page => {
    console.log(`  - ${page.name} (${page.slug})`);
  });
}

// Verificar blocos da home
if (pages && pages.length > 0) {
  const homePage = pages.find(p => p.slug === 'home');
  if (homePage) {
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', homePage.id)
      .order('position');

    if (blocksError) {
      console.error('❌ Erro ao buscar blocos:', blocksError.message);
    } else {
      console.log(`📦 Blocos da página "${homePage.name}":`);
      blocks.forEach(block => {
        console.log(`  - ${block.type} (pos: ${block.position})`);
        if (block.payload?.title) {
          console.log(`    Título: ${block.payload.title}`);
        }
      });
    }
  }
}