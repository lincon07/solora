// src/main/pairing-ipc.ts
import { ipcMain, app } from "electron"
import { setDeviceToken } from "./device"
import os from "os"
import { exec } from "child_process"

function run(cmd: string) {
  exec(`bash -lc "${cmd.replace(/"/g, '\\"')}"`)
}

/* =======================
   KEYBOARD CONTROL
   ======================= */

function showKeyboard() {
  const platform = os.platform()

  if (platform === "win32") {
    run("osk")
    return
  }

  if (platform === "linux") {
    // Prefer Wayland keyboard first
    run("wvkbd-mobintl || wvkbd || matchbox-keyboard")
    return
  }
}

function hideKeyboard() {
  const platform = os.platform()

  if (platform === "win32") {
    run("taskkill /IM osk.exe /F")
    return
  }

  if (platform === "linux") {
    run("pkill -f wvkbd || pkill -f matchbox-keyboard")
    return
  }
}

/* =======================
   IPC HANDLERS
   ======================= */

ipcMain.handle("keyboard:show", () => {
  showKeyboard()
})

ipcMain.handle("keyboard:hide", () => {
  hideKeyboard()
})

/* =======================
   PAIRING (DO NOT TOUCH)
   ======================= */

ipcMain.handle("pairing:complete", async (_event, deviceToken: string) => {
  if (!deviceToken) {
    throw new Error("pairing:complete called without deviceToken")
  }

  setDeviceToken(deviceToken)

  // Relaunch into authenticated mode
  app.relaunch()
  app.exit(0)
})
