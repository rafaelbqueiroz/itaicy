#!/usr/bin/env ts-node
/**
 * Script completo de configuração do CMS Itaicy
 * 
 * Este script executa todas as etapas necessárias para configurar o CMS:
 * 1. Verificação e instalação de dependências
 * 2. Criação de tabelas no Supabase
 * 3. Extração de conteúdo do site atual
 * 4. Seed dos dados no Supabase
 * 5. Testes de conexão e funcionalidade
 * 6. Instruções finais
 * 
 * Uso: pnpm ts-node scripts/complete-setup.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Interface para prompt de confirmação
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para prompt de confirmação
function confirmPrompt(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(`${question} (S/n): `, (answer) => {
      resolve(answer.toLowerCase() !== 'n');
    });
  });
}

// Função para exibir cabeçalho de etapa
function showStepHeader(step: number, title: string): void {
  console.log('\n');
  console.log(`${colors.bgBlue}${colors.white}${colors.bright} ETAPA ${step} ${colors.reset}`);
  console.log(`${colors.blue}${colors.bright}=== ${title} ===${colors.reset}`);
  console.log('\n');
}

// Função para exibir sucesso
function showSuccess(message: string): void {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

// Função para exibir erro
function showError(message: string): void {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

// Função para exibir aviso
function showWarning(message: string): void {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

// Função para exibir informação
function showInfo(message: string): void {
  console.log(`${colors.cyan}ℹ ${message}${colors.reset}`);
}

// Função para executar comando com output em tempo real
function execCommand(command: string, options: { silent?: boolean } = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (!options.silent) {
        showInfo(`Executando: ${command}`);
      }
      const output = execSync(command, { stdio: options.silent ? 'pipe' : 'inherit' });
      resolve(output ? output.toString() : '');
    } catch (error) {
      reject(error);
    }
  });
}

// Função para verificar se o Supabase está configurado
async function checkSupabaseConfig(): Promise<boolean> {
  showInfo('Verificando configuração do Supabase...');
  
  if (!supabaseKey) {
    showError('SUPABASE_ANON_KEY não encontrada nas variáveis de ambiente');
    console.log('\nPor favor, crie um arquivo .env na raiz do projeto com as seguintes variáveis:');
    console.log('SUPABASE_URL=seu_url_do_supabase');
    console.log('SUPABASE_ANON_KEY=sua_chave_anon_do_supabase');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('pages').select('count').limit(1).maybeSingle();
    
    // Se a tabela não existir, é normal ter erro, mas a conexão está OK
    if (error && error.code !== 'PGRST116') {
      showError(`Erro ao conectar ao Supabase: ${error.message}`);
      return false;
    }
    
    showSuccess('Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    showError(`Erro ao verificar conexão com Supabase: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para criar tabelas no Supabase
async function createTables(): Promise<boolean> {
  showInfo('Criando tabelas no Supabase...');
  
  try {
    // Verifica se o arquivo SQL existe
    const sqlFilePath = path.resolve('./scripts/cms-schema.sql');
    if (!fs.existsSync(sqlFilePath)) {
      showError(`Arquivo SQL não encontrado: ${sqlFilePath}`);
      return false;
    }
    
    // Lê o conteúdo do arquivo SQL
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    // Executa o SQL no Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });
    
    if (error) {
      // Se houver erro, tenta executar via REST API
      showWarning(`Erro ao executar SQL via RPC: ${error.message}`);
      showInfo('Tentando método alternativo...');
      
      // Divide o SQL em comandos individuais
      const sqlCommands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);
      
      for (const cmd of sqlCommands) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: cmd + ';' });
        if (error) {
          showWarning(`Comando falhou: ${cmd.substring(0, 50)}...`);
        }
      }
      
      // Verifica se as tabelas foram criadas
      const { data, error: checkError } = await supabase.from('pages').select('count').limit(1).maybeSingle();
      
      if (checkError && checkError.code === 'PGRST116') {
        showError('Falha ao criar tabelas. Por favor, execute o SQL manualmente no Console do Supabase.');
        console.log('\nAcesse: https://app.supabase.com/project/_/sql');
        console.log(`Cole o conteúdo de ${sqlFilePath} e execute.`);
        return false;
      }
    }
    
    showSuccess('Tabelas criadas com sucesso!');
    return true;
  } catch (error) {
    showError(`Erro ao criar tabelas: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para criar bucket de mídia no Supabase
async function createMediaBucket(): Promise<boolean> {
  showInfo('Verificando bucket de mídia no Supabase...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.storage.getBucket('media');
    
    if (error) {
      showInfo('Bucket "media" não encontrado. Criando...');
      
      const { error: createError } = await supabase.storage.createBucket('media', {
        public: true
      });
      
      if (createError) {
        showError(`Erro ao criar bucket "media": ${createError.message}`);
        return false;
      }
      
      showSuccess('Bucket "media" criado com sucesso!');
    } else {
      showSuccess('Bucket "media" já existe!');
    }
    
    return true;
  } catch (error) {
    showError(`Erro ao verificar/criar bucket de mídia: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para extrair conteúdo do site
async function extractSiteContent(): Promise<boolean> {
  showInfo('Extraindo conteúdo do site...');
  
  try {
    await execCommand('pnpm ts-node scripts/extract-site.ts');
    
    // Verifica se o arquivo de dados extraídos foi criado
    const extractedDataPath = path.resolve('./extracted-content/site-data.json');
    if (!fs.existsSync(extractedDataPath)) {
      showError('Arquivo de dados extraídos não encontrado');
      return false;
    }
    
    showSuccess('Conteúdo do site extraído com sucesso!');
    return true;
  } catch (error) {
    showError(`Erro ao extrair conteúdo do site: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para fazer seed dos dados no Supabase
async function seedSupabase(): Promise<boolean> {
  showInfo('Fazendo seed dos dados no Supabase...');
  
  try {
    await execCommand('pnpm ts-node scripts/seed-supabase.ts');
    
    // Verifica se os dados foram inseridos
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('pages').select('count');
    
    if (error) {
      showError(`Erro ao verificar dados inseridos: ${error.message}`);
      return false;
    }
    
    if (!data || data.length === 0 || data[0].count === 0) {
      showWarning('Nenhuma página encontrada após o seed');
      return false;
    }
    
    showSuccess(`Seed concluído com sucesso! ${data[0].count} páginas inseridas.`);
    return true;
  } catch (error) {
    showError(`Erro ao fazer seed dos dados: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para testar o CMS
async function testCMS(): Promise<boolean> {
  showInfo('Testando funcionalidades do CMS...');
  
  try {
    await execCommand('pnpm ts-node scripts/test-cms.ts');
    showSuccess('Testes concluídos!');
    return true;
  } catch (error) {
    showError(`Erro ao testar CMS: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para verificar e instalar dependências
async function checkAndInstallDependencies(): Promise<boolean> {
  showInfo('Verificando dependências...');
  
  try {
    await execCommand('pnpm ts-node scripts/setup-cms-dependencies.ts');
    showSuccess('Dependências verificadas e instaladas!');
    return true;
  } catch (error) {
    showError(`Erro ao verificar dependências: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Função para iniciar o servidor de desenvolvimento
async function startDevServer(): Promise<void> {
  showInfo('Iniciando servidor de desenvolvimento...');
  
  try {
    // Inicia o servidor em um processo separado
    const child = execSync('pnpm dev', { stdio: 'inherit' });
  } catch (error) {
    showError(`Erro ao iniciar servidor: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Função para exibir instruções finais
function showFinalInstructions(): void {
  console.log('\n');
  console.log(`${colors.bgGreen}${colors.black}${colors.bright} CONFIGURAÇÃO CONCLUÍDA! ${colors.reset}`);
  console.log('\n');
  console.log(`${colors.green}${colors.bright}O CMS do Itaicy foi configurado com sucesso!${colors.reset}`);
  console.log('\n');
  console.log('Próximos passos:');
  console.log('1. Inicie o servidor de desenvolvimento:');
  console.log('   $ pnpm dev');
  console.log('\n');
  console.log('2. Acesse o CMS em:');
  console.log('   http://localhost:5173/cms');
  console.log('\n');
  console.log('3. Faça login com as credenciais de administrador');
  console.log('\n');
  console.log('4. Para mais informações, consulte:');
  console.log('   docs/cms-manual.md');
  console.log('\n');
}

// Função principal
async function main(): Promise<void> {
  console.log('\n');
  console.log(`${colors.bgMagenta}${colors.white}${colors.bright} CONFIGURAÇÃO DO CMS ITAICY ${colors.reset}`);
  console.log('\n');
  console.log('Este script irá configurar o CMS completo, incluindo:');
  console.log('- Verificação e instalação de dependências');
  console.log('- Criação de tabelas no Supabase');
  console.log('- Extração de conteúdo do site atual');
  console.log('- Seed dos dados no Supabase');
  console.log('- Testes de conexão e funcionalidade');
  console.log('\n');
  
  const proceed = await confirmPrompt('Deseja continuar?');
  
  if (!proceed) {
    console.log('Configuração cancelada pelo usuário.');
    rl.close();
    return;
  }
  
  // Etapa 1: Verificar e instalar dependências
  showStepHeader(1, 'Verificando e instalando dependências');
  const dependenciesOk = await checkAndInstallDependencies();
  
  if (!dependenciesOk) {
    showWarning('Houve problemas com as dependências, mas tentaremos continuar...');
  }
  
  // Etapa 2: Verificar conexão com Supabase
  showStepHeader(2, 'Verificando conexão com Supabase');
  const supabaseOk = await checkSupabaseConfig();
  
  if (!supabaseOk) {
    showError('Não foi possível conectar ao Supabase. Configuração interrompida.');
    rl.close();
    return;
  }
  
  // Etapa 3: Criar tabelas no Supabase
  showStepHeader(3, 'Criando tabelas no Supabase');
  const tablesOk = await createTables();
  
  if (!tablesOk) {
    const continueAnyway = await confirmPrompt('Houve problemas ao criar as tabelas. Deseja continuar mesmo assim?');
    
    if (!continueAnyway) {
      showError('Configuração interrompida pelo usuário.');
      rl.close();
      return;
    }
  }
  
  // Etapa 4: Criar bucket de mídia
  showStepHeader(4, 'Configurando storage para mídia');
  const bucketOk = await createMediaBucket();
  
  if (!bucketOk) {
    const continueAnyway = await confirmPrompt('Houve problemas ao criar o bucket de mídia. Deseja continuar mesmo assim?');
    
    if (!continueAnyway) {
      showError('Configuração interrompida pelo usuário.');
      rl.close();
      return;
    }
  }
  
  // Etapa 5: Extrair conteúdo do site
  showStepHeader(5, 'Extraindo conteúdo do site');
  const extractionOk = await extractSiteContent();
  
  if (!extractionOk) {
    const continueAnyway = await confirmPrompt('Houve problemas ao extrair o conteúdo do site. Deseja continuar mesmo assim?');
    
    if (!continueAnyway) {
      showError('Configuração interrompida pelo usuário.');
      rl.close();
      return;
    }
  }
  
  // Etapa 6: Fazer seed dos dados
  showStepHeader(6, 'Fazendo seed dos dados no Supabase');
  const seedOk = await seedSupabase();
  
  if (!seedOk) {
    const continueAnyway = await confirmPrompt('Houve problemas ao fazer seed dos dados. Deseja continuar mesmo assim?');
    
    if (!continueAnyway) {
      showError('Configuração interrompida pelo usuário.');
      rl.close();
      return;
    }
  }
  
  // Etapa 7: Testar o CMS
  showStepHeader(7, 'Testando funcionalidades do CMS');
  const testOk = await testCMS();
  
  if (!testOk) {
    showWarning('Alguns testes falharam. Verifique os erros acima.');
  }
  
  // Finalização
  showFinalInstructions();
  
  // Pergunta se deseja iniciar o servidor
  const startServer = await confirmPrompt('Deseja iniciar o servidor de desenvolvimento agora?');
  
  if (startServer) {
    await startDevServer();
  }
  
  rl.close();
}

// Executa a função principal
main().catch(error => {
  showError(`Erro durante a configuração: ${error instanceof Error ? error.message : String(error)}`);
  rl.close();
  process.exit(1);
});
