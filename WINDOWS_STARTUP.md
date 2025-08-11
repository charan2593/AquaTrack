# Windows Local Startup Guide

## Quick Start Commands

Open Command Prompt in your AquaTrack folder and run these commands:

### Option 1: Use the Windows Batch File
```cmd
run-local-windows.bat
```

### Option 2: Manual Commands
```cmd
set NODE_ENV=development
set PORT=3001
npx tsx server/index.ts
```

### Option 3: PowerShell (if you prefer)
```powershell
$env:NODE_ENV="development"
$env:PORT="3001"
npx tsx server/index.ts
```

## Expected Output
You should see:
```
[Database Config] Environment: development
[Database Config] Database URL: mysql://...
[Database] Detected MySQL database (Hostinger)
[Database] Connection initialized successfully
[Auth] Using MySQL session store
[express] serving on port 3001
```

## Access Your Application
- **Frontend:** http://localhost:3001
- **Login Credentials:**
  - Admin: `8500095021` / `password`
  - Manager: `9999999999` / `password`
  - Service Boy: `7777777777` / `password`

## First Time Setup
If this is your first time:
1. Make sure you have `.env` file with your MySQL DATABASE_URL
2. Run the database migration: `npx drizzle-kit push --config=drizzle.mysql.config.ts`
3. Create initial users by inserting them manually in your MySQL database

## Troubleshooting
- **NODE_ENV error:** Use the manual commands above
- **Database connection error:** Check your DATABASE_URL in `.env`
- **Port 3001 in use:** Change PORT to 4000 or another available port