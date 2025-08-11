import { defineConfig } from "drizzle-kit";

// Use development database URL in development, production database URL in production
const databaseUrl = process.env.NODE_ENV === 'production' 
  ? (process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL)
  : (process.env.DEV_DATABASE_URL || process.env.DATABASE_URL);

if (!databaseUrl) {
  throw new Error("Database URL environment variable is required. Set DEV_DATABASE_URL for development or PRODUCTION_DATABASE_URL for production.");
}

if (!databaseUrl.startsWith('mysql://')) {
  throw new Error("This configuration is for MySQL databases only. Use drizzle.config.ts for PostgreSQL.");
}

console.log(`[Drizzle Config] Using ${process.env.NODE_ENV || 'development'} database for schema operations`);

export default defineConfig({
  out: "./migrations-mysql",
  schema: "./shared/mysql-schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});