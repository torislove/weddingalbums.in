# ========================================================
# weddingalbums.in - Install All Dependencies
# ========================================================
$baseDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$apps = @("server", "client", "b2b-portal", "editor-portal", "sysadmin", "uiadmin")

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Installing dependencies for all 6 applications..." -ForegroundColor Cyan
Write-Host "Base Directory: $baseDir" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

foreach ($app in $apps) {
    $appPath = Join-Path $baseDir $app
    if (Test-Path $appPath) {
        Write-Host "`n----------------------------------------------------" -ForegroundColor Yellow
        Write-Host "Installing node modules for: $app" -ForegroundColor Yellow
        Write-Host "----------------------------------------------------" -ForegroundColor Yellow
        
        Push-Location $appPath
        try {
            npm install
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to install dependencies for $app"
                exit $LASTEXITCODE
            }
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Warning "Directory not found: $appPath"
    }
}

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "All node modules installed successfully!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
