import { ipcMain, app } from "electron"
import { setDeviceToken } from "./device"
import os from "os"
import { exec } from "child_process"

let keyboardProcess: any = null

function showKeyboard() {
  if (keyboardProcess) return

  const platform = os.platform()

  if (platform === "win32") {
    keyboardProcess = exec("osk")
    return
  }

  if (platform === "linux") {
    // Prefer matchbox-keyboard, fallback to wvkbd
    keyboardProcess = exec("matchbox-keyboard || wvkbd")
    return
  }
}

function hideKeyboard() {
  const platform = os.platform()

  if (platform === "win32") {
    exec("taskkill /IM osk.exe /F")
  }

  if (platform === "linux") {
    exec("pkill matchbox-keyboard || pkill wvkbd")
  }

  keyboardProcess = null
}

/* ---------------- pairing ---------------- */

ipcMain.handle("pairing:complete", async (_event, deviceToken: string) => {
  if (!deviceToken) {
    throw new Error("pairing:complete called without deviceToken")
  }

  setDeviceToken(deviceToken)
  app.relaunch()
  app.exit(0)
})

/* ---------------- keyboard ---------------- */

ipcMain.handle("keyboard:show", () => {
  showKeyboard()
})

ipcMain.handle("keyboard:hide", () => {
  hideKeyboard()
})
