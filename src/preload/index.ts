import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * ================================
 * Updater API (Renderer Safe)
 * ================================
 *
 * This object is exposed to the renderer via `window.updater`
 * and provides:
 *  - Event listeners (update available, not available, downloaded)
 *  - Commands (check, restart)
 *
 * IMPORTANT:
 * - Each `onX` returns an unsubscribe function
 * - Prevents memory leaks + HMR duplication
 */

const updater = {
  /**
   * Fired when an update IS available
   */
  onUpdateAvailable(cb: () => void) {
    const listener = () => cb()
    ipcRenderer.on('updater:update-available', listener)

    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('updater:update-available', listener)
    }
  },

  /**
   * Fired when NO update is available
   */
  onNoUpdateAvailable(cb: () => void) {
    const listener = () => cb()
    ipcRenderer.on('updater:update-not-available', listener)

    return () => {
      ipcRenderer.removeListener('updater:update-not-available', listener)
    }
  },

  onUpdateError(cb: () => void) {
    const listener = () => cb()
    ipcRenderer.on('updater:update-error', listener)

    return () => {
      ipcRenderer.removeListener('updater:update-error', listener)
    }
  },

  /**
   * Fired once the update has been downloaded
   */
  onUpdateDownloaded(cb: () => void) {
    const listener = () => cb()
    ipcRenderer.on('updater:update-downloaded', listener)

    return () => {
      ipcRenderer.removeListener('updater:update-downloaded', listener)
    }
  },

  /**
   * Ask the main process to check for updates
   */
  checkForUpdates() {
    ipcRenderer.send('updater:check-for-updates')
  },

  /**
   * Ask the main process to restart & install update
   */
  restart() {
    ipcRenderer.send('updater:restart')
  }
}

// Placeholder for future app APIs
const api = {}

/**
 * ================================
 * Secure Exposure
 * ================================
 *
 * Expose APIs ONLY if context isolation is enabled.
 * This keeps the renderer sandboxed.
 */
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
  contextBridge.exposeInMainWorld('updater', updater)
} else {
  // Fallback for disabled context isolation (not recommended)
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
  // @ts-ignore
  window.updater = updater
}
