@echo off
echo Starting AquaFlow Local Development Server...
echo.
set NODE_ENV=development
npx tsx server/index.ts
pause