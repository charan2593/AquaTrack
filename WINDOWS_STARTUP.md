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

### 1. Create .env file with your MySQL database:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://u866935527_phw_2025:your_password@82.25.121.32:3306/u866935527_purehomewaters
```

### 2. Run database migration:
```cmd
npx drizzle-kit push --config=drizzle.mysql.config.ts
```

### 3. Create initial users in MySQL:
Open MySQL command line or phpMyAdmin and run:
```sql
-- Insert Admin User
INSERT INTO users (id, mobile, password, firstName, lastName, email, role, createdAt, updatedAt) 
VALUES (UUID(), '8500095021', '$2a$10$hashedpassword.salt', 'Admin', 'User', 'admin@aquaflow.com', 'admin', NOW(), NOW());

-- Insert Manager User  
INSERT INTO users (id, mobile, password, firstName, lastName, email, role, createdAt, updatedAt)
VALUES (UUID(), '9999999999', '$2a$10$hashedpassword.salt', 'Manager', 'User', 'manager@aquaflow.com', 'manager', NOW(), NOW());

-- Insert Service Boy
INSERT INTO users (id, mobile, password, firstName, lastName, email, role, createdAt, updatedAt)
VALUES (UUID(), '7777777777', '$2a$10$hashedpassword.salt', 'Service', 'Boy', 'service@aquaflow.com', 'technician', NOW(), NOW());
```
*Note: You'll need to generate proper password hashes. For testing, use the password 'password'*

## Troubleshooting
- **NODE_ENV error:** Use the manual commands above
- **Database connection error:** Check your DATABASE_URL in `.env`
- **Port 3001 in use:** Change PORT to 4000 or another available port