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
   DATABASE_URL=postgresql://neondb_owner:your_password@ep-polished-math-af7yzbh8.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
   SESSION_SECRET=your-secret-key-here
   ```

4. **Database Setup:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   
   **For Windows (Command Prompt):**
   ```cmd
   set NODE_ENV=development && npx tsx server/index.ts
   ```
   
   **For Windows (PowerShell):**
   ```powershell
   $env:NODE_ENV="development"; npx tsx server/index.ts
   ```
   
   **For Mac/Linux:**
   ```bash
   NODE_ENV=development npx tsx server/index.ts
   ```
   
   **Alternative (works on all platforms):**
   ```bash
   npx tsx server/index.ts
   ```
   (The server will default to development mode)

## Available Scripts
- `npm run dev` - Start development server (both frontend and backend)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio

## Access Points
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

## Test Accounts
- Admin: Mobile 8500095021, Password: password
- Manager: Mobile 9999999999, Password: password  
- Service Boy: Mobile 7777777777, Password: password

## Local Development Notes
- The server runs on port 5000 by default
- Frontend and backend are served from the same port
- Hot reloading is enabled for both frontend and backend
- Database connections use connection pooling for development