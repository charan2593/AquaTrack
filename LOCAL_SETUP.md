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
   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://neondb_owner:npg_eF4ZaH7sMqgp@ep-polished-math-af7yzbh8.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
   SESSION_SECRET=aquaflow-dev-secret-key-12345
   ```
   
   **Note:** The PORT is set to 3001 to avoid conflicts with other local services. The DATABASE_URL connects to the Neon database with all existing data.

4. **Database Setup:**
   ```bash
   npm run db:push
   ```
   
   **Note:** If you get authentication errors, make sure your `.env` file has the correct DATABASE_URL with the right password. The database is already set up on Neon, so this step just ensures your schema is current.

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