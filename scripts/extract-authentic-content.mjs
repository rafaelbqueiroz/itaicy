#!/usr/bin/env zx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('🔍 Extraindo conteúdo autêntico dos componentes...');

// Dados autênticos extraídos dos componentes React
const authenticContent = {
  pages: [
    {
      slug: 'home',
      name: 'Página Inicial',
      template: 'home',
      priority: 1
    }
  ],
  blocks: [
    {
      pageSlug: 'home',
      type: 'hero-video',
      position: 1,
      payload: {
        title: 'Viva o Pantanal Autêntico',
        subtitle: 'Pesque dourados gigantes, aviste 650+ aves e adormeça com o canto da mata.',
        videoUrl: '/attached_assets/itaicy-video-bg.mp4',
        ctaPrimary: 'Reservar Agora',
        ctaSecondary: 'Conhecer Experiências'
      },
      published: true
    },
    {
      pageSlug: 'home',
      type: 'split-block',
      position: 2,
      payload: {
        title: 'Pesca catch-and-release 100% cota-zero',
        description: 'Barcos ágeis em águas preservadas; guia local premiado garante emoção sem impacto. Viva a aventura, preserve o Pantanal.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&h=600&auto=format&fit=crop',
        imagePosition: 'left',
        link: '/experiencias/pesca'
      },
      published: true
    },
    {
      pageSlug: 'home',
      type: 'split-block',
      position: 3,
      payload: {
        title: 'Safáris, trilhas & birdwatching',
        description: 'Mais de 650 aves no Pantanal — 166 registradas em 5 dias na última maratona Itaicy (jan 2024). Sinta o frio na barriga ao avistar tuiuiús e onças.',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&h=600&auto=format&fit=crop',
        imagePosition: 'right',
        link: '/experiencias/birdwatching'
      },
      published: true
    },
    {
      pageSlug: 'home',
      type: 'split-block',
      position: 4,
      payload: {
        title: 'Gastronomia de origem',
        description: 'Buffet pantaneiro com ingredientes colhidos na hora e petiscos ao entardecer. Delicie-se com sabores autênticos e afetivos da região.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&h=600&auto=format&fit=crop',
        imagePosition: 'left',
        link: '/gastronomia'
      },
      published: true
    },
    {
      pageSlug: 'home',
      type: 'split-block',
      position: 5,
      payload: {
        title: 'História viva – Usina Itaicy (1897)',
        description: 'Passeie pelas relíquias centenárias da antiga usina às margens do Rio Cuiabá. Descubra como evoluímos de geradora de energia a eco-lodge de referência.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&h=600&auto=format&fit=crop',
        imagePosition: 'right',
        link: '/sobre/historia'
      },
      published: true
    }
  ]
};

// Limpar dados antigos e inserir dados autênticos
async function replaceWithAuthenticData() {
  try {
    console.log('🗑️ Removendo dados antigos...');
    
    // Deletar blocos existentes da home
    const { data: homePage } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', 'home')
      .single();
    
    if (homePage) {
      await supabase
        .from('blocks')
        .delete()
        .eq('page_id', homePage.id);
      
      console.log('✅ Blocos antigos removidos');
    }
    
    // Inserir blocos autênticos
    console.log('📥 Inserindo conteúdo autêntico...');
    
    const blocks = authenticContent.blocks.map(block => ({
      page_id: homePage.id,
      type: block.type,
      position: block.position,
      payload: block.payload,
      published: block.published
    }));
    
    const { data: insertedBlocks, error } = await supabase
      .from('blocks')
      .insert(blocks)
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir blocos:', error.message);
      return false;
    }
    
    console.log(`✅ ${insertedBlocks.length} blocos autênticos inseridos`);
    
    // Verificar resultado
    console.log('\n🔍 Verificando dados inseridos:');
    insertedBlocks.forEach((block, index) => {
      console.log(`${index + 1}. ${block.type}: ${block.payload?.title || 'Sem título'}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

// Executar
const success = await replaceWithAuthenticData();

if (success) {
  console.log('\n🎉 Conteúdo autêntico inserido com sucesso!');
  console.log('O CMS agora mostra os dados reais do site.');
} else {
  console.log('\n❌ Falha ao inserir conteúdo autêntico');
}