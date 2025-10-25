@echo off
title Dark Souls Enhancement Suite
echo.
echo  ████████╗  █████╗  ██████╗  ██╗  ██╗    ███████╗  ██████╗  ██╗   ██╗ ██╗     ███████╗
echo  ██╔══██║ ██╔══██╗ ██╔══██╗ ██║ ██╔╝    ██╔════╝ ██╔═══██╗ ██║   ██║ ██║     ██╔════╝
echo  ██║  ██║ ███████║ ██████╔╝ █████╔╝     ███████╗ ██║   ██║ ██║   ██║ ██║     ███████╗
echo  ██║  ██║ ██╔══██║ ██╔══██╗ ██╔═██╗     ╚════██║ ██║   ██║ ██║   ██║ ██║     ╚════██║
echo  ██████╔╝ ██║  ██║ ██║  ██║ ██║  ██╗    ███████║ ╚██████╔╝ ╚██████╔╝ ███████╗███████║
echo  ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝    ╚══════╝  ╚═════╝   ╚═════╝  ╚══════╝╚══════╝
echo.
echo                        ENHANCEMENT SUITE v2.0
echo.
echo ===========================================================================================
echo  IMPORTANTE: Este aplicativo precisa ser executado como Administrador
echo  para poder modificar o registro do Windows e copiar arquivos do sistema.
echo ===========================================================================================
echo.
echo  Funcionalidades:
echo   [1] Registry Fixes        - Steam Override, GPU Override, DEP Override
echo   [2] FSR Overlay Launcher  - Lossless Scaling com Uniscaler+Optiscaler
echo   [3] DSFIX+Reshade Install - Instalacao automatica de mods visuais
echo.
echo  Pressione qualquer tecla para iniciar o aplicativo...
pause >nul

echo.
echo [INFO] Iniciando Dark Souls Enhancement Suite...
echo [INFO] Aguarde o carregamento da interface...
echo.

start "" "npm" "start"

echo.
echo [SUCCESS] Aplicativo iniciado!
echo [INFO] Se a janela nao abrir, verifique se o Node.js esta instalado.
echo [INFO] Pressione qualquer tecla para fechar este terminal...
pause >nul