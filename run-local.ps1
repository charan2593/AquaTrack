# PowerShell script to run AquaFlow locally
Write-Host "Starting AquaFlow Local Development Server..." -ForegroundColor Green
Write-Host "Server will start on http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
$env:NODE_ENV="development"
$env:PORT="3001"
npx tsx server/index.ts