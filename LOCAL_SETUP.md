# Local Development Setup

## Prerequisites
- Node.js 18+ installed on your machine
- PostgreSQL database (you can use the same Neon database or set up a local one)

## Setup Steps

1. **Clone/Download the project files** to your local machine

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory with:
   
   **Option A: Use Hostinger Database (Recommended for your own data)**
   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://username:password@hostname:port/database_name?sslmode=require
   ```
   
   **Option B: Use Existing Neon Database (With demo data)**
   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://neondb_owner:npg_eF4ZaH7sMqgp@ep-polished-math-af7yzbh8.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
   ```
   
   **Note:** SESSION_SECRET is optional - the system will auto-generate one if not provided.

4. **Database Setup:**
   ```bash
   npm run db:push
   ```
   
   **Important Notes:**
   - **For Hostinger Database:** This command will create all the required tables in your empty database
   - **For Neon Database:** The tables already exist, so this just ensures your schema is current
   - If you get authentication errors, double-check your DATABASE_URL connection string

5. **Start the development server:**
   
   **For Windows (Command Prompt):**
   ```cmd
   set NODE_ENV=development && set PORT=3001 && npx tsx server/index.ts
   ```
   
   **For Windows (PowerShell):**
   ```powershell
   $env:NODE_ENV="development"; $env:PORT="3001"; npx tsx server/index.ts
   ```
   
   **For Mac/Linux:**
   ```bash
   NODE_ENV=development PORT=3001 npx tsx server/index.ts
   ```
   
   **Easiest (with .env file):**
   ```bash
   npx tsx server/index.ts
   ```
   (Reads PORT and other settings from .env file automatically)

## Available Scripts
- `npm run dev` - Start development server (both frontend and backend)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio

## Access Points
- Frontend: http://localhost:3001 (or whatever PORT you set in .env)
- Backend API: http://localhost:3001/api

## Test Accounts
- Admin: Mobile 8500095021, Password: password
- Manager: Mobile 9999999999, Password: password  
- Service Boy: Mobile 7777777777, Password: password

## Local Development Notes
- The server runs on port 5000 by default
- Frontend and backend are served from the same port
- Hot reloading is enabled for both frontend and backend
- Database connections use connection pooling for development

## Connecting to Your Hostinger Database

### Step 1: Get Your Hostinger Database Details
Log into your Hostinger control panel and find these details:
- **Host/Server:** Usually something like `postgresql.hostinger.com` or an IP address
- **Port:** Usually `5432` (default PostgreSQL port)
- **Database Name:** Your database name
- **Username:** Your database username
- **Password:** Your database password

### Step 2: Create the Connection String
Replace the placeholders in this format:
```
postgresql://username:password@hostname:port/database_name?sslmode=require
```

**Example:**
```
DATABASE_URL=postgresql://aquaflow_user:MyPassword123@postgresql.hostinger.com:5432/aquaflow_db?sslmode=require
```

### Step 3: Update Your .env File
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://your_username:your_password@your_host:5432/your_database?sslmode=require
```

### Step 4: Initialize Your Database
```bash
npm run db:push
```

This will create all the required tables:
- `users` (for authentication)
- `customers` (customer management)
- `services` (service records)
- `rent_dues` (rent tracking)
- `purchases` (purchase history)
- `inventory` (inventory management)
- `sessions` (user sessions)

### Step 5: Create Admin User
After the database is set up, you'll need to create an admin user. The system doesn't allow public registration - all users must be created by an admin.

**Option A: Use the API directly**
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8500095021","password":"password","name":"Admin User","role":"admin"}'
```

**Option B: Use a database client**
Connect to your Hostinger database and insert directly:
```sql
INSERT INTO users (mobile, password, name, role) 
VALUES ('8500095021', '$scrypt$N$8$1$hashedpassword', 'Admin User', 'admin');
```

### Step 6: Test the Connection
Start your server and try logging in:
```bash
npx tsx server/index.ts
```
Visit: http://localhost:3001

**Login with:**
- Mobile: 8500095021
- Password: password

## Troubleshooting

### Database Connection Issues
If you get "password authentication failed" errors:
1. Make sure your `.env` file has the correct DATABASE_URL
2. The database is hosted on Neon and already contains all the tables and test user accounts
3. You can skip `npm run db:push` if you get connection errors - the database is already set up

### Port Conflict Issues
If you get "EADDRINUSE" or "ENOTUP" port errors:
1. Make sure no other service is running on port 3001
2. Try a different port by changing PORT in your `.env` file (e.g., PORT=3002)
3. On Windows, check if Windows Reserved Ports are causing conflicts
4. Use `netstat -ano | findstr :3001` to check what's using the port

### Windows Command Issues
- Use the provided `run-local.bat` file for easiest startup on Windows
- Or use PowerShell with the `run-local.ps1` script
- Command Prompt syntax: `set NODE_ENV=development && npx tsx server/index.ts`