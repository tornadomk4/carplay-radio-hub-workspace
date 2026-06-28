# RAM Monitor - runs in background, logs alerts when RAM is critical
# Checks every 60 seconds

$logFile = "$env:USERPROFILE\.openclaw\workspace\memory\ram-monitor.log"
$alertThreshold = 0.5  # GB - alert if free RAM drops below this
$criticalThreshold = 0.2  # GB - critical if free RAM drops below this

New-Item -ItemType Directory -Force -Path (Split-Path $logFile) | Out-Null

while ($true) {
    $os = Get-CimInstance Win32_OperatingSystem
    $total = [math]::Round($os.TotalVisibleMemorySize/1MB, 1)
    $free = [math]::Round($os.FreePhysicalMemory/1MB, 1)
    $used = [math]::Round($total - $free, 1)
    $pct = [math]::Round(($used / $total) * 100, 1)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    # Get top 3 RAM consumers
    $top3 = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 3 | ForEach-Object {
        "$($_.ProcessName)=$([math]::Round($_.WorkingSet64/1MB,0))MB"
    }

    $line = "$timestamp | Free: ${free}GB / ${total}GB (${pct}% used) | Top: $($top3 -join ', ')"

    if ($free -lt $criticalThreshold) {
        $line = "CRITICAL: $line"
        Add-Content -Path $logFile -Value $line
    } elseif ($free -lt $alertThreshold) {
        $line = "WARNING: $line"
        Add-Content -Path $logFile -Value $line
    } else {
        Add-Content -Path $logFile -Value $line
    }

    # Keep log file manageable (last 500 lines)
    if (Test-Path $logFile) {
        $lines = Get-Content $logFile
        if ($lines.Count -gt 500) {
            $lines | Select-Object -Last 500 | Set-Content $logFile
        }
    }

    Start-Sleep -Seconds 60
}
