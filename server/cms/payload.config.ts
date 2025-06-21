import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { pt } from '@payloadcms/translations/languages/pt'
import { buildConfig } from 'payload'
import sharp from 'sharp'

// Suas collections virão aqui
// import { Users } from './collections/Users'
// import { Pages } from './collections/Pages'
// import { Experiences } from './collections/Experiences'
// import { Accommodations } from './collections/Accommodations'
// import { Gastronomy } from './collections/Gastronomy'
// import { Media } from './collections/Media'

export default buildConfig({
  admin: {
    // user: Users.slug,
  },
  collections: [
    // Pages,
    // Experiences,
    // Accommodations,
    // Gastronomy,
    // Media,
    // Users,
  ],
  editor: {
    // editor-adapter-import
  },
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.SUPABASE_DATABASE_URL,
    },
  }),
  sharp,
  i18n: {
    supportedLanguages: { en, es, pt },
    fallbackLanguage: 'pt',
  },
  localization: {
    locales: [
      {
        label: 'Português',
        code: 'pt',
      },
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Español',
        code: 'es',
      },
    ],
    defaultLocale: 'pt',
    fallback: true,
  },
  // plugins: [
  //   // seoPlugin({
  //   //   collections: ['pages', 'experiences', 'accommodations', 'gastronomy'],
  //   //   uploadsCollection: 'media',
  //   //   generateTitle,
  //   //   generateDescription,
  //   // }),
  // ],
}) 