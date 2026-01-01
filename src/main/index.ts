import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { cpuUsage, mainModule } from 'process'
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
  ? 'http://10.0.0.229:3008' // <-- your LAN IP
  : 'https://solora-api-841c6cc58685.herokuapp.com'

autoUpdater.forceDevUpdateConfig = true
autoUpdater.disableWebInstaller = true
autoUpdater.allowDowngrade = true
// autoUpdater.autoDownload = true
// autoUpdater.autoInstallOnAppQuit = true


// MUST be before app.whenReady()
app.commandLine.appendSwitch("enable-features", "UseOzonePlatform")
app.commandLine.appendSwitch("ozone-platform", "wayland")

app.commandLine.appendSwitch("disable-frame-rate-limit", "false")
app.commandLine.appendSwitch("disable-gpu-vsync")


// THIS IS THE IMPORTANT ONE
app.commandLine.appendSwitch("enable-wayland-ime")

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
    show: true,
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

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
    mainWindow?.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
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

let canRestart = false

autoUpdater.on('update-available', () => {
  console.log('[Updater] Update available')
  broadcast('updater:update-available')
})

autoUpdater.on('update-not-available', () => {
  console.log('[Updater] No update available')
  broadcast('updater:update-not-available')
})

autoUpdater.on('error', (err) => {
  console.error('[Updater] Error:', err)
  broadcast('updater:update-error')
})

autoUpdater.on('download-progress', (progressObj) => {
  console.log(
    `[Updater] Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`
  )
  broadcast('updater:download-progress', progressObj)
})

autoUpdater.on('update-downloaded', () => {
  console.log('[Updater] Update downloaded and ready to install')
  canRestart = true
  broadcast('updater:update-downloaded')
})

/**
 * ================================
 * System configuration fetch
 * ================================
 */
ipcMain.handle('system:get-configuration', async () => {
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
  if (!canRestart) {
    console.log('[Updater] Restart requested but update not ready')
    return
  }

  console.log('[Updater] Quitting and installing update')
  autoUpdater.quitAndInstall(false, true)
})

// Confirm update (DOWNLOAD ONLY)
ipcMain.on('updater:confirm-update', () => {
  console.log('[Updater] User confirmed update download')
  autoUpdater.downloadUpdate()
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
