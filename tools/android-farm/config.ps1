# Android Farm Configuration
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"

$script:ADB = "$env:ANDROID_HOME\platform-tools\adb.exe"
$script:EMULATOR = "$env:ANDROID_HOME\emulator\emulator.exe"
$script:AVD_DIR = "$env:USERPROFILE\.android\avd"
$script:LOG_DIR = "$env:USERPROFILE\.openclaw\workspace\memory\android-farm"

New-Item -ItemType Directory -Force -Path $script:LOG_DIR | Out-Null

# Emulator instances
$script:EMULATORS = @(
    @{Name="circuit_farm_1"; Port=5554; RAM=1024; Cores=2}
    @{Name="circuit_farm_2"; Port=5556; RAM=1024; Cores=2}
)
