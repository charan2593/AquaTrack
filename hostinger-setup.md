# Hostinger Database Setup Guide

## Quick Setup for Hostinger PostgreSQL

### 1. Get Your Database Credentials from Hostinger
1. Log into your Hostinger control panel
2. Go to "Databases" section
3. Create a new PostgreSQL database (if you haven't already)
4. Note down these details:
   - **Host:** Usually `postgresql.hostinger.com` or similar
   - **Port:** Usually `5432`
   - **Database Name:** Your chosen database name
   - **Username:** Your database username
   - **Password:** Your database password

### 2. Update Your .env File
Create/update your `.env` file with your Hostinger details:

**For MySQL (Most Common):**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://username:password@hostname:port/database_name
```

**For PostgreSQL:**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@hostname:port/database_name?sslmode=disable
```

**Real MySQL Example:**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://aquaflow_user:MySecurePassword123@srv1952.hstgr.io:3306/u866935527_aquaflow
```

**Note:** SESSION_SECRET is optional - the system automatically generates a secure session secret if not provided.

### 3. Initialize Database Tables
```bash
npm run db:push
```

This creates all required tables in your empty Hostinger database:
- users (authentication)
- customers (customer data)
- services (service records)
- rent_dues (monthly rent tracking)
- purchases (AMC/purifier purchases)
- inventory (product inventory)
- sessions (user sessions)

### 4. Create Your First Admin User

**Method A: Direct API Call**
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "8500095021",
    "password": "password",
    "name": "Admin User",
    "role": "admin"
  }'
```

**Method B: Database Client (phpMyAdmin, pgAdmin, etc.)**
```sql
INSERT INTO users (mobile, password, name, role, created_at) 
VALUES (
  '8500095021', 
  '$2b$10$rBTLQHYrOb5JEIKgwKNBFOCYgCzWJSBV6FZkfXPwOZgYGKfmDNz4m',  -- This is "password" hashed
  'Admin User', 
  'admin',
  NOW()
);
```

### 5. Start Your Application
```bash
npx tsx server/index.ts
```

Visit: http://localhost:3001

**Login Credentials:**
- Mobile: 8500095021
- Password: password

### 6. Create Additional Users
Once logged in as admin, you can create more users through the User Management page:
- **Manager Users:** Can access Service Management
- **Service Boy Users:** Read-only access to Dashboard and Today's Services

## Connection String Variations

Try these different connection string formats if you get connection errors:

**Option 1: With SSL (Most Secure)**
```
postgresql://username:password@hostname:port/database_name?sslmode=require
```

**Option 2: Without SSL (For Compatibility)**
```
postgresql://username:password@hostname:port/database_name?sslmode=disable
```

**Option 3: With Connection Timeout**
```
postgresql://username:password@hostname:port/database_name?sslmode=require&connect_timeout=30
```

**Option 4: Internal Hostinger Network (if available)**
```
postgresql://username:password@localhost:5432/database_name?sslmode=disable
```

**Option 5: Alternative Port (some Hostinger plans use different ports)**
```
postgresql://username:password@hostname:3306/database_name?sslmode=disable
```

## Common Hostinger Database Hosts
- `postgresql.hostinger.com`
- `cpdb-{region}.hostinger.com`
- Direct IP addresses (check your control panel)

## Troubleshooting

### Connection Refused or Timeout
- **Check Hostinger Control Panel:** Make sure your database is running
- **Verify Host/Port:** Double-check the connection details
- **Firewall Issues:** Hostinger may restrict external connections
- **Try Alternative Connection Methods:**
  - Use Hostinger's internal hostname instead of external IP
  - Check if your hosting plan allows external database connections
  - Contact Hostinger support to enable external database access

### Authentication Failed
- Double-check username and password
- Make sure the user has access to the database
- Try connecting with a database client first

### SSL Errors
- Try different sslmode options (require, disable, prefer)
- Check if Hostinger supports SSL connections

### Permission Denied
- Ensure your database user has CREATE, INSERT, UPDATE, DELETE permissions
- Check if the database exists and is accessible

## Migration from Demo Database

If you want to copy existing data from the demo Neon database to your Hostinger database:

1. First, set up your Hostinger database (steps 1-3 above)
2. Export data from Neon database
3. Import data to Hostinger database

This would require additional setup - let me know if you need help with data migration.