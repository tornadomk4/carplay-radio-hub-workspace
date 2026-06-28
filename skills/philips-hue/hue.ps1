# Philips Hue Light Controller
# Usage:
#   hue.ps1 list                              - List all lights
#   hue.ps1 rooms                             - List all rooms/zones
#   hue.ps1 scenes                            - List all scenes
#   hue.ps1 on <light_id>                     - Turn light on
#   hue.ps1 off <light_id>                    - Turn light off
#   hue.ps1 toggle <light_id>                 - Toggle light
#   hue.ps1 brightness <light_id> <0-254>     - Set brightness
#   hue.ps1 color <light_id> <hue> <sat>      - Set color (hue: 0-65535, sat: 0-254)
#   hue.ps1 temp <light_id> <ct>              - Set color temp (153-500 mirek)
#   hue.ps1 scene <scene_id> [room_id]        - Activate scene (optionally in a room)
#   hue.ps1 room-on <room_id>                 - Turn all lights in room on
#   hue.ps1 room-off <room_id>                - Turn all lights in room off
#   hue.ps1 room-bri <room_id> <0-254>        - Set room brightness
#   hue.ps1 all-off                           - Turn all lights off
#   hue.ps1 all-on                            - Turn all lights on

param(
    [Parameter(Mandatory=$true)][string]$Action,
    [Parameter()][string]$Arg1,
    [Parameter()][string]$Arg2,
    [Parameter()][string]$Arg3
)

$configPath = "C:\Users\frank\.openclaw\workspace\skills\philips-hue\config.json"

if (-not (Test-Path $configPath)) {
    Write-Host "ERROR: Hue not configured. Run setup first:"
    Write-Host "  1. Find your Hue Bridge IP"
    Write-Host "  2. Press the button on the bridge"
    Write-Host "  3. POST to http://<bridge-ip>/api with body {`"devicetype`":`"circuit#pc`"}"
    Write-Host "  4. Save bridge_ip and api_key to $configPath"
    exit 1
}

$config = Get-Content $configPath | ConvertFrom-Json
$baseUrl = "http://$($config.bridge_ip)/api/$($config.api_key)"

function Hue-GET($path) {
    try {
        $r = Invoke-WebRequest -Uri "$baseUrl$path" -UseBasicParsing -TimeoutSec 10
        return $r.Content | ConvertFrom-Json
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)"
        exit 1
    }
}

function Hue-PUT($path, $body) {
    try {
        $r = Invoke-WebRequest -Uri "$baseUrl$path" -Method PUT -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
        return $r.Content | ConvertFrom-Json
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)"
        exit 1
    }
}

switch ($Action) {
    "list" {
        $lights = Hue-GET "/lights"
        Write-Host "=== LIGHTS ==="
        $lights.PSObject.Properties | ForEach-Object {
            $l = $_.Value
            $state = if ($l.state.on) { "ON" } else { "OFF" }
            $bri = if ($l.state.bri) { " bri:$($l.state.bri)" } else { "" }
            Write-Host "  $($_.Name): $l.name [$state$bri]"
        }
    }
    "rooms" {
        $groups = Hue-GET "/groups"
        Write-Host "=== ROOMS/ZONES ==="
        $groups.PSObject.Properties | ForEach-Object {
            $g = $_.Value
            Write-Host "  $($_.Name): $($g.name) ($($g.lights.Count) lights)"
        }
    }
    "scenes" {
        $scenes = Hue-GET "/scenes"
        Write-Host "=== SCENES ==="
        $scenes.PSObject.Properties | ForEach-Object {
            $s = $_.Value
            Write-Host "  $($_.Name): $($s.name)"
        }
    }
    "on" {
        if (-not $Arg1) { Write-Host "Usage: hue.ps1 on <light_id>"; exit 1 }
        Hue-PUT "/lights/$Arg1/state" '{"on": true}'
        Write-Host "Light $Arg1 ON"
    }
    "off" {
        if (-not $Arg1) { Write-Host "Usage: hue.ps1 off <light_id>"; exit 1 }
        Hue-PUT "/lights/$Arg1/state" '{"on": false}'
        Write-Host "Light $Arg1 OFF"
    }
    "toggle" {
        if (-not $Arg1) { Write-Host "Usage: hue.ps1 toggle <light_id>"; exit 1 }
        $light = Hue-GET "/lights/$Arg1"
        $newState = -not $light.state.on
        Hue-PUT "/lights/$Arg1/state" "{\"on\": $newState}"
        Write-Host "Light $Arg1 $(if ($newState) {'ON'} else {'OFF'})"
    }
    "brightness" {
        if (-not $Arg1 -or -not $Arg2) { Write-Host "Usage: hue.ps1 brightness <light_id> <0-254>"; exit 1 }
        Hue-PUT "/lights/$Arg1/state" "{\"bri\": $Arg2}"
        Write-Host "Light $Arg1 brightness set to $Arg2"
    }
    "color" {
        if (-not $Arg1 -or -not $Arg2 -or -not $Arg3) { Write-Host "Usage: hue.ps1 color <light_id> <hue:0-65535> <sat:0-254>"; exit 1 }
        Hue-PUT "/lights/$Arg1/state" "{\"hue\": $Arg2, \"sat\": $Arg3}"
        Write-Host "Light $Arg1 color set to hue:$Arg2 sat:$Arg3"
    }
    "temp" {
        if (-not $Arg1 -or -not $Arg2) { Write-Host "Usage: hue.ps1 temp <light_id> <ct:153-500>"; exit 1 }
        Hue-PUT "/lights/$Arg1/state" "{\"ct\": $Arg2}"
        Write-Host "Light $Arg1 color temp set to $Arg2 mirek"
    }
    "scene" {
        if (-not $Arg1) { Write-Host "Usage: hue.ps1 scene <scene_id> [room_id]"; exit 1 }
        if ($Arg2) {
            Hue-PUT "/groups/$Arg2/action" "{\"scene\": \"$Arg1\"}"
            Write-Host "Scene $Arg1 activated in room $Arg2"
        } else {
            Hue-PUT "/groups/0/action" "{\"scene\": \"$Arg1\"}"
            Write-Host "Scene $Arg1 activated (all lights)"
        }
    }
    "room-on" {
        if (-not $Arg1) { Write-Host "Usage: hue.ps1 room-on <room_id>"; exit 1 }
        Hue-PUT "/groups/$Arg1/action" '{"on": true}'
        Write-Host "Room $Arg1 ON"
    }
    "room-off" {
        if (-not $Arg1) { Write-Host "Usage: hue.ps1 room-off <room_id>"; exit 1 }
        Hue-PUT "/groups/$Arg1/action" '{"on": false}'
        Write-Host "Room $Arg1 OFF"
    }
    "room-bri" {
        if (-not $Arg1 -or -not $Arg2) { Write-Host "Usage: hue.ps1 room-bri <room_id> <0-254>"; exit 1 }
        Hue-PUT "/groups/$Arg1/action" "{\"bri\": $Arg2}"
        Write-Host "Room $Arg1 brightness set to $Arg2"
    }
    "all-off" {
        Hue-PUT "/groups/0/action" '{"on": false}'
        Write-Host "All lights OFF"
    }
    "all-on" {
        Hue-PUT "/groups/0/action" '{"on": true}'
        Write-Host "All lights ON"
    }
    default {
        Write-Host "Unknown action: $Action"
        Write-Host "Run 'hue.ps1' without args for usage"
    }
}
