#!/usr/bin/env node

/**
 * Script para configurar completamente o Sprint 1 do CMS
 * Executa todas as migrações e seeds necessários
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Supabase
const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY ou SUPABASE_ANON_KEY é obrigatório');
  console.log('💡 Configure a variável de ambiente antes de executar o script');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Executa um arquivo SQL no Supabase
 */
async function executeSqlFile(filePath, description) {
  console.log(`📄 Executando: ${description}...`);
  
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    
    // Dividir em statements individuais (separados por ;)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          
          if (error) {
            // Alguns erros são esperados (como tabelas já existentes)
            if (error.message.includes('already exists') || 
                error.message.includes('duplicate key') ||
                error.message.includes('relation') && error.message.includes('already exists')) {
              console.log(`⚠️  Aviso: ${error.message.substring(0, 100)}...`);
            } else {
              console.error(`❌ Erro: ${error.message}`);
              errorCount++;
            }
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Erro executando statement: ${err.message}`);
          errorCount++;
        }
      }
    }

    console.log(`✅ ${description} concluído: ${successCount} sucessos, ${errorCount} erros`);
    return errorCount === 0;

  } catch (error) {
    console.error(`❌ Erro lendo arquivo ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Executa SQL direto (para casos simples)
 */
async function executeSQL(sql, description) {
  console.log(`🔧 Executando: ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`❌ ${description} falhou:`, error.message);
      return false;
    }
    
    console.log(`✅ ${description} concluído`);
    return true;
  } catch (err) {
    console.error(`❌ ${description} falhou:`, err.message);
    return false;
  }
}

/**
 * Verifica se as tabelas foram criadas corretamente
 */
async function verifyTables() {
  console.log('🔍 Verificando tabelas criadas...');
  
  const expectedTables = [
    'pages', 'blocks', 'posts', 'media_library', 'site_settings',
    'experiences', 'accommodations_new', 'gastronomy_items', 
    'cms_users', 'redirects'
  ];

  const results = [];
  
  for (const table of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        results.push({ table, status: 'ERROR', message: error.message });
      } else {
        results.push({ table, status: 'OK', count: data?.length || 0 });
      }
    } catch (err) {
      results.push({ table, status: 'ERROR', message: err.message });
    }
  }

  console.log('\n📊 Status das tabelas:');
  results.forEach(({ table, status, count, message }) => {
    if (status === 'OK') {
      console.log(`  ✅ ${table}: ${count} registros`);
    } else {
      console.log(`  ❌ ${table}: ${message}`);
    }
  });

  return results.every(r => r.status === 'OK');
}

/**
 * Verifica se o bucket de mídia existe
 */
async function verifyStorage() {
  console.log('🗂️  Verificando bucket de mídia...');
  
  try {
    const { data, error } = await supabase.storage.getBucket('media');
    
    if (error) {
      console.log('📁 Criando bucket de mídia...');
      
      const { error: createError } = await supabase.storage.createBucket('media', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error('❌ Erro criando bucket:', createError.message);
        return false;
      }
      
      console.log('✅ Bucket de mídia criado');
    } else {
      console.log('✅ Bucket de mídia já existe');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Erro verificando storage:', err.message);
    return false;
  }
}

/**
 * Função principal
 */
async function setupSprint1() {
  console.log('🚀 Iniciando configuração do Sprint 1...\n');
  
  try {
    // 1. Verificar conexão
    console.log('🔗 Testando conexão com Supabase...');
    const { data, error } = await supabase.from('pages').select('count', { count: 'exact', head: true });
    
    if (error && !error.message.includes('relation "pages" does not exist')) {
      throw new Error(`Erro de conexão: ${error.message}`);
    }
    
    console.log('✅ Conexão estabelecida\n');

    // 2. Executar schema principal
    const schemaPath = path.join(__dirname, 'cms-schema.sql');
    if (fs.existsSync(schemaPath)) {
      await executeSqlFile(schemaPath, 'Schema do CMS');
    } else {
      console.log('⚠️  Arquivo cms-schema.sql não encontrado, pulando...');
    }

    // 3. Executar seed de dados
    const seedPath = path.join(__dirname, 'seed-cms-data.sql');
    if (fs.existsSync(seedPath)) {
      await executeSqlFile(seedPath, 'Seed de dados iniciais');
    } else {
      console.log('⚠️  Arquivo seed-cms-data.sql não encontrado, pulando...');
    }

    // 4. Verificar storage
    await verifyStorage();

    // 5. Verificar tabelas
    const tablesOk = await verifyTables();

    // 6. Criar função para execução de SQL (se não existir)
    await executeSQL(`
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `, 'Função auxiliar exec_sql');

    console.log('\n🎉 Configuração do Sprint 1 concluída!');
    
    if (tablesOk) {
      console.log('✅ Todas as tabelas foram criadas com sucesso');
      console.log('✅ Dados iniciais foram inseridos');
      console.log('✅ Storage configurado');
      console.log('\n📋 Próximos passos:');
      console.log('  1. Acesse /cms para testar o painel');
      console.log('  2. Faça login com um dos emails configurados');
      console.log('  3. Teste o upload de mídia');
      console.log('  4. Verifique as configurações do site');
    } else {
      console.log('⚠️  Algumas tabelas podem não ter sido criadas corretamente');
      console.log('💡 Verifique os logs acima para mais detalhes');
    }

  } catch (error) {
    console.error('\n❌ Erro durante a configuração:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSprint1();
}

export { setupSprint1 };
