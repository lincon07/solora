// src/renderer/api/heartbeat.ts
import { api } from "./client"

export interface HeartbeatResponse {
  ok: boolean
  time?: string
}

export function fetchHeartBeat() {
  return api<HeartbeatResponse>("/hub/heartbeat", {
    method: "POST",
  })
}
