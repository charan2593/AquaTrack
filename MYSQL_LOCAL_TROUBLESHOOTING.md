# MySQL Local Connection Troubleshooting

## Current Issue: MySQL not connecting locally

### Step 1: Check Your .env File
Your `.env` file should contain:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://u866935527_phw_2025:YOUR_ACTUAL_PASSWORD@82.25.121.32:3306/u866935527_purehomewaters
```

### Step 2: Verify Hostinger Database Settings
In your Hostinger control panel, check:
1. **Database name**: u866935527_purehomewaters
2. **Username**: u866935527_phw_2025
3. **Host/IP**: May be different than 82.25.121.32
4. **Password**: Get the exact password
5. **Remote access**: Must be enabled for your IP

### Step 3: Common Hostinger Connection Formats
Try these different formats in your `.env`:

**Format 1 (Current):**
```env
DATABASE_URL=mysql://u866935527_phw_2025:password@82.25.121.32:3306/u866935527_purehomewaters
```

**Format 2 (With srv hostname):**
```env
DATABASE_URL=mysql://u866935527_phw_2025:password@srv1952.hstgr.io:3306/u866935527_purehomewaters
```

**Format 3 (With SSL disabled):**
```env
DATABASE_URL=mysql://u866935527_phw_2025:password@82.25.121.32:3306/u866935527_purehomewaters?ssl=false
```

### Step 4: Enable Remote Access in Hostinger
1. Log into your Hostinger control panel
2. Go to Databases → MySQL Databases
3. Find your database: u866935527_purehomewaters
4. Click "Remote MySQL" or "Remote Access"
5. Add your local IP address or use "%" for any IP (less secure)

### Step 5: Test Connection with Debug Script
Run this to test your connection:
```cmd
node debug-mysql-local.js
```

### Step 6: Alternative Local Testing
If MySQL still doesn't work locally, you can:

**Option A: Use PostgreSQL locally**
```env
DATABASE_URL=postgresql://localhost:5432/aquaflow_local
```

**Option B: Continue development in Replit**
The MySQL connection works in Replit, so you can develop here and deploy later.

### Common Error Solutions

**Error: Access denied**
- Check password in Hostinger control panel
- Verify username is exactly: u866935527_phw_2025
- Enable remote access for your IP

**Error: Connection timeout**
- Your firewall may be blocking port 3306
- Try different hostname (srv1952.hstgr.io instead of IP)
- Contact Hostinger support about remote access

**Error: Unknown database**
- Database name must be exactly: u866935527_purehomewaters
- Check if database exists in your Hostinger panel

### Quick Local Development Solution
If you want to develop locally immediately:

1. **Install local MySQL:**
   - Download MySQL Community Server
   - Create local database named "aquaflow_local"
   
2. **Use local connection:**
   ```env
   DATABASE_URL=mysql://root:your_local_password@localhost:3306/aquaflow_local
   ```

3. **Run migrations:**
   ```cmd
   npx drizzle-kit push --config=drizzle.mysql.config.ts
   ```

This gives you a working local environment while we fix the Hostinger remote connection.