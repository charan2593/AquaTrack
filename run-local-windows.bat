@echo off
title AquaFlow Water Purifier Management System
echo ===============================================
echo Starting AquaFlow Local Development Server...
echo ===============================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create .env file with your database configuration:
    echo DATABASE_URL=mysql://username:password@hostname:port/database_name
    echo NODE_ENV=development
    echo PORT=3001
    echo.
    echo See .env.example for reference
    echo.
    pause
    exit /b 1
)

REM Set environment variables for Windows
set NODE_ENV=development
set PORT=3001

echo Environment: %NODE_ENV%
echo Port: %PORT%
echo.
echo Server will start on http://localhost:%PORT%
echo.
echo Starting server...
echo.

REM Start the application directly with tsx
npx tsx server/index.ts

echo.
echo Server stopped. Press any key to exit...
pause