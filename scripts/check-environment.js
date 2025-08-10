#!/usr/bin/env node

// Simple script to check database environment configuration
import { getDatabaseConfig, validateEnvironment } from '../server/config/database.js';

console.log('=== AquaFlow Database Environment Check ===\n');

try {
  // Validate and get configuration
  validateEnvironment();
  const config = getDatabaseConfig();
  
  console.log('✅ Environment Configuration:');
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Database URL: ${config.databaseUrl.replace(/:[^:]*@/, ':***@')}`);
  console.log(`   Connection Pool: ${JSON.stringify(config.connectionPool)}`);
  
  if (config.environment === 'production') {
    console.log('\n🔒 Production Environment Detected:');
    console.log('   - Secure cookies enabled');
    console.log('   - Optimized connection pool settings');
    console.log('   - Enhanced security measures active');
  } else {
    console.log('\n🛠️  Development Environment Detected:');
    console.log('   - Debug logging enabled');
    console.log('   - Relaxed security settings for development');
    console.log('   - Smaller connection pool for resource efficiency');
  }
  
  console.log('\n📊 Available Commands:');
  console.log('   Development: npm run dev');
  console.log('   Production:  NODE_ENV=production npm start');
  console.log('   DB Push:     npm run db:push (for current environment)');
  console.log('   DB Push Prod: NODE_ENV=production npm run db:push');
  
} catch (error) {
  console.error('❌ Environment Configuration Error:');
  console.error(`   ${error.message}`);
  console.log('\n📝 Required Environment Variables:');
  console.log('   Development: DATABASE_URL, SESSION_SECRET');
  console.log('   Production:  PRODUCTION_DATABASE_URL, PRODUCTION_SESSION_SECRET');
  console.log('   See .env.example for details');
  process.exit(1);
}

console.log('\n✨ Environment check completed successfully!');