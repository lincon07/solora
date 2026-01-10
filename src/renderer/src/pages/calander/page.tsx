import * as React from "react"
import { Card, Stack, Typography, Fab, Box, Divider } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"

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

import { CreateEventDialog } from "./dialogs/CreateEventDialog"
import { mapEvents } from "@renderer/utils/calendarMappers"
import { toast } from "react-toastify"
import CalaendarMembersPage from "./members"
import { CalendarShell } from "./shell"
import { CalendarSelector } from "./selector"
import { CreateCalendarDialog } from "./dialogs/CreateCalendarDialog"

export default function CalendarPage() {
  const hub = React.useContext(HubInfoContext)
  const hubId = hub?.hubId
  const hubMembers = hub?.members ?? []

  const [calendars, setCalendars] = React.useState<HubCalendar[]>([])
  const [activeCalendarId, setActiveCalendarId] = React.useState<string | null>(null)

  const [events, setEvents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  const [createEventOpen, setCreateEventOpen] = React.useState(false)
  const [eventSeed, setEventSeed] = React.useState<{ start?: Date; end?: Date }>({})

  // ✅ Calendar dialog
  const [createCalendarOpen, setCreateCalendarOpen] = React.useState(false)

  // ✅ MEMBER FILTER
  const [visibleMemberIds, setVisibleMemberIds] = React.useState<string[]>([])

  const activeCalendar = React.useMemo(
    () => calendars.find((c) => c.id === activeCalendarId) ?? null,
    [calendars, activeCalendarId]
  )

  /** ✅ members that belong to this calendar (with fallback) */
  const calendarMembers = React.useMemo(() => {
    if (!activeCalendar) return []

    const list = activeCalendar.hubMembersIds ?? []

    // ✅ If the calendar has no member list stored, show everyone
    if (!Array.isArray(list) || list.length === 0) {
      return hubMembers
    }

    const ids = new Set(list)
    return hubMembers.filter((m) => ids.has(m.id))
  }, [activeCalendar, hubMembers])

  /** ✅ initialize visible members whenever calendarMembers changes */
  React.useEffect(() => {
    setVisibleMemberIds(calendarMembers.map((m) => m.id))
  }, [calendarMembers])

  const toggleMember = (memberId: string) => {
    setVisibleMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  /** ✅ FILTER EVENTS (requires mapEvents to provide createdByMemberId) */
  const filteredEvents = React.useMemo(() => {
    if (visibleMemberIds.length === 0) return []
    return events.filter((e) =>
      visibleMemberIds.includes(e.extendedProps?.createdByMemberId)
    )
  }, [events, visibleMemberIds])

  /* ---------- load calendars ---------- */
  React.useEffect(() => {
    if (!hubId) return

    fetchCalendars(hubId)
      .then((res) => {
        const list = res.calendars ?? []
        setCalendars(list)

        // ✅ do not blow away user selection if already set
        setActiveCalendarId((prev) => prev ?? list[0]?.id ?? null)
      })
      .catch(() => toast.error("Failed to load calendars"))
  }, [hubId])

  /* ---------- load events ---------- */
  React.useEffect(() => {
    if (!hubId || !activeCalendarId) return

    setLoading(true)
    fetchCalendarEvents(hubId, activeCalendarId)
      .then((res) => setEvents(mapEvents(res.events ?? [])))
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false))
  }, [hubId, activeCalendarId])

  /* ---------- create event ---------- */
  const handleSaveEvent = async (data: {
    title: string
    startAt: Date
    endAt: Date
    color: string
    createdByMemberId: string
  }) => {
    if (!hubId || !activeCalendarId) return

    try {
      const res = await createCalendarEvent(hubId, activeCalendarId, data)
      setEvents((prev) => [...prev, ...mapEvents([res.event])])
    } catch (e) {
      toast.error("Failed to create event")
      console.error(e)
    }
  }

  /* ---------- open create calendar dialog ---------- */
  const openCreateCalendarDialog = () => {
    setCreateCalendarOpen(true)
  }

  /* ---------- create calendar from dialog ---------- */
  const handleCreateCalendarFromDialog = async ({
    name,
    color,
    ownerMemberId,
    hubMembersIds,
  }: {
    name: string
    color: string
    ownerMemberId: string
    hubMembersIds: string[]
  }) => {
    if (!hubId) return

    try {
      const res = await createCalendar(hubId, {
        name,
        color,
        ownerMemberId,
        hubMembersIds,
      })

      setCalendars((prev) => [...prev, res.calendar])
      setActiveCalendarId(res.calendar.id)
      toast.success("Calendar created")
    } catch (e) {
      toast.error("Failed to create calendar")
      console.error(e)
    }
  }

  const defaultOwnerId =
    hubMembers.find((m: any) => m.role === "owner")?.id ?? hubMembers[0]?.id ?? ""

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <Stack spacing={1.25} sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <CalendarMonthIcon />
          <Typography variant="h4" fontWeight={800}>
            Calendar
          </Typography>

          <Box sx={{ flex: 1 }} />

          <CalendarSelector
            calendars={calendars}
            activeCalendarId={activeCalendarId}
            onChange={setActiveCalendarId}
            onCreate={openCreateCalendarDialog} // ✅ opens dialog now
          />

          {/* ✅ avatar toggle row */}
          <CalaendarMembersPage
            members={calendarMembers}
            selectedIds={visibleMemberIds}
            onToggle={toggleMember}
          />
        </Stack>

        <Divider />
      </Stack>

      {/* CALENDAR */}
      <Card sx={{ flexGrow: 1 }}>
        <CalendarShell
          loading={loading}
          events={filteredEvents}
          onSelect={(arg) => {
            setEventSeed({ start: arg.start, end: arg.end })
            setCreateEventOpen(true)
          }}
          onUpdate={async ({ id, start, end }) => {
            if (!hubId || !activeCalendarId) return
            await updateCalendarEvent(hubId, activeCalendarId, id, {
              startAt: start,
              endAt: end,
            })
          }}
          onEdit={() => {}}
          onDelete={async (event) => {
            if (!hubId || !activeCalendarId) return
            await deleteCalendarEvent(hubId, activeCalendarId, event.id)
            setEvents((prev) => prev.filter((e) => e.id !== event.id))
          }}
        />
      </Card>

      {/* FAB */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => {
          const start = new Date()
          setEventSeed({ start, end: new Date(start.getTime() + 3600000) })
          setCreateEventOpen(true)
        }}
      >
        <AddIcon />
      </Fab>

      {/* EVENT DIALOG */}
      <CreateEventDialog
        open={createEventOpen}
        initialStart={eventSeed.start}
        initialEnd={eventSeed.end}
        members={calendarMembers}
        onClose={() => setCreateEventOpen(false)}
        onCreate={handleSaveEvent}
      />

      {/* ✅ CREATE CALENDAR DIALOG (NOW USED) */}
      <CreateCalendarDialog
        open={createCalendarOpen}
        hubMembers={hubMembers}
        defaultColor="#3b82f6"
        onClose={() => setCreateCalendarOpen(false)}
        onCreate={async ({ name, color, ownerMemberId, hubMembersIds }) => {
          // if your dialog already passes these fields, use them.
          // if not, fallback:
          await handleCreateCalendarFromDialog({
            name,
            color,
            ownerMemberId: ownerMemberId || defaultOwnerId,
            hubMembersIds: hubMembersIds?.length ? hubMembersIds : hubMembers.map((m) => m.id),
          })
        }}
      />
    </Box>
  )
}
