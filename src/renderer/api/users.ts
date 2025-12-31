// api/users.ts

import { api } from "./client";

export interface HubUser {
  id: string;
  email?: string;
}

export function fetchHubUsers(hubId: string) {
  return api<{ users: HubUser[] }>(`/hub/${hubId}/users`);
}

export function inviteHubUser(hubId: string, email: string) {
  return api<{ ok: true }>(`/hub/${hubId}/invite`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
