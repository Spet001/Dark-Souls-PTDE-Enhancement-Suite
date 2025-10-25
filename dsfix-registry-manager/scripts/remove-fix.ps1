# Script para remover fix de registry para um jogo específico
param(
    [string]$GamePath
)

if (-not $GamePath) {
    Write-Error "Caminho do jogo não especificado"
    exit 1
}

try {
    $registryPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
    
    # Verificar se existe entrada no registry
    $currentValue = $null
    try {
        $currentValue = (Get-ItemProperty -Path $registryPath -Name $GamePath -ErrorAction SilentlyContinue).$GamePath
    } catch {
        Write-Host "Nenhum fix encontrado para: $GamePath"
        exit 0
    }
    
    if (-not $currentValue) {
        Write-Host "Nenhum fix encontrado para: $GamePath"
        exit 0
    }
    
    # Remover apenas o flag DisableNXShowUI, preservando outros
    $newValue = $currentValue -replace "\s*DisableNXShowUI\s*", ""
    $newValue = $newValue.Trim()
    
    if ([string]::IsNullOrWhiteSpace($newValue)) {
        # Se não há outros flags, remover a entrada completamente
        Remove-ItemProperty -Path $registryPath -Name $GamePath -ErrorAction SilentlyContinue
        Write-Host "Fix removido completamente para: $GamePath"
    } else {
        # Manter outros flags
        Set-ItemProperty -Path $registryPath -Name $GamePath -Value $newValue -Type String
        Write-Host "Fix DisableNXShowUI removido, outros flags preservados: $newValue"
    }
    
} catch {
    Write-Error "Erro ao remover fix: $($_.Exception.Message)"
    exit 1
}