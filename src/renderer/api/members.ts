import { api } from "./client";

/* =========================================================
 * Types
 * ========================================================= */

export type HubMember = {
  id: string;
  hubId: string;
  displayName: string;
  avatarUrl?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

/* =========================================================
 * Fetch members for a hub
 * ========================================================= */

export async function fetchHubMembers(hubId: string) {
  if (!hubId) {
    throw new Error("hubId is required to fetch members");
  }

  return api<{ hubId: string; members: HubMember[] }>(
    `/hub/${hubId}/info/members`
  );
}

/* =========================================================
 * Create member (kiosk-side, hub token)
 * ========================================================= */

export async function createHubMember(
  hubId: string,
  input: {
    displayName: string;
    avatarUrl?: string;
    role?: string;
  }
) {
  if (!hubId) {
    throw new Error("hubId is required to create member");
  }

  return api<{ member: HubMember }>(
    `/hub/${hubId}/members`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}
