// src/main/device.ts
import { app, safeStorage } from "electron"
import fs from "node:fs"
import path from "node:path"

const SERVICE_DIR = "soloras"
const TOKEN_FILE = "device-token.bin"

/** Absolute path to where we store the encrypted token file */
function tokenPath() {
  return path.join(app.getPath("userData"), SERVICE_DIR, TOKEN_FILE)
}

/** Ensure the directory exists */
function ensureDir() {
  const dir = path.dirname(tokenPath())
  fs.mkdirSync(dir, { recursive: true })
}

/**
 * Read & decrypt the device token.
 * Returns null if missing or not decryptable (e.g., OS key changed).
 */
export function getDeviceToken(): string | null {
  const file = tokenPath()
  if (!fs.existsSync(file)) return null

  try {
    const data = fs.readFileSync(file)

    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.decryptString(data) || null
    }

    // plaintext fallback
    return data.toString("utf8") || null
  } catch {
    return null
  }
}


/**
 * Encrypt & store the device token.
 */
export function setDeviceToken(token: string) {
  if (!token || typeof token !== "string") {
    throw new Error("setDeviceToken: token must be a non-empty string")
  }

  ensureDir()

  try {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(token)
      fs.writeFileSync(tokenPath(), encrypted, { mode: 0o600 })
    } else {
      // ⚠️ Fallback (DEV / kiosk-safe)
      console.warn("[device] safeStorage unavailable, storing plaintext")
      fs.writeFileSync(tokenPath(), token, { mode: 0o600 })
    }
  } catch (err) {
    console.error("[device] Failed to persist device token:", err)
    throw err
  }
}


/**
 * Remove the stored device token (force re-pair).
 */
export function clearDeviceToken() {
  const file = tokenPath()
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file)
  } catch {
    // ignore
  }
}

/**
 * Convenience helper:
 * Returns true if the hub appears paired.
 */
export function isPaired() {
  return !!getDeviceToken()
}
