// ARQUIVO: src/payload.config.ts

// 1. IMPORTS DE ADAPTER E IDIOMAS (ATUALIZADO)
// Trocamos o mongoose (MongoDB) pelo postgres (PostgreSQL/Supabase)
// e ajustamos os idiomas para Português, Inglês e Espanhol.
import { postgresAdapter } from '@payloadcms/db-postgres'
import { pt } from '@payloadcms/translations/languages/pt'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'

// Imports essenciais do Payload e outros
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { plugins } from './plugins'
import { defaultLexical } from './fields/defaultLexical' // Corrigido para caminho relativo
import { getServerSideURL } from './utilities/getURL'

// 2. IMPORTS DAS COLLECTIONS E GLOBAIS (ATUALIZADO)
// Mantivemos as collections existentes e adicionamos as novas para o seu projeto.
// Você precisará criar os arquivos para as novas collections.
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Users } from './collections/Users'
import { Experiences } from './collections/Experiences' // <-- NOVO
import { Accommodations } from './collections/Accommodations' // <-- NOVO
import { Gastronomy } from './collections/Gastronomy' // <-- NOVO
import { Header } from './globals/Header' // Corrigido para caminho de exemplo
import { Footer } from './globals/Footer' // Corrigido para caminho de exemplo

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // 3. CONFIGURAÇÃO DE IDIOMAS (ATUALIZADO)
  // Definimos Português como padrão, com suporte para Inglês e Espanhol.
  i18n: {
    supportedLanguages: { pt, en, es },
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
    fallback: true, // Importante: exibe o conteúdo do idioma padrão se a tradução não existir.
  },

  // 4. CONFIGURAÇÃO DO BANCO DE DADOS (ATUALIZADO)
  // Trocado para o adapter do PostgreSQL.
  // Certifique-se de que a variável DATABASE_URI no seu arquivo .env está correta.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  // 5. LISTA DE COLLECTIONS (ATUALIZADO)
  // Adicionamos as novas collections necessárias para o seu site.
  collections: [
    // Conteúdo Principal
    Pages,
    Posts,
    Experiences,
    Accommodations,
    Gastronomy,
    // Taxonomia e Mídia
    Categories,
    Media,
    // Sistema
    Users,
  ],

  // O restante da configuração é mantido conforme o template original.
  admin: {
    user: Users.slug,
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  editor: defaultLexical,

  globals: [Header, Footer],

  plugins: [...plugins],

  cors: [getServerSideURL()].filter(Boolean),
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})