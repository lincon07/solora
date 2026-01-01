// src/utils/calendarMappers.ts

export function mapEvents(events: any[]) {
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    start: new Date(e.startAt),
    end: new Date(e.endAt),

    backgroundColor: e.color ?? e.calendarColor ?? "#3b82f6",
    borderColor: e.color ?? e.calendarColor ?? "#3b82f6",

    extendedProps: {
      memberDisplayName: e.memberDisplayName,
      memberAvatarUrl: e.memberAvatarUrl,
    },
  }));
}
