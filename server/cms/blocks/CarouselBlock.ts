import { Block } from 'payload/types';

export const CarouselBlock: Block = {
  slug: 'carousel',
  labels: {
    singular: 'Carrossel',
    plural: 'Carrosséis',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo',
      localized: true,
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      maxRows: 10,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Imagem',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Título',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrição',
          localized: true,
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Call to Action',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Texto',
              localized: true,
            },
            {
              name: 'href',
              type: 'text',
              label: 'Link',
            },
            {
              name: 'variant',
              type: 'select',
              label: 'Estilo',
              options: [
                { label: 'Primário', value: 'primary' },
                { label: 'Secundário', value: 'secondary' },
                { label: 'Outline', value: 'outline' },
                { label: 'Ghost', value: 'ghost' },
              ],
              defaultValue: 'primary',
            },
          ],
        },
        {
          name: 'overlayColor',
          type: 'select',
          label: 'Cor do Overlay',
          options: [
            { label: 'Nenhum', value: 'none' },
            { label: 'Escuro', value: 'dark' },
            { label: 'Claro', value: 'light' },
            { label: 'Gradiente', value: 'gradient' },
          ],
          defaultValue: 'none',
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Configurações',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Reprodução Automática',
          defaultValue: true,
        },
        {
          name: 'interval',
          type: 'number',
          label: 'Intervalo (ms)',
          defaultValue: 5000,
          admin: {
            condition: (data, siblingData) => siblingData?.autoplay === true,
          },
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          label: 'Mostrar Setas de Navegação',
          defaultValue: true,
        },
        {
          name: 'showDots',
          type: 'checkbox',
          label: 'Mostrar Indicadores',
          defaultValue: true,
        },
        {
          name: 'height',
          type: 'select',
          label: 'Altura',
          options: [
            { label: 'Pequena', value: 'small' },
            { label: 'Média', value: 'medium' },
            { label: 'Grande', value: 'large' },
            { label: 'Tela Cheia', value: 'full' },
          ],
          defaultValue: 'medium',
        },
        {
          name: 'effect',
          type: 'select',
          label: 'Efeito de Transição',
          options: [
            { label: 'Slide', value: 'slide' },
            { label: 'Fade', value: 'fade' },
            { label: 'Zoom', value: 'zoom' },
          ],
          defaultValue: 'slide',
        },
      ],
    },
  ],
};

export default CarouselBlock; 