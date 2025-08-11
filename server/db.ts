import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import ws from "ws";
import { getDatabaseConfig, validateEnvironment } from './config/database.js';

// Get database configuration for current environment
const dbConfig = getDatabaseConfig();

// Only configure neonConfig for Neon databases
if (dbConfig.databaseUrl.includes('neon.tech')) {
  neonConfig.webSocketConstructor = ws;
}

// Validate environment configuration on startup
validateEnvironment();

console.log(`[Database] Initializing ${dbConfig.environment} database connection`);

// Detect database type and create appropriate connection
let pool: any;
let db: any;

async function initializeDatabase() {
  if (dbConfig.databaseUrl.startsWith('mysql://')) {
    // MySQL Database (Hostinger)
    console.log('[Database] Configuring MySQL connection for Hostinger');
    const mysqlSchema = await import("@shared/mysql-schema");
    const mysqlPool = createPool(dbConfig.databaseUrl);
    const mysqlDb = drizzleMysql(mysqlPool, { schema: mysqlSchema, mode: 'default' });
    return { pool: mysqlPool, db: mysqlDb };
  } else {
    // PostgreSQL Database (Neon or others)
    const pgSchema = await import("@shared/schema");
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

    const pgPool = new Pool(poolConfig);
    const pgDb = drizzle({ client: pgPool, schema: pgSchema });
    return { pool: pgPool, db: pgDb };
  }
}

// Initialize database connection
initializeDatabase().then(({ pool: poolInstance, db: dbInstance }) => {
  pool = poolInstance;
  db = dbInstance;
  console.log('[Database] Connection initialized successfully');
}).catch(error => {
  console.error('[Database] Failed to initialize connection:', error);
  process.exit(1);
});

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