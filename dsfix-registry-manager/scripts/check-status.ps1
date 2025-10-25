# Script para verificar status do fix para um jogo específico
param(
    [string]$GamePath
)

if (-not $GamePath) {
    Write-Error "Caminho do jogo não especificado"
    exit 1
}

try {
    $registryPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
    $status = @{
        GamePath = $GamePath
        HasFix = $false
        RegistryValue = ""
        HasDisableNXShowUI = $false
        OtherFlags = @()
    }
    
    # Verificar se existe entrada no registry
    try {
        $currentValue = (Get-ItemProperty -Path $registryPath -Name $GamePath -ErrorAction SilentlyContinue).$GamePath
        
        if ($currentValue) {
            $status.HasFix = $true
            $status.RegistryValue = $currentValue
            
            # Verificar se tem o flag específico do DSFIX
            if ($currentValue -like "*DisableNXShowUI*") {
                $status.HasDisableNXShowUI = $true
            }
            
            # Extrair outros flags
            $flags = $currentValue -split "\s+" | Where-Object { $_ -and $_ -ne "DisableNXShowUI" }
            $status.OtherFlags = $flags
        }
    } catch {
        # Entrada não existe
    }
    
    # Retornar status como JSON
    $status | ConvertTo-Json -Depth 2
    
} catch {
    Write-Error "Erro ao verificar status: $($_.Exception.Message)"
    exit 1
}