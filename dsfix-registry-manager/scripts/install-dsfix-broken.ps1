# Script para instalar DSFIX+Reshade automaticamente
param(
    [string]$TargetPath
)

if (-not $TargetPath) {
    Write-Error "Target path not specified"
    exit 1
}

if (-not (Test-Path $TargetPath)) {
    Write-Error "Target folder not found: $TargetPath"
    exit 1
}

try {
    # Caminho da pasta DSFIX+Reshade
    $sourcePath = Join-Path $PSScriptRoot ".." ".." "DSFIX+Reshade"
    
    if (-not (Test-Path $sourcePath)) {
        Write-Error "DSFIX+Reshade folder not found: $sourcePath"
        exit 1
    }
    
    Write-Host "Starting DSFIX+Reshade installation..."
    Write-Host "Source: $sourcePath"
    Write-Host "Target: $TargetPath"
    
    # Verificar se DATA.exe existe na pasta de destino (Dark Souls identifier)
    $dataExe = Join-Path $TargetPath "DATA.exe"
    if (-not (Test-Path $dataExe)) {
        Write-Warning "DATA.exe not found. Make sure this is a Dark Souls installation folder."
    }
    
    # Lista de arquivos e pastas para copiar
    $itemsToCopy = @(
        "dsfix",
        "reshade-shaders",
        "DS Remaster.ini",
        "DSfix.ini", 
        "DSfixKeys.ini",
        "ReShade.ini"
    )
    
    # Copiar cada item
    foreach ($item in $itemsToCopy) {
        $sourcePath_item = Join-Path $sourcePath $item
        $targetPath_item = Join-Path $TargetPath $item
        
        if (Test-Path $sourcePath_item) {
            Write-Host "Copying $item..."
            
            if (Test-Path $sourcePath_item -PathType Container) {
                # E uma pasta
                if (Test-Path $targetPath_item) {
                    Write-Host "Removing existing folder: $targetPath_item"
                    Remove-Item $targetPath_item -Recurse -Force
                }
                Copy-Item $sourcePath_item $targetPath_item -Recurse -Force
            } else {
                # E um arquivo
                Copy-Item $sourcePath_item $targetPath_item -Force
            }
            
            Write-Host "Copied: $item"
        } else {
            Write-Warning "Item not found in source: $item"
        }
    }
    
    # Verificar se d3d9.dll ja existe (pode ser de outro mod)
    $d3d9dll = Join-Path $TargetPath "d3d9.dll"
    if (Test-Path $d3d9dll) {
        $backup = Join-Path $TargetPath "d3d9_backup.dll"
        Write-Host "Backing up existing d3d9.dll to d3d9_backup.dll"
        Copy-Item $d3d9dll $backup -Force
    }
    
    # Copiar o d3d9.dll do DSfix
    $dsfixD3d9 = Join-Path $sourcePath "dsfix" "d3d9.dll"
    if (Test-Path $dsfixD3d9) {
        Copy-Item $dsfixD3d9 $d3d9dll -Force
        Write-Host "Installed DSfix d3d9.dll"
    } else {
        Write-Warning "DSfix d3d9.dll not found"
    }
    
    # Verificar se dinput8.dll ja existe
    $dinput8dll = Join-Path $TargetPath "dinput8.dll"
    if (Test-Path $dinput8dll) {
        $backup = Join-Path $TargetPath "dinput8_backup.dll"
        Write-Host "Backing up existing dinput8.dll to dinput8_backup.dll"
        Copy-Item $dinput8dll $backup -Force
    }
    
    # Copiar o dinput8.dll do ReShade se existir
    $reshadedinput8 = Join-Path $sourcePath "dinput8.dll"
    if (Test-Path $reshadedinput8) {
        Copy-Item $reshadedinput8 $dinput8dll -Force
        Write-Host "Installed ReShade dinput8.dll"
    } else {
        Write-Host "ReShade dinput8.dll not found (this is optional)"
    }
    
    Write-Host ""
    Write-Host "DSFIX+Reshade installation completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Edit DSfix.ini to configure your desired settings"
    Write-Host "2. Edit ReShade.ini to enable/disable effects"
    Write-Host "3. Launch Dark Souls to test the installation"
    Write-Host ""
    Write-Host "Important notes:" -ForegroundColor Cyan
    Write-Host "- Original DLLs were backed up with _backup suffix"
    Write-Host "- Configure unlockFPS carefully to avoid physics issues"
    Write-Host "- Use 60 FPS max for stable gameplay"
    
} catch {
    Write-Error "Error during installation: $($_.Exception.Message)"
    exit 1
}