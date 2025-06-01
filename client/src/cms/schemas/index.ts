import { z } from 'zod';

// Schema para hero-video
export const heroVideoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  videoSrc: z.string().min(1, 'URL do vídeo é obrigatória'),
  overlayColor: z.string().default('rgba(0,0,0,0.4)'),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  height: z.enum(['full', 'large', 'medium', 'small']).default('full'),
  muted: z.boolean().default(true),
  autoplay: z.boolean().default(true),
  loop: z.boolean().default(true),
});

// Schema para hero-image
export const heroImageSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  imageSrc: z.string().min(1, 'URL da imagem é obrigatória'),
  overlayColor: z.string().default('rgba(0,0,0,0.4)'),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  height: z.enum(['full', 'large', 'medium', 'small']).default('large'),
});

// Schema para split-block
export const splitBlockSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  imageSrc: z.string().min(1, 'URL da imagem é obrigatória'),
  imagePosition: z.enum(['left', 'right']).default('right'),
  imageWidth: z.enum(['small', 'medium', 'large']).default('medium'),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  backgroundColor: z.string().default('#ffffff'),
});

// Schema para stats-ribbon
export const statsRibbonSchema = z.object({
  title: z.string().optional(),
  stats: z.array(
    z.object({
      value: z.string().min(1, 'Valor é obrigatório'),
      label: z.string().min(1, 'Legenda é obrigatória'),
    })
  ).min(1, 'Pelo menos uma estatística é obrigatória'),
  backgroundColor: z.string().default('#f8f9fa'),
  textColor: z.string().default('#000000'),
});

// Schema para counters-ribbon
export const countersRibbonSchema = z.object({
  title: z.string().optional(),
  counters: z.array(
    z.object({
      value: z.number().min(0, 'Valor deve ser positivo'),
      label: z.string().min(1, 'Legenda é obrigatória'),
      icon: z.string().optional(),
    })
  ).min(1, 'Pelo menos um contador é obrigatório'),
  backgroundColor: z.string().default('#f8f9fa'),
  textColor: z.string().default('#000000'),
});

// Schema para feature-blocks
export const featureBlocksSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  features: z.array(
    z.object({
      title: z.string().min(1, 'Título é obrigatório'),
      description: z.string().min(1, 'Descrição é obrigatória'),
      imageSrc: z.string().optional(),
      icon: z.string().optional(),
    })
  ).min(1, 'Pelo menos um recurso é obrigatório'),
  columns: z.enum(['1', '2', '3', '4']).default('3'),
  backgroundColor: z.string().default('#ffffff'),
});

// Schema para testimonials
export const testimonialsSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  testimonials: z.array(
    z.object({
      quote: z.string().min(1, 'Depoimento é obrigatório'),
      author: z.string().min(1, 'Autor é obrigatório'),
      location: z.string().optional(),
      rating: z.number().min(1).max(5).default(5),
      avatarSrc: z.string().optional(),
    })
  ).min(1, 'Pelo menos um depoimento é obrigatório'),
  backgroundColor: z.string().default('#f8f9fa'),
});

// Schema para newsletter
export const newsletterSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  buttonText: z.string().default('Inscrever-se'),
  placeholderText: z.string().default('Seu e-mail'),
  backgroundColor: z.string().default('#f8f9fa'),
  image: z.string().optional(),
});

// Schema para gallery
export const gallerySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  images: z.array(
    z.object({
      src: z.string().min(1, 'URL da imagem é obrigatória'),
      alt: z.string().default(''),
      caption: z.string().optional(),
    })
  ).min(1, 'Pelo menos uma imagem é obrigatória'),
  layout: z.enum(['grid', 'masonry', 'carousel']).default('grid'),
  columns: z.enum(['2', '3', '4']).default('3'),
});

// Schema para blog-grid
export const blogGridSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  postsToShow: z.number().min(1).max(12).default(3),
  showExcerpt: z.boolean().default(true),
  showDate: z.boolean().default(true),
  showAuthor: z.boolean().default(false),
  ctaText: z.string().default('Ver todos'),
  ctaUrl: z.string().default('/blog'),
});

