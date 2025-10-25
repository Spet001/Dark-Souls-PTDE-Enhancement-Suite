# Dark Souls Enhancement Suite

Uma suite completa de melhorias para Dark Souls, incluindo correções de registro, upscaling FSR e instalação automática de mods visuais.

## 🎮 Funcionalidades

### � Registry Fixes
- **Steam Signature Override**: Desabilita verificação de assinatura para mods Steam
- **NVIDIA/AMD Signature Override**: Habilita override de assinatura para placas de vídeo
- **DEP Dark Souls Override**: Desabilita DEP para melhor compatibilidade com DSFIX
- **Busca Automática**: Encontra automaticamente jogos Dark Souls instalados
- **Aplicação Segura**: Preserva outras configurações de compatibilidade

### � FSR Overlay - Uniscaler Launcher
- **Lossless Scaling**: Executa o upscaler com configurações otimizadas
- **Frame Generation**: AI-powered frame interpolation
- **Múltiplas APIs**: Suporte para DirectX 11/12 e Vulkan
- **Documentação Completa**: Guias detalhados para configuração

### 💾 Install DSFIX+Reshade
- **Instalação Automática**: Copia todos os arquivos necessários para o jogo
- **Backup Automático**: Preserva arquivos originais
- **Configuração RTGI**: Guia para Ray Tracing experimental
- **Otimização FSR**: Instruções para 120FPS sem quebrar física

## 🎨 Interface

- **Tema Dark Souls**: Background oficial do jogo
- **Design Moderno**: Interface responsiva com animações suaves
- **Navegação por Abas**: Organização clara das funcionalidades
- **Notificações Visuais**: Feedback em tempo real das operações
- **Modais Informativos**: Documentação integrada

## 📁 Estrutura do Projeto

```
dark-souls-enhancement-suite/
├── main.js              # Processo principal do Electron
├── preload.js           # Script de contexto seguro
├── index.html           # Interface principal com abas
├── styles.css           # Estilos modernos com tema Dark Souls
├── renderer.js          # Lógica da interface
├── package.json         # Configurações do projeto
└── scripts/             # Scripts PowerShell
    ├── scan-games.ps1       # Busca jogos no sistema
    ├── apply-fix.ps1        # Aplica correção DEP
    ├── remove-fix.ps1       # Remove correção DEP
    ├── check-status.ps1     # Verifica status
    └── install-dsfix.ps1    # Instala DSFIX+Reshade
```

## 🚀 Como Usar

### Requisitos
- Windows 10/11
- Permissões de Administrador
- Node.js (para desenvolvimento)

### Instalação Rápida
1. Execute como Administrador: `npm start`
2. Navegue pelas abas conforme necessário
3. Para build: `npm run build-win`

### Uso das Funcionalidades

#### Registry Fixes
1. **Steam Override**: Aplica correção para mods Steam
2. **GPU Override**: Habilita override para NVIDIA/AMD
3. **DEP Override**: 
   - Clique em "Buscar Jogos"
   - Aplique correção para cada jogo encontrado

#### FSR Overlay
1. **Launch Scaler**: Inicia o Lossless Scaling
2. **Help**: Documentação completa sobre FSR

#### DSFIX+Reshade
1. **Selecionar Pasta**: Escolha onde está o DATA.exe
2. **Instalar**: Copia automaticamente todos os arquivos
3. **Opções Avançadas**: Guias para RTGI e FSR+120FPS

## ⚙️ Configurações Avançadas

### RTGI Experimental
⚠️ **USE POR SUA CONTA E RISCO - PODE QUEBRAR O JOGO!**

1. Edite `DSfix.ini`
2. Mude `dinput8dllWrapper none` para `dinput8dllWrapper d3d9_vulkan.dll`
3. O ReShade compilará RTGI in-game com Vulkan
4. Com DX9 padrão, RTGI fica desabilitado

### FSR + 120FPS sem Quebrar Física
1. Configure o jogo em modo janela
2. Use resolução menor que 1080p (recomendado 900p)
3. Configure FSR para upscaling (900p → 1080p)
4. Use 2x Frame Generation (30→60 ou 60→120 FPS)
5. Mantenha FPS do jogo limitado a 60 no DSfix.ini

## 🛡️ Segurança

- **Backups Automáticos**: Arquivos originais são preservados
- **Registro Seguro**: Apenas flags específicos são modificados
- **Verificação**: Status pode ser verificado a qualquer momento
- **Reversível**: Todas as alterações podem ser desfeitas

## 📋 Arquivos de Registro Utilizados

- `SteamSignatureOverride.reg`: Override Steam
- `EnableSignatureOverride.reg`: Override NVIDIA/AMD
- Scripts PowerShell para DEP: Aplicação dinâmica

## 🎯 Jogos Suportados

- Dark Souls: Prepare to Die Edition
- Dark Souls Remastered
- Outros jogos com executáveis similares

## 📞 Suporte

Se encontrar problemas:

1. **Execute como Administrador** (essencial)
2. Verifique se PowerShell permite execução de scripts
3. Confirme que os arquivos .reg estão na pasta correta
4. Abra uma issue no GitHub com detalhes

## ⚖️ Licença

MIT License - Software livre para uso pessoal e modificação.

## ⚠️ Aviso Legal

Este aplicativo modifica o registro do Windows e arquivos de jogos. Use por sua própria conta e risco. Sempre faça backup dos seus saves antes de usar modificações experimentais como RTGI.