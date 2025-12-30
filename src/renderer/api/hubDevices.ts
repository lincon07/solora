
/* ---------- helpers ---------- */

import { API_BASE } from "@renderer/utils/api_url";

function userAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };
}

function hubAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("deviceToken")}`,
  };
}

/* ---------- API calls ---------- */

export async function fetchHubMe() {
  const res = await fetch(`${API_BASE}/hub/me`, {
    headers: hubAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch hub");
  return res.json();
}

export async function startDevicePairing(hubId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/devices/pair`, {
    method: "POST",
    headers: userAuthHeaders(),
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
    headers: {
      Authorization: `Bearer ${localStorage.getItem("deviceToken")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch hub devices");
  }

  return res.json();
}
