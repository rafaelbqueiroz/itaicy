/**
 * Centralized Environment Configuration
 * Validates and provides typed access to environment variables
 */

import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? Number(val) : val).default(3000),

  // Database Configuration
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').optional(),
  DATABASE_URL_FALLBACK: z.string().optional(),

  // Supabase Configuration
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  // Client Configuration
  VITE_API_URL: z.string().optional(),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),

  // Security
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required').optional(),

  // External APIs
  OPENAI_API_KEY: z.string().optional(),

  // Development flags
  DEV_MODE_OFFLINE: z.union([z.string(), z.boolean()]).transform(val =>
    typeof val === 'string' ? val === 'true' : val
  ).default(false),
  USE_MOCK_DATA: z.union([z.string(), z.boolean()]).transform(val =>
    typeof val === 'string' ? val === 'true' : val
  ).default(false),
  VITE_DEV_MODE: z.union([z.string(), z.boolean()]).transform(val =>
    typeof val === 'string' ? val === 'true' : val
  ).default(false),
});

export type Environment = z.infer<typeof envSchema>;

class EnvironmentConfig {
  private _config: Environment | null = null;
  private _validationErrors: string[] = [];
  private _isValid = false;

  constructor() {
    this.validate();
  }

  private validate(): void {
    try {
      this._config = envSchema.parse(process.env);
      this._isValid = true;
      this._validationErrors = [];
      
      // Additional validation for production
      if (this._config.NODE_ENV === 'production') {
        this.validateProductionRequirements();
      }
      
    } catch (error) {
      this._isValid = false;
      if (error instanceof z.ZodError) {
        this._validationErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
      } else {
        this._validationErrors = ['Unknown validation error'];
      }
    }
  }

  private validateProductionRequirements(): void {
    if (!this._config) return;

    // Check required fields for production
    const requiredInProduction = [
      { key: 'DATABASE_URL', value: this._config.DATABASE_URL },
      { key: 'SESSION_SECRET', value: this._config.SESSION_SECRET },
    ];

    const missingRequired = requiredInProduction
      .filter(req => !req.value)
      .map(req => req.key);

    if (missingRequired.length > 0) {
      this._validationErrors.push(
        `Production environment missing required: ${missingRequired.join(', ')}`
      );
      this._isValid = false;
    }

    // Check optional but recommended fields
    const recommendedInProduction = [
      { key: 'SUPABASE_URL', value: this._config.SUPABASE_URL },
      { key: 'SUPABASE_SERVICE_KEY', value: this._config.SUPABASE_SERVICE_KEY },
      { key: 'OPENAI_API_KEY', value: this._config.OPENAI_API_KEY },
    ];

    const missingRecommended = recommendedInProduction
      .filter(req => !req.value)
      .map(req => req.key);

    if (missingRecommended.length > 0) {
      console.warn(`⚠️ Production environment missing recommended: ${missingRecommended.join(', ')}`);
    }
  }

  get config(): Environment {
    if (!this._config) {
      console.error('❌ Environment configuration is not valid:');
      this._validationErrors.forEach(error => console.error(`   • ${error}`));
      throw new Error('Environment configuration is not valid. Check validation errors.');
    }
    return this._config;
  }

  get isValid(): boolean {
    return this._isValid;
  }

  get validationErrors(): string[] {
    return [...this._validationErrors];
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  // Supabase configuration helpers
  get hasSupabaseConfig(): boolean {
    try {
      return !!(this.config.SUPABASE_URL && this.config.SUPABASE_SERVICE_KEY);
    } catch {
      return false;
    }
  }

  get supabaseConfig() {
    if (!this.hasSupabaseConfig) {
      return null;
    }
    return {
      url: this.config.SUPABASE_URL!,
      serviceKey: this.config.SUPABASE_SERVICE_KEY!,
      anonKey: this.config.SUPABASE_ANON_KEY
    };
  }

  // Database configuration helpers
  get databaseConfig() {
    try {
      return {
        url: this.config.DATABASE_URL,
        fallbackUrl: this.config.DATABASE_URL_FALLBACK
      };
    } catch {
      return {
        url: undefined,
        fallbackUrl: undefined
      };
    }
  }

  // Print configuration status
  printStatus(): void {
    try {
      console.log('\n🔧 Environment Configuration Status:');
      console.log(`   Mode: ${this.config.NODE_ENV}`);
      console.log(`   Port: ${this.config.PORT}`);
      console.log(`   Database: ${this.config.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);
      console.log(`   Supabase: ${this.hasSupabaseConfig ? '✅ Configured' : '❌ Missing'}`);
      console.log(`   OpenAI: ${this.config.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);

      if (!this.isValid) {
        console.log('\n❌ Configuration Errors:');
        this.validationErrors.forEach(error => {
          console.log(`   • ${error}`);
        });
      } else {
        console.log('\n✅ Configuration is valid');
      }

      if (this.isDevelopment) {
        console.log('\n🔧 Development Mode Features:');
        console.log(`   Mock Data: ${this.config.USE_MOCK_DATA ? 'Enabled' : 'Disabled'}`);
        console.log(`   Offline Mode: ${this.config.DEV_MODE_OFFLINE ? 'Enabled' : 'Disabled'}`);
      }
    } catch (error) {
      console.log('\n❌ Cannot print status - configuration is invalid');
      console.log('Validation errors:');
      this.validationErrors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
  }

  // Get safe config for client (no secrets)
  getClientConfig() {
    return {
      NODE_ENV: this.config.NODE_ENV,
      VITE_API_URL: this.config.VITE_API_URL,
      VITE_SUPABASE_URL: this.config.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: this.config.VITE_SUPABASE_ANON_KEY,
      VITE_DEV_MODE: this.config.VITE_DEV_MODE,
    };
  }
}

// Export singleton instance
export const env = new EnvironmentConfig();

// Export validation function for startup checks
export function validateEnvironment(): boolean {
  if (!env.isValid) {
    console.error('\n❌ Environment validation failed:');
    env.validationErrors.forEach(error => {
      console.error(`   • ${error}`);
    });
    return false;
  }
  
  env.printStatus();
  return true;
}

// Export helper functions
export function requireSupabase(): { url: string; serviceKey: string; anonKey?: string } {
  if (!env.hasSupabaseConfig) {
    throw new Error('Supabase configuration is required but not available');
  }
  return env.supabaseConfig!;
}

export function getSupabaseConfigOrNull() {
  return env.hasSupabaseConfig ? env.supabaseConfig : null;
}
