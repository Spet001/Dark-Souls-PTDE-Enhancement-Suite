const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Existing functions
  scanGames: () => ipcRenderer.invoke('scan-games'),
  applyFix: (gamePath) => ipcRenderer.invoke('apply-fix', gamePath),
  removeFix: (gamePath) => ipcRenderer.invoke('remove-fix', gamePath),
  checkFixStatus: (gamePath) => ipcRenderer.invoke('check-fix-status', gamePath),
  
  // Registry Override functions
  applySteamOverride: () => ipcRenderer.invoke('apply-steam-override'),
  applyGpuOverride: () => ipcRenderer.invoke('apply-gpu-override'),
  
  // FSR Overlay functions
  launchScaler: () => ipcRenderer.invoke('launch-scaler'),
  
  // DSFIX+Reshade functions
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  installDsfix: (targetPath) => ipcRenderer.invoke('install-dsfix', targetPath)
});