# Script para aplicar fix de registry para um jogo específico
param(
    [string]$GamePath
)

if (-not $GamePath) {
    Write-Error "Caminho do jogo não especificado"
    exit 1
}

if (-not (Test-Path $GamePath)) {
    Write-Error "Arquivo do jogo não encontrado: $GamePath"
    exit 1
}

try {
    # Verificar se já existe entrada no registry
    $registryPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
    $currentValue = $null
    
    try {
        $currentValue = (Get-ItemProperty -Path $registryPath -Name $GamePath -ErrorAction SilentlyContinue).$GamePath
    } catch {
        # Entrada não existe ainda
    }
    
    # Valores de compatibilidade para DSFIX
    $compatibilityFlags = "DisableNXShowUI"
    
    # Se já existe uma entrada, preservar outros flags e adicionar o nosso
    if ($currentValue) {
        if ($currentValue -notlike "*DisableNXShowUI*") {
            $compatibilityFlags = "$currentValue DisableNXShowUI"
        } else {
            Write-Host "Fix já aplicado para: $GamePath"
            exit 0
        }
    }
    
    # Aplicar a entrada no registry
    if (-not (Test-Path $registryPath)) {
        New-Item -Path $registryPath -Force | Out-Null
    }
    
    Set-ItemProperty -Path $registryPath -Name $GamePath -Value $compatibilityFlags -Type String
    
    Write-Host "Fix aplicado com sucesso para: $GamePath"
    Write-Host "Valor aplicado: $compatibilityFlags"
    
} catch {
    Write-Error "Erro ao aplicar fix: $($_.Exception.Message)"
    exit 1
}