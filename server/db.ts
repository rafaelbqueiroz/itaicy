import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import { getDb, getDbStatus } from './lib/database-connection';

// Create a cached database instance
let dbInstance: any = null;

// Function to get database with caching
export async function getDatabase() {
  if (!dbInstance) {
    try {
      dbInstance = await getDb();
    } catch (error) {
      console.error('Failed to get database connection:', error);
      // Fallback to direct connection for compatibility
      const databaseUrl = process.env.DATABASE_URL ||
        "postgresql://postgres.hcmrlpevcpkclqubnmmf:%2A-%3FA%40fU3LrnQM27@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
      const sql = neon(databaseUrl);
      dbInstance = drizzle(sql, { schema });
    }
  }
  return dbInstance;
}

// Export for backward compatibility
export const db = {
  select: (...args: any[]) => getDatabase().then(db => db.select(...args)),
  insert: (...args: any[]) => getDatabase().then(db => db.insert(...args)),
  update: (...args: any[]) => getDatabase().then(db => db.update(...args)),
  delete: (...args: any[]) => getDatabase().then(db => db.delete(...args)),
};

// Export status checker for health checks
export { getDbStatus };