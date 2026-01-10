import * as React from "react"
import {
  Card,
  Stack,
  Typography,
  Fab,
  Box,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { HubInfoContext } from "@renderer/providers/hub-info"
import {
  fetchCalendars,
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  HubCalendar,
  createCalendar,
} from "../../../api/calender"

import { CalendarShell } from "./CalendarShell"
import { CalendarSelector } from "./CalendarSelector"
import { CreateEventDialog } from "./dialogs/CreateEventDialog"
import { CreateCalendarDialog } from "./dialogs/CreateCalendarDialog"
import { mapEvents } from "@renderer/utils/calendarMappers"
import { toUSVString } from "util"
import { toast } from "react-toastify"
import CalaendarMembersPage from "./calaendar-members"

export default function CalendarPage() {
  const hub = React.useContext(HubInfoContext)
  const hubId = hub?.hubId

  const [calendars, setCalendars] = React.useState<HubCalendar[]>([])
  const [activeCalendarId, setActiveCalendarId] =
    React.useState<string | null>(null)

  const [events, setEvents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  const [createEventOpen, setCreateEventOpen] = React.useState(false)
  const [eventSeed, setEventSeed] =
    React.useState<{ start?: Date; end?: Date }>({})
  const [editingEvent, setEditingEvent] = React.useState<any | null>(null)
  const [createCalendarOpen, setCreateCalendarOpen] = React.useState(false)

  /* ---------- load calendars ---------- */
  React.useEffect(() => {
    if (!hubId) return
    fetchCalendars(hubId).then((res) => {
      setCalendars(res.calendars)
      setActiveCalendarId(res.calendars[0]?.id ?? null)
    })
  }, [hubId])

  /* ---------- load events ---------- */
  React.useEffect(() => {
    if (!hubId || !activeCalendarId) return
    setLoading(true)
    fetchCalendarEvents(hubId, activeCalendarId)
      .then((res) => setEvents(mapEvents(res.events)))
      .finally(() => setLoading(false))
  }, [hubId, activeCalendarId])

  /* ---------- create / edit ---------- */
  const handleSaveEvent = async (data: {
    title: string
    startAt: Date
    endAt: Date
    color: string
  }) => {
    if (!hubId || !activeCalendarId) return

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, title: data.title, start: data.startAt, end: data.endAt }
            : e
        )
      )

      await updateCalendarEvent(
        hubId,
        activeCalendarId,
        editingEvent.id,
        data
      )
      setEditingEvent(null)
      return
    }

    const res = await createCalendarEvent(hubId, activeCalendarId, data)
    setEvents((prev) => [...prev, ...mapEvents([res.event])])
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <Typography variant="h4" fontWeight={700}>
          Calendar
        </Typography>

        <CalendarSelector
          calendars={calendars}
          activeCalendarId={activeCalendarId}
          onChange={setActiveCalendarId}
          onCreate={() => setCreateCalendarOpen(true)}
          onDelete={async (cal) => {
            if (!hubId) return
            // optional delete flow
          }}
        />

        <CalaendarMembersPage members={hub?.members || []} />
      </Stack>

      {/* CALENDAR */}
      <Card sx={{ flexGrow: 1,  overflow: "hidden" }}>
        <CalendarShell
          loading={loading}
          events={events}
          onSelect={(arg) => {
            setEventSeed({ start: arg.start, end: arg.end })
            setEditingEvent(null)
            setCreateEventOpen(true)
          }}
          onUpdate={async ({ id, start, end }) => {
            if (!hubId || !activeCalendarId) return
            setEvents((prev) =>
              prev.map((e) => (e.id === id ? { ...e, start, end } : e))
            )
            await updateCalendarEvent(hubId, activeCalendarId, id, {
              startAt: start,
              endAt: end,
            })
          }}
          onEdit={(event) => {
            setEditingEvent(event)
            setEventSeed({ start: event.start, end: event.end })
            setCreateEventOpen(true)
          }}
          onDelete={async (event) => {
            if (!hubId || !activeCalendarId) return
            await deleteCalendarEvent(hubId, activeCalendarId, event.id)
            setEvents((prev) => prev.filter((e) => e.id !== event.id))
          }}
        />
      </Card>

      {/* FAB – CREATE EVENT */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1200,
        }}
        onClick={() => {
          const start = new Date()
          const end = new Date(start.getTime() + 60 * 60 * 1000)
          setEventSeed({ start, end })
          setEditingEvent(null)
          setCreateEventOpen(true)
        }}
      >
        <AddIcon />
      </Fab>

      {/* DIALOGS */}
      <CreateEventDialog
        open={createEventOpen}
        initialStart={eventSeed.start}
        initialEnd={eventSeed.end}
        onClose={() => {
          setCreateEventOpen(false)
          setEditingEvent(null)
        }}
        onCreate={handleSaveEvent}
      />

      <CreateCalendarDialog
        open={createCalendarOpen}
        onClose={() => setCreateCalendarOpen(false)}
        onCreate={async (data) => {
          if (!hubId) {
            toast.error("Hub ID is missing. Cannot create calendar.")
            return
          }
          const res = await createCalendar(hubId, data)
          setCalendars((prev) => [...prev, res.calendar])
          setActiveCalendarId(res.calendar.id)
          setCreateCalendarOpen(false)
        }}
      />
    </Box>
  )
}
