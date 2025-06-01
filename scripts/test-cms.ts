#!/usr/bin/env ts-node
/**
 * Script para testar se o CMS está funcionando corretamente
 * Este script verifica:
 * 1. Conexão com o Supabase
 * 2. Carregamento de páginas
 * 3. Renderização de blocos
 * 4. Funcionamento do sistema de preview
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as http from 'http';

// Promisify exec para usar com async/await
const execAsync = promisify(exec);

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

// Cria cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// URLs para teste
const DEV_SERVER_URL = 'http://localhost:5173';
const API_SERVER_URL = 'http://localhost:3000';

// Função para verificar se um servidor está rodando
async function isServerRunning(url: string): Promise<boolean> {
  return new Promise(resolve => {
    http.get(url, () => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Função para iniciar o servidor de desenvolvimento se não estiver rodando
async function ensureDevServerRunning(): Promise<void> {
  const isRunning = await isServerRunning(DEV_SERVER_URL);
  
  if (!isRunning) {
    console.log('🚀 Servidor de desenvolvimento não está rodando. Iniciando...');
    
    // Inicia o servidor em um processo separado
    const child = exec('pnpm dev');
    
    // Espera o servidor iniciar (10 segundos)
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Verifica novamente se o servidor está rodando
    const isNowRunning = await isServerRunning(DEV_SERVER_URL);
    
    if (!isNowRunning) {
      throw new Error('Não foi possível iniciar o servidor de desenvolvimento');
    }
    
    console.log('✅ Servidor de desenvolvimento iniciado com sucesso!');
    
    // Registra evento para matar o processo do servidor ao sair
    process.on('exit', () => {
      child.kill();
    });
  } else {
    console.log('✅ Servidor de desenvolvimento já está rodando');
  }
}

// Teste 1: Verifica conexão com o Supabase
async function testSupabaseConnection(): Promise<boolean> {
  console.log('\n🔍 Teste 1: Verificando conexão com o Supabase...');
  
  try {
    // Tenta fazer uma consulta simples
    const { data, error } = await supabase
      .from('pages')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error);
    return false;
  }
}

// Teste 2: Verifica carregamento de páginas
async function testPagesLoading(): Promise<boolean> {
  console.log('\n🔍 Teste 2: Verificando carregamento de páginas...');
  
  try {
    // Consulta todas as páginas
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('priority', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    if (!pages || pages.length === 0) {
      console.log('⚠️ Nenhuma página encontrada. Execute o script de seed primeiro.');
      return false;
    }
    
    console.log(`✅ ${pages.length} páginas carregadas com sucesso!`);
    
    // Lista as páginas encontradas
    console.log('\nPáginas encontradas:');
    pages.forEach(page => {
      console.log(`- ${page.name} (${page.slug})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao carregar páginas:', error);
    return false;
  }
}

// Teste 3: Verifica renderização de blocos
async function testBlocksRendering(): Promise<boolean> {
  console.log('\n🔍 Teste 3: Verificando renderização de blocos...');
  
  try {
    // Obtém a primeira página (geralmente a home)
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .limit(1);
    
    if (pagesError || !pages || pages.length === 0) {
      console.log('⚠️ Página home não encontrada. Tentando outra página...');
      
      // Tenta obter qualquer página
      const { data: anyPages, error: anyPagesError } = await supabase
        .from('pages')
        .select('*')
        .limit(1);
      
      if (anyPagesError || !anyPages || anyPages.length === 0) {
        throw new Error('Nenhuma página encontrada');
      }
      
      pages[0] = anyPages[0];
    }
    
    const page = pages[0];
    
    // Consulta os blocos da página
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true });
    
    if (blocksError) {
      throw blocksError;
    }
    
    if (!blocks || blocks.length === 0) {
      console.log(`⚠️ Nenhum bloco encontrado para a página ${page.name} (${page.slug})`);
      return false;
    }
    
    console.log(`✅ ${blocks.length} blocos encontrados para a página ${page.name} (${page.slug})!`);
    
    // Lista os tipos de blocos encontrados
    const blockTypes = blocks.map(block => block.type);
    const uniqueBlockTypes = [...new Set(blockTypes)];
    
    console.log('\nTipos de blocos encontrados:');
    uniqueBlockTypes.forEach(type => {
      const count = blockTypes.filter(t => t === type).length;
      console.log(`- ${type} (${count})`);
    });
    
    // Tenta acessar a página no frontend para verificar se os blocos são renderizados
    await ensureDevServerRunning();
    
    try {
      const response = await axios.get(`${DEV_SERVER_URL}/${page.slug === 'home' ? '' : page.slug}`);
      
      if (response.status === 200) {
        console.log(`✅ Página ${page.slug} carregada com sucesso no frontend!`);
        return true;
      } else {
        console.error(`❌ Erro ao carregar página ${page.slug} no frontend: Status ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erro ao acessar página ${page.slug} no frontend:`, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar renderização de blocos:', error);
    return false;
  }
}

// Teste 4: Verifica sistema de preview
async function testPreviewSystem(): Promise<boolean> {
  console.log('\n🔍 Teste 4: Verificando sistema de preview...');
  
  try {
    // Obtém a primeira página
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .limit(1);
    
    if (pagesError || !pages || pages.length === 0) {
      throw new Error('Nenhuma página encontrada');
    }
    
    const page = pages[0];
    
    // Obtém o primeiro bloco da página
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true })
      .limit(1);
    
    if (blocksError || !blocks || blocks.length === 0) {
      throw new Error(`Nenhum bloco encontrado para a página ${page.name} (${page.slug})`);
    }
    
    const block = blocks[0];
    
    // Cria uma cópia do payload para fazer uma modificação de teste
    const originalPayload = { ...block.payload };
    const testPayload = { ...originalPayload, testTimestamp: new Date().toISOString() };
    
    // Atualiza o bloco com o payload de teste
    const { error: updateError } = await supabase
      .from('blocks')
      .update({ 
        payload: testPayload,
        updated_at: new Date().toISOString()
      })
      .eq('id', block.id);
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`✅ Bloco atualizado com payload de teste!`);
    
    // Verifica se a página de preview está acessível
    await ensureDevServerRunning();
    
    try {
      const response = await axios.get(`${DEV_SERVER_URL}/preview/${page.slug}?token=${Date.now()}`);
      
      if (response.status === 200) {
        console.log(`✅ Página de preview para ${page.slug} carregada com sucesso!`);
        
        // Restaura o payload original
        const { error: restoreError } = await supabase
          .from('blocks')
          .update({ 
            payload: originalPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', block.id);
        
        if (restoreError) {
          console.error('⚠️ Erro ao restaurar payload original:', restoreError);
        } else {
          console.log('✅ Payload original restaurado com sucesso!');
        }
        
        return true;
      } else {
        console.error(`❌ Erro ao carregar página de preview para ${page.slug}: Status ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erro ao acessar página de preview para ${page.slug}:`, error);
      
      // Restaura o payload original mesmo em caso de erro
      await supabase
        .from('blocks')
        .update({ 
          payload: originalPayload,
          updated_at: new Date().toISOString()
        })
        .eq('id', block.id);
      
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar sistema de preview:', error);
    return false;
  }
}

// Função principal
async function main(): Promise<void> {
  console.log('🚀 Iniciando testes do CMS...');
  
  // Executa os testes
  const supabaseConnected = await testSupabaseConnection();
  
  if (!supabaseConnected) {
    console.error('❌ Falha no teste de conexão com o Supabase. Abortando testes subsequentes.');
    process.exit(1);
  }
  
  const pagesLoaded = await testPagesLoading();
  
  if (!pagesLoaded) {
    console.warn('⚠️ Falha no teste de carregamento de páginas. Continuando com os próximos testes...');
  }
  
  const blocksRendered = await testBlocksRendering();
  
  if (!blocksRendered) {
    console.warn('⚠️ Falha no teste de renderização de blocos. Continuando com os próximos testes...');
  }
  
  const previewWorks = await testPreviewSystem();
  
  if (!previewWorks) {
    console.warn('⚠️ Falha no teste do sistema de preview.');
  }
  
  // Resumo dos resultados
  console.log('\n📋 Resumo dos testes:');
  console.log(`1. Conexão com Supabase: ${supabaseConnected ? '✅ Passou' : '❌ Falhou'}`);
  console.log(`2. Carregamento de páginas: ${pagesLoaded ? '✅ Passou' : '❌ Falhou'}`);
  console.log(`3. Renderização de blocos: ${blocksRendered ? '✅ Passou' : '❌ Falhou'}`);
  console.log(`4. Sistema de preview: ${previewWorks ? '✅ Passou' : '❌ Falhou'}`);
  
  // Resultado final
  const allPassed = supabaseConnected && pagesLoaded && blocksRendered && previewWorks;
  
  if (allPassed) {
    console.log('\n🎉 Todos os testes passaram! O CMS está funcionando corretamente.');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os erros acima e corrija os problemas.');
  }
}

// Executa a função principal
main().catch(error => {
  console.error('❌ Erro durante os testes:', error);
  process.exit(1);
});
