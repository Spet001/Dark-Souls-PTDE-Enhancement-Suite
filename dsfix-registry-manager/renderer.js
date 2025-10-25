class DarkSoulsEnhancementSuite {
    constructor() {
        this.games = [];
        this.selectedGameFolder = '';
        this.languageManager = new LanguageManager();
        this.initializeEventListeners();
        this.initializeTabs();
        this.languageManager.init();
    }

    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Registry Fixes tab
        document.getElementById('steamOverrideBtn').addEventListener('click', () => this.applySteamOverride());
        document.getElementById('gpuOverrideBtn').addEventListener('click', () => this.applyGpuOverride());
        document.getElementById('scanGamesBtn').addEventListener('click', () => this.scanForGames());
        document.getElementById('gfwlHelpBtn').addEventListener('click', () => this.showGfwlHelp());

        // FSR Overlay tab
        document.getElementById('launchScalerBtn').addEventListener('click', () => this.launchScaler());
        document.getElementById('fsrHelpBtn').addEventListener('click', () => this.showFsrHelp());

        // DSFIX+Reshade tab
        document.getElementById('selectGameFolderBtn').addEventListener('click', () => this.selectGameFolder());
        document.getElementById('installDsfixBtn').addEventListener('click', () => this.installDsfix());
        document.getElementById('rtgiHelpBtn').addEventListener('click', () => this.showRtgiHelp());
        document.getElementById('fsrTipsBtn').addEventListener('click', () => this.showFsrTips());

        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modalOverlay')) {
                this.closeModal();
            }
        });
    }

    initializeTabs() {
        // Set default tab
        this.switchTab('registry');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Registry Fixes Functions
    async applySteamOverride() {
        this.showLoading(true);
        try {
            await window.electronAPI.applySteamOverride();
            this.showSuccess(this.languageManager.get('steamSuccess'));
        } catch (error) {
            console.error('Error applying Steam Override:', error);
            this.showError(this.languageManager.get('adminError'));
        } finally {
            this.showLoading(false);
        }
    }

    async applyGpuOverride() {
        this.showLoading(true);
        try {
            await window.electronAPI.applyGpuOverride();
            this.showSuccess(this.languageManager.get('gpuSuccess'));
        } catch (error) {
            console.error('Error applying GPU Override:', error);
            this.showError(this.languageManager.get('adminError'));
        } finally {
            this.showLoading(false);
        }
    }

    async scanForGames() {
        this.showLoading(true);

        try {
            const games = await window.electronAPI.scanGames();
            this.games = Array.isArray(games) ? games : [games];
            this.displayGames();
            
            if (this.games.length === 0) {
                this.showInfo(this.languageManager.get('noGamesFound'));
            } else {
                this.showSuccess(`${this.games.length} ${this.languageManager.get('gamesFound')}`);
            }
        } catch (error) {
            console.error('Error scanning games:', error);
            this.showError(this.languageManager.get('scanError'));
        } finally {
            this.showLoading(false);
        }
    }

    displayGames() {
        const gamesList = document.getElementById('gamesList');
        
        if (this.games.length === 0) {
            gamesList.innerHTML = `<p style="text-align: center; color: #ccc;">${this.languageManager.get('noGamesFound')}</p>`;
            return;
        }

        gamesList.innerHTML = this.games.map(game => this.createGameCard(game)).join('');
        
        // Adicionar event listeners para os botões
        this.attachGameCardListeners();
    }

    createGameCard(game) {
        const hasFixClass = game.HasRegistryFix ? 'has-fix' : '';
        const statusClass = game.HasRegistryFix ? 'status-applied' : 'status-not-applied';
        const statusText = game.HasRegistryFix ? this.languageManager.get('statusApplied') : this.languageManager.get('statusNotApplied');
        const statusIcon = game.HasRegistryFix ? '✅' : '❌';
        
        return `
            <div class="game-card ${hasFixClass}" data-path="${game.Path}">
                <div class="game-header">
                    <div class="game-title">
                        <i class="fas fa-gamepad"></i> ${game.Name}
                    </div>
                    <div class="status-badge ${statusClass}">
                        ${statusIcon} ${statusText}
                    </div>
                </div>
                
                <div class="game-info">
                    <div class="game-info-item">
                        <div class="game-info-label">${this.languageManager.get('pathLabel')}</div>
                        <div class="game-info-value">${game.Path}</div>
                    </div>
                    <div class="game-info-item">
                        <div class="game-info-label">${this.languageManager.get('sizeLabel')}</div>
                        <div class="game-info-value">${game.Size} MB</div>
                    </div>
                    <div class="game-info-item">
                        <div class="game-info-label">${this.languageManager.get('modifiedLabel')}</div>
                        <div class="game-info-value">${game.LastModified}</div>
                    </div>
                    ${game.RegistryValue ? `
                    <div class="game-info-item">
                        <div class="game-info-label">${this.languageManager.get('registryLabel')}</div>
                        <div class="game-info-value">${game.RegistryValue}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="game-actions">
                    ${!game.HasRegistryFix ? `
                        <button class="btn btn-success apply-fix-btn" data-path="${game.Path}">
                            <i class="fas fa-check"></i> ${this.languageManager.get('applyFixBtn')}
                        </button>
                    ` : `
                        <button class="btn btn-warning remove-fix-btn" data-path="${game.Path}">
                            <i class="fas fa-times"></i> ${this.languageManager.get('removeFixBtn')}
                        </button>
                    `}
                    <button class="btn btn-secondary check-status-btn" data-path="${game.Path}">
                        <i class="fas fa-search"></i> ${this.languageManager.get('checkStatusBtn')}
                    </button>
                </div>
            </div>
        `;
    }

    attachGameCardListeners() {
        // Aplicar fix
        document.querySelectorAll('.apply-fix-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const gamePath = e.target.closest('button').dataset.path;
                await this.applyDepFix(gamePath);
            });
        });

        // Remover fix
        document.querySelectorAll('.remove-fix-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const gamePath = e.target.closest('button').dataset.path;
                await this.removeDepFix(gamePath);
            });
        });

        // Verificar status
        document.querySelectorAll('.check-status-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const gamePath = e.target.closest('button').dataset.path;
                await this.checkDepStatus(gamePath);
            });
        });
    }

    async applyDepFix(gamePath) {
        const btn = document.querySelector(`[data-path="${gamePath}"].apply-fix-btn`);
        const originalText = btn.innerHTML;
        
        try {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.languageManager.get('applying')}`;
            
            await window.electronAPI.applyFix(gamePath);
            
            // Atualizar status local
            const game = this.games.find(g => g.Path === gamePath);
            if (game) {
                game.HasRegistryFix = true;
            }
            
            this.showSuccess(this.languageManager.get('depSuccess'));
            this.displayGames(); // Redesenhar a interface
            
        } catch (error) {
            console.error('Error applying fix:', error);
            this.showError(this.languageManager.get('adminError'));
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async removeDepFix(gamePath) {
        const btn = document.querySelector(`[data-path="${gamePath}"].remove-fix-btn`);
        const originalText = btn.innerHTML;
        
        try {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.languageManager.get('removing')}`;
            
            await window.electronAPI.removeFix(gamePath);
            
            // Atualizar status local
            const game = this.games.find(g => g.Path === gamePath);
            if (game) {
                game.HasRegistryFix = false;
                game.RegistryValue = '';
            }
            
            this.showSuccess(this.languageManager.get('depRemoved'));
            this.displayGames(); // Redesenhar a interface
            
        } catch (error) {
            console.error('Error removing fix:', error);
            this.showError(this.languageManager.get('adminError'));
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async checkDepStatus(gamePath) {
        const btn = document.querySelector(`[data-path="${gamePath}"].check-status-btn`);
        const originalText = btn.innerHTML;
        
        try {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.languageManager.get('checking')}`;
            
            const status = await window.electronAPI.checkFixStatus(gamePath);
            
            // Atualizar status local
            const game = this.games.find(g => g.Path === gamePath);
            if (game) {
                game.HasRegistryFix = status.HasDisableNXShowUI;
                game.RegistryValue = status.RegistryValue;
                game.OtherFlags = status.OtherFlags;
            }
            
            this.displayGames(); // Redesenhar a interface
            const statusMsg = status.HasDisableNXShowUI ? this.languageManager.get('fixApplied') : this.languageManager.get('noFix');
            this.showInfo(`${this.languageManager.get('statusChecked')} ${statusMsg}`);
            
        } catch (error) {
            console.error('Error checking status:', error);
            this.showError('Error checking status.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    // FSR Overlay Functions
    async launchScaler() {
        this.showLoading(true);
        try {
            await window.electronAPI.launchScaler();
            this.showSuccess(this.languageManager.get('scalerSuccess'));
        } catch (error) {
            console.error('Error launching scaler:', error);
            this.showError(this.languageManager.get('scalerError'));
        } finally {
            this.showLoading(false);
        }
    }

    showFsrHelp() {
        this.showModal('FSR Overlay - Uniscaler Help', `
            <h4><i class="fas fa-info-circle"></i> About FSR Overlay - Uniscaler</h4>
            <p>This is a decompilation of Lossless Scaling, using Uniscaler+Optiscaler as framework.</p>
            
            <h4><i class="fas fa-cogs"></i> Features:</h4>
            <ul>
                <li><strong>AMD FSR:</strong> FidelityFX Super Resolution upscaling</li>
                <li><strong>Frame Generation:</strong> AI-powered frame interpolation</li>
                <li><strong>OpticalFlow:</strong> Motion vector optimization</li>
                <li><strong>Multiple APIs:</strong> DirectX 11/12, Vulkan support</li>
            </ul>
            
            <h4><i class="fas fa-exclamation-triangle"></i> Important Notes:</h4>
            <ul>
                <li>Use at your own risk - this is experimental software</li>
                <li>May cause compatibility issues with some games</li>
                <li>Performance results may vary depending on hardware</li>
                <li>Always test thoroughly before extended gaming sessions</li>
            </ul>
            
            <h4><i class="fas fa-rocket"></i> Recommended Settings:</h4>
            <ul>
                <li>Start with 900p → 1080p upscaling</li>
                <li>Use 2x Frame Generation for 30→60 FPS</li>
                <li>Enable Windowed mode in games for best compatibility</li>
            </ul>
        `);
    }

    showGfwlHelp() {
        this.showModal('GFWL vs SteamWorks Guide', `
            <h4><i class="fas fa-gamepad"></i> Online Play Guide for Dark Souls</h4>
            <p>Choose the optimal configuration for your version of Dark Souls:</p>
            
            <div style="margin: 20px 0; padding: 20px; background: rgba(34, 139, 34, 0.1); border-left: 4px solid #228B22; border-radius: 4px;">
                <h4><i class="fas fa-windows"></i> GFWL (Games for Windows Live)</h4>
                <p><strong>Configuration:</strong> Use DSFix at 30FPS + FSR Overlay to make it 60FPS</p>
                <ul>
                    <li><strong>Benefits:</strong> No memory manipulation, safe for online play</li>
                    <li><strong>No ban concerns:</strong> GFWL won't detect frame rate modifications</li>
                    <li><strong>Stability:</strong> Avoids constant crashes from FPS unlocking</li>
                    <li><strong>Recommended for:</strong> Original Dark Souls PTDE with GFWL</li>
                </ul>
                <p><em>Note: This method preserves game physics and prevents online bans.</em></p>
            </div>
            
            <div style="margin: 20px 0; padding: 20px; background: rgba(30, 144, 255, 0.1); border-left: 4px solid #1E90FF; border-radius: 4px;">
                <h4><i class="fab fa-steam"></i> SteamWorks</h4>
                <p><strong>Configuration:</strong> Use 60FPS + FSR Overlay to make it 120FPS</p>
                <ul>
                    <li><strong>Higher performance:</strong> Native 60FPS + frame generation</li>
                    <li><strong>Online play:</strong> Use "spacewar" method for online functionality</li>
                    <li><strong>Better experience:</strong> Smoother gameplay at high refresh rates</li>
                    <li><strong>Recommended for:</strong> Dark Souls Remastered on Steam</li>
                </ul>
                <p><em>Note: Spacewar method allows online play while using modifications.</em></p>
            </div>
            
            <h4><i class="fas fa-exclamation-triangle"></i> Important Considerations:</h4>
            <ul>
                <li><strong>Physics Preservation:</strong> Both methods maintain game physics integrity</li>
                <li><strong>Anti-Cheat:</strong> GFWL method is safer for anti-cheat detection</li>
                <li><strong>Performance:</strong> SteamWorks method offers better performance</li>
                <li><strong>Compatibility:</strong> Test your specific setup before extended play</li>
            </ul>
            
            <h4><i class="fas fa-tools"></i> Setup Instructions:</h4>
            <ol>
                <li>Identify your Dark Souls version (GFWL or SteamWorks)</li>
                <li>Apply the appropriate configuration from above</li>
                <li>Test in offline mode first</li>
                <li>Gradually enable online features</li>
                <li>Monitor for any stability issues</li>
            </ol>
        `);
    }

    // DSFIX+Reshade Functions
    async selectGameFolder() {
        try {
            const folderPath = await window.electronAPI.selectFolder();
            if (folderPath) {
                this.selectedGameFolder = folderPath;
                this.updateSelectedPath(folderPath);
                document.getElementById('installDsfixBtn').disabled = false;
                this.showSuccess(this.languageManager.get('folderSelected'));
            }
        } catch (error) {
            console.error('Error selecting folder:', error);
            this.showError(this.languageManager.get('folderError'));
        }
    }

    updateSelectedPath(path) {
        const selectedPathElement = document.getElementById('selectedPath');
        selectedPathElement.innerHTML = `<span>${path}</span>`;
        selectedPathElement.classList.add('has-path');
    }

    async installDsfix() {
        if (!this.selectedGameFolder) {
            this.showError('Select game folder first.');
            return;
        }

        this.showLoading(true);
        try {
            await window.electronAPI.installDsfix(this.selectedGameFolder);
            this.showSuccess(this.languageManager.get('dsfixSuccess'));
        } catch (error) {
            console.error('Error installing DSFIX:', error);
            this.showError(this.languageManager.get('dsfixError'));
        } finally {
            this.showLoading(false);
        }
    }

    showRtgiHelp() {
        this.showModal('How to Install Experimental RTGI?', `
            <div style="color: #dc3545; font-weight: bold; margin-bottom: 20px; padding: 15px; background: rgba(220, 53, 69, 0.1); border-radius: 8px;">
                <i class="fas fa-exclamation-triangle"></i> 
                USE AT YOUR OWN RISK - THIS TENDS TO BREAK THE GAME!!!
            </div>
            
            <h4><i class="fas fa-radiation"></i> Ray Tracing RTGI Setup</h4>
            <p>Follow these steps to enable experimental Real-Time Global Illumination:</p>
            
            <h4><i class="fas fa-list-ol"></i> Installation Steps:</h4>
            <ol>
                <li><strong>Backup your save files</strong> before proceeding</li>
                <li>Navigate to your Dark Souls installation directory</li>
                <li>Open <code>DSfix.ini</code> in a text editor</li>
                <li>Find the line: <code>dinput8dllWrapper none</code></li>
                <li>Replace <code>none</code> with <code>d3d9_vulkan.dll</code></li>
                <li>Save the file and restart the game</li>
            </ol>
            
            <h4><i class="fas fa-info-circle"></i> Technical Details:</h4>
            <ul>
                <li><strong>Vulkan Wrapper:</strong> Makes Vulkan the primary wrapper</li>
                <li><strong>ReShade Compilation:</strong> RTGI will compile in-game</li>
                <li><strong>Default DX9:</strong> RTGI remains disabled (won't compile)</li>
                <li><strong>Performance Impact:</strong> Significant FPS reduction expected</li>
            </ul>
            
            <h4><i class="fas fa-exclamation-circle"></i> Warning Signs:</h4>
            <ul>
                <li>Game crashes or becomes unstable</li>
                <li>Severe performance degradation</li>
                <li>Visual artifacts or rendering issues</li>
                <li>Save game corruption (rare but possible)</li>
            </ul>
            
            <p><strong>Recommended:</strong> Test in a safe area with recent save backup!</p>
        `);
    }

    showFsrTips() {
        this.showModal('How to Use FSR+120FPS Without Breaking Game Physics?', `
            <h4><i class="fas fa-tachometer-alt"></i> FSR + High FPS Setup Guide</h4>
            <p>Learn how to achieve high refresh rates without breaking Dark Souls physics:</p>
            
            <h4><i class="fas fa-display"></i> Display Configuration:</h4>
            <ol>
                <li><strong>Switch to Windowed Mode:</strong> Set Dark Souls to windowed mode in settings</li>
                <li><strong>Choose Lower Resolution:</strong> Use 900p instead of 1080p native</li>
                <li><strong>Alternative:</strong> Modify scaler for 1080p → 1440p upscaling</li>
            </ol>
            
            <h4><i class="fas fa-rocket"></i> Recommended Settings:</h4>
            <ul>
                <li><strong>Resolution:</strong> 900p → 1080p for optimal balance</li>
                <li><strong>Frame Generation:</strong> 2x FrameGen (30→60 FPS or 60→120 FPS)</li>
                <li><strong>Upscaling:</strong> FSR Quality mode</li>
                <li><strong>Game FPS Limit:</strong> Keep game at 60 FPS max in DSfix.ini</li>
            </ul>
            
            <h4><i class="fas fa-cogs"></i> FSR Overlay Application:</h4>
            <ol>
                <li>Use the application in the previous tab</li>
                <li>Configure upscaling before launching the game</li>
                <li>Test frame generation settings incrementally</li>
                <li>Monitor for physics glitches during gameplay</li>
            </ol>
            
            <h4><i class="fas fa-exclamation-triangle"></i> Physics Preservation:</h4>
            <ul>
                <li><strong>Game Engine Limit:</strong> Keep DSfix FPS at 60 or below</li>
                <li><strong>Frame Generation:</strong> Let FSR handle the high refresh rate</li>
                <li><strong>Test Areas:</strong> Ladders, elevators, and collision detection</li>
                <li><strong>Fallback:</strong> Disable frame gen if issues persist</li>
            </ul>
            
            <h4><i class="fas fa-check-circle"></i> Stability Tips:</h4>
            <ul>
                <li>Start with conservative settings</li>
                <li>Test each change thoroughly</li>
                <li>Keep original config files as backup</li>
                <li>Monitor system temperature and stability</li>
            </ul>
        `);
    }

    // Modal Functions
    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('modalOverlay').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.add('hidden');
    }

    // Utility Functions
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Remover notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${this.getNotificationIcon(type)} ${message}
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos inline para a notificação
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });

        // Auto-close após 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                this.closeNotification(notification);
            }
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #28a745, #20893a)',
            error: 'linear-gradient(135deg, #dc3545, #c82333)',
            info: 'linear-gradient(135deg, #17a2b8, #138496)',
            warning: 'linear-gradient(135deg, #ffc107, #e0a800)'
        };
        return colors[type] || colors.info;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const suite = new DarkSoulsEnhancementSuite();
    
    // Verificar se está executando como administrador
    suite.showInfo(suite.languageManager.get('adminRequired'));
});