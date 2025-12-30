import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    updater: {
      onUpdateAvailable: (cb: () => void) => () => void
      onUpdateDownloaded: (cb: () => void) => () => void
      onNoUpdateAvailable: (cb: () => void) => () => void

      onUpdateError: (cb: () => void) => () => void

      checkForUpdates: () => void
      restart: () => void
      confirmUpdate: () => void
      removeAllListeners: () => void
    }
    system: {
      getSystemConfiguration: () => Promise<any>
    }
  }
}
