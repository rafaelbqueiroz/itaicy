import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

const PLACEHOLDER_URL = 'https://hcmrlpevcpkclqubnmmf.supabase.co/storage/v1/object/public/media//placeholder%20(2).avif';

// Placeholders padrão
const DEFAULT_PLACEHOLDERS = [
  // Feature Blocks
  {
    id: 'feature-pesca',
    key: 'feature-blocks-pesca',
    title: 'Imagem da Pesca',
    description: 'Imagem para o bloco de pesca catch-and-release',
    url: PLACEHOLDER_URL,
    alt: 'Pesca catch-and-release no Pantanal',
    isPlaceholder: true,
    category: 'feature',
    section: 'feature-blocks'
  },
  {
    id: 'feature-safari',
    key: 'feature-blocks-safari',
    title: 'Imagem do Safari',
    description: 'Imagem para o bloco de safáris e birdwatching',
    url: PLACEHOLDER_URL,
    alt: 'Safari e birdwatching no Pantanal',
    isPlaceholder: true,
    category: 'feature',
    section: 'feature-blocks'
  },
  {
    id: 'feature-gastronomia',
    key: 'feature-blocks-gastronomia',
    title: 'Imagem da Gastronomia',
    description: 'Imagem para o bloco de gastronomia',
    url: PLACEHOLDER_URL,
    alt: 'Gastronomia pantaneira',
    isPlaceholder: true,
    category: 'feature',
    section: 'feature-blocks'
  },
  
  // Testimonials
  {
    id: 'testimonial-avatar-1',
    key: 'testimonials-avatar-1',
    title: 'Avatar Depoimento 1',
    description: 'Avatar do primeiro depoimento',
    url: PLACEHOLDER_URL,
    alt: 'Roberto Ferreira',
    isPlaceholder: true,
    category: 'thumb',
    section: 'testimonials'
  },
  {
    id: 'testimonial-avatar-2',
    key: 'testimonials-avatar-2',
    title: 'Avatar Depoimento 2',
    description: 'Avatar do segundo depoimento',
    url: PLACEHOLDER_URL,
    alt: 'Ana Carolina Silva',
    isPlaceholder: true,
    category: 'thumb',
    section: 'testimonials'
  },
  {
    id: 'testimonial-avatar-3',
    key: 'testimonials-avatar-3',
    title: 'Avatar Depoimento 3',
    description: 'Avatar do terceiro depoimento',
    url: PLACEHOLDER_URL,
    alt: 'Carlos Mendonça',
    isPlaceholder: true,
    category: 'thumb',
    section: 'testimonials'
  },

  // Galeria
  {
    id: 'gallery-1',
    key: 'gallery-item-1',
    title: 'Imagem da Galeria 1',
    description: 'Primeira imagem da galeria',
    url: PLACEHOLDER_URL,
    alt: 'Pantanal - Vida selvagem',
    isPlaceholder: true,
    category: 'gallery',
    section: 'gallery'
  },
  {
    id: 'gallery-2',
    key: 'gallery-item-2',
    title: 'Imagem da Galeria 2',
    description: 'Segunda imagem da galeria',
    url: PLACEHOLDER_URL,
    alt: 'Pantanal - Paisagem',
    isPlaceholder: true,
    category: 'gallery',
    section: 'gallery'
  },
  {
    id: 'gallery-3',
    key: 'gallery-item-3',
    title: 'Imagem da Galeria 3',
    description: 'Terceira imagem da galeria',
    url: PLACEHOLDER_URL,
    alt: 'Pantanal - Atividades',
    isPlaceholder: true,
    category: 'gallery',
    section: 'gallery'
  },

  // Acomodações
  {
    id: 'suite-master',
    key: 'acomodacoes-suite-master',
    title: 'Suíte Master',
    description: 'Imagem da Suíte Master',
    url: PLACEHOLDER_URL,
    alt: 'Suíte Master com vista para o rio',
    isPlaceholder: true,
    category: 'gallery',
    section: 'acomodacoes'
  },
  {
    id: 'suite-standard',
    key: 'acomodacoes-suite-standard',
    title: 'Suíte Standard',
    description: 'Imagem da Suíte Standard',
    url: PLACEHOLDER_URL,
    alt: 'Suíte Standard confortável',
    isPlaceholder: true,
    category: 'gallery',
    section: 'acomodacoes'
  },
  {
    id: 'suite-family',
    key: 'acomodacoes-suite-family',
    title: 'Suíte Família',
    description: 'Imagem da Suíte Família',
    url: PLACEHOLDER_URL,
    alt: 'Suíte Família espaçosa',
    isPlaceholder: true,
    category: 'gallery',
    section: 'acomodacoes'
  },

  // Blog
  {
    id: 'blog-melhor-epoca',
    key: 'blog-melhor-epoca',
    title: 'Melhor Época para Visitar',
    description: 'Artigo sobre melhor época para visitar o Pantanal',
    url: PLACEHOLDER_URL,
    alt: 'Pantanal durante diferentes estações',
    isPlaceholder: true,
    category: 'gallery',
    section: 'blog'
  },
  {
    id: 'blog-pesca-sustentavel',
    key: 'blog-pesca-sustentavel',
    title: 'Pesca Sustentável',
    description: 'Artigo sobre pesca sustentável',
    url: PLACEHOLDER_URL,
    alt: 'Pesca sustentável no Pantanal',
    isPlaceholder: true,
    category: 'gallery',
    section: 'blog'
  },
  {
    id: 'blog-aves-pantanal',
    key: 'blog-aves-pantanal',
    title: 'Aves do Pantanal',
    description: 'Artigo sobre aves do Pantanal',
    url: PLACEHOLDER_URL,
    alt: 'Aves do Pantanal para birdwatching',
    isPlaceholder: true,
    category: 'gallery',
    section: 'blog'
  },
  {
    id: 'blog-turismo-sustentavel',
    key: 'blog-turismo-sustentavel',
    title: 'Turismo Sustentável',
    description: 'Artigo sobre turismo sustentável',
    url: PLACEHOLDER_URL,
    alt: 'Turismo sustentável no Pantanal',
    isPlaceholder: true,
    category: 'gallery',
    section: 'blog'
  },
  {
    id: 'blog-culinaria-pantaneira',
    key: 'blog-culinaria-pantaneira',
    title: 'Culinária Pantaneira',
    description: 'Artigo sobre culinária pantaneira',
    url: PLACEHOLDER_URL,
    alt: 'Culinária tradicional pantaneira',
    isPlaceholder: true,
    category: 'gallery',
    section: 'blog'
  },
  {
    id: 'blog-oncas-pantanal',
    key: 'blog-oncas-pantanal',
    title: 'Onças do Pantanal',
    description: 'Artigo sobre onças do Pantanal',
    url: PLACEHOLDER_URL,
    alt: 'Onças-pintadas no Pantanal',
    isPlaceholder: true,
    category: 'gallery',
    section: 'blog'
  },

  // Pesca Esportiva
  {
    id: 'pesca-hero',
    key: 'pesca-esportiva-hero',
    title: 'Hero Pesca Esportiva',
    description: 'Imagem de fundo da página de pesca esportiva',
    url: PLACEHOLDER_URL,
    alt: 'Pesca esportiva no Rio Cuiabá',
    isPlaceholder: true,
    category: 'hero',
    section: 'pesca-esportiva'
  },
  {
    id: 'pesca-guias',
    key: 'pesca-esportiva-guias',
    title: 'Guias de Pesca',
    description: 'Imagem dos guias de pesca',
    url: PLACEHOLDER_URL,
    alt: 'Guia de pesca experiente',
    isPlaceholder: true,
    category: 'gallery',
    section: 'pesca-esportiva'
  },
  {
    id: 'pesca-temporada',
    key: 'pesca-esportiva-temporada',
    title: 'Temporada de Pesca',
    description: 'Imagem da temporada de pesca',
    url: PLACEHOLDER_URL,
    alt: 'Dourado sendo pescado',
    isPlaceholder: true,
    category: 'gallery',
    section: 'pesca-esportiva'
  },

  // Lodge
  {
    id: 'lodge-hero',
    key: 'lodge-hero',
    title: 'Hero Lodge',
    description: 'Imagem de fundo da página do lodge',
    url: PLACEHOLDER_URL,
    alt: 'Vista aérea do Itaicy Pantanal Eco Lodge',
    isPlaceholder: true,
    category: 'hero',
    section: 'lodge'
  },
  {
    id: 'lodge-apartamento',
    key: 'lodge-apartamento',
    title: 'Apartamento com Varanda',
    description: 'Apartamento com varanda e rede',
    url: PLACEHOLDER_URL,
    alt: 'Apartamento com varanda e rede',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },
  {
    id: 'lodge-piscina',
    key: 'lodge-piscina',
    title: 'Piscina de Borda Infinita',
    description: 'Piscina com vista para o rio',
    url: PLACEHOLDER_URL,
    alt: 'Piscina de borda infinita',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },
  {
    id: 'lodge-vista-aerea',
    key: 'lodge-vista-aerea',
    title: 'Vista Aérea',
    description: 'Vista aérea do lodge',
    url: PLACEHOLDER_URL,
    alt: 'Vista aérea do lodge',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },
  {
    id: 'lodge-area-comum',
    key: 'lodge-area-comum',
    title: 'Área Comum',
    description: 'Área comum e recepção',
    url: PLACEHOLDER_URL,
    alt: 'Área comum e recepção',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },
  {
    id: 'lodge-restaurante',
    key: 'lodge-restaurante',
    title: 'Restaurante',
    description: 'Restaurante com vista para o rio',
    url: PLACEHOLDER_URL,
    alt: 'Restaurante com vista para o rio',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },
  {
    id: 'lodge-suite-master',
    key: 'lodge-suite-master',
    title: 'Suíte Master',
    description: 'Suíte master com hidromassagem',
    url: PLACEHOLDER_URL,
    alt: 'Suíte master com hidromassagem',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },
  {
    id: 'lodge-sustentabilidade',
    key: 'lodge-sustentabilidade',
    title: 'Energia Solar',
    description: 'Sistema de energia solar do lodge',
    url: PLACEHOLDER_URL,
    alt: 'Energia solar no lodge',
    isPlaceholder: true,
    category: 'gallery',
    section: 'lodge'
  },

  // Safaris & Birdwatching
  {
    id: 'safaris-hero',
    key: 'safaris-hero',
    title: 'Hero Safaris',
    description: 'Imagem de fundo da página de safaris',
    url: PLACEHOLDER_URL,
    alt: 'Safari fotográfico no Pantanal',
    isPlaceholder: true,
    category: 'hero',
    section: 'safaris'
  },
  {
    id: 'safaris-oncas',
    key: 'safaris-oncas',
    title: 'Onças-pintadas',
    description: 'Onças-pintadas no Pantanal',
    url: PLACEHOLDER_URL,
    alt: 'Onça-pintada no habitat natural',
    isPlaceholder: true,
    category: 'gallery',
    section: 'safaris'
  },
  {
    id: 'safaris-birdwatching',
    key: 'safaris-birdwatching',
    title: 'Birdwatching',
    description: 'Observação de aves no Pantanal',
    url: PLACEHOLDER_URL,
    alt: 'Birdwatching com tuiuiú',
    isPlaceholder: true,
    category: 'gallery',
    section: 'safaris'
  },
  {
    id: 'safaris-equipamentos',
    key: 'safaris-equipamentos',
    title: 'Equipamentos',
    description: 'Equipamentos para safari',
    url: PLACEHOLDER_URL,
    alt: 'Equipamentos de observação',
    isPlaceholder: true,
    category: 'gallery',
    section: 'safaris'
  },

  // Pacotes & Tarifas
  {
    id: 'pacotes-hero',
    key: 'pacotes-hero',
    title: 'Hero Pacotes',
    description: 'Imagem de fundo da página de pacotes',
    url: PLACEHOLDER_URL,
    alt: 'Pacotes all-inclusive no Pantanal',
    isPlaceholder: true,
    category: 'hero',
    section: 'pacotes'
  }
];

