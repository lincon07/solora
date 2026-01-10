import { api } from "./client"

export interface HeartbeatResponse {
  ok: boolean
  time?: string
}

export function fetchHealth() {
  return api<HeartbeatResponse>(`/health`, {
    method: "GET",
  })
}
