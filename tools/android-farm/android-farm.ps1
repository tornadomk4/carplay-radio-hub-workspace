# Android Farm Controller
# Manages emulator instances, installs apps, runs automation

. "$PSScriptRoot\config.ps1"

function Log-Message {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "$timestamp | $Message"
    Write-Host $line
    Add-Content -Path "$script:LOG_DIR\farm.log" -Value $line
}

function Get-DeviceStatus {
    param([string]$Serial)
    $boot = & $script:ADB -s $Serial shell getprop sys.boot_completed 2>&1
    return ($boot -eq "1")
}

function Get-AllDevices {
    $output = & $script:ADB devices 2>&1
    $devices = @()
    foreach ($line in $output) {
        if ($line -match "^(emulator-\d+)\s+(device|offline)") {
            $devices += $Matches[1]
        }
    }
    return $devices
}

function Start-Emulator {
    param(
        [string]$Name,
        [int]$Port
    )
    
    # Check if already running
    $existing = Get-Process | Where-Object {$_.ProcessName -eq "qemu-system-x86_64-headless"}
    if ($existing) {
        $serial = "emulator-$Port"
        $status = Get-DeviceStatus $serial
        if ($status) {
            Log-Message "$Name ($serial) already running and booted"
            return $true
        }
    }
    
    Log-Message "Starting $Name on port $Port..."
    $emuArgs = @(
        "-avd", $Name,
        "-no-window",
        "-no-audio",
        "-gpu", "swiftshader",
        "-memory", "1024",
        "-cores", "2",
        "-no-snapshot-load",
        "-port", "$Port"
    )
    
    Start-Process -FilePath $script:EMULATOR -ArgumentList $emuArgs -NoNewWindow
    return $false
}

function Wait-ForBoot {
    param(
        [string]$Serial,
        [int]$TimeoutSeconds = 120
    )
    
    $elapsed = 0
    while ($elapsed -lt $TimeoutSeconds) {
        $boot = & $script:ADB -s $Serial shell getprop sys.boot_completed 2>&1
        if ($boot -eq "1") {
            Log-Message "$Serial booted successfully"
            return $true
        }
        Start-Sleep -Seconds 5
        $elapsed += 5
    }
    Log-Message "WARNING: $Serial failed to boot in ${TimeoutSeconds}s"
    return $false
}

function Install-Apk {
    param(
        [string]$Serial,
        [string]$ApkPath
    )
    
    if (-not (Test-Path $ApkPath)) {
        Log-Message "APK not found: $ApkPath"
        return $false
    }
    
    Log-Message "Installing $ApkPath on $Serial..."
    $result = & $script:ADB -s $Serial install -r $ApkPath 2>&1
    if ($result -match "Success") {
        Log-Message "Installed successfully on $Serial"
        return $true
    } else {
        Log-Message "Install failed on $Serial : $result"
        return $false
    }
}

function Start-App {
    param(
        [string]$Serial,
        [string]$PackageName,
        [string]$Activity = ""
    )
    
    if ($Activity) {
        & $script:ADB -s $Serial shell am start -n "$PackageName/$Activity" 2>&1
    } else {
        & $script:ADB -s $Serial shell monkey -p $PackageName -c android.intent.category.LAUNCHER 1 2>&1
    }
    Log-Message "Started $PackageName on $Serial"
}

function Stop-App {
    param(
        [string]$Serial,
        [string]$PackageName
    )
    & $script:ADB -s $Serial shell am force-stop $PackageName 2>&1
    Log-Message "Stopped $PackageName on $Serial"
}

function Send-Tap {
    param(
        [string]$Serial,
        [int]$X,
        [int]$Y
    )
    & $script:ADB -s $Serial shell input tap $X $Y 2>&1
}

function Send-Text {
    param(
        [string]$Serial,
        [string]$Text
    )
    & $script:ADB -s $Serial shell input text "$Text" 2>&1
}

function Send-Key {
    param(
        [string]$Serial,
        [int]$KeyCode
    )
    & $script:ADB -s $Serial shell input keyevent $KeyCode 2>&1
}

function Get-Screenshot {
    param(
        [string]$Serial,
        [string]$OutputPath
    )
    & $script:ADB -s $Serial shell screencap -p /sdcard/screenshot.png 2>&1
    & $script:ADB -s $Serial pull /sdcard/screenshot.png $OutputPath 2>&1
}

function Set-DeviceName {
    param(
        [string]$Serial,
        [string]$DeviceName
    )
    # Change device model to mimic a real phone
    & $script:ADB -s $Serial shell settings put global device_name $DeviceName 2>&1
}

# === MAIN ===
Log-Message "=== Android Farm Controller Started ==="

# Check current devices
$devices = Get-AllDevices
Log-Message "Found $($devices.Count) device(s): $($devices -join ', ')"

# Check RAM
$os = Get-CimInstance Win32_OperatingSystem
$freeRAM = [math]::Round($os.FreePhysicalMemory/1MB, 1)
Log-Message "Free RAM: ${freeRAM}GB"

# For each emulator, ensure it's running
foreach ($emu in $script:EMULATORS) {
    $serial = "emulator-$($emu.Port)"
    $running = Get-DeviceStatus $serial
    
    if (-not $running) {
        # Check if process exists but not booted
        $proc = Get-Process | Where-Object {$_.ProcessName -eq "qemu-system-x86_64-headless"}
        if ($proc) {
            Log-Message "$($emu.Name) process exists but not booted, waiting..."
            Wait-ForBoot $serial 60
        } else {
            # Check RAM before starting new emulator
            $os = Get-CimInstance Win32_OperatingSystem
            $free = [math]::Round($os.FreePhysicalMemory/1MB, 1)
            if ($free -lt 1.0) {
                Log-Message "SKIPPING $($emu.Name) - only ${free}GB free RAM (need 1GB+)"
            } else {
                Start-Emulator -Name $emu.Name -Port $emu.Port
                Start-Sleep -Seconds 10
                Wait-ForBoot $serial 120
            }
        }
    } else {
        Log-Message "$($emu.Name) ($serial) is online"
    }
}

# Final status
$devices = Get-AllDevices
Log-Message "=== Farm Status: $($devices.Count) device(s) online ==="
foreach ($d in $devices) {
    $androidVer = & $script:ADB -s $d shell getprop ro.build.version.release 2>&1
    $model = & $script:ADB -s $d shell getprop ro.product.model 2>&1
    Log-Message "  $d : Android $androidVer, $model"
}
