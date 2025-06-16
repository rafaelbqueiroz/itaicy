import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

interface ConnectionConfig {
  url: string;
  name: string;
  timeout: number;
}

class DatabaseConnectionManager {
  private connections: ConnectionConfig[] = [];
  private currentConnection: any = null;
  private lastSuccessfulConnection: string = "";
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.setupConnections();
  }

  private setupConnections() {
    // Primary connection (Pooler)
    if (process.env.DATABASE_URL) {
      this.connections.push({
        url: process.env.DATABASE_URL,
        name: "Supabase Pooler",
        timeout: 5000
      });
    }

    // Fallback connection (Direct)
    if (process.env.DATABASE_URL_FALLBACK) {
      this.connections.push({
        url: process.env.DATABASE_URL_FALLBACK,
        name: "Supabase Direct",
        timeout: 10000
      });
    }

    // Local development fallback
    if (process.env.NODE_ENV === 'development') {
      this.connections.push({
        url: "postgresql://localhost:5432/itaicy_dev",
        name: "Local PostgreSQL",
        timeout: 3000
      });
    }
  }

  async getConnection() {
    // Return existing connection if available
    if (this.currentConnection && this.retryCount === 0) {
      return this.currentConnection;
    }

    // Try each connection in order
    for (const config of this.connections) {
      try {
        console.log(`🔄 Attempting connection to ${config.name}...`);
        
        const sql = neon(config.url);
        const db = drizzle(sql, { schema });

        // Test the connection with a simple query
        await this.testConnection(sql);
        
        console.log(`✅ Successfully connected to ${config.name}`);
        this.currentConnection = db;
        this.lastSuccessfulConnection = config.name;
        this.retryCount = 0;
        
        return db;
      } catch (error) {
        console.log(`❌ Failed to connect to ${config.name}:`, error.message);
        continue;
      }
    }

    // If all connections fail, use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.log("🔧 All database connections failed. Using mock data for development.");
      return this.createMockConnection();
    }

    throw new Error("All database connections failed");
  }

  private async testConnection(sql: any) {
    const result = await sql`SELECT 1 as test`;
    if (!result || result.length === 0) {
      throw new Error("Connection test failed");
    }
  }

  private createMockConnection() {
    // Return a mock database object for development
    return {
      select: () => ({
        from: () => ({
          where: () => [],
          limit: () => [],
          orderBy: () => []
        })
      }),
      insert: () => ({
        into: () => ({
          values: () => ({ returning: () => [{ id: 1 }] })
        })
      }),
      update: () => ({
        set: () => ({
          where: () => ({ returning: () => [{ id: 1 }] })
        })
      }),
      delete: () => ({
        from: () => ({
          where: () => ({ returning: () => [{ id: 1 }] })
        })
      })
    };
  }

  async reconnect() {
    this.currentConnection = null;
    this.retryCount++;
    
    if (this.retryCount > this.maxRetries) {
      this.retryCount = 0;
      throw new Error("Max reconnection attempts reached");
    }
    
    return this.getConnection();
  }

  getStatus() {
    return {
      connected: !!this.currentConnection,
      lastSuccessfulConnection: this.lastSuccessfulConnection,
      retryCount: this.retryCount,
      availableConnections: this.connections.map(c => c.name)
    };
  }
}

// Singleton instance
export const dbManager = new DatabaseConnectionManager();

// Export the connection getter
export async function getDb() {
  try {
    return await dbManager.getConnection();
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

// Export status checker
export function getDbStatus() {
  return dbManager.getStatus();
}
