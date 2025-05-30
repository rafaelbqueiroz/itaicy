import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// URL encode the database URL to handle special characters in password
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres.hcmrlpevcpkclqubnmmf:%2A-%3FA%40fU3LrnQM27@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });