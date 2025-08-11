import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

if (!process.env.DATABASE_URL.startsWith('mysql://')) {
  throw new Error("This configuration is for MySQL databases only. Use drizzle.config.ts for PostgreSQL.");
}

export default defineConfig({
  out: "./migrations-mysql",
  schema: "./shared/mysql-schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});