#!/usr/bin/env zx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('🔍 Verificando estrutura das tabelas...');

// Verificar cada tabela
const tables = ['pages', 'blocks', 'media_library', 'suites', 'testimonials'];

for (const table of tables) {
  try {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      console.log(`❌ Tabela ${table}: ${error.message}`);
    } else {
      console.log(`✅ Tabela ${table}: encontrada`);
      if (data && data.length > 0) {
        console.log(`   Colunas: ${Object.keys(data[0]).join(', ')}`);
      }
    }
  } catch (err) {
    console.log(`❌ Tabela ${table}: erro ${err.message}`);
  }
}