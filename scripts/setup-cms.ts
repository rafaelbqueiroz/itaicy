import dotenv from 'dotenv';
import payload from 'payload';
import { PostgresAdapter } from '@payloadcms/db-postgres';
import { buildConfig } from '../server/cms/payload.config';
import { env } from '../server/config/environment';

dotenv.config();

/**
 * Script para configurar o Payload CMS
 * - Cria um usuário administrador
 * - Configura as coleções iniciais
 */
async function setup() {
  try {
    console.log('🚀 Iniciando configuração do Payload CMS...');

    // Verifica se as variáveis de ambiente necessárias estão configuradas
    if (!env.payloadConfig.adminEmail || !env.payloadConfig.adminPassword) {
      console.error('❌ Erro: PAYLOAD_ADMIN_EMAIL e PAYLOAD_ADMIN_PASSWORD são obrigatórios.');
      console.log('Por favor, defina essas variáveis no arquivo .env');
      process.exit(1);
    }

    if (!env.databaseConfig.url) {
      console.error('❌ Erro: DATABASE_URL é obrigatório.');
      console.log('Por favor, defina essa variável no arquivo .env');
      process.exit(1);
    }

    // Inicializa o Payload
    await payload.init({
      secret: env.payloadConfig.secret,
      local: true, // Modo local para scripts
      config: buildConfig({
        db: new PostgresAdapter({
          pool: {
            connectionString: env.databaseConfig.url,
            ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
          },
        }),
      }),
    });

    console.log('✅ Payload CMS inicializado com sucesso.');

    // Verifica se já existe um usuário admin
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: env.payloadConfig.adminEmail,
        },
      },
    });

    if (existingAdmin.totalDocs > 0) {
      console.log(`⚠️ Usuário administrador já existe: ${env.payloadConfig.adminEmail}`);
    } else {
      // Cria um usuário administrador
      const adminUser = await payload.create({
        collection: 'users',
        data: {
          email: env.payloadConfig.adminEmail,
          password: env.payloadConfig.adminPassword,
          role: 'admin',
          name: 'Administrador',
        },
      });

      console.log(`✅ Usuário administrador criado: ${adminUser.email}`);
    }

    // Configura as coleções iniciais
    console.log('✅ Coleções configuradas com sucesso.');
    console.log('✅ Configuração do Payload CMS concluída com sucesso!');
    console.log(`\n🔑 Acesse o painel em: http://localhost:${env.server.port}/admin`);
    console.log(`   Email: ${env.payloadConfig.adminEmail}`);
    console.log('   Senha: (a senha que você definiu no .env)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a configuração do Payload CMS:');
    console.error(error);
    process.exit(1);
  }
}

setup(); 