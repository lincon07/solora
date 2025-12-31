import * as React from "react";
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { HubInfoContext } from "@renderer/providers/hub-info";

import {
  fetchCalendars,
  createCalendar,
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  deleteCalendar,
  HubCalendar,
} from "../../../api/calender";

import { CalendarShell } from "./CalendarShell";
import { CalendarEmptyState } from "./CalendarEmptyState";

import { CreateCalendarDialog } from "./dialogs/CreateCalendarDialog";
import { CreateEventDialog } from "./dialogs/CreateEventDialog";
import { DeleteCalendarDialog } from "./dialogs/DeleteCalendarDialog";

import { mapEvents } from "@renderer/utils/calendarMappers";
import { CalendarSelector } from "./CalendarSelector";

/* ========================================================= */

export default function CalendarPage() {
  const hub = React.useContext(HubInfoContext);
  const hubId = hub?.hubId;

  const [calendars, setCalendars] = React.useState<HubCalendar[]>([]);
  const [activeCalendarId, setActiveCalendarId] =
    React.useState<string | null>(null);

  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  /* ---------- dialogs ---------- */

  const [createCalendarOpen, setCreateCalendarOpen] = React.useState(false);
  const [createEventOpen, setCreateEventOpen] = React.useState(false);
  const [deleteCalendarOpen, setDeleteCalendarOpen] = React.useState(false);

  const [editingEvent, setEditingEvent] = React.useState<any | null>(null);
  const [pendingDeleteEvent, setPendingDeleteEvent] = React.useState<any | null>(null);

  const [eventSeed, setEventSeed] = React.useState<{
    start?: Date;
    end?: Date;
  }>({});

  /* =========================================================
   * Load calendars
   * ========================================================= */

  React.useEffect(() => {
    if (!hubId) return;

    fetchCalendars(hubId).then((res) => {
      const list = res.calendars ?? [];
      setCalendars(list);
      setActiveCalendarId(list[0]?.id ?? null);
    });
  }, [hubId]);

  /* =========================================================
   * Load events
   * ========================================================= */

  React.useEffect(() => {
    if (!hubId || !activeCalendarId) return;

    setLoading(true);
    fetchCalendarEvents(hubId, activeCalendarId)
      .then((res) => setEvents(mapEvents(res.events ?? [])))
      .finally(() => setLoading(false));
  }, [hubId, activeCalendarId]);

  /* =========================================================
   * Calendar create
   * ========================================================= */

  const handleCreateCalendar = async (data: {
    name: string;
    color: string;
  }) => {
    if (!hubId) return;

    const res = await createCalendar(hubId, data);
    const cal = res.calendar;

    setCalendars((prev) => [...prev, cal]);
    setActiveCalendarId(cal.id);
  };

  /* =========================================================
   * Event create / edit (SAME DIALOG)
   * ========================================================= */

  const handleSaveEvent = async (data: {
    title: string;
    startAt: Date;
    endAt: Date;
  }) => {
    if (!hubId || !activeCalendarId) return;

    // EDIT
    if (editingEvent) {
      await updateCalendarEvent(hubId, activeCalendarId, editingEvent.id, data);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, title: data.title, start: data.startAt, end: data.endAt }
            : e
        )
      );

      setEditingEvent(null);
      return;
    }

    // CREATE
    const res = await createCalendarEvent(hubId, activeCalendarId, data);
    setEvents((prev) => mapEvents([...prev, res.event]));
  };

  /* =========================================================
   * Event drag / resize
   * ========================================================= */

  const handleUpdateEvent = async (arg: any) => {
    if (!hubId || !activeCalendarId) return;

    try {
      await updateCalendarEvent(hubId, activeCalendarId, arg.event.id, {
        title: arg.event.title,
        startAt: arg.event.start,
        endAt: arg.event.end,
      });
    } catch {
      arg.revert();
    }
  };

  /* =========================================================
   * Event delete (CONFIRMED)
   * ========================================================= */

  const confirmDeleteEvent = async () => {
    if (!hubId || !activeCalendarId || !pendingDeleteEvent) return;

    await deleteCalendarEvent(hubId, activeCalendarId, pendingDeleteEvent.id);
    setEvents((prev) => prev.filter((e) => e.id !== pendingDeleteEvent.id));
    setPendingDeleteEvent(null);
  };

  /* =========================================================
   * Calendar delete
   * ========================================================= */

  const handleDeleteCalendar = async () => {
    if (!hubId || !activeCalendarId) return;

    await deleteCalendar(hubId, activeCalendarId);

    const remaining = calendars.filter((c) => c.id !== activeCalendarId);
    setCalendars(remaining);
    setEvents([]);
    setActiveCalendarId(remaining[0]?.id ?? null);

    setDeleteCalendarOpen(false);
  };

  /* =========================================================
   * Empty state
   * ========================================================= */

  if (!calendars.length) {
    return (
      <>
        <CalendarEmptyState onCreate={() => setCreateCalendarOpen(true)} />

        <CreateCalendarDialog
          open={createCalendarOpen}
          onClose={() => setCreateCalendarOpen(false)}
          onCreate={handleCreateCalendar}
        />
      </>
    );
  }

  /* =========================================================
   * Render
   * ========================================================= */

  return (
    <>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* ---------- header ---------- */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" fontWeight={700}>
            Calendar
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* calendar selector */}
            <CalendarSelector
              calendars={calendars}
              activeCalendarId={activeCalendarId}
              onChange={(id) => setActiveCalendarId(id)}
              onDelete={(calendar) => {
                setActiveCalendarId(calendar.id);
                setDeleteCalendarOpen(true);
              }}
            />

            <Chip
              icon={<AddIcon />}
              label="New Calendar"
              onClick={() => setCreateCalendarOpen(true)}
            />

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
        </Stack>

        {/* ---------- calendar ---------- */}
        <Card sx={{ flexGrow: 1, p: 2 }}>
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
            onDelete={(event) => {
              setPendingDeleteEvent(event);
            }}
          />
        </Card>
      </Box>

      {/* ---------- dialogs ---------- */}

      <CreateCalendarDialog
        open={createCalendarOpen}
        onClose={() => setCreateCalendarOpen(false)}
        onCreate={handleCreateCalendar}
      />

      <CreateEventDialog
        open={createEventOpen}
        initialStart={eventSeed.start ?? null}
        initialEnd={eventSeed.end ?? null}
        onClose={() => {
          setCreateEventOpen(false);
          setEditingEvent(null);
        }}
        onCreate={handleSaveEvent}
      />

      <DeleteCalendarDialog
        open={deleteCalendarOpen}
        calendar={calendars.find((c) => c.id === activeCalendarId)}
        onClose={() => setDeleteCalendarOpen(false)}
        onConfirm={handleDeleteCalendar}
      />

      {/* ---------- delete event confirm ---------- */}
      <DeleteCalendarDialog
        open={!!pendingDeleteEvent}
        calendar={{ name: "this event" } as any}
        onClose={() => setPendingDeleteEvent(null)}
        onConfirm={confirmDeleteEvent}
      />
    </>
  );
}
