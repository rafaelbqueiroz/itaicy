import { z } from 'zod';

export const heroImageSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  subtitle: z.string().max(200, 'Subtítulo deve ter no máximo 200 caracteres').optional(),
  backgroundImage: z.string().url('URL da imagem deve ser válida').or(z.string().startsWith('/', 'URL deve começar com / para caminhos locais')),
  overlay: z.boolean().optional().default(true),
  height: z.string().optional().default('90vh')
});

export type HeroImageData = z.infer<typeof heroImageSchema>;

export const heroImageFormConfig = {
  title: {
    label: 'Título',
    placeholder: 'Ex: Suítes à Beira-Rio',
    type: 'text' as const,
    description: 'Título principal da seção'
  },
  subtitle: {
    label: 'Subtítulo',
    placeholder: 'Ex: Conforto sustentável com vista para o Cuiabá',
    type: 'text' as const,
    description: 'Subtítulo opcional'
  },
  backgroundImage: {
    label: 'Imagem de Fundo',
    placeholder: 'https://images.unsplash.com/...',
    type: 'text' as const,
    description: 'URL da imagem de fundo'
  },
  overlay: {
    label: 'Overlay Escuro',
    type: 'select' as const,
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' }
    ],
    description: 'Adiciona uma camada escura sobre a imagem'
  },
  height: {
    label: 'Altura',
    placeholder: '90vh',
    type: 'text' as const,
    description: 'Altura da seção (CSS)'
  }
};