import { API_BASE } from "@renderer/utils/api_url"
import { toast } from "react-toastify"

/* =========================================================
 * Types
 * ========================================================= */

type ApiOptions = RequestInit & {
  auth?: "hub" | "user" | "none"
}

/* =========================================================
 * Token helpers (Electron-safe)
 * ========================================================= */

async function getHubToken(): Promise<string | null> {
  if (!window.soloras?.getDeviceToken) {
    console.warn("[api] getDeviceToken not available")
    return null
  }
  return await window.soloras.getDeviceToken()
}

async function getUserToken(): Promise<string | null> {
  if (!window.soloras?.getUserToken) {
    console.warn("[api] getUserToken not available")
    return null
  }
  return await window.soloras.getUserToken()
}

/* =========================================================
 * Core API client
 * ========================================================= */

export async function api<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = "hub", headers, ...rest } = options

  let authHeader: HeadersInit = {}

  if (auth === "hub") {
    const token = await getHubToken()
    if (!token) {
      throw new Error("Missing hub token")
    }
    authHeader = { Authorization: `Bearer ${token}` }
  }

  if (auth === "user") {
    const token = await getUserToken()
    if (!token) {
      throw new Error("Missing user token")
    }
    authHeader = { Authorization: `Bearer ${token}` }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(headers || {}),
    },
  })

  /* =========================================================
   * Error handling
   * ========================================================= */

  if (res.status === 401) {
    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`

    try {
      const data = await res.json()
      message = data?.error || message
    } catch {
      message = res.statusText || message
    }

    toast.error(`API Error: ${message}`)
    throw new Error(message)
  }

  /* =========================================================
   * Response handling
   * ========================================================= */

  // 204 No Content
  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
