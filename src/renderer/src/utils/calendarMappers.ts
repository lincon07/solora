import { CalendarEvent } from "@api/calender";
import { hashColor } from "./hash-color";

export function mapEvents(rows: CalendarEvent[]) {
  return rows.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.startAt,
    end: e.endAt,
    backgroundColor: e.calendarColor ?? hashColor(e.calendarId),
    borderColor: "transparent",
    extendedProps: {
      memberDisplayName: e.memberDisplayName,
      memberAvatarUrl: e.memberAvatarUrl,
    },
  }));
}
