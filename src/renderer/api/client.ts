import { API_BASE } from "@renderer/utils/api_url";

function getHubToken() {
  return localStorage.getItem("deviceToken");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getHubToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  /* ---------- Error handling ---------- */
  if (!res.ok) {
    let message = "API error";

    try {
      const data = await res.json();
      message = data?.error || message;
    } catch {
      // backend may return empty body or text
      message = res.statusText || message;
    }

    throw new Error(message);
  }

  /* ---------- ✅ CRITICAL FIX ---------- */
  // 204 No Content (DELETE, some PATCH)
  if (res.status === 204) {
    return undefined as T;
  }

  // Empty body safety (Electron / proxies)
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
