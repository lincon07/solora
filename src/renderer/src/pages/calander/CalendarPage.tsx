import * as React from "react";
import {  Card, Stack, Typography, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { HubInfoContext } from "@renderer/providers/hub-info";
import {
  fetchCalendars,
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  HubCalendar,
} from "../../../api/calender";

import { CalendarShell } from "./CalendarShell";
import { CreateEventDialog } from "./dialogs/CreateEventDialog";
import { mapEvents } from "@renderer/utils/calendarMappers";

export default function CalendarPage() {
  const hub = React.useContext(HubInfoContext);
  const hubId = hub?.hubId;

  const [_calendars, setCalendars] = React.useState<HubCalendar[]>([]);
  const [activeCalendarId, setActiveCalendarId] = React.useState<string | null>(null);
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [createEventOpen, setCreateEventOpen] = React.useState(false);
  const [eventSeed, setEventSeed] = React.useState<{ start?: Date; end?: Date }>({});
  const [editingEvent, setEditingEvent] = React.useState<any | null>(null);

  /* ---------- load calendars ---------- */
  React.useEffect(() => {
    if (!hubId) return;
    fetchCalendars(hubId).then((res) => {
      setCalendars(res.calendars);
      setActiveCalendarId(res.calendars[0]?.id ?? null);
    });
  }, [hubId]);

  /* ---------- load events ---------- */
  React.useEffect(() => {
    if (!hubId || !activeCalendarId) return;
    setLoading(true);
    fetchCalendarEvents(hubId, activeCalendarId)
      .then((res) => setEvents(mapEvents(res.events)))
      .finally(() => setLoading(false));
  }, [hubId, activeCalendarId]);

  /* ---------- create / edit ---------- */
  const handleSaveEvent = async (data: {
    title: string;
    startAt: Date;
    endAt: Date;
    color: string;
  }) => {
    if (!hubId || !activeCalendarId) return;

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, title: data.title, start: data.startAt, end: data.endAt }
            : e
        )
      );

      await updateCalendarEvent(hubId, activeCalendarId, editingEvent.id, data);
      setEditingEvent(null);
      return;
    }

    const res = await createCalendarEvent(hubId, activeCalendarId, data);
    setEvents((prev) => [...prev, ...mapEvents([res.event])]);
  };

  /* ---------- resize / drag ---------- */
  const handleUpdateEvent = async ({
    id,
    start,
    end,
  }: {
    id: string;
    start: Date;
    end: Date;
  }) => {
    if (!hubId || !activeCalendarId) return;

    // optimistic update (THIS fixes resize rendering)
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, start, end } : e))
    );

    try {
      await updateCalendarEvent(hubId, activeCalendarId, id, {
        startAt: start,
        endAt: end,
      });
    } catch {
      // optional revert: refetch events if needed
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Calendar
        </Typography>

        <Chip
          icon={<AddIcon />}
          label="Add Event"
          color="primary"
          onClick={() => {
            const start = new Date();
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            setEventSeed({ start, end });
            setEditingEvent(null);
            setCreateEventOpen(true);
          }}
        />
      </Stack>

      <Card sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CalendarShell
          loading={loading}
          events={events}
          onSelect={(arg) => {
            setEventSeed({ start: arg.start, end: arg.end });
            setEditingEvent(null);
            setCreateEventOpen(true);
          }}
          onUpdate={handleUpdateEvent}
          onEdit={(event) => {
            setEditingEvent(event);
            setEventSeed({ start: event.start, end: event.end });
            setCreateEventOpen(true);
          }}
          onDelete={async (event) => {
            if (!hubId || !activeCalendarId) return;
            await deleteCalendarEvent(hubId, activeCalendarId, event.id);
            setEvents((prev) => prev.filter((e) => e.id !== event.id));
          }}
        />
      </Card>

      <CreateEventDialog
        open={createEventOpen}
        initialStart={eventSeed.start}
        initialEnd={eventSeed.end}
        onClose={() => {
          setCreateEventOpen(false);
          setEditingEvent(null);
        }}
        onCreate={handleSaveEvent}
      />
    </>
  );
}
