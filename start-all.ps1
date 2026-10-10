Write-Host "Starting WeddingAlbums.in Platform..." -ForegroundColor Cyan

# Define the paths and commands
$apps = @(
    @{ Name="Backend API"; Path="server"; Command="npm run dev"; Port=4000 },
    @{ Name="B2C Client Portal"; Path="client"; Command="npm run dev -- --port 5173"; Port=5173 },
    @{ Name="B2B Studio Portal"; Path="b2b-portal"; Command="npm run dev -- --port 5174"; Port=5174 },
    @{ Name="Editor Portal"; Path="editor-portal"; Command="npm run dev -- --port 5175"; Port=5175 },
    @{ Name="Sysadmin Ops"; Path="sysadmin"; Command="npm run dev -- --port 5176"; Port=5176 },
    @{ Name="CMS Admin"; Path="uiadmin"; Command="npm run dev -- --port 5177"; Port=5177 }
)

foreach ($app in $apps) {
    Write-Host "Starting $($app.Name) on port $($app.Port)..." -ForegroundColor Yellow
    # Start each process in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $($app.Path); $($app.Command)" -WindowStyle Normal
}

Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host "Please ensure you have run 'npm install' in each folder." -ForegroundColor Yellow
