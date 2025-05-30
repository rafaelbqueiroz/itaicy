import { z } from 'zod';

export const heroVideoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  subtitle: z.string().min(1, 'Subtítulo é obrigatório').max(200, 'Subtítulo deve ter no máximo 200 caracteres'),
  videoUrl: z.string().url('URL do vídeo deve ser válida').or(z.string().startsWith('/', 'URL deve começar com / para caminhos locais')),
  ctaPrimary: z.string().min(1, 'Botão primário é obrigatório').max(30, 'Texto do botão deve ter no máximo 30 caracteres'),
  ctaSecondary: z.string().max(30, 'Texto do botão deve ter no máximo 30 caracteres').optional()
});

export type HeroVideoData = z.infer<typeof heroVideoSchema>;

export const heroVideoFormConfig = {
  title: {
    label: 'Título Principal',
    placeholder: 'Ex: Viva o Pantanal Autêntico',
    type: 'text' as const,
    description: 'Título principal que aparece no centro da tela'
  },
  subtitle: {
    label: 'Subtítulo',
    placeholder: 'Ex: Pesque dourados gigantes, aviste 650+ aves...',
    type: 'textarea' as const,
    description: 'Texto descritivo abaixo do título'
  },
  videoUrl: {
    label: 'URL do Vídeo',
    placeholder: '/attached_assets/itaicy-video-bg.mp4',
    type: 'text' as const,
    description: 'Caminho para o arquivo de vídeo de fundo'
  },
  ctaPrimary: {
    label: 'Botão Principal',
    placeholder: 'Reservar Agora',
    type: 'text' as const,
    description: 'Texto do botão de ação principal'
  },
  ctaSecondary: {
    label: 'Botão Secundário',
    placeholder: 'Conhecer Experiências',
    type: 'text' as const,
    description: 'Texto do botão de ação secundário (opcional)'
  }
};