/**
 * GET /api/placeholders
 * Listar todos os placeholders
 */
router.get('/', async (req, res) => {
  try {
    // Tentar carregar do Supabase
    try {
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('placeholders')
        .select('*')
        .order('section', { ascending: true });

      if (!error && data && data.length > 0) {
        return res.json({
          success: true,
          placeholders: data,
          source: 'supabase'
        });
      }
    } catch (supabaseError) {
      console.warn('Erro ao carregar placeholders do Supabase:', supabaseError.message);
    }

    // Fallback para placeholders padrão
    res.json({
      success: true,
      placeholders: DEFAULT_PLACEHOLDERS,
      source: 'default'
    });

  } catch (error) {
    console.error('Erro ao buscar placeholders:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar placeholders',
      details: error.message
    });
  }
});

/**
 * GET /api/placeholders/:key
 * Obter placeholder específico por chave
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    // Tentar carregar do Supabase
    try {
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('placeholders')
        .select('*')
        .eq('key', key)
        .single();

      if (!error && data) {
        return res.json({
          success: true,
          placeholder: data,
          source: 'supabase'
        });
      }
    } catch (supabaseError) {
      console.warn('Erro ao carregar placeholder do Supabase:', supabaseError.message);
    }

    // Fallback para placeholder padrão
    const defaultPlaceholder = DEFAULT_PLACEHOLDERS.find(p => p.key === key);
    if (defaultPlaceholder) {
      res.json({
        success: true,
        placeholder: defaultPlaceholder,
        source: 'default'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Placeholder não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao buscar placeholder:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar placeholder',
      details: error.message
    });
  }
});

/**
 * PUT /api/placeholders/:key
 * Atualizar placeholder
 */
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const updates = req.body;

    // Tentar atualizar no Supabase
    try {
      const supabaseClient = getSupabaseClient();
      
      // Verificar se existe
      const { data: existing } = await supabaseClient
        .from('placeholders')
        .select('*')
        .eq('key', key)
        .single();

      if (existing) {
        // Atualizar existente
        const { data, error } = await supabaseClient
          .from('placeholders')
          .update(updates)
          .eq('key', key)
          .select()
          .single();

        if (!error) {
          return res.json({
            success: true,
            placeholder: data,
            action: 'updated'
          });
        }
      } else {
        // Criar novo
        const newPlaceholder = {
          key,
          ...updates,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabaseClient
          .from('placeholders')
          .insert(newPlaceholder)
          .select()
          .single();

        if (!error) {
          return res.json({
            success: true,
            placeholder: data,
            action: 'created'
          });
        }
      }
    } catch (supabaseError) {
      console.warn('Erro ao salvar no Supabase:', supabaseError.message);
    }

    // Fallback: retornar dados atualizados sem salvar
    const defaultPlaceholder = DEFAULT_PLACEHOLDERS.find(p => p.key === key);
    if (defaultPlaceholder) {
      const updatedPlaceholder = { ...defaultPlaceholder, ...updates };
      res.json({
        success: true,
        placeholder: updatedPlaceholder,
        action: 'fallback',
        warning: 'Dados não foram salvos permanentemente'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Placeholder não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao atualizar placeholder:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar placeholder',
      details: error.message
    });
  }
});

export default router;
