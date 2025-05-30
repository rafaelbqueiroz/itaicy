#!/usr/bin/env zx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('🧹 Limpando dados antigos e inserindo apenas dados reais...');

// Limpar todas as tabelas
async function cleanTables() {
  console.log('🗑️ Removendo dados antigos...');
  
  const tables = ['blocks', 'pages', 'media_library', 'suites', 'testimonials'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', 0);
    if (error) {
      console.error(`❌ Erro ao limpar ${table}:`, error.message);
    } else {
      console.log(`✅ ${table}: limpa`);
    }
  }
}

// Inserir dados reais extraídos
async function insertRealData() {
  console.log('📥 Inserindo dados reais extraídos...');
  
  const extractedData = JSON.parse(readFileSync('scripts/extracted-content.json', 'utf-8'));
  
  // Inserir páginas
  const pages = extractedData.pages.map(page => ({
    slug: page.slug,
    name: page.name,
    template: page.template,
    priority: page.priority
  }));
  
  const { data: insertedPages, error: pagesError } = await supabase
    .from('pages')
    .insert(pages)
    .select();
    
  if (pagesError) {
    console.error('❌ Erro ao inserir páginas:', pagesError.message);
    return false;
  }
  
  console.log(`✅ Páginas inseridas: ${insertedPages.length}`);
  
  // Criar mapa de páginas
  const pageMap = {};
  insertedPages.forEach(page => {
    pageMap[page.slug] = page.id;
  });
  
  // Inserir blocos
  const blocks = extractedData.blocks.map(block => ({
    page_id: pageMap[block.pageSlug],
    type: block.type,
    position: block.position,
    payload: block.payload,
    published: block.published
  })).filter(block => block.page_id);
  
  const { data: insertedBlocks, error: blocksError } = await supabase
    .from('blocks')
    .insert(blocks)
    .select();
    
  if (blocksError) {
    console.error('❌ Erro ao inserir blocos:', blocksError.message);
    return false;
  }
  
  console.log(`✅ Blocos inseridos: ${insertedBlocks.length}`);
  
  // Inserir mídia
  const media = extractedData.media.map(asset => ({
    path: asset.path,
    alt: asset.alt
  }));
  
  const { data: insertedMedia, error: mediaError } = await supabase
    .from('media_library')
    .insert(media)
    .select();
    
  if (mediaError) {
    console.error('❌ Erro ao inserir mídia:', mediaError.message);
  } else {
    console.log(`✅ Mídia inserida: ${insertedMedia.length}`);
  }
  
  return true;
}

// Executar limpeza e inserção
try {
  await cleanTables();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar limpeza
  
  const success = await insertRealData();
  
  if (success) {
    console.log('🎉 Banco de dados limpo e populado com dados reais!');
    
    // Verificar resultado
    const { data: finalPages } = await supabase.from('pages').select('count');
    const { data: finalBlocks } = await supabase.from('blocks').select('count');
    
    console.log(`📊 Páginas no banco: ${finalPages?.[0]?.count || 0}`);
    console.log(`📦 Blocos no banco: ${finalBlocks?.[0]?.count || 0}`);
  } else {
    console.log('❌ Falha na inserção dos dados');
  }
  
} catch (error) {
  console.error('❌ Erro durante a operação:', error.message);
}