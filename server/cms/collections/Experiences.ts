import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'difficulty', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Título da Experiência',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'richText',
      localized: true,
    },
    {
      name: 'featuredImage',
      label: 'Imagem de Destaque',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'duration',
      label: 'Duração',
      type: 'text',
      localized: true,
    },
    {
      name: 'difficulty',
      label: 'Dificuldade',
      type: 'select',
      options: ['Fácil', 'Moderado', 'Difícil'],
    },
  ],
} 