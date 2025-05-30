#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY necessária');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCMS() {
  console.log('🚀 Configurando CMS do Itaicy Pantanal...');
  
  try {
    // 1. Carregar dados extraídos
    const exportPath = join(process.cwd(), 'seed', 'export.json');
    const exportData = JSON.parse(readFileSync(exportPath, 'utf-8'));
    console.log(`📦 Carregados: ${exportData.pages.length} páginas, ${exportData.media.length} mídia`);

    // 2. Inserir páginas
    console.log('📄 Inserindo páginas...');
    for (const page of exportData.pages) {
      console.log(`  → ${page.name} (${page.slug})`);
      
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert({
          slug: page.slug,
          name: page.name,
          template: page.template,
          priority: exportData.pages.indexOf(page)
        })
        .select()
        .single();

      if (pageError) {
        console.error(`Erro ao inserir página ${page.slug}:`, pageError);
        continue;
      }

      // 3. Inserir blocos da página
      for (const block of page.blocks) {
        const { error: blockError } = await supabase
          .from('blocks')
          .insert({
            page_id: pageData.id,
            type: block.type,
            position: block.position,
            payload: block.payload,
            published: block.payload // Publicar imediatamente
          });

        if (blockError) {
          console.error(`Erro ao inserir bloco ${block.type}:`, blockError);
        }
      }
    }

    // 4. Inserir mídia
    console.log('🖼️ Inserindo mídia...');
    for (const media of exportData.media) {
      const { error } = await supabase
        .from('media_library')
        .insert({
          path: media.path,
          alt: media.alt
        });

      if (error) {
        console.error(`Erro ao inserir mídia ${media.path}:`, error);
      }
    }

    // 5. Inserir dados específicos
    await insertSuites();
    await insertTestimonials();

    console.log('✅ CMS configurado com sucesso!');
    console.log('🎯 Acesse /cms para gerenciar o conteúdo');

  } catch (error) {
    console.error('❌ Erro durante setup:', error);
    process.exit(1);
  }
}

async function insertSuites() {
  console.log('🏨 Inserindo suítes...');
  
  const suites = [
    {
      name: 'Suíte Compacta',
      capacity: 2,
      area_m2: 25,
      price: 450.00,
      description: 'Acomodação aconchegante com vista para o rio'
    },
    {
      name: 'Suíte Ampla',
      capacity: 3,
      area_m2: 35,
      price: 650.00,
      description: 'Espaço generoso com varanda privativa'
    },
    {
      name: 'Suíte Master',
      capacity: 4,
      area_m2: 50,
      price: 950.00,
      description: 'Suíte premium com vista panorâmica do Pantanal'
    }
  ];

  for (const suite of suites) {
    const { error } = await supabase
      .from('suites')
      .insert(suite);

    if (error) {
      console.error(`Erro ao inserir suíte ${suite.name}:`, error);
    }
  }
}

async function insertTestimonials() {
  console.log('💬 Inserindo depoimentos...');
  
  const testimonials = [
    {
      author: 'Maria Santos',
      city: 'São Paulo',
      rating: 5,
      quote: 'Uma experiência única no coração do Pantanal. O lodge oferece conforto excepcional em meio à natureza exuberante.',
      is_featured: true
    },
    {
      author: 'Carlos Oliveira',
      city: 'Rio de Janeiro',
      rating: 5,
      quote: 'Os passeios de observação da fauna foram inesquecíveis. A equipe é muito profissional e acolhedora.',
      is_featured: true
    },
    {
      author: 'Ana Costa',
      city: 'Brasília',
      rating: 5,
      quote: 'Perfeito para quem busca tranquilidade e contato com a natureza. As acomodações são confortáveis e bem localizadas.',
      is_featured: false
    }
  ];

  for (const testimonial of testimonials) {
    const { error } = await supabase
      .from('testimonials')
      .insert(testimonial);

    if (error) {
      console.error('Erro ao inserir depoimento:', error);
    }
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupCMS().catch(console.error);
}

export { setupCMS };