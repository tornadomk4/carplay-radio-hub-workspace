# OpenClaw Service Healthcheck
# Checks all critical services and reports status

$services = @(
    @{ Name = "OpenClaw Gateway"; Url = "http://127.0.0.1:18787/health"; Port = 18787 },
    @{ Name = "Circuit Dashboard"; Url = "http://127.0.0.1:8081"; Port = 8081 },
    @{ Name = "SearxNG"; Url = "http://127.0.0.1:8080/search?q=test&format=json"; Port = 8080 },
    @{ Name = "Ollama"; Url = "http://127.0.0.1:11434/api/tags"; Port = 11434 },
    @{ Name = "Philips Hue"; Url = "http://192.168.1.151/api/"; Port = 80 }
)

$results = @()
$failures = @()

foreach ($svc in $services) {
    try {
        $response = Invoke-WebRequest -Uri $svc.Url -TimeoutSec 5 -ErrorAction Stop
        $status = "UP"
        $code = $response.StatusCode
    } catch {
        $status = "DOWN"
        $code = $_.Exception.Response.StatusCode.value__
        $failures += $svc.Name
    }
    $results += [PSCustomObject]@{
        Service = $svc.Name
        Status = $status
        Code = $code
        Time = Get-Date -Format "HH:mm:ss"
    }
}

Write-Host "`n=== OpenClaw Service Healthcheck ==="
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"

foreach ($r in $results) {
    $icon = if ($r.Status -eq "UP") { "✅" } else { "❌" }
    Write-Host "$icon $($r.Service): $($r.Status) (HTTP $($r.Code))"
}

if ($failures.Count -gt 0) {
    Write-Host "`n⚠️  FAILURES: $($failures -join ', ')"
    Write-Host "Alert: Services are down!"
} else {
    Write-Host "`n✅ All services operational"
}

# Save results to log
$logPath = "C:\Users\frank\.openclaw\workspace\tools\healthcheck\log.json"
$logEntry = @{
    timestamp = Get-Date -Format "o"
    results = $results
    failures = $failures
} | ConvertTo-Json -Depth 3

if (Test-Path $logPath) {
    $existing = Get-Content $logPath -Raw | ConvertFrom-Json
    $existing += $logEntry
    $existing | ConvertTo-Json -Depth 5 | Set-Content $logPath
} else {
    @($logEntry) | ConvertTo-Json -Depth 5 | Set-Content $logPath
}
