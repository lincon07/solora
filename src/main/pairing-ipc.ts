// src/main/pairing-ipc.ts
import { ipcMain, app } from "electron"
import { setDeviceToken } from "./device"
import os from "os"
import { exec } from "child_process"

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

ipcMain.handle("show-keyboard", () => {
  const platform = os.platform()

  if (platform === "win32") {
    exec("osk")
    return
  }

  if (platform === "linux") {
    // Try common Linux keyboards
    exec("onboard || matchbox-keyboard || wvkbd")
    return
  }

  console.warn("On-screen keyboard not supported on this platform")
})

