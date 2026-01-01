import { api } from "./client";

/* ================= Types ================= */

export type HubCalendar = {
  id: string;
  hubId: string;
  name: string;
  color: string;
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  color: string | null;

  calendarId: string;
  calendarColor?: string;

  memberDisplayName?: string | null;
  memberAvatarUrl?: string | null;
};

/* ================= Calendars ================= */

export function fetchCalendars(hubId: string) {
  return api<{ calendars: HubCalendar[] }>(`/hub/${hubId}/calendars`);
}

export function createCalendar(
  hubId: string,
  data: { name: string; color: string }
) {
  return api<{ calendar: HubCalendar }>(`/hub/${hubId}/calendars`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCalendar(
  hubId: string,
  calendarId: string,
  data: { name?: string; color?: string }
) {
  return api<{ calendar: HubCalendar }>(`/hub/${hubId}/calendars/${calendarId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCalendar(hubId: string, calendarId: string) {
  return api<void>(`/hub/${hubId}/calendars/${calendarId}`, {
    method: "DELETE",
  });
}

/* ================= Events ================= */

export function fetchCalendarEvents(hubId: string, calendarId: string) {
  return api<{ events: CalendarEvent[] }>(
    `/hub/${hubId}/calendars/${calendarId}/events`
  );
}

export function createCalendarEvent(
  hubId: string,
  calendarId: string,
  data: { title: string; startAt: Date | string; endAt: Date | string }
) {
  return api<{ event: CalendarEvent }>(
    `/hub/${hubId}/calendars/${calendarId}/events`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateCalendarEvent(
  hubId: string,
  calendarId: string,
  eventId: string,
  data: { title?: string; startAt?: Date | string; endAt?: Date | string }
) {
  return api<{ event: CalendarEvent }>(
    `/hub/${hubId}/calendars/${calendarId}/events/${eventId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export function deleteCalendarEvent(
  hubId: string,
  calendarId: string,
  eventId: string
) {
  return api<void>(`/hub/${hubId}/calendars/${calendarId}/events/${eventId}`, {
    method: "DELETE",
  });
}
