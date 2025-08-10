@echo off
echo Starting AquaFlow Local Development Server...
echo.
echo Server will start on http://localhost:3001
echo.
set NODE_ENV=development
set PORT=3001
npx tsx server/index.ts
pause