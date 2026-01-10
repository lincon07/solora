export function userAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };
}

export async function hubAuthHeaders(): Promise<HeadersInit> {
  if (!window.soloras?.getDeviceToken) {
    console.warn("[auth] getDeviceToken not available")
    return {}
  }

  const token = await window.soloras.getDeviceToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}