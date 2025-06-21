import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: {
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    heading: {
      h1: true,
      h2: true,
      h3: true,
      h4: true,
      h5: true,
      h6: true,
    },
    lists: {
      ordered: true,
      unordered: true,
    },
    link: true,
    media: true,
    alignment: true,
    quote: true,
    tables: true,
    upload: {
      collections: {
        media: {
          fields: [
            {
              name: 'alt',
              type: 'text',
              required: true,
            },
          ],
        },
      },
    },
  },
})
