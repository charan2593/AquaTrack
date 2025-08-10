# PowerShell script to run AquaFlow locally
Write-Host "Starting AquaFlow Local Development Server..." -ForegroundColor Green
Write-Host ""
$env:NODE_ENV="development"
npx tsx server/index.ts