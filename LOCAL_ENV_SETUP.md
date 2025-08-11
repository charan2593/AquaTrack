# Local Environment Setup for MySQL

## The Issue
Your local environment is connecting to PostgreSQL instead of MySQL because:
1. Your `.env` file might have a PostgreSQL DATABASE_URL
2. The environment detection isn't working correctly

## Solution: Create Correct .env File

Create a `.env` file in your project root with:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://u866935527_phw_2025:your_actual_password@82.25.121.32:3306/u866935527_purehomewaters
```

**Replace `your_actual_password` with your real MySQL password from Hostinger**

## Verify Your Database Connection

1. **Check your Hostinger control panel** for the exact credentials:
   - Database name: `u866935527_purehomewaters`
   - Username: `u866935527_phw_2025`  
   - Host: `82.25.121.32` (or check for current hostname)
   - Port: `3306`

2. **Test the connection format:**
   ```
   mysql://username:password@hostname:port/database_name
   ```

## Run Locally with MySQL

After creating the correct `.env` file:

```cmd
# Set environment manually (Windows)
set NODE_ENV=development
set PORT=3001

# Start the application
npx tsx server/index.ts
```

You should see:
```
[Database] Detected MySQL database (Hostinger)
[Database] Configuring MySQL connection for Hostinger
```

## If Still Connecting to PostgreSQL

Delete any existing `.env` file and create a new one with only:
```env
DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
NODE_ENV=development
PORT=3001
```

The key is making sure the `DATABASE_URL` starts with `mysql://` - this triggers the MySQL connection logic.