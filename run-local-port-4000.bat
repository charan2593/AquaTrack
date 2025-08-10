@echo off
echo Starting AquaFlow Local Development Server on Port 4000...
echo.
echo Server will start on http://localhost:4000
echo.
set NODE_ENV=development
set PORT=4000
npx tsx server/index.ts
pause