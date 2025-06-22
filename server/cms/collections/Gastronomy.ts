import { CollectionConfig } from 'payload/types';
import { generateSlug } from '../../utilities/getURL';
import SEOFields, { validateSEO, processSEO } from '../shared/seo-fields';

const Gastronomy: CollectionConfig = {
  slug: 'gastronomy',
  labels: {
    singular: 'Gastronomia',
    plural: 'Gastronomia',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    group: 'Conteúdo',
    description: 'Experiências gastronômicas, restaurantes e pratos especiais.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      admin: {
        position: 'sidebar',
        description: 'URL única para este item (gerada automaticamente)',
      },
      hooks: {
        beforeValidate: [
          generateSlug('title'),
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoria',
      options: [
        {
          label: 'Restaurante',
          value: 'restaurant',
        },
        {
          label: 'Bar',
          value: 'bar',
        },
        {
          label: 'Café',
          value: 'cafe',
        },
        {
          label: 'Prato Especial',
          value: 'special-dish',
        },
        {
          label: 'Experiência Gastronômica',
          value: 'food-experience',
        },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descrição Curta',
      required: true,
      localized: true,
      admin: {
        description: 'Breve descrição para listagens (máximo 200 caracteres)',
      },
      validate: (value) => {
        if (value && value.length > 200) {
          return 'A descrição curta deve ter no máximo 200 caracteres';
        }
        return true;
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descrição Completa',
      required: true,
      localized: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      label: 'Imagem Principal',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Imagem principal para exibição em destaque',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galeria de Imagens',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Legenda',
          localized: true,
        },
      ],
      admin: {
        description: 'Galeria de imagens adicionais',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Destaques',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrição',
          localized: true,
        },
      ],
      admin: {
        description: 'Pontos de destaque desta experiência gastronômica',
      },
    },
    {
      name: 'menu',
      type: 'array',
      label: 'Menu',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome do Item',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrição',
          localized: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Preço',
          min: 0,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Imagem',
          relationTo: 'media',
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          fields: [
            {
              name: 'tag',
              type: 'text',
              label: 'Tag',
            },
          ],
        },
      ],
      admin: {
        description: 'Itens do menu (opcional)',
      },
    },
    {
      name: 'location',
      type: 'group',
      label: 'Localização',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: 'Endereço',
          localized: true,
        },
        {
          name: 'coordinates',
          type: 'point',
          label: 'Coordenadas',
        },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      label: 'Horário de Funcionamento',
      fields: [
        {
          name: 'day',
          type: 'select',
          label: 'Dia',
          options: [
            { label: 'Segunda-feira', value: 'monday' },
            { label: 'Terça-feira', value: 'tuesday' },
            { label: 'Quarta-feira', value: 'wednesday' },
            { label: 'Quinta-feira', value: 'thursday' },
            { label: 'Sexta-feira', value: 'friday' },
            { label: 'Sábado', value: 'saturday' },
            { label: 'Domingo', value: 'sunday' },
          ],
          required: true,
        },
        {
          name: 'open',
          type: 'text',
          label: 'Abertura',
          admin: {
            description: 'Ex: 08:00',
          },
        },
        {
          name: 'close',
          type: 'text',
          label: 'Fechamento',
          admin: {
            description: 'Ex: 22:00',
          },
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          label: 'Fechado neste dia',
        },
      ],
    },
    {
      name: 'relatedExperiences',
      type: 'relationship',
      label: 'Experiências Relacionadas',
      relationTo: 'experiences',
      hasMany: true,
      admin: {
        description: 'Experiências relacionadas a esta opção gastronômica',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        {
          label: 'Rascunho',
          value: 'draft',
        },
        {
          label: 'Publicado',
          value: 'published',
        },
        {
          label: 'Arquivado',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: SEOFields,
      admin: {
        description: 'Configurações de SEO para esta página',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      (data) => {
        // Processar dados antes da validação
        return processSEO(data);
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Processar dados antes de salvar
        return data;
      },
    ],
    afterRead: [
      (doc) => {
        // Processar documento após leitura
        return doc;
      },
    ],
  },
  endpoints: [
    {
      path: '/by-slug/:slug',
      method: 'get',
      handler: async (req, res, next) => {
        const { slug } = req.params;
        const { payload } = req;

        try {
          const gastronomy = await payload.find({
            collection: 'gastronomy',
            where: {
              slug: {
                equals: slug,
              },
            },
          });

          if (gastronomy.docs.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado' });
          }

          return res.status(200).json(gastronomy.docs[0]);
        } catch (error) {
          return res.status(500).json({ error: 'Erro ao buscar item' });
        }
      },
    },
  ],
};

export default Gastronomy; 