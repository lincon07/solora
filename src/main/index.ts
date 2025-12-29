import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { cpuUsage } from 'process'
import { version } from 'os'

/**
 * ================================
 * Auto Updater Configuration
 * ================================
 */
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'lincon07',
  repo: 'solora',
  private: false,
  token: process.env.GITHUB_TOKEN,
  releaseType: 'release'
})

autoUpdater.forceDevUpdateConfig = true
autoUpdater.disableWebInstaller = true
// autoUpdater.autoDownload = true
// autoUpdater.autoInstallOnAppQuit = true

/**
 * Helper to safely broadcast events to all windows
 */
function broadcast(channel: string) {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send(channel)
  })
}

/**
 * ================================
 * Window Creation
 * ================================
 */
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    kiosk: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/**
 * ================================
 * App Lifecycle
 * ================================
 */
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Initial update check
  autoUpdater.checkForUpdates()
})

/**
 * ================================
 * AutoUpdater → Renderer Events
 * ================================
 */

// Update available
autoUpdater.on('update-available', () => {
  console.log('[Updater] Update available')
  broadcast('updater:update-available')
})

// No update available
autoUpdater.on('update-not-available', () => {
  console.log('[Updater] No update available')
  broadcast('updater:update-not-available')
})

autoUpdater.on('error', (err) => {
  console.error('[Updater] Error:', err)
  broadcast('updater:update-error')
})
// Update downloaded
autoUpdater.on('update-downloaded', () => {
  console.log('[Updater] Update downloaded')
  broadcast('updater:update-downloaded')
})



// ststem configuration fetch
ipcMain.handle('system:get-configuration', async () => {
  // Here you can gather and return system configuration details
  return {
    platform: process.platform,
    arch: process.arch,
    memory: process.getSystemMemoryInfo(),
    cpuUsage: cpuUsage(),
    version: app.getVersion()
  }
})

/**
 * ================================
 * Renderer → Main Commands
 * ================================
 */

// Manual update check
ipcMain.on('updater:check-for-updates', () => {
  autoUpdater.checkForUpdates()
})

// Restart & install
ipcMain.on('updater:restart', () => {
  autoUpdater.quitAndInstall(false, true)
})

/**
 * ================================
 * Shutdown Handling
 * ================================
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
