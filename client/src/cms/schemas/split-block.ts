import { z } from 'zod';

export const splitBlockSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(120, 'Título deve ter no máximo 120 caracteres'),
  subtitle: z.string().max(150, 'Subtítulo deve ter no máximo 150 caracteres').optional(),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição deve ter no máximo 500 caracteres'),
  image: z.string().url('URL da imagem deve ser válida').or(z.string().startsWith('/', 'URL deve começar com / para caminhos locais')),
  imagePosition: z.enum(['left', 'right'], { errorMap: () => ({ message: 'Posição deve ser "left" ou "right"' }) }),
  link: z.string().url('Link deve ser uma URL válida').or(z.string().startsWith('/', 'Link deve começar com / para caminhos locais')).optional(),
  bullets: z.array(z.string().min(1, 'Item não pode estar vazio')).max(6, 'Máximo de 6 itens').optional()
});

export type SplitBlockData = z.infer<typeof splitBlockSchema>;

export const splitBlockFormConfig = {
  title: {
    label: 'Título',
    placeholder: 'Ex: Pesca catch-and-release 100% cota-zero',
    type: 'text' as const,
    description: 'Título principal do bloco'
  },
  subtitle: {
    label: 'Subtítulo',
    placeholder: 'Ex: Barcos ágeis em águas preservadas',
    type: 'text' as const,
    description: 'Subtítulo opcional'
  },
  description: {
    label: 'Descrição',
    placeholder: 'Descreva a experiência ou serviço...',
    type: 'textarea' as const,
    description: 'Texto principal do bloco'
  },
  image: {
    label: 'URL da Imagem',
    placeholder: 'https://images.unsplash.com/...',
    type: 'text' as const,
    description: 'URL da imagem que acompanha o bloco'
  },
  imagePosition: {
    label: 'Posição da Imagem',
    type: 'select' as const,
    options: [
      { value: 'left', label: 'Esquerda' },
      { value: 'right', label: 'Direita' }
    ],
    description: 'Lado onde a imagem será exibida'
  },
  link: {
    label: 'Link (opcional)',
    placeholder: '/experiencias/pesca',
    type: 'text' as const,
    description: 'Link para página relacionada'
  },
  bullets: {
    label: 'Lista de Pontos',
    type: 'array' as const,
    itemType: 'text',
    placeholder: 'Ex: Guias especializados',
    description: 'Lista de características ou benefícios'
  }
};