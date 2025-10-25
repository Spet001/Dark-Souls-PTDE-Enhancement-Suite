param(
    [string]$TargetPath
)

if (-not $TargetPath) {
    Write-Host "Target path not specified" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $TargetPath)) {
    Write-Host "Target folder not found: $TargetPath" -ForegroundColor Red
    exit 1
}

try {
    # Get the source path (go up from scripts to dsfix-registry-manager, then up to ScalingManagerWPF, then to DSFIX+Reshade)
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $appDir = Split-Path -Parent $scriptDir
    $rootDir = Split-Path -Parent $appDir
    $sourcePath = Join-Path $rootDir "DSFIX+Reshade"
    
    Write-Host "Script directory: $scriptDir"
    Write-Host "App directory: $appDir"
    Write-Host "Root directory: $rootDir"
    Write-Host "Source path: $sourcePath"
    
    if (-not (Test-Path $sourcePath)) {
        Write-Host "DSFIX+Reshade folder not found at: $sourcePath" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Starting DSFIX+Reshade installation..." -ForegroundColor Green
    Write-Host "Source: $sourcePath"
    Write-Host "Target: $TargetPath"
    
    # Check if DATA.exe exists (Dark Souls identifier)
    $dataExe = Join-Path $TargetPath "DATA.exe"
    if (-not (Test-Path $dataExe)) {
        Write-Host "Warning: DATA.exe not found. Make sure this is a Dark Souls installation folder." -ForegroundColor Yellow
    }
    
    # Items to copy (including all DLLs)
    $itemsToCopy = @(
        "dsfix",
        "reshade-shaders", 
        "DS Remaster.ini",
        "DSfix.ini",
        "DSfixKeys.ini",
        "ReShade.ini",
        "d3d9.dll",
        "d3d9_vulkan.dll", 
        "DINPUT8.dll"
    )
    
    # Copy each item
    foreach ($item in $itemsToCopy) {
        $sourceItem = Join-Path $sourcePath $item
        $targetItem = Join-Path $TargetPath $item
        
        if (Test-Path $sourceItem) {
            Write-Host "Copying $item..." -ForegroundColor Cyan
            
            # If it's a DLL and already exists, make a backup
            if ($item.EndsWith(".dll") -and (Test-Path $targetItem)) {
                $backupItem = $targetItem.Replace(".dll", "_backup.dll")
                Write-Host "Backing up existing $item to $(Split-Path -Leaf $backupItem)" -ForegroundColor Yellow
                Copy-Item $targetItem $backupItem -Force
            }
            
            if (Test-Path $sourceItem -PathType Container) {
                # It's a folder
                if (Test-Path $targetItem) {
                    Write-Host "Removing existing folder: $targetItem"
                    Remove-Item $targetItem -Recurse -Force
                }
                Copy-Item $sourceItem $targetItem -Recurse -Force
            } else {
                # It's a file
                Copy-Item $sourceItem $targetItem -Force
            }
            
            Write-Host "Copied: $item" -ForegroundColor Green
        } else {
            Write-Host "Item not found in source: $item" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "DSFIX+Reshade installation completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installed components:" -ForegroundColor Cyan
    Write-Host "- DSfix folder with configuration files"
    Write-Host "- ReShade shaders and configuration"
    Write-Host "- d3d9.dll (DSfix main library)"
    Write-Host "- d3d9_vulkan.dll (Vulkan wrapper for RTGI)"
    Write-Host "- DINPUT8.dll (ReShade input hook)"
    Write-Host "- Configuration files (.ini)"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Edit DSfix.ini to configure FPS and visual settings"
    Write-Host "2. Edit ReShade.ini to enable/disable effects"
    Write-Host "3. Launch Dark Souls to test the installation"
    Write-Host ""
    Write-Host "Important notes:" -ForegroundColor Red
    Write-Host "- Any existing DLLs were backed up with _backup suffix"
    Write-Host "- Configure unlockFPS carefully to avoid physics issues"
    Write-Host "- Use 60 FPS max for stable gameplay"
    
} catch {
    Write-Host "Error during installation: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}