import { api } from "./client"

export interface HeartbeatResponse {
  ok: boolean
  time?: string
}

export function fetchHeartBeat(hubId: string) {
  if (!hubId) {
    throw new Error("hubId is required for heartbeat")
  }

  return api<HeartbeatResponse>(`/hub/${hubId}/heartbeat`, {
    method: "POST",
  })
}
