import { api } from "./client";

/* =========================================================
 * Types
 * ========================================================= */

export type HubMemberRole = "owner" | "member";

export type HubMember = {
  id: string;
  hubId: string;
  userId: string;                  // ✅ STRICT link to user
  displayName: string;
  role: HubMemberRole;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string | null;
};

/* =========================================================
 * Fetch members for a hub
 * ========================================================= */

export function fetchHubMembers(hubId: string) {
  return api<{
    hubId: string;
    members: HubMember[];
  }>(`/hub/${hubId}/info/members`);
}

/* =========================================================
 * Create a hub member (REQUIRES userId)
 * ========================================================= */

export function createHubMember(
  hubId: string,
  input: {
    userId: string;                // ✅ REQUIRED
    displayName: string;
    role?: HubMemberRole;
    avatarUrl?: string | null;
  }
) {
  return api<{
    member: HubMember;
  }>(`/hub/${hubId}/members`, {
    method: "POST",
    body: JSON.stringify({
      userId: input.userId,
      displayName: input.displayName,
      role: input.role ?? "member",
      avatarUrl: input.avatarUrl ?? null,
    }),
  });
}

/* =========================================================
 * Update hub member
 * ========================================================= */

export function updateHubMember(
  hubId: string,
  memberId: string,
  input: {
    displayName?: string;
    role?: HubMemberRole;
    isActive?: boolean;
    avatarUrl?: string | null;
  }
) {
  return api<{
    member: HubMember;
  }>(`/hub/${hubId}/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...(input.displayName !== undefined && {
        displayName: input.displayName,
      }),
      ...(input.role !== undefined && {
        role: input.role,
      }),
      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
      ...(input.avatarUrl !== undefined && {
        avatarUrl: input.avatarUrl,
      }),
    }),
  });
}

/* =========================================================
 * Delete hub member
 * ========================================================= */

export function deleteHubMember(
  hubId: string,
  memberId: string
) {
  return api<void>(`/hub/${hubId}/members/${memberId}`, {
    method: "DELETE",
  });
}
