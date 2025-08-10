# Local Development Setup Guide

This guide will help you set up the AquaFlow water purifier service management system on your local machine.

## Prerequisites

### 1. Install Node.js
- Download and install Node.js (version 18 or higher) from [nodejs.org](https://nodejs.org/)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install PostgreSQL
Choose one of the following options:

#### Option A: Local PostgreSQL Installation
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: Use Homebrew: `brew install postgresql`
- **Linux**: Use package manager: `sudo apt-get install postgresql postgresql-contrib`

#### Option B: Docker PostgreSQL (Recommended)
```bash
# Install Docker first, then run:
docker run --name aquaflow-postgres \
  -e POSTGRES_DB=aquaflow_dev \
  -e POSTGRES_USER=aquaflow_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

#### Option C: Cloud Database (Neon, Supabase, etc.)
- Create a free PostgreSQL database on [Neon](https://neon.tech/) or [Supabase](https://supabase.com/)
- Get the connection string

## Project Setup

### 1. Clone/Download the Project
```bash
# If using git:
git clone <your-repository-url>
cd aquaflow

# Or download and extract the project files
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

#### Create Environment File
Copy the example environment file:
```bash
cp .env.example .env
```

#### Configure Development Environment
Edit the `.env` file with your database details:

```bash
# Development Database
DATABASE_URL=postgresql://aquaflow_user:your_password@localhost:5432/aquaflow_dev
SESSION_SECRET=your-development-session-secret-key

# Optional: Production settings (for later)
# PRODUCTION_DATABASE_URL=postgresql://user:pass@prod-host:5432/aquaflow_prod
# PRODUCTION_SESSION_SECRET=your-production-session-secret

# Application Settings
NODE_ENV=development
PORT=5000
```

#### Database URL Examples
Choose the format that matches your setup:

```bash
# Local PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Docker PostgreSQL
DATABASE_URL=postgresql://aquaflow_user:your_password@localhost:5432/aquaflow_dev

# Neon (cloud)
DATABASE_URL=postgresql://username:password@ep-xxx.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require

# Supabase (cloud)
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### 4. Database Setup

#### Create Database (if using local PostgreSQL)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE aquaflow_dev;
CREATE USER aquaflow_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aquaflow_dev TO aquaflow_user;
\q
```

#### Run Database Migrations
```bash
npm run db:push
```

This will create all necessary tables in your database.

### 5. Start the Application

#### Development Mode
```bash
npm run dev
```

The application will start with:
- Backend API server: `http://localhost:5000`
- Frontend development server: `http://localhost:5000` (integrated)

#### Verify Setup
1. Open `http://localhost:5000` in your browser
2. You should see the AquaFlow login page
3. Check the console for successful database connection logs:
   ```
   [Database Config] Environment: development
   [Database] Initializing development database connection
   [Auth] Setting up authentication for development environment
   [express] serving on port 5000
   ```

## Development Workflow

### Available Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push          # Push schema changes
npm run db:studio        # Open database studio

# Check TypeScript
npm run check
```

### Environment Testing
Test your setup with the environment checker:
```bash
node scripts/check-environment.js
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: DATABASE_URL must be set for development environment
```
**Solution**: Check your `.env` file and ensure `DATABASE_URL` is correctly set.

#### 2. PostgreSQL Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solutions**:
- Ensure PostgreSQL is running: `sudo service postgresql start` (Linux) or check Docker container
- Verify port 5432 is available
- Check username/password in DATABASE_URL

#### 3. Permission Denied
```
Error: permission denied for database
```
**Solution**: Grant proper permissions to your database user:
```sql
GRANT ALL PRIVILEGES ON DATABASE aquaflow_dev TO aquaflow_user;
GRANT ALL ON SCHEMA public TO aquaflow_user;
```

#### 4. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: 
- Kill the process using port 5000: `lsof -ti:5000 | xargs kill -9`
- Or change the port in your `.env` file: `PORT=3000`

#### 5. Module Not Found Errors
```
Error: Cannot find module '@shared/schema'
```
**Solution**: Ensure all dependencies are installed: `npm install`

### Database Studio Access
To view and manage your database visually:
```bash
npm run db:studio
```
This opens Drizzle Studio in your browser.

## Production Setup

### 1. Environment Variables
Set production environment variables:
```bash
NODE_ENV=production
PRODUCTION_DATABASE_URL=postgresql://user:pass@prod-host:5432/aquaflow_prod
PRODUCTION_SESSION_SECRET=secure-production-secret
```

### 2. Build and Deploy
```bash
npm run build
NODE_ENV=production npm start
```

## Security Considerations

### Development
- Use a simple session secret for development
- Database can be on localhost without SSL

### Production
- Use a strong, random session secret
- Enable SSL for database connections
- Use environment variables, never hardcode credentials
- Consider using a secrets management service

## Next Steps

Once your local setup is working:

1. **Create an admin user** through the registration form
2. **Add sample customers** to test the system
3. **Explore the inventory management** features
4. **Test service scheduling** functionality
5. **Review the dashboard analytics**

## Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify your database connection string
3. Ensure all environment variables are set correctly
4. Try restarting the database and application
5. Check that all required ports are available

The application includes comprehensive logging to help diagnose issues. Look for messages starting with `[Database]`, `[Auth]`, and `[express]` in your console.