import { ipcMain, app } from "electron"
import { setDeviceToken } from "./device"
import os from "os"
import { exec } from "child_process"

function isWayland() {
  return process.env.XDG_SESSION_TYPE === "wayland"
}

function showSystemKeyboard() {
  exec(`
    gdbus call --session \
      --dest sm.puri.OSK0 \
      --object-path /sm/puri/OSK0 \
      --method sm.puri.OSK0.SetVisible true
  `)
}

function hideSystemKeyboard() {
  exec(`
    gdbus call --session \
      --dest sm.puri.OSK0 \
      --object-path /sm/puri/OSK0 \
      --method sm.puri.OSK0.SetVisible false
  `)
}

function showFallbackKeyboard() {
  exec("matchbox-keyboard || wvkbd")
}

function hideFallbackKeyboard() {
  exec("pkill matchbox-keyboard || pkill wvkbd")
}

/* ---------------- keyboard IPC ---------------- */

ipcMain.handle("keyboard:show", () => {
  if (os.platform() === "linux" && isWayland()) {
    showSystemKeyboard()
  } else {
    showFallbackKeyboard()
  }
})

ipcMain.handle("keyboard:hide", () => {
  if (os.platform() === "linux" && isWayland()) {
    hideSystemKeyboard()
  } else {
    hideFallbackKeyboard()
  }
})

/* ---------------- pairing ---------------- */

ipcMain.handle("pairing:complete", async (_event, deviceToken: string) => {
  if (!deviceToken) {
    throw new Error("pairing:complete called without deviceToken")
  }

  setDeviceToken(deviceToken)
  app.relaunch()
  app.exit(0)
})
