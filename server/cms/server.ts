import express from 'express';
import payload from 'payload';
import path from 'path';
import { config } from 'dotenv';
import { PostgresAdapter } from '@payloadcms/db-postgres';
import { buildConfig } from './payload.config';

// Carrega variáveis de ambiente
config();

const app = express();

// Middleware para processar JSON
app.use(express.json());

// Configuração de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Pasta para servir arquivos estáticos
app.use('/assets', express.static(path.resolve(__dirname, '../../media')));

// Inicialização do Payload
const start = async () => {
  // Inicializa o Payload CMS
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'seu-segredo-seguro',
    express: app,
    config: buildConfig({
      db: new PostgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        },
      }),
    }),
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Rota de healthcheck
  app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Rota de fallback para o admin do Payload
  app.get('*', (req, res) => {
    // Se a rota não for encontrada, redireciona para o admin
    if (!req.url.startsWith('/api')) {
      res.redirect('/admin');
    } else {
      res.status(404).json({ error: 'Rota não encontrada' });
    }
  });

  // Inicia o servidor
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    payload.logger.info(`Servidor rodando em http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
}); 