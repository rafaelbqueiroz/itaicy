import type { CollectionConfig } from 'payload'

export const Accommodations: CollectionConfig = {
  slug: 'accommodations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'capacity', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Nome da Acomodação',
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
      name: 'capacity',
      label: 'Capacidade (hóspedes)',
      type: 'number',
      min: 1,
    },
    {
      name: 'amenities',
      label: 'Comodidades',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'amenity',
          label: 'Item da Comodidade',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
} 