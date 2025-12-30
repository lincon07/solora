import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { cpuUsage } from 'process'
import "./pairing-ipc"
import { getDeviceToken } from './device'
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
// is development mode
const apiURL = is.dev
  ? 'http://0.0.0.0:3008'
  : 'https://solora-api-841c6cc58685.herokuapp.com'

autoUpdater.forceDevUpdateConfig = true
autoUpdater.disableWebInstaller = true
autoUpdater.allowDowngrade = true
// autoUpdater.autoDownload = true
// autoUpdater.autoInstallOnAppQuit = true

/**
 * Helper to safely broadcast events to all windows
 */
function broadcast(channel: string, ...args: any[]) {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send(channel, ...args)
  })
}




/**
 * ================================
 * Window Creation
 * ================================
 */

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
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

  const deviceToken = getDeviceToken()

  const route = deviceToken ? "/" : "/settings/pair"

  let loadUrl: string

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    loadUrl = `${process.env.ELECTRON_RENDERER_URL}${route}`
  } else {
    loadUrl = `file://${join(__dirname, '../renderer/index.html')}#${route}`
  }

  mainWindow.loadURL(loadUrl)



  mainWindow.on('ready-to-show', () => mainWindow?.show())

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  setInterval(async () => {
    try {
      await fetch(`${apiURL}/hub/heartbeat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${deviceToken}`,
        },
      })
    } catch (err) {
      console.error("Heartbeat failed", err)
    }
  }, 15_000)


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

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`[Updater] Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`)
  // send progress to renderer if needed
  broadcast('updater:download-progress', progressObj)
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

ipcMain.on('updater:confirm-update', () => {
  autoUpdater.downloadUpdate()
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
