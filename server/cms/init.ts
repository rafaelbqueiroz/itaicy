import payload from 'payload';
import express from 'express';
import path from 'path';
import { PostgresAdapter } from '@payloadcms/db-postgres';
import { buildConfig } from './payload.config';

/**
 * Inicializa o Payload CMS para ser usado em um servidor Express existente
 * @param app Instância do Express
 * @param databaseUrl String de conexão com o banco de dados PostgreSQL
 * @param secret Chave secreta para o Payload
 * @returns A instância inicializada do Payload
 */
export const initPayloadCMS = async (
  app: express.Express,
  databaseUrl: string,
  secret: string = 'seu-segredo-seguro'
) => {
  // Configura a pasta de mídia
  app.use('/assets', express.static(path.resolve(__dirname, '../../media')));

  // Inicializa o Payload CMS
  await payload.init({
    secret,
    express: app,
    config: buildConfig({
      db: new PostgresAdapter({
        pool: {
          connectionString: databaseUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        },
      }),
    }),
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  return payload;
};

/**
 * Configura rotas adicionais para o CMS
 * @param app Instância do Express
 */
export const setupCMSRoutes = (app: express.Express) => {
  // Rota de healthcheck para o CMS
  app.get('/cms/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Outras rotas específicas do CMS podem ser adicionadas aqui
};

export default {
  initPayloadCMS,
  setupCMSRoutes
}; 