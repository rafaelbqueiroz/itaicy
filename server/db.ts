import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

const databaseUrl = process.env.DATABASE_URL!;

const sql = postgres(databaseUrl, {
  ssl: 'require',
  max: 1,
  connect_timeout: 10,
  idle_timeout: 20,
});

export const db = drizzle(sql, { schema });