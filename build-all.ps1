# ========================================================
# weddingalbums.in - Build All Frontend Applications
# ========================================================
$baseDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$frontends = @("client", "b2b-portal", "editor-portal", "sysadmin", "uiadmin")

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Building all frontend applications..." -ForegroundColor Cyan
Write-Host "Base Directory: $baseDir" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

foreach ($app in $frontends) {
    $appPath = Join-Path $baseDir $app
    if (Test-Path $appPath) {
        Write-Host "`n----------------------------------------------------" -ForegroundColor Yellow
        Write-Host "Building: $app" -ForegroundColor Yellow
        Write-Host "----------------------------------------------------" -ForegroundColor Yellow
        
        Push-Location $appPath
        try {
            npm run build
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Build failed for $app"
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
Write-Host "All applications built successfully!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
