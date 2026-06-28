# Install additional passive income apps on Android emulators
# Requires: adb, emulator running

param(
    [string[]]$Emulators = @("emulator-5554", "emulator-5556")
)

$apps = @(
    @{
        Name = "PacketStream"
        Package = "com.packetstream.client"
        Url = "https://packetstream.io/downloads/"
        EstMonthly = "$10-20/device"
    },
    @{
        Name = "EarnApp" 
        Package = "com.earnapp"
        Url = "https://earnapp.com/"
        EstMonthly = "$3-8/device"
    },
    @{
        Name = "Repocket"
        Package = "com.repocket.client"
        Url = "https://repocket.com/"
        EstMonthly = "$5-15/device"
    }
)

foreach ($emu in $Emulators) {
    Write-Host "`n=== Installing apps on $emu ===" -ForegroundColor Cyan
    
    $status = adb -s $emu get-state 2>$null
    if ($status -ne "device") {
        Write-Host "Emulator $emu is not connected!" -ForegroundColor Red
        continue
    }
    
    foreach ($app in $apps) {
        $installed = adb -s $emu shell pm list packages 2>$null | Select-String $app.Package
        if ($installed) {
            Write-Host "$($app.Name) already installed on $emu" -ForegroundColor Green
        } else {
            Write-Host "$($app.Name) not installed - need to download APK manually" -ForegroundColor Yellow
            Write-Host "  Download from: $($app.Url)" -ForegroundColor Gray
            Write-Host "  Install with: adb -s $emu install <apk-path>" -ForegroundColor Gray
        }
    }
}

Write-Host "`n=== Status Summary ===" -ForegroundColor Cyan
foreach ($emu in $Emulators) {
    Write-Host "`n$emu installed packages:" -ForegroundColor Yellow
    adb -s $emu shell pm list packages 2>$null | Select-String -Pattern "honeygain|pawns|packetstream|earnapp|repocket|proxyrack" | ForEach-Object { Write-Host "  $_" }
}
