const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

let mainWindow;

// Helper function to get resource paths (works both in dev and packaged)
function getResourcePath(relativePath) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, relativePath);
  } else {
    return path.join(__dirname, '..', relativePath);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    title: 'Dark Souls Enhancement Suite',
    minWidth: 800,
    minHeight: 600
  });

  mainWindow.loadFile('index.html');

  // Create a simple menu with only File
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Abrir DevTools em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers

// Existing game scanning functionality
ipcMain.handle('scan-games', async () => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'scripts', 'scan-games.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao executar script:', error);
        reject(error);
        return;
      }
      
      try {
        const games = JSON.parse(stdout);
        resolve(games);
      } catch (parseError) {
        console.error('Erro ao parsear resultado:', parseError);
        reject(parseError);
      }
    });
  });
});

ipcMain.handle('apply-fix', async (event, gamePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'scripts', 'apply-fix.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -GamePath "${gamePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao aplicar fix:', error);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
});

ipcMain.handle('remove-fix', async (event, gamePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'scripts', 'remove-fix.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -GamePath "${gamePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao remover fix:', error);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
});

ipcMain.handle('check-fix-status', async (event, gamePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'scripts', 'check-status.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -GamePath "${gamePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao verificar status:', error);
        reject(error);
        return;
      }
      
      try {
        const status = JSON.parse(stdout);
        resolve(status);
      } catch (parseError) {
        console.error('Erro ao parsear status:', parseError);
        reject(parseError);
      }
    });
  });
});

// New Registry Override handlers
ipcMain.handle('apply-steam-override', async () => {
  return new Promise((resolve, reject) => {
    const regPath = path.join(__dirname, '..', 'SteamSignatureOverride.reg');
    exec(`regedit /s "${regPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao aplicar Steam Override:', error);
        reject(error);
        return;
      }
      resolve('Steam Override aplicado com sucesso');
    });
  });
});

ipcMain.handle('apply-gpu-override', async () => {
  return new Promise((resolve, reject) => {
    const regPath = path.join(__dirname, '..', 'EnableSignatureOverride.reg');
    exec(`regedit /s "${regPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao aplicar GPU Override:', error);
        reject(error);
        return;
      }
      resolve('GPU Override aplicado com sucesso');
    });
  });
});

// FSR Overlay handlers
ipcMain.handle('launch-scaler', async () => {
  return new Promise((resolve, reject) => {
    // Path to the FSR Overlay - Uniscaler directory relative to the app
    const scalerPath = path.join(getResourcePath('FSR Overlay - Uniscaler'), 'Scaling.exe');
    
    console.log('Looking for Scaling.exe at:', scalerPath);
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(scalerPath)) {
      console.error('Scaling.exe not found at:', scalerPath);
      reject(new Error(`Scaling.exe not found at: ${scalerPath}`));
      return;
    }
    
    // Execute the Scaling.exe with proper working directory
    const workingDir = path.dirname(scalerPath);
    exec(`"${scalerPath}"`, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error starting Scaling:', error);
        // Don't reject here as the process might continue in background
        console.log('Scaling process may be running in background');
      }
      resolve('Scaling started successfully');
    });
  });
});

// DSFIX+Reshade handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Selecione a pasta do jogo Dark Souls'
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

ipcMain.handle('install-dsfix', async (event, targetPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'scripts', 'install-dsfix.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -TargetPath "${targetPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao instalar DSFIX:', error);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
});