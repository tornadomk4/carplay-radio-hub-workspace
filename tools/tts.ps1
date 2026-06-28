# Text-to-Speech helper using Edge TTS (Microsoft, free, no API key)
# Usage: .\tts.ps1 "Hello world" [voice] [output.mp3]
param(
    [Parameter(Mandatory=$true)][string]$Text,
    [string]$Voice = "en-US-AriaNeural",
    [string]$Output = "C:\Users\frank\.openclaw\workspace\tools\tts-output.mp3"
)

& "C:\Users\frank\AppData\Local\Python\pythoncore-3.14-64\Scripts\edge-tts.exe" --voice $Voice --text $Text --write-media $Output 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: $Output"
} else {
    Write-Host "TTS failed"
    exit 1
}
