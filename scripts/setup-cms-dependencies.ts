#!/usr/bin/env ts-node
/**
 * Script para verificar e instalar dependências necessárias para o CMS
 * Este script verifica se todas as dependências necessárias estão instaladas
 * e instala as que estiverem faltando.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Lista de dependências necessárias para o CMS
const dependencies = [
  'cheerio',          // Para crawling e extração de conteúdo HTML
  'file-type',        // Para detectar tipos de arquivos
  'uuid',             // Para gerar IDs únicos
  'axios',            // Para requisições HTTP
  '@supabase/supabase-js', // Cliente Supabase
  'zod',              // Para validação de schemas
  'zod-validation-error', // Para formatação de erros do Zod
  'dotenv',           // Para variáveis de ambiente
  'sharp',            // Para processamento de imagens
  '@dnd-kit/core',    // Para drag-and-drop
  '@dnd-kit/sortable', // Para ordenação com drag-and-drop
  '@dnd-kit/utilities', // Utilitários para drag-and-drop
  'react-hook-form',  // Para formulários
  '@hookform/resolvers', // Para integração do Zod com react-hook-form
  'react-mde',        // Editor markdown para blog
  'marked',           // Para renderizar markdown
  'react-dropzone',   // Para upload de arquivos com drag-and-drop
  'react-resizable-panels', // Para painéis redimensionáveis no CMS
  'framer-motion',    // Para animações
  'class-variance-authority', // Para estilos condicionais
  'clsx',             // Para manipulação de classes CSS
  'tailwind-merge',   // Para mesclar classes Tailwind
  'lucide-react'      // Para ícones
];

// Verifica se uma dependência está instalada
function isDependencyInstalled(dependency: string): boolean {
  try {
    // Verifica se a dependência está no package.json
    const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
    return (
      (packageJson.dependencies && packageJson.dependencies[dependency]) ||
      (packageJson.devDependencies && packageJson.devDependencies[dependency])
    );
  } catch (error) {
    console.error(`Erro ao verificar dependência ${dependency}:`, error);
    return false;
  }
}

// Instala uma dependência
function installDependency(dependency: string): void {
  try {
    console.log(`Instalando ${dependency}...`);
    execSync(`pnpm add ${dependency}`, { stdio: 'inherit' });
    console.log(`✅ ${dependency} instalado com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao instalar ${dependency}:`, error);
    throw error;
  }
}

// Verifica e instala todas as dependências necessárias
async function checkAndInstallDependencies(): Promise<void> {
  console.log('🔍 Verificando dependências do CMS...');
  
  const missingDependencies: string[] = [];
  
  // Verifica quais dependências estão faltando
  for (const dependency of dependencies) {
    if (!isDependencyInstalled(dependency)) {
      missingDependencies.push(dependency);
    }
  }
  
  // Se não houver dependências faltando
  if (missingDependencies.length === 0) {
    console.log('✅ Todas as dependências já estão instaladas!');
    return;
  }
  
  // Instala as dependências faltando
  console.log(`🚀 Instalando ${missingDependencies.length} dependências faltantes...`);
  
  for (const dependency of missingDependencies) {
    installDependency(dependency);
  }
  
  console.log('✅ Todas as dependências foram instaladas com sucesso!');
}

// Verifica se o Supabase está configurado corretamente
async function checkSupabaseConfig(): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    console.error('❌ SUPABASE_ANON_KEY não encontrada nas variáveis de ambiente');
    console.log('Por favor, crie um arquivo .env na raiz do projeto com as seguintes variáveis:');
    console.log('SUPABASE_URL=seu_url_do_supabase');
    console.log('SUPABASE_ANON_KEY=sua_chave_anon_do_supabase');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('pages').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro ao conectar ao Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar conexão com Supabase:', error);
    return false;
  }
}

// Verifica se as tabelas necessárias existem no Supabase
async function checkSupabaseTables(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    console.error('❌ Não foi possível verificar tabelas: SUPABASE_ANON_KEY não encontrada');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Lista de tabelas necessárias
  const requiredTables = [
    'pages',
    'blocks',
    'media_library',
    'suites',
    'testimonials',
    'posts',
    'global_settings'
  ];
  
  console.log('🔍 Verificando tabelas no Supabase...');
  
  // Verifica cada tabela
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.error(`❌ Tabela '${table}' não encontrada ou erro de acesso:`, error);
        console.log(`Você precisa executar o script de criação de tabelas: pnpm ts-node scripts/cms-schema.sql`);
      } else {
        console.log(`✅ Tabela '${table}' encontrada`);
      }
    } catch (error) {
      console.error(`❌ Erro ao verificar tabela '${table}':`, error);
    }
  }
}

// Verifica se o bucket 'media' existe no Supabase Storage
async function checkSupabaseStorage(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    console.error('❌ Não foi possível verificar storage: SUPABASE_ANON_KEY não encontrada');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('🔍 Verificando bucket de mídia no Supabase Storage...');
  
  try {
    const { data, error } = await supabase.storage.getBucket('media');
    
    if (error) {
      console.error('❌ Bucket "media" não encontrado:', error);
      console.log('Você precisa criar um bucket chamado "media" no Supabase Storage');
      
      // Tenta criar o bucket
      console.log('🚀 Tentando criar bucket "media"...');
      const { data: createData, error: createError } = await supabase.storage.createBucket('media', {
        public: true
      });
      
      if (createError) {
        console.error('❌ Erro ao criar bucket "media":', createError);
      } else {
        console.log('✅ Bucket "media" criado com sucesso!');
      }
    } else {
      console.log('✅ Bucket "media" encontrado');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar bucket "media":', error);
  }
}

// Verifica se os diretórios necessários existem
function checkDirectories(): void {
  console.log('🔍 Verificando diretórios necessários...');
  
  const directories = [
    './client/src/cms',
    './client/src/cms/schemas',
    './client/src/cms/components',
    './client/src/components/cms',
    './scripts',
    './extracted-content',
    './temp-media'
  ];
  
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.log(`📁 Criando diretório: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  console.log('✅ Todos os diretórios necessários estão criados');
}

// Função principal
async function main(): Promise<void> {
  console.log('🚀 Iniciando setup de dependências do CMS...');
  
  // Verifica e cria diretórios
  checkDirectories();
  
  // Verifica e instala dependências
  await checkAndInstallDependencies();
  
  // Verifica configuração do Supabase
  const supabaseConfigured = await checkSupabaseConfig();
  
  if (supabaseConfigured) {
    // Verifica tabelas do Supabase
    await checkSupabaseTables();
    
    // Verifica storage do Supabase
    await checkSupabaseStorage();
  }
  
  console.log('✅ Setup de dependências do CMS concluído!');
  console.log('');
  console.log('Próximos passos:');
  console.log('1. Execute o script de extração de conteúdo: pnpm ts-node scripts/extract-site.ts');
  console.log('2. Execute o script de seed do Supabase: pnpm ts-node scripts/seed-supabase.ts');
  console.log('3. Inicie o servidor de desenvolvimento: pnpm dev');
  console.log('4. Acesse o CMS em: http://localhost:5173/cms');
}

// Executa a função principal
main().catch(error => {
  console.error('❌ Erro durante o setup:', error);
  process.exit(1);
});
