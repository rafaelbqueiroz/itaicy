import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Título do Post',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'content',
      label: 'Conteúdo',
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
      name: 'author',
      label: 'Autor',
      type: 'text',
      defaultValue: 'Itaicy Eco Lodge',
    },
    {
      name: 'categories',
      label: 'Categorias',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
} 