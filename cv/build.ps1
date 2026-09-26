# Genera los PDF del CV a partir de cv-es.html y cv-en.html usando Microsoft Edge (headless).
# Uso: powershell -ExecutionPolicy Bypass -File cv\build.ps1

$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe" }

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "assets\cv"
New-Item -ItemType Directory -Force $outDir | Out-Null

$builds = @{
  "cv-es.html" = "Joshua-Solares-CV-ES.pdf"
  "cv-en.html" = "Joshua-Solares-CV-EN.pdf"
}

foreach ($src in $builds.Keys) {
  $in = "file:///" + ((Join-Path $PSScriptRoot $src) -replace "\\", "/")
  $out = Join-Path $outDir $builds[$src]
  & $edge --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$out" $in 2>&1 | Out-Null
  Write-Output "OK  $out"
}
