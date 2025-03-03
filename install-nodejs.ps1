# PowerShell script to download and install Node.js LTS
Write-Host "Downloading Node.js LTS installer..." -ForegroundColor Green

# Create a temporary directory for the download
$tempDir = "$env:TEMP\nodejs_install"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

# Download Node.js LTS installer
$nodeInstallerUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
$nodeInstallerPath = "$tempDir\node_installer.msi"
Invoke-WebRequest -Uri $nodeInstallerUrl -OutFile $nodeInstallerPath

# Install Node.js
Write-Host "Installing Node.js..." -ForegroundColor Green
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$nodeInstallerPath`" /quiet /norestart" -Wait

# Check if installation was successful
Write-Host "Verifying installation..." -ForegroundColor Green
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

# Try to run node and npm to verify installation
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" -v
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" -v
    
    Write-Host "Node.js $nodeVersion installed successfully!" -ForegroundColor Green
    Write-Host "npm $npmVersion installed successfully!" -ForegroundColor Green
    
    Write-Host "`nIMPORTANT: You may need to restart your terminal or IDE to use Node.js and npm." -ForegroundColor Yellow
} catch {
    Write-Host "Installation verification failed. You may need to restart your terminal or install Node.js manually." -ForegroundColor Red
    Write-Host "Visit https://nodejs.org/en/download/ to download and install manually." -ForegroundColor Red
}

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force 