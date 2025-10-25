# Script para instalar as dependências necessárias
Write-Host "=== DSFIX Registry Manager - Setup ===" -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro:" -ForegroundColor Red
    Write-Host "   https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se npm está disponível
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Instalando dependências..." -ForegroundColor Yellow

# Instalar dependências
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para executar o aplicativo:" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "Para criar um build:" -ForegroundColor Cyan
    Write-Host "  npm run build-win" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANTE: Execute sempre como Administrador!" -ForegroundColor Yellow
} else {
    Write-Host "❌ Erro ao instalar dependências." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")