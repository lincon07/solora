import { api } from "./client";

export type HubMember = {
  id: string;
  hubId: string;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string | null;
};

export function fetchHubMembers(hubId: string) {
  return api<{ hubId: string; members: HubMember[] }>(
    `/hub/${hubId}/info/members`
  );
}

export function createHubMember(
  hubId: string,
  input: { displayName: string; role?: string; avatarUrl?: string | null }
) {
  return api<{ member: HubMember }>(
    `/hub/${hubId}/members`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

export function updateHubMember(
  hubId: string,
  memberId: string,
  input: { displayName?: string; role?: string; isActive?: boolean, avatarUrl?: string | null }
) {
  return api<{ member: HubMember }>(
    `/hub/${hubId}/members/${memberId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
}

export function deleteHubMember(hubId: string, memberId: string) {
  return api(
    `/hub/${hubId}/members/${memberId}`,
    { method: "DELETE" }
  );
}
