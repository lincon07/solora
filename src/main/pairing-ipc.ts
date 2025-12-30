// src/main/pairing-ipc.ts
import { ipcMain, app } from "electron"
import { setDeviceToken } from "./device"

/**
 * Called when renderer tells us pairing succeeded
 */
ipcMain.handle("pairing:complete", async (_event, deviceToken: string) => {
  if (!deviceToken) {
    throw new Error("pairing:complete called without deviceToken")
  }

  setDeviceToken(deviceToken)

  // Relaunch into authenticated mode
  app.relaunch()
  app.exit(0)
})