// Schema para hero-simple
export const heroSimpleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default('#f8f9fa'),
  textColor: z.string().default('#000000'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  padding: z.enum(['small', 'medium', 'large']).default('medium'),
});

// Schema para contact-form
export const contactFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  fields: z.array(
    z.object({
      type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox']),
      name: z.string().min(1, 'Nome do campo é obrigatório'),
      label: z.string().min(1, 'Rótulo é obrigatório'),
      placeholder: z.string().optional(),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
    })
  ).min(1, 'Pelo menos um campo é obrigatório'),
  submitText: z.string().default('Enviar'),
  successMessage: z.string().default('Mensagem enviada com sucesso!'),
  errorMessage: z.string().default('Ocorreu um erro. Tente novamente.'),
});

// Schema para lodge-overview
export const lodgeOverviewSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  features: z.array(
    z.object({
      title: z.string().min(1, 'Título é obrigatório'),
      description: z.string().min(1, 'Descrição é obrigatória'),
      icon: z.string().optional(),
    })
  ).optional(),
  imageSrc: z.string().min(1, 'URL da imagem é obrigatória'),
  backgroundColor: z.string().default('#ffffff'),
});

// Schema para highlights
export const highlightsSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  items: z.array(
    z.object({
      title: z.string().min(1, 'Título é obrigatório'),
      description: z.string().min(1, 'Descrição é obrigatória'),
      icon: z.string().optional(),
    })
  ).min(1, 'Pelo menos um destaque é obrigatório'),
  columns: z.enum(['1', '2', '3']).default('2'),
  backgroundColor: z.string().default('#ffffff'),
});

// Mapeamento de tipos de blocos para schemas
const blockSchemas = {
  'hero-video': heroVideoSchema,
  'hero-image': heroImageSchema,
  'split-block': splitBlockSchema,
  'stats-ribbon': statsRibbonSchema,
  'counters-ribbon': countersRibbonSchema,
  'feature-blocks': featureBlocksSchema,
  'testimonials': testimonialsSchema,
  'newsletter': newsletterSchema,
  'gallery': gallerySchema,
  'blog-grid': blogGridSchema,
  'hero-simple': heroSimpleSchema,
  'contact-form': contactFormSchema,
  'lodge-overview': lodgeOverviewSchema,
  'highlights': highlightsSchema,
};

// Função para obter o schema apropriado com base no tipo de bloco
export function getSchemaForBlockType(type: string): z.ZodType<any> | null {
  return blockSchemas[type] || null;
}

// Função para validar dados de um bloco com base em seu tipo
export function validateBlockData(type: string, data: any): { success: boolean; errors?: any } {
  const schema = getSchemaForBlockType(type);
  
  if (!schema) {
    return { 
      success: false, 
      errors: { message: `Schema não encontrado para o tipo de bloco: ${type}` } 
    };
  }
  
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.format() 
      };
    }
    return { 
      success: false, 
      errors: { message: 'Erro de validação desconhecido' } 
    };
  }
}

// Função para gerar valores padrão para um tipo de bloco
export function getDefaultValuesForBlockType(type: string): Record<string, any> {
  const schema = getSchemaForBlockType(type);
  
  if (!schema) {
    return {};
  }
  
  // Tenta extrair valores padrão do schema (simplificado)
  const defaults: Record<string, any> = {};
  
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    
    Object.entries(shape).forEach(([key, def]) => {
      if (def instanceof z.ZodDefault) {
        // @ts-ignore - Acessando propriedade interna do Zod
        defaults[key] = def._def.defaultValue();
      } else if (key === 'title') {
        defaults[key] = 'Novo Título';
      } else if (key === 'subtitle') {
        defaults[key] = 'Subtítulo opcional';
      } else if (key.includes('Src') || key.includes('Url')) {
        defaults[key] = '';
      } else if (key.includes('Color')) {
        defaults[key] = '#ffffff';
      } else if (Array.isArray(def)) {
        defaults[key] = [];
      }
    });
  }
  
  return defaults;
}

// Exporta todos os schemas e funções auxiliares
export default {
  getSchemaForBlockType,
  validateBlockData,
  getDefaultValuesForBlockType,
  blockSchemas,
};
