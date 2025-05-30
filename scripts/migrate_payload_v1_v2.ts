#!/usr/bin/env tsx

/**
 * Script para migrar payloads existentes de v1 para v2
 * Transforma chaves snake_case → camelCase e normaliza estruturas
 */

import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis SUPABASE_URL e SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Função para converter snake_case para camelCase
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = toCamelCase(value);
  }
  return result;
}

// Função para normalizar payload por tipo de bloco
function normalizePayload(type: string, payload: any): any {
  const normalized = toCamelCase(payload);
  
  switch (type) {
    case 'hero-video':
      return {
        title: normalized.title || '',
        subtitle: normalized.subtitle || '',
        videoUrl: normalized.videoUrl || normalized.videoSrc || '',
        ctaPrimary: normalized.ctaPrimary || normalized.primaryCta || '',
        ctaSecondary: normalized.ctaSecondary || normalized.secondaryCta || ''
      };
      
    case 'split-block':
      return {
        title: normalized.title || '',
        subtitle: normalized.subtitle || '',
        description: normalized.description || '',
        image: normalized.image || normalized.imageUrl || '',
        imagePosition: normalized.imagePosition || 'left',
        link: normalized.link || normalized.href || '',
        bullets: normalized.bullets || []
      };
      
    case 'stats-grid':
      return {
        title: normalized.title || '',
        stats: normalized.stats || []
      };
      
    case 'testimonials':
      return {
        title: normalized.title || '',
        subtitle: normalized.subtitle || '',
        testimonials: normalized.testimonials || []
      };
      
    case 'newsletter':
      return {
        title: normalized.title || '',
        subtitle: normalized.subtitle || '',
        placeholder: normalized.placeholder || 'Seu e-mail',
        buttonText: normalized.buttonText || 'Inscrever'
      };
      
    default:
      return normalized;
  }
}

async function migratePayloads() {
  console.log('🔄 Iniciando migração de payloads v1 → v2...');
  
  try {
    // Buscar todos os blocos
    const { data: blocks, error: fetchError } = await supabase
      .from('blocks')
      .select('*');
      
    if (fetchError) {
      console.error('❌ Erro ao buscar blocos:', fetchError.message);
      return false;
    }
    
    console.log(`📦 Encontrados ${blocks.length} blocos para migrar`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const block of blocks) {
      try {
        const normalizedPayload = normalizePayload(block.type, block.payload);
        
        const { error: updateError } = await supabase
          .from('blocks')
          .update({ 
            payload: normalizedPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', block.id);
          
        if (updateError) {
          console.error(`❌ Erro ao migrar bloco ${block.id}:`, updateError.message);
          errors++;
        } else {
          console.log(`✅ Migrado: ${block.type} - ${normalizedPayload.title || 'Sem título'}`);
          migrated++;
        }
        
      } catch (error) {
        console.error(`❌ Erro ao processar bloco ${block.id}:`, error);
        errors++;
      }
    }
    
    console.log(`\n📊 Migração concluída:`);
    console.log(`  ✅ Migrados: ${migrated}`);
    console.log(`  ❌ Erros: ${errors}`);
    
    return errors === 0;
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return false;
  }
}

// Executar migração
migratePayloads().then(success => {
  if (success) {
    console.log('🎉 Migração concluída com sucesso!');
    process.exit(0);
  } else {
    console.log('❌ Migração falhou');
    process.exit(1);
  }
});