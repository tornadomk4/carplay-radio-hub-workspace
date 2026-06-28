# Circuit Self-Check Script
# Runs diagnostics on all installed tools, MCPs, and services
# Run from main session (not cron) since it needs direct port access

Write-Host "=== CIRCUIT SELF-CHECK $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" -ForegroundColor Cyan

$failures = @()

# 1. Core tools
Write-Host "`n[1] CORE TOOLS" -ForegroundColor Yellow
$coreTools = @(
    "node", "npm", "git", "python", "pip", "curl", "winget",
    "gog", "himalaya", "mcporter", "edge-tts", "gh", "pm2"
)
foreach ($tool in $coreTools) {
    $path = Get-Command $tool -ErrorAction SilentlyContinue
    if ($path) {
        $ver = & $tool --version 2>$null | Select-Object -First 1
        Write-Host "  OK $tool $ver" -ForegroundColor Green
    } else {
        Write-Host "  MISSING $tool" -ForegroundColor Red
        $failures += "tool:$tool"
    }
}

# 2. Services
Write-Host "`n[2] SERVICES" -ForegroundColor Yellow
$services = @(
    @{Name="Dashboard"; Port=8081},
    @{Name="SearxNG"; Port=8080},
    @{Name="Ollama"; Port=11434},
    @{Name="Gateway"; Port=18789}
)
foreach ($svc in $services) {
    $result = Test-NetConnection -ComputerName 127.0.0.1 -Port $svc.Port -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "  OK $($svc.Name) (port $($svc.Port))" -ForegroundColor Green
    } else {
        Write-Host "  DOWN $($svc.Name) (port $($svc.Port))" -ForegroundColor Red
        $failures += "service:$($svc.Name)"
    }
}

# 3. Philips Hue
Write-Host "`n[3] PHILIPS HUE" -ForegroundColor Yellow
$hueResult = Test-NetConnection -ComputerName 192.168.1.151 -Port 80 -WarningAction SilentlyContinue
if ($hueResult.TcpTestSucceeded) {
    Write-Host "  OK Bridge (192.168.1.151)" -ForegroundColor Green
} else {
    Write-Host "  DOWN Bridge (192.168.1.151)" -ForegroundColor Red
    $failures += "service:Hue"
}

# 4. Ollama models
Write-Host "`n[4] OLLAMA MODELS" -ForegroundColor Yellow
try {
    $models = Invoke-WebRequest -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 5 -UseBasicParsing
    $modelList = $models.Content | ConvertFrom-Json
    foreach ($m in $modelList.models) {
        $size = [math]::Round($m.size/1GB, 1)
        Write-Host "  OK $($m.name) ($size GB)" -ForegroundColor Green
    }
} catch {
    Write-Host "  DOWN - Cannot reach Ollama API" -ForegroundColor Red
    $failures += "ollama:api"
}

# 5. GitHub auth
Write-Host "`n[5] GITHUB" -ForegroundColor Yellow
$ghToken = [System.Environment]::GetEnvironmentVariable("GH_TOKEN", "User")
if ($ghToken) {
    $user = & gh api user --jq '.login' 2>&1
    Write-Host "  OK Authenticated as $user" -ForegroundColor Green
} else {
    Write-Host "  MISSING GH_TOKEN environment variable" -ForegroundColor Red
    $failures += "github:token"
}

# 6. Site build
Write-Host "`n[6] SITE BUILD" -ForegroundColor Yellow
$siteDir = "C:\Users\frank\.openclaw\workspace\projects\carplayradiohub-site\carplayradiohub_site"
if (Test-Path "$siteDir\dist\index.html") {
    $distSize = (Get-ChildItem "$siteDir\dist" -Recurse | Measure-Object -Property Length -Sum).Sum
    Write-Host "  OK Build exists ($([math]::Round($distSize/1KB, 0)) KB)" -ForegroundColor Green
} else {
    Write-Host "  NO BUILD - Run 'npm run build'" -ForegroundColor Yellow
}

# 7. Cookies / Login state
Write-Host "`n[7] BROWSER STATE" -ForegroundColor Yellow
$chromeData = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cookies"
if (Test-Path $chromeData) {
    Write-Host "  OK Chrome profile exists" -ForegroundColor Green
} else {
    Write-Host "  NO Chrome profile" -ForegroundColor Yellow
}

# 8. Disk
Write-Host "`n[8] DISK" -ForegroundColor Yellow
$disk = Get-PSDrive C
$freeGB = [math]::Round($disk.Free/1GB, 1)
$totalGB = [math]::Round($disk.Total/1GB, 1)
Write-Host "  Free: $freeGB GB / Total: $totalGB GB" -ForegroundColor Cyan

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
if ($failures.Count -eq 0) {
    Write-Host "ALL CHECKS PASSED" -ForegroundColor Green
} else {
    Write-Host "FAILURES ($($failures.Count)):" -ForegroundColor Red
    foreach ($f in $failures) {
        Write-Host "  - $f" -ForegroundColor Red
    }
}
Write-Host ""
