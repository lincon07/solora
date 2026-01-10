import type { CalendarEvent } from "@api/calender"

function initialsFromName(name?: string | null) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  return (
    (parts[0]?.[0] ?? "") +
    (parts.length > 1 ? parts.at(-1)?.[0] ?? "" : "")
  ).toUpperCase()
}

export function mapEvents(events: CalendarEvent[] = []) {
  return events.map((e) => {
    const start = new Date(e.startAt)
    const end = new Date(e.endAt)

    // ✅ IMPORTANT: prefer event color, fallback to calendar color
    const color = e.color ?? e.calendarColor ?? undefined

    return {
      id: String(e.id),
      title: e.title || "(Untitled)",
      start,
      end,

      backgroundColor: color,
      borderColor: color,

      extendedProps: {
        createdByMemberId: e.createdByMemberId ?? undefined,
        avatar:
  e.memberAvatarUrl &&
  !e.memberAvatarUrl.startsWith("blob:")
    ? e.memberAvatarUrl
    : undefined,
    initials: initialsFromName(e.memberDisplayName),
        memberDisplayName: e.memberDisplayName ?? "Unknown",

        color,
      },
    }
  })
}
