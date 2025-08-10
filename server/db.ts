import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import ws from "ws";
import * as schema from "@shared/schema";
import { getDatabaseConfig, validateEnvironment } from './config/database.js';

// Only configure neonConfig for Neon databases
const dbConfig = getDatabaseConfig();
if (dbConfig.databaseUrl.includes('neon.tech')) {
  neonConfig.webSocketConstructor = ws;
}

// Validate environment configuration on startup
validateEnvironment();

console.log(`[Database] Initializing ${dbConfig.environment} database connection`);

// Detect database type and create appropriate connection
let pool: any;
let db: any;

if (dbConfig.databaseUrl.startsWith('mysql://')) {
  // MySQL Database (Hostinger)
  console.log('[Database] Configuring MySQL connection for Hostinger');
  pool = createPool(dbConfig.databaseUrl);
  db = drizzleMysql(pool, { schema, mode: 'default' });
} else {
  // PostgreSQL Database (Neon or others)
  const poolConfig: any = { 
    connectionString: dbConfig.databaseUrl,
    ...dbConfig.connectionPool
  };

  // Handle SSL configuration for PostgreSQL
  if (dbConfig.databaseUrl.includes('neon.tech')) {
    poolConfig.ssl = { rejectUnauthorized: false };
    console.log('[Database] Configuring PostgreSQL connection for Neon (SSL enabled)');
  } else {
    poolConfig.ssl = { rejectUnauthorized: false };
    console.log('[Database] Configuring PostgreSQL connection (SSL flexible)');
  }

  pool = new Pool(poolConfig);
  db = drizzle({ client: pool, schema });
}

export { pool, db };

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