#!/usr/bin/env zx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('🔍 Debugando dados do CMS...');

// Verificar todas as páginas
const { data: allPages, error: pagesError } = await supabase
  .from('pages')
  .select('*')
  .order('priority');

if (pagesError) {
  console.error('❌ Erro ao buscar páginas:', pagesError.message);
  process.exit(1);
}

console.log(`📄 Total de páginas: ${allPages.length}`);
allPages.forEach((page, index) => {
  console.log(`${index + 1}. ${page.name} (${page.slug}) - ID: ${page.id}`);
});

// Verificar blocos da home específicamente
const homePage = allPages.find(p => p.slug === 'home');
if (homePage) {
  console.log(`\n🔍 Verificando blocos da página "${homePage.name}" (ID: ${homePage.id}):`);
  
  const { data: homeBlocks, error: blocksError } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', homePage.id)
    .order('position');

  if (blocksError) {
    console.error('❌ Erro ao buscar blocos:', blocksError.message);
  } else {
    console.log(`📦 Total de blocos: ${homeBlocks.length}`);
    homeBlocks.forEach((block, index) => {
      console.log(`\n--- Bloco ${index + 1} ---`);
      console.log(`Tipo: ${block.type}`);
      console.log(`Posição: ${block.position}`);
      console.log(`Publicado: ${block.published}`);
      
      if (block.payload?.title) {
        console.log(`Título: ${block.payload.title}`);
      }
      if (block.payload?.subtitle) {
        console.log(`Subtítulo: ${block.payload.subtitle}`);
      }
      if (block.payload?.content) {
        console.log(`Conteúdo: ${block.payload.content.substring(0, 100)}...`);
      }
    });
  }
}

// Verificar se existem duplicatas ou dados conflitantes
console.log('\n🔍 Verificando possíveis duplicatas...');
const slugCounts = {};
allPages.forEach(page => {
  slugCounts[page.slug] = (slugCounts[page.slug] || 0) + 1;
});

const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
if (duplicates.length > 0) {
  console.log('⚠️ Páginas duplicadas encontradas:');
  duplicates.forEach(([slug, count]) => {
    console.log(`  ${slug}: ${count} ocorrências`);
  });
} else {
  console.log('✅ Nenhuma duplicata encontrada');
}