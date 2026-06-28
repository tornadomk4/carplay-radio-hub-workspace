# Circuit Notifier
# Sends notifications to Frank via Telegram or logs to activity log

param(
    [Parameter(Mandatory=$true)][string]$Message,
    [ValidateSet("info","warn","urgent")][string]$Level = "info"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logPath = "C:\Users\frank\.openclaw\workspace\tools\circuit-dashboard\activityLog.json"

# Read existing log
$log = @()
if (Test-Path $logPath) {
    try { $log = Get-Content $logPath -Raw | ConvertFrom-Json } catch {}
}

# Add notification entry
$newEntry = @{
    timestamp = $timestamp
    type = "notification"
    level = $Level
    summary = $Message
    details = null
}
$log += $newEntry

# Save
$log | ConvertTo-Json -Depth 5 | Set-Content $logPath

# Console output
$icon = switch ($Level) { "info" { "ℹ️" } "warn" { "⚠️" } "urgent" { "🚨" } }
Write-Host "$icon [$Level] $timestamp - $Message"
