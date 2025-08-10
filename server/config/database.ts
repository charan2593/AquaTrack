// Database environment configuration
export interface DatabaseConfig {
  environment: 'development' | 'production';
  databaseUrl: string;
  sessionSecret: string;
  connectionPool?: {
    min?: number;
    max?: number;
    idleTimeout?: number;
  };
}

export function getDatabaseConfig(): DatabaseConfig {
  const environment = (process.env.NODE_ENV || 'development') as 'development' | 'production';
  
  let databaseUrl: string;
  let sessionSecret: string;

  if (environment === 'production') {
    databaseUrl = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL || '';
    sessionSecret = process.env.PRODUCTION_SESSION_SECRET || process.env.SESSION_SECRET || 'production-secret-key';
    
    if (!databaseUrl) {
      throw new Error(
        'PRODUCTION_DATABASE_URL must be set for production environment. ' +
        'Please provide this environment variable.'
      );
    }
    
    if (!process.env.PRODUCTION_SESSION_SECRET) {
      console.warn('[Warning] PRODUCTION_SESSION_SECRET not set, using fallback');
    }
  } else {
    // For development: Use DATABASE_URL from .env or fallback to Neon
    databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_eF4ZaH7sMqgp@ep-polished-math-af7yzbh8.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';
    sessionSecret = process.env.SESSION_SECRET || 'aquaflow-dev-session-secret-key-' + Math.random().toString(36).substring(2, 15);
    
    if (!databaseUrl) {
      console.error('DATABASE_URL not found in environment variables');
      throw new Error(
        'DATABASE_URL must be set for development environment. ' +
        'Please add DATABASE_URL to your .env file with your Hostinger database connection string.'
      );
    }
  }

  const config: DatabaseConfig = {
    environment,
    databaseUrl,
    sessionSecret,
    connectionPool: environment === 'production' ? {
      min: 2,
      max: 10,
      idleTimeout: 30000
    } : {
      min: 1,
      max: 5,
      idleTimeout: 15000
    }
  };

  // Log configuration (without exposing sensitive data)
  console.log(`[Database Config] Environment: ${environment}`);
  console.log(`[Database Config] Database URL: ${databaseUrl.replace(/:[^:]*@/, ':***@')}`);
  console.log(`[Database Config] Connection Pool: ${JSON.stringify(config.connectionPool)}`);

  // Test database connection and log database type
  if (databaseUrl.startsWith('mysql://')) {
    console.log('[Database] Detected MySQL database (Hostinger)');
  } else if (databaseUrl.includes('hostinger') || databaseUrl.includes('hstgr.io') || databaseUrl.includes('145.79.209.203')) {
    console.log('[Database] Detected Hostinger PostgreSQL database - SSL will be disabled for compatibility');
  } else if (databaseUrl.includes('neon.tech')) {
    console.log('[Database] Detected Neon PostgreSQL database - SSL will be enabled');
  }

  return config;
}

export function validateEnvironment(): void {
  const config = getDatabaseConfig();
  
  if (config.environment === 'production') {
    // Production environment checks
    const requiredEnvVars = [
      'PRODUCTION_DATABASE_URL',
      'PRODUCTION_SESSION_SECRET'
    ];
    
    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName] && !process.env[varName.replace('PRODUCTION_', '')]
    );
    
    if (missingVars.length > 0) {
      console.warn(
        `[Production Warning] Missing recommended environment variables: ${missingVars.join(', ')}`
      );
    }
    
    // Additional production checks
    if (config.sessionSecret === 'production-secret-key') {
      console.warn('[Security Warning] Using default session secret in production!');
    }
  }
  
  console.log(`[Environment] Successfully validated ${config.environment} configuration`);
}