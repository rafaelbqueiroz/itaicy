import 'dotenv/config';
import http from 'http';
import { Pool } from '@neondatabase/serverless';
import { validateEnvironment, env } from './config/environment';

interface ServiceCheck {
  name: string;
  check: () => Promise<boolean>;
  required: boolean;
}

async function checkDatabase() {
  try {
    if (!env.config.DATABASE_URL) {
      throw new Error('DATABASE_URL not configured');
    }

    // In development, skip actual connection check
    if (env.isDevelopment) {
      console.log('Database check skipped in development mode');
      return true;
    }

    // Production database check
    try {
      const pool = new Pool({
        connectionString: env.config.DATABASE_URL,
        connectionTimeoutMillis: 5000,
        ssl: true
      });

      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      return true;
    } catch (dbError: unknown) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.error('Database connection failed:', errorMessage);
      return false;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown configuration error';
    console.error('Database configuration error:', errorMessage);
    return false;
  }
}

async function checkEnvironment() {
  return validateEnvironment();
}

export async function initializeServer(): Promise<boolean> {
  console.log('\n🌿 Initializing Itaicy Eco Lodge Server...\n');

  const services: ServiceCheck[] = [
    {
      name: 'Environment',
      check: checkEnvironment,
      required: true
    },
    {
      name: 'Database',
      check: checkDatabase,
      required: env.isProduction // Only required in production
    }
  ];

  if (env.isDevelopment) {
    console.log('Running in development mode - some checks are optional\n');
  }

  let allPassed = true;
  
  for (const service of services) {
    process.stdout.write(`Checking ${service.name}... `);
    
    try {
      const passed = await service.check();
      
      if (passed) {
        console.log('✓ OK');
      } else {
        console.log('✗ FAILED');
        if (service.required) {
          allPassed = false;
        }
      }
    } catch (error: unknown) {
      console.log('✗ ERROR');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Service check failed:', errorMessage);
      if (service.required) {
        allPassed = false;
      }
    }
  }

  if (allPassed) {
    console.log('\n✨ All required services are ready!\n');
  } else {
    console.log('\n❌ Some required services failed to initialize\n');
  }

  return allPassed;
}

export async function shutdownServer(server: http.Server) {
  console.log('\n🔄 Shutting down server...');
  
  return new Promise<void>((resolve) => {
    server.close(() => {
      console.log('✓ Server shutdown complete');
      resolve();
    });
  });
}
