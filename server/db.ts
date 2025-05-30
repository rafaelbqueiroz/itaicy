import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Get database URL from environment - Supabase PostgreSQL connection
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// URL encode the password to handle special characters
const connectionString = databaseUrl.includes('*-?A@fU3LrnQM27') 
  ? databaseUrl.replace('*-?A@fU3LrnQM27', '%2A-%3FA%40fU3LrnQM27')
  : databaseUrl;

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });