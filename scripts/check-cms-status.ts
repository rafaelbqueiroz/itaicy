#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_ANON_KEY necessária');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  console.log('Verificando status do CMS...');
  
  try {
    // Verificar páginas
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .order('priority');

    if (pagesError) {
      console.error('Erro ao buscar páginas:', pagesError);
      return;
    }

    console.log(`Páginas encontradas: ${pages?.length || 0}`);
    pages?.forEach(page => {
      console.log(`  - ${page.name} (${page.slug})`);
    });

    // Verificar blocos
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('*');

    if (blocksError) {
      console.error('Erro ao buscar blocos:', blocksError);
      return;
    }

    console.log(`Blocos encontrados: ${blocks?.length || 0}`);

    // Verificar suítes
    const { data: suites, error: suitesError } = await supabase
      .from('suites')
      .select('*');

    if (suitesError) {
      console.error('Erro ao buscar suítes:', suitesError);
      return;
    }

    console.log(`Suítes encontradas: ${suites?.length || 0}`);

  } catch (error) {
    console.error('Erro durante verificação:', error);
  }
}

checkStatus().catch(console.error);