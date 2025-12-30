import { API_BASE } from "@renderer/utils/api_url";

export async function createPairingSession() {
  const res = await fetch(`${API_BASE}/pairing/session`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to create pairing session");

  return res.json();
}

export async function fetchPairingStatus(pairingId: string) {
  const res = await fetch(`${API_BASE}/pairing/status/${pairingId}`);

  if (!res.ok) throw new Error("Failed to fetch pairing status");

  return res.json();
}
