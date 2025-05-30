#!/usr/bin/env zx

/**
 * Script que faz upsert dos dados extraídos no Supabase
 * Só insere se a row não existir (preserva dados existentes)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente necessárias:');
  console.error('   SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_KEY (ou SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔗 Conectando ao Supabase...');

// Carregar dados extraídos
const extractedPath = 'scripts/extracted-content.json';
if (!existsSync(extractedPath)) {
  console.error(`❌ Arquivo ${extractedPath} não encontrado. Execute primeiro: npx zx scripts/01_extract_from_components.mjs`);
  process.exit(1);
}

const extractedData = JSON.parse(readFileSync(extractedPath, 'utf-8'));
console.log(`📊 Dados carregados: ${extractedData.pages.length} páginas, ${extractedData.blocks.length} blocos`);

// Função para fazer upsert seguro
async function safeUpsert(table, data, conflictColumn = 'id') {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .upsert(data, { 
        onConflict: conflictColumn,
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error(`❌ Erro em ${table}:`, error.message);
      return false;
    }

    console.log(`✅ ${table}: ${result?.length || 0} registros processados`);
    return true;
  } catch (err) {
    console.error(`❌ Erro em ${table}:`, err.message);
    return false;
  }
}

// Seed páginas
async function seedPages() {
  console.log('📄 Inserindo páginas...');
  
  const pages = extractedData.pages.map(page => ({
    slug: page.slug,
    name: page.name,
    template: page.template,
    priority: page.priority,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return await safeUpsert('pages', pages, 'slug');
}

// Seed blocos
async function seedBlocks() {
  console.log('📦 Inserindo blocos...');
  
  // Primeiro, buscar IDs das páginas
  const { data: pagesData, error: pagesError } = await supabase
    .from('pages')
    .select('id, slug');

  if (pagesError) {
    console.error('❌ Erro ao buscar páginas:', pagesError.message);
    return false;
  }

  const pageMap = {};
  pagesData.forEach(page => {
    pageMap[page.slug] = page.id;
  });

  const blocks = extractedData.blocks.map(block => ({
    page_id: pageMap[block.pageSlug],
    type: block.type,
    position: block.position,
    payload: block.payload,
    published: block.published,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })).filter(block => block.page_id); // Remove blocos sem página

  return await safeUpsert('blocks', blocks);
}

// Seed mídia
async function seedMedia() {
  console.log('🖼️ Inserindo mídia...');
  
  const media = extractedData.media.map(asset => ({
    filename: asset.filename,
    path: asset.path,
    type: asset.type,
    alt_text: asset.alt,
    file_size: 0, // Será atualizado quando o arquivo for enviado
    uploaded_at: new Date().toISOString()
  }));

  return await safeUpsert('media_library', media, 'filename');
}

// Seed suites (dados base)
async function seedSuites() {
  console.log('🏠 Inserindo suites...');
  
  const suites = [
    {
      name: 'Apartamento Duplo Standard',
      description: 'Apartamento confortável com vista para o rio, ideal para casais ou amigos.',
      capacity: 2,
      amenities: ['Ar-condicionado', 'Ventilador', 'Banheiro privativo', 'Varanda', 'Frigobar', 'Cofre'],
      images: ['/assets/suite-interior.jpg', '/assets/suite-varanda.jpg'],
      base_price: 450.00,
      available: true
    },
    {
      name: 'Apartamento Duplo Superior',
      description: 'Apartamento espaçoso com varanda ampla e vista privilegiada do rio.',
      capacity: 2,
      amenities: ['Ar-condicionado', 'Ventilador', 'Banheiro privativo', 'Varanda ampla', 'Frigobar', 'Cofre', 'Roupão'],
      images: ['/assets/suite-superior.jpg'],
      base_price: 550.00,
      available: true
    }
  ];

  return await safeUpsert('suites', suites, 'name');
}

// Seed depoimentos
async function seedTestimonials() {
  console.log('💬 Inserindo depoimentos...');
  
  const testimonials = [
    {
      guest_name: 'Maria Silva',
      location: 'São Paulo, SP',
      rating: 5,
      comment: 'Uma experiência incrível! A pesca foi excepcional e a hospitalidade da equipe superou todas as expectativas.',
      stay_date: '2024-03-15',
      featured: true
    },
    {
      guest_name: 'João Santos',
      location: 'Rio de Janeiro, RJ',
      rating: 5,
      comment: 'O Pantanal é mágico e o Itaicy proporcionou momentos únicos. Voltaremos com certeza!',
      stay_date: '2024-02-28',
      featured: true
    },
    {
      guest_name: 'Ana Costa',
      location: 'Belo Horizonte, MG',
      rating: 5,
      comment: 'Acomodações confortáveis e experiências autênticas. Recomendo para quem busca contato com a natureza.',
      stay_date: '2024-04-10',
      featured: false
    }
  ];

  return await safeUpsert('testimonials', testimonials);
}

// Executar seed completo
async function runSeed() {
  console.log('🚀 Iniciando seed do Supabase...');
  
  try {
    // Verificar conexão
    const { data: testData, error: testError } = await supabase
      .from('pages')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erro de conexão com Supabase:', testError.message);
      process.exit(1);
    }

    console.log('✅ Conexão com Supabase estabelecida');

    // Executar seeds em ordem
    const results = await Promise.all([
      seedPages(),
      seedMedia(),
      seedSuites(),
      seedTestimonials()
    ]);

    // Seed de blocos precisa ser após páginas
    await new Promise(resolve => setTimeout(resolve, 1000));
    const blocksResult = await seedBlocks();

    const allSuccess = [...results, blocksResult].every(Boolean);

    if (allSuccess) {
      console.log('🎉 Seed concluído com sucesso!');
      
      // Verificar resultados
      const { data: pagesCount } = await supabase.from('pages').select('count');
      const { data: blocksCount } = await supabase.from('blocks').select('count');
      
      console.log(`📊 Páginas no banco: ${pagesCount?.[0]?.count || 0}`);
      console.log(`📦 Blocos no banco: ${blocksCount?.[0]?.count || 0}`);
      
    } else {
      console.log('⚠️ Seed concluído com alguns erros');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message);
    process.exit(1);
  }
}

// Executar
runSeed();