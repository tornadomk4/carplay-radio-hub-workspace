param(
  [ValidateSet("toggle", "on", "off", "flash")]
  [string]$Mode = "toggle"
)

$stateDir = Join-Path $env:USERPROFILE ".openclaw\workspace\tools"
$stateFile = Join-Path $stateDir "bed-mode.state"
$defaultDisplayTimeoutSeconds = 900

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class MonitorPower {
    [DllImport("user32.dll")]
    public static extern IntPtr SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam);
}
"@

function Set-DisplayTimeoutSeconds([int]$Seconds) {
  powercfg /change monitor-timeout-ac $Seconds | Out-Null
}

function Save-BedState {
  if (-not (Test-Path $stateDir)) {
    New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
  }
  Set-Content -Path $stateFile -Value "armed" -NoNewline
}

function Clear-BedState {
  if (Test-Path $stateFile) {
    Remove-Item -Force $stateFile
  }
}

function Get-BedStateArmed {
  return (Test-Path $stateFile) -and ((Get-Content $stateFile -Raw).Trim() -eq "armed")
}

function Turn-Off-Monitors {
  [MonitorPower]::SendMessage([IntPtr]0xffff, 0x0112, [IntPtr]0xF170, [IntPtr]2) | Out-Null
}

switch ($Mode) {
  "on" {
    Set-DisplayTimeoutSeconds 0
    Save-BedState
    Turn-Off-Monitors
    break
  }
  "off" {
    Set-DisplayTimeoutSeconds $defaultDisplayTimeoutSeconds
    Clear-BedState
    break
  }
  "flash" {
    Turn-Off-Monitors
    break
  }
  default {
    if (Get-BedStateArmed) {
      Set-DisplayTimeoutSeconds $defaultDisplayTimeoutSeconds
      Clear-BedState
    } else {
      Set-DisplayTimeoutSeconds 0
      Save-BedState
      Turn-Off-Monitors
    }
    break
  }
}
