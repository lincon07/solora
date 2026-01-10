// api/calender.ts
import { api } from "./client"

/* ================= Types ================= */

export type HubCalendar = {
  id: string
  hubId: string
  name: string
  color: string
  hubMembersIds: string[]
  ownerMemberId: string
  createdAt: string
}

/**
 * ✅ IMPORTANT:
 * Your backend returns `calendarColor` (not `color`) in the event response.
 * So we model BOTH:
 * - `calendarColor`: default color coming from the calendar
 * - `color`: optional per-event override (if you support it)
 */
export type CalendarEvent = {
  id: string
  title: string
  startAt: string
  endAt: string

  calendarId: string

  // backend-provided default color
  calendarColor?: string | null

  // optional per-event override
  color?: string | null

  // ✅ IMPORTANT (for filtering + avatar rendering)
  createdByMemberId?: string | null
  memberDisplayName?: string | null
  memberAvatarUrl?: string | null
}

/* ================= Inputs ================= */

export type CreateCalendarInput = {
  name: string
  color: string
  hubMembersIds: string[]
  ownerMemberId: string
}

export type UpdateCalendarInput = {
  name?: string
  color?: string
  hubMembersIds?: string[]
  ownerMemberId?: string
}

/* ================= Calendars ================= */

export function fetchCalendars(hubId: string) {
  return api<{ calendars: HubCalendar[] }>(`/hub/${hubId}/calendars`)
}

export function createCalendar(hubId: string, data: CreateCalendarInput) {
  return api<{ calendar: HubCalendar }>(`/hub/${hubId}/calendars`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateCalendar(hubId: string, calendarId: string, data: UpdateCalendarInput) {
  return api<{ calendar: HubCalendar }>(`/hub/${hubId}/calendars/${calendarId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteCalendar(hubId: string, calendarId: string) {
  return api<void>(`/hub/${hubId}/calendars/${calendarId}`, {
    method: "DELETE",
  })
}

/* ================= Events ================= */

export function fetchCalendarEvents(hubId: string, calendarId: string) {
  return api<{ events: CalendarEvent[] }>(`/hub/${hubId}/calendars/${calendarId}/events`)
}

type CreateEventInput = {
  title: string
  startAt: Date | string
  endAt: Date | string
  createdByMemberId: string
  // ✅ optional override; backend may still return calendarColor
  color?: string | null
}

export function createCalendarEvent(hubId: string, calendarId: string, data: CreateEventInput) {
  return api<{ event: CalendarEvent }>(`/hub/${hubId}/calendars/${calendarId}/events`, {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      startAt: data.startAt instanceof Date ? data.startAt.toISOString() : data.startAt,
      endAt: data.endAt instanceof Date ? data.endAt.toISOString() : data.endAt,
      createdByMemberId: data.createdByMemberId,
      // send override if provided (backend can ignore or store it)
      color: data.color ?? null,
    }),
  })
}

type UpdateEventInput = {
  title?: string
  startAt?: Date | string
  endAt?: Date | string
  color?: string | null
}

export function updateCalendarEvent(
  hubId: string,
  calendarId: string,
  eventId: string,
  data: UpdateEventInput
) {
  return api<{ event: CalendarEvent }>(`/hub/${hubId}/calendars/${calendarId}/events/${eventId}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.color !== undefined ? { color: data.color } : {}),
      ...(data.startAt !== undefined
        ? { startAt: data.startAt instanceof Date ? data.startAt.toISOString() : data.startAt }
        : {}),
      ...(data.endAt !== undefined
        ? { endAt: data.endAt instanceof Date ? data.endAt.toISOString() : data.endAt }
        : {}),
    }),
  })
}

export function deleteCalendarEvent(hubId: string, calendarId: string, eventId: string) {
  return api<void>(`/hub/${hubId}/calendars/${calendarId}/events/${eventId}`, {
    method: "DELETE",
  })
}
