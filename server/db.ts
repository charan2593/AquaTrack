import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { getDatabaseConfig, validateEnvironment } from './config/database.js';

neonConfig.webSocketConstructor = ws;

// Validate environment configuration on startup
validateEnvironment();

// Get database configuration for current environment
const dbConfig = getDatabaseConfig();

console.log(`[Database] Initializing ${dbConfig.environment} database connection`);

// Create connection pool with environment-specific settings
const poolConfig: any = { 
  connectionString: dbConfig.databaseUrl,
  ...dbConfig.connectionPool
};

// Handle SSL configuration for different database providers
if (dbConfig.databaseUrl.includes('hostinger') || dbConfig.databaseUrl.includes('srv1952.hstgr.io') || dbConfig.databaseUrl.includes('hstgr.io')) {
  // Hostinger database - disable SSL
  poolConfig.ssl = false;
  console.log('[Database] Configuring for Hostinger database (SSL disabled)');
} else if (dbConfig.databaseUrl.includes('neon.tech')) {
  // Neon database - requires SSL
  poolConfig.ssl = { rejectUnauthorized: false };
  console.log('[Database] Configuring for Neon database (SSL enabled)');
} else {
  // Other external databases - try flexible SSL
  poolConfig.ssl = { rejectUnauthorized: false };
  console.log('[Database] Configuring for external database (SSL flexible)');
}

export const pool = new Pool(poolConfig);

export const db = drizzle({ client: pool, schema });

// Export configuration for use in other parts of the application
export { dbConfig };

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('[Database] Closing database connections...');
  await pool.end();
  console.log('[Database] Database connections closed.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[Database] Closing database connections...');
  await pool.end();
  console.log('[Database] Database connections closed.');
  process.exit(0);
});