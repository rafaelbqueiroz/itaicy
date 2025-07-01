import { Block } from 'payload/types';

export const TabsBlock: Block = {
  slug: 'tabs',
  labels: {
    singular: 'Abas',
    plural: 'Abas',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título da Seção',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo da Seção',
      localized: true,
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Abas',
      minRows: 2,
      maxRows: 8,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Rótulo da Aba',
          required: true,
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Conteúdo',
          required: true,
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Imagem',
          relationTo: 'media',
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
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Configurações',
      fields: [
        {
          name: 'orientation',
          type: 'select',
          label: 'Orientação',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          defaultValue: 'horizontal',
        },
        {
          name: 'tabsPosition',
          type: 'select',
          label: 'Posição das Abas',
          options: [
            { label: 'Topo', value: 'top' },
            { label: 'Esquerda', value: 'left' },
            { label: 'Direita', value: 'right' },
            { label: 'Base', value: 'bottom' },
          ],
          defaultValue: 'top',
          validate: (value, { siblingData }) => {
            const orientation = siblingData?.orientation || 'horizontal';
            
            if (orientation === 'horizontal' && !['top', 'bottom'].includes(value)) {
              return 'Para orientação horizontal, use apenas "Topo" ou "Base"';
            }
            
            if (orientation === 'vertical' && !['left', 'right'].includes(value)) {
              return 'Para orientação vertical, use apenas "Esquerda" ou "Direita"';
            }
            
            return true;
          },
          admin: {
            description: 'Horizontal: Topo/Base | Vertical: Esquerda/Direita',
          },
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variante',
          options: [
            { label: 'Padrão', value: 'default' },
            { label: 'Cartões', value: 'cards' },
            { label: 'Underline', value: 'underline' },
          ],
          defaultValue: 'default',
        },
        {
          name: 'contentLayout',
          type: 'select',
          label: 'Layout do Conteúdo',
          options: [
            { label: 'Apenas Texto', value: 'text-only' },
            { label: 'Imagem à Esquerda', value: 'image-left' },
            { label: 'Imagem à Direita', value: 'image-right' },
            { label: 'Imagem no Topo', value: 'image-top' },
            { label: 'Imagem de Fundo', value: 'image-background' },
          ],
          defaultValue: 'text-only',
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Cor de Fundo',
          options: [
            { label: 'Branco', value: 'white' },
            { label: 'Cinza Claro', value: 'light' },
            { label: 'Primária', value: 'primary' },
            { label: 'Secundária', value: 'secondary' },
          ],
          defaultValue: 'white',
        },
      ],
    },
  ],
};

export default TabsBlock; 