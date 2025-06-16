#!/usr/bin/env tsx

/**
 * Configuration Check Script
 * Validates all environment variables and configuration
 */

import { env, validateEnvironment } from '../server/config/environment';

function main() {
  console.log('🔍 Checking Itaicy Eco Lodge Configuration...\n');

  // Validate environment
  const isValid = validateEnvironment();

  if (!isValid) {
    console.log('\n❌ Configuration check failed!');
    console.log('Please fix the issues above before starting the server.\n');
    process.exit(1);
  }

  // Additional checks
  console.log('\n🔧 Additional Configuration Details:');
  
  // Database configuration
  console.log('\n📊 Database Configuration:');
  console.log(`   Primary URL: ${env.config.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Fallback URL: ${env.config.DATABASE_URL_FALLBACK ? '✅ Set' : '⚠️ Optional'}`);
  
  // Supabase configuration
  console.log('\n🔐 Supabase Configuration:');
  if (env.hasSupabaseConfig) {
    console.log('   ✅ Fully configured');
    console.log(`   URL: ${env.supabaseConfig!.url}`);
    console.log(`   Service Key: ${env.supabaseConfig!.serviceKey.substring(0, 20)}...`);
    console.log(`   Anon Key: ${env.supabaseConfig!.anonKey ? 'Set' : 'Missing'}`);
  } else {
    console.log('   ⚠️ Not configured (using mock auth in development)');
  }
  
  // External APIs
  console.log('\n🤖 External APIs:');
  console.log(`   OpenAI: ${env.config.OPENAI_API_KEY ? '✅ Configured' : '⚠️ Optional'}`);
  
  // Development flags
  if (env.isDevelopment) {
    console.log('\n🔧 Development Flags:');
    console.log(`   Mock Data: ${env.config.USE_MOCK_DATA ? 'Enabled' : 'Disabled'}`);
    console.log(`   Offline Mode: ${env.config.DEV_MODE_OFFLINE ? 'Enabled' : 'Disabled'}`);
    console.log(`   Vite Dev Mode: ${env.config.VITE_DEV_MODE ? 'Enabled' : 'Disabled'}`);
  }

  // Security
  console.log('\n🔒 Security:');
  console.log(`   Session Secret: ${env.config.SESSION_SECRET.length >= 32 ? '✅ Strong' : '⚠️ Weak'} (${env.config.SESSION_SECRET.length} chars)`);

  console.log('\n✅ Configuration check completed successfully!');
  console.log('You can now start the server with: npm run dev\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
