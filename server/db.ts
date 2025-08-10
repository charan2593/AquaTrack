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
export const pool = new Pool({ 
  connectionString: dbConfig.databaseUrl,
  ...dbConfig.connectionPool
});

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