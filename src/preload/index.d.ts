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
      onDownloadProgress: (cb: (progressObj: any) => void) => () => void,
      removeAllListeners: () => void
    }
    soloras: {
      pairingComplete: (deviceToken: string) => Promise<void>
    }
    system: {
      getSystemConfiguration: () => Promise<any>
    },
    danger: {
      clearDeviceToken: () => Promise<void>
      clearCache: () => Promise<void>
      factoryResetLocal: () => Promise<void>
    },
    keyboard: {
      show: () => Promise<void>
      hide: () => Promise<void>
    }
  }
}
