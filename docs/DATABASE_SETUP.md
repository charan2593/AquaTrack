# Database Environment Setup

This document explains how to set up separate development and production database environments for AquaFlow.

## Environment Configuration

The application automatically detects the environment using `NODE_ENV` and connects to the appropriate database:

- **Development** (`NODE_ENV=development` or unset): Uses `DATABASE_URL`
- **Production** (`NODE_ENV=production`): Uses `PRODUCTION_DATABASE_URL` (falls back to `DATABASE_URL`)

## Environment Variables

### Development Environment

```bash
# Required for development
DATABASE_URL=postgresql://username:password@localhost:5432/aquaflow_dev
SESSION_SECRET=your-development-session-secret

# Optional
NODE_ENV=development
```

### Production Environment

```bash
# Required for production
NODE_ENV=production
PRODUCTION_DATABASE_URL=postgresql://username:password@prod-host:5432/aquaflow_prod
PRODUCTION_SESSION_SECRET=your-secure-production-session-secret

# Fallback (if PRODUCTION_* not set)
DATABASE_URL=postgresql://username:password@prod-host:5432/aquaflow_prod
SESSION_SECRET=your-secure-production-session-secret
```

## Database Setup Steps

### 1. Development Database

1. Create a development database:
   ```sql
   CREATE DATABASE aquaflow_dev;
   ```

2. Set your development environment variables:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/aquaflow_dev
   SESSION_SECRET=dev-secret-key-change-this
   ```

3. Run database migrations:
   ```bash
   npm run db:push
   ```

### 2. Production Database

1. Create a production database (or provision through your hosting provider)

2. Set production environment variables:
   ```bash
   NODE_ENV=production
   PRODUCTION_DATABASE_URL=postgresql://username:password@prod-host:5432/aquaflow_prod
   PRODUCTION_SESSION_SECRET=secure-production-secret
   ```

3. Run database migrations for production:
   ```bash
   NODE_ENV=production npm run db:push
   ```

## Database Commands

The application uses the same commands for both environments. The environment is determined by `NODE_ENV`:

```bash
# Development (default)
npm run db:push      # Push schema to development DB
npm run db:studio    # Open database studio for development

# Production
NODE_ENV=production npm run db:push      # Push schema to production DB
NODE_ENV=production npm run db:studio    # Open database studio for production
```

## Connection Pool Settings

The application automatically configures different connection pool settings for each environment:

### Development
- Min connections: 1
- Max connections: 5
- Idle timeout: 15 seconds

### Production
- Min connections: 2
- Max connections: 10
- Idle timeout: 30 seconds

## Security Considerations

1. **Session Secrets**: Always use different, secure session secrets for development and production
2. **Database Access**: Use separate database users with appropriate permissions for each environment
3. **SSL/TLS**: Production databases should use SSL/TLS connections
4. **Secure Cookies**: Production automatically enables secure cookie settings

## Monitoring

The application logs database connection information on startup:

```
[Database Config] Environment: production
[Database Config] Database URL: postgresql://***:***@prod-host:5432/aquaflow_prod
[Database Config] Connection Pool: {"min":2,"max":10,"idleTimeout":30000}
[Database] Initializing production database connection
[Auth] Setting up authentication for production environment
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Error: `DATABASE_URL must be set for development environment`
   - Solution: Set the appropriate `DATABASE_URL` or `PRODUCTION_DATABASE_URL`

2. **Connection Pool Errors**
   - Check that your database server allows the configured number of connections
   - Adjust pool settings if needed

3. **Session Store Issues**
   - The application automatically creates the sessions table
   - Ensure your database user has CREATE TABLE permissions

### Environment Validation

The application validates environment configuration on startup and will warn about missing recommended variables for production.

## Migration Between Environments

To copy data from development to production:

1. Export development data:
   ```bash
   pg_dump aquaflow_dev > dev_backup.sql
   ```

2. Import to production:
   ```bash
   NODE_ENV=production psql $PRODUCTION_DATABASE_URL < dev_backup.sql
   ```

**⚠️ Warning**: Always backup production data before any migration operations.