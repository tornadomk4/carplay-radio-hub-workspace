param(
  [Parameter(Mandatory = $true)]
  [string]$Url,

  [string]$OutputPath = ""
)

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$python = Join-Path $projectRoot "research-tools\.venv\Scripts\python.exe"

if (!(Test-Path -LiteralPath $python)) {
  throw "Research virtualenv not found. Expected: $python"
}

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  & $python -m yt_dlp --skip-download --dump-json $Url
} else {
  $directory = Split-Path -Parent $OutputPath
  if ($directory -and !(Test-Path -LiteralPath $directory)) {
    New-Item -ItemType Directory -Path $directory | Out-Null
  }
  & $python -m yt_dlp --skip-download --dump-json $Url | Set-Content -Path $OutputPath -Encoding UTF8
  Write-Output "Wrote metadata to $OutputPath"
}
