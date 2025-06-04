import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Get database URL from environment - Supabase PostgreSQL connection
const databaseUrl = process.env.DATABASE_URL || 
  "postgresql://postgres.hcmrlpevcpkclqubnmmf:%2A-%3FA%40fU3LrnQM27@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const connectionString = databaseUrl;

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });