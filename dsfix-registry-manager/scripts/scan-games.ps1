# Script para encontrar jogos Dark Souls no sistema
param()

$games = @()

# Lista de jogos conhecidos que usam DSFIX (focado em Dark Souls PTDE)
$gamePatterns = @(
    "*DARK SOULS*",
    "*DarkSouls*", 
    "*DATA.exe*",
    "*Dark Souls*",
    "*PTDE*",
    "*Prepare To Die*"
)

# Locais comuns de instalação
$searchPaths = @(
    # Steam paths
    "C:\Program Files (x86)\Steam\steamapps\common",
    "C:\Program Files\Steam\steamapps\common",
    "C:\Program Files (x86)\Steam\steamapps\common\DARK SOULS Prepare To Die Edition",
    "C:\Program Files\Steam\steamapps\common\DARK SOULS Prepare To Die Edition",
    
    # Games for Windows Live / GFWL paths
    "C:\Program Files (x86)\Microsoft Games\DARK SOULS Prepare To Die Edition",
    "C:\Program Files\Microsoft Games\DARK SOULS Prepare To Die Edition",
    "C:\Program Files (x86)\Games for Windows - LIVE\Games\DARK SOULS",
    "C:\Program Files\Games for Windows - LIVE\Games\DARK SOULS",
    
    # CD-ROM / Default installation paths
    "C:\Program Files (x86)\FromSoftware\DARK SOULS Prepare To Die Edition",
    "C:\Program Files\FromSoftware\DARK SOULS Prepare To Die Edition", 
    "C:\Program Files (x86)\Bandai Namco Games\DARK SOULS Prepare To Die Edition",
    "C:\Program Files\Bandai Namco Games\DARK SOULS Prepare To Die Edition",
    "C:\Program Files (x86)\DARK SOULS Prepare To Die Edition",
    "C:\Program Files\DARK SOULS Prepare To Die Edition",
    
    # Custom game directories
    "C:\Games",
    "D:\Games", 
    "E:\Games",
    "F:\Games",
    "C:\Games\DARK SOULS",
    "C:\Games\DARK SOULS PTDE",
    "C:\Games\DARK SOULS Prepare To Die Edition",
    "D:\Games\DARK SOULS",
    "D:\Games\DARK SOULS PTDE", 
    "D:\Games\DARK SOULS Prepare To Die Edition",
    
    # Fallback broad search paths
    "C:\Program Files (x86)",
    "C:\Program Files",
    
    # Legacy paths (older installations)
    "C:\DARK SOULS",
    "C:\DarkSouls",
    "D:\DARK SOULS",
    "D:\DarkSouls"
)

# Busca no registro do Steam
try {
    $steamPath = (Get-ItemProperty -Path "HKLM:\SOFTWARE\WOW6432Node\Valve\Steam" -Name "InstallPath" -ErrorAction SilentlyContinue).InstallPath
    if ($steamPath) {
        $searchPaths += "$steamPath\steamapps\common"
    }
} catch {
    Write-Host "Steam não encontrado no registro"
}

function Find-GameExecutables {
    param($basePath)
    
    if (!(Test-Path $basePath)) {
        return @()
    }
    
    $foundGames = @()
    
    foreach ($pattern in $gamePatterns) {
        try {
            $exeFiles = Get-ChildItem -Path $basePath -Recurse -Filter "*.exe" -ErrorAction SilentlyContinue | 
                       Where-Object { $_.Name -like $pattern -or $_.Directory.Name -like "*Dark Souls*" }
            
            foreach ($exe in $exeFiles) {
                $gameInfo = @{
                    Name = $exe.BaseName
                    Path = $exe.FullName
                    Directory = $exe.Directory.FullName
                    Size = [math]::Round($exe.Length / 1MB, 2)
                    LastModified = $exe.LastWriteTime.ToString("yyyy-MM-dd")
                }
                
                # Verificar se é um executável válido do jogo
                if ($exe.Name -match "(DARK|Dark|DATA)" -and $exe.Length -gt 1MB) {
                    $foundGames += $gameInfo
                }
            }
        } catch {
            continue
        }
    }
    
    return $foundGames
}

# Buscar em todos os caminhos
foreach ($path in $searchPaths) {
    $foundGames = Find-GameExecutables -basePath $path
    $games += $foundGames
}

# Remover duplicatas baseado no caminho
$uniqueGames = $games | Sort-Object Path -Unique

# Verificar status atual do registry para cada jogo
$gamesWithStatus = @()
foreach ($game in $uniqueGames) {
    $registryKey = "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
    $hasRegistryEntry = $false
    
    try {
        $regValue = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers" -Name $game.Path -ErrorAction SilentlyContinue)
        if ($regValue) {
            $hasRegistryEntry = $true
        }
    } catch {
        $hasRegistryEntry = $false
    }
    
    $gameWithStatus = $game.Clone()
    $gameWithStatus.HasRegistryFix = $hasRegistryEntry
    $gamesWithStatus += $gameWithStatus
}

# Retornar resultado como JSON
$gamesWithStatus | ConvertTo-Json -Depth 3