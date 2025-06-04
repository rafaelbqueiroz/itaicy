import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';

const router = Router();

// Configuração da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const seoSuggestionSchema = z.object({
  contentType: z.enum(['page', 'experience', 'accommodation', 'blog', 'gastronomy']),
  title: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

// Função para gerar sugestões de SEO usando OpenAI GPT-4o-mini
async function generateSEOSuggestionsWithAI(data: {
  contentType: string;
  title?: string;
  description?: string;
  slug?: string;
}) {
  const { contentType, title, description } = data;

  // Contexto específico por tipo de conteúdo
  const contextMap = {
    experience: 'experiência turística no Pantanal',
    accommodation: 'acomodação ecológica no Pantanal',
    blog: 'artigo de blog sobre o Pantanal',
    gastronomy: 'prato da gastronomia regional do Pantanal',
    page: 'página do site do eco lodge'
  };

  const context = contextMap[contentType as keyof typeof contextMap] || 'conteúdo do site';

  const prompt = `
Você é um especialista em SEO para turismo ecológico. Preciso de sugestões otimizadas para uma ${context} do Itaicy Eco Lodge, um eco lodge sustentável no coração do Pantanal.

INFORMAÇÕES DO CONTEÚDO:
- Título: ${title || 'Não informado'}
- Descrição: ${description || 'Não informada'}
- Tipo: ${contentType}

INSTRUÇÕES:
1. Crie um meta title otimizado (máximo 60 caracteres) que inclua palavras-chave relevantes
2. Crie uma meta description atrativa (50-155 caracteres) que incentive cliques
3. Crie um alt text descritivo para imagens
4. Use palavras-chave como: Pantanal, eco lodge, sustentável, natureza, turismo ecológico
5. Mantenha o tom profissional mas acolhedor
6. Inclua "Itaicy" no meta title se possível

RESPONDA APENAS EM JSON no formato:
{
  "title": "meta title otimizado",
  "description": "meta description otimizada",
  "altText": "alt text para imagens"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em SEO para turismo ecológico. Responda sempre em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Resposta vazia da OpenAI');
    }

    // Parse da resposta JSON
    const suggestions = JSON.parse(response);

    return {
      title: suggestions.title || title || 'Itaicy Eco Lodge',
      description: suggestions.description || description || 'Experiência única no Pantanal',
      altText: suggestions.altText || `Imagem de ${title || 'conteúdo'} - Itaicy Eco Lodge`
    };

  } catch (error) {
    console.error('Erro ao gerar sugestões com OpenAI:', error);

    // Fallback para templates estáticos se a IA falhar
    return generateFallbackSuggestions(data);
  }
}

// Função de fallback caso a IA não esteja disponível
function generateFallbackSuggestions(data: {
  contentType: string;
  title?: string;
  description?: string;
  slug?: string;
}) {
  const { contentType, title, description } = data;

  const templates = {
    experience: {
      titleSuffix: ' | Experiências Pantanal - Itaicy',
      descriptionPrefix: 'Viva uma experiência única no Pantanal com ',
      descriptionSuffix: '. Reserve no Itaicy Eco Lodge.',
    },
    accommodation: {
      titleSuffix: ' | Acomodações - Itaicy Eco Lodge',
      descriptionPrefix: 'Hospede-se com conforto sustentável em ',
      descriptionSuffix: '. Eco lodge no coração do Pantanal.',
    },
    blog: {
      titleSuffix: ' | Blog Itaicy Eco Lodge',
      descriptionPrefix: 'Descubra ',
      descriptionSuffix: '. Histórias e aventuras do Pantanal.',
    },
    gastronomy: {
      titleSuffix: ' | Gastronomia - Itaicy',
      descriptionPrefix: 'Saboreie ',
      descriptionSuffix: '. Gastronomia regional no Itaicy Eco Lodge.',
    },
    page: {
      titleSuffix: ' | Itaicy Eco Lodge Pantanal',
      descriptionPrefix: '',
      descriptionSuffix: ' no Itaicy Eco Lodge, refúgio sustentável no Pantanal.',
    },
  };

  const template = templates[contentType as keyof typeof templates] || templates.page;

  // Gerar meta title otimizado
  let metaTitle = title || 'Itaicy Eco Lodge';
  if (metaTitle.length + template.titleSuffix.length <= 60) {
    metaTitle += template.titleSuffix;
  } else {
    const maxTitleLength = 60 - template.titleSuffix.length - 3;
    metaTitle = metaTitle.substring(0, maxTitleLength) + '...' + template.titleSuffix;
  }

  // Gerar meta description otimizada
  let metaDescription = description || title || 'Experiência única no Pantanal';
  const fullDescription = template.descriptionPrefix + metaDescription + template.descriptionSuffix;

  if (fullDescription.length <= 155) {
    metaDescription = fullDescription;
  } else {
    const availableLength = 155 - template.descriptionPrefix.length - template.descriptionSuffix.length - 3;
    const truncatedDescription = metaDescription.substring(0, availableLength) + '...';
    metaDescription = template.descriptionPrefix + truncatedDescription + template.descriptionSuffix;
  }

  return {
    title: metaTitle,
    description: metaDescription,
    altText: `Imagem de ${title || 'conteúdo'} - Itaicy Eco Lodge Pantanal`,
  };
}

// Endpoint para gerar sugestões de SEO
router.post('/', async (req, res) => {
  try {
    const data = seoSuggestionSchema.parse(req.body);

    console.log('🤖 Gerando sugestões de SEO com OpenAI para:', data.contentType, data.title);

    const suggestions = await generateSEOSuggestionsWithAI(data);

    res.json({
      success: true,
      data: suggestions,
      source: 'openai-gpt4o-mini'
    });
  } catch (error) {
    console.error('Erro ao gerar sugestões de SEO:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    // Fallback para sugestões estáticas
    try {
      const fallbackSuggestions = generateFallbackSuggestions(req.body);
      res.json({
        success: true,
        data: fallbackSuggestions,
        source: 'fallback',
        warning: 'IA indisponível, usando sugestões estáticas'
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
});

// Endpoint para validar SEO
router.post('/validate', async (req, res) => {
  try {
    const validationSchema = z.object({
      metaTitle: z.string(),
      metaDescription: z.string(),
      contentType: z.string(),
    });

    const { metaTitle, metaDescription } = validationSchema.parse(req.body);

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar meta title
    if (!metaTitle || metaTitle.length === 0) {
      errors.push('Meta Title é obrigatório');
    } else {
      if (metaTitle.length < 30) {
        warnings.push('Meta Title muito curto (recomendado: 30-60 caracteres)');
      }
      if (metaTitle.length > 60) {
        errors.push('Meta Title muito longo (máximo: 60 caracteres)');
      }
    }

    // Validar meta description
    if (!metaDescription || metaDescription.length === 0) {
      errors.push('Meta Description é obrigatória');
    } else {
      if (metaDescription.length < 50) {
        warnings.push('Meta Description muito curta (recomendado: 50-155 caracteres)');
      }
      if (metaDescription.length > 155) {
        errors.push('Meta Description muito longa (máximo: 155 caracteres)');
      }
    }

    // Verificar palavras-chave importantes
    const keywords = ['pantanal', 'eco lodge', 'itaicy', 'natureza', 'sustentável'];
    const hasKeywords = keywords.some(keyword =>
      metaTitle.toLowerCase().includes(keyword) ||
      metaDescription.toLowerCase().includes(keyword)
    );

    if (!hasKeywords) {
      warnings.push('Considere incluir palavras-chave relevantes como "Pantanal", "Eco Lodge", etc.');
    }

    res.json({
      success: true,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings,
        score: calculateSEOScore(metaTitle, metaDescription),
      },
    });
  } catch (error) {
    console.error('Erro ao validar SEO:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
});

function calculateSEOScore(metaTitle: string, metaDescription: string): number {
  let score = 0;
  
  // Pontuação para meta title
  if (metaTitle.length >= 30 && metaTitle.length <= 60) score += 30;
  else if (metaTitle.length > 0) score += 15;
  
  // Pontuação para meta description
  if (metaDescription.length >= 50 && metaDescription.length <= 155) score += 30;
  else if (metaDescription.length > 0) score += 15;
  
  // Pontuação para palavras-chave
  const keywords = ['pantanal', 'eco lodge', 'itaicy', 'natureza', 'sustentável'];
  const keywordCount = keywords.filter(keyword => 
    metaTitle.toLowerCase().includes(keyword) || 
    metaDescription.toLowerCase().includes(keyword)
  ).length;
  
  score += keywordCount * 8; // Máximo 40 pontos
  
  return Math.min(score, 100);
}

export default router;
