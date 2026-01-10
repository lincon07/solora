
  /* ---------- helpers ---------- */

  import { API_BASE } from "@renderer/utils/api_url";
  import { hubAuthHeaders, userAuthHeaders } from "@renderer/utils/headers";



  /* ---------- API calls ---------- */
export async function fetchHubMe() {
  const res = await fetch(`${API_BASE}/hub/me`, {
    headers: await hubAuthHeaders(), // ✅
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json();
}





export async function startDevicePairing(hubId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/devices/pair`, {
    method: "POST",
    headers: await userAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to start device pairing");
  return res.json();
}

  export async function fetchPairingStatus(pairingId: string) {
    const res = await fetch(`${API_BASE}/pairing/status/${pairingId}`);
    if (!res.ok) throw new Error("Failed to fetch pairing status");
    return res.json();
  }
export async function fetchMyDevices() {
  const res = await fetch(`${API_BASE}/hub/devices`, {
    headers: await hubAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch hub devices");
  return res.json();
}



export async function factoryResetHub() {
  const res = await fetch(`${API_BASE}/hub/factory-reset`, {
    method: "POST",
    headers: await hubAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to factory reset hub");
  return res.json();
}
