import * as React from "react"
import {
  Box,
  Card,
  Stack,
  Typography,
  Avatar,
  Checkbox,
  useTheme,
  alpha,
  Divider,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material"

import AddIcon from "@mui/icons-material/Add"
import WbSunnyIcon from "@mui/icons-material/WbSunny"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import { fetchTodos, createTodo, updateTodo } from "../../../api/todos"
import {
  fetchCalendars,
  fetchCalendarEvents,
  HubCalendar,
} from "../../../api/calender"

import { mapEvents } from "@renderer/utils/calendarMappers"
import { CalendarSelector } from "../calander/selector"
import { useHubInfo } from "@renderer/providers/hub-info"

/* =========================================================
 * TYPES
 * ========================================================= */

type Todo = {
  id: string
  text: string
  completed: boolean
}

type MemberTodos = {
  memberId: string
  name: string
  avatar?: string | null
  todos: Todo[]
}

/* =========================================================
 * HOME PAGE
 * ========================================================= */

export default function HomePage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const { hubId, members } = useHubInfo()

  const [memberTodos, setMemberTodos] = React.useState<MemberTodos[]>([])
  const [newTask, setNewTask] = React.useState<Record<string, string>>({})

  /* ---------- calendars ---------- */
  const [calendars, setCalendars] = React.useState<HubCalendar[]>([])
  const [activeCalendarId, setActiveCalendarId] = React.useState<string | null>(null)

  /* ---------- events ---------- */
  const [events, setEvents] = React.useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = React.useState(false)

  /* =========================================================
   * LOAD TODOS PER MEMBER
   * ========================================================= */
  React.useEffect(() => {
    if (!hubId || !members?.length) return

    Promise.all(
      members.map(async (m) => {
        const res = await fetchTodos(hubId, m.id)
        return {
          memberId: m.id,
          name: m.displayName,
          avatar: m.avatarUrl,
          todos: res.todos,
        }
      })
    ).then(setMemberTodos)
  }, [hubId, members])

  /* =========================================================
   * LOAD CALENDARS
   * ========================================================= */
  React.useEffect(() => {
    if (!hubId) return

    fetchCalendars(hubId).then((res) => {
      const list = res.calendars ?? []
      setCalendars(list)
      setActiveCalendarId((prev) => prev ?? list[0]?.id ?? null)
    })
  }, [hubId])

  /* =========================================================
   * LOAD EVENTS
   * ========================================================= */
  React.useEffect(() => {
    if (!hubId || !activeCalendarId) return

    setLoadingEvents(true)

    fetchCalendarEvents(hubId, activeCalendarId)
      .then((res) => setEvents(mapEvents(res.events ?? [])))
      .finally(() => setLoadingEvents(false))
  }, [hubId, activeCalendarId])

  /* =========================================================
   * TODO ACTIONS
   * ========================================================= */
  async function toggleTodo(memberId: string, todoId: string, completed: boolean) {
    if (!hubId) return

    setMemberTodos((prev) =>
      prev.map((m) =>
        m.memberId === memberId
          ? {
              ...m,
              todos: m.todos.map((t) =>
                t.id === todoId ? { ...t, completed } : t
              ),
            }
          : m
      )
    )

    await updateTodo(hubId, todoId, { completed })
  }

  async function addTodo(memberId: string) {
    if (!hubId) return
    const text = newTask[memberId]?.trim()
    if (!text) return

    const res = await createTodo(hubId, memberId, text)

    setMemberTodos((prev) =>
      prev.map((m) =>
        m.memberId === memberId
          ? { ...m, todos: [res.todo, ...m.todos] }
          : m
      )
    )

    setNewTask((p) => ({ ...p, [memberId]: "" }))
  }

  const hourLine = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)"

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        p: 2,
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: 2,
      }}
    >
      {/* ================================================= WEATHER ================================================= */}
      <Card sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <WbSunnyIcon fontSize="large" color="warning" />
          <Stack>
            <Typography fontWeight={700} fontSize={18}>
              Sunny
            </Typography>
            <Typography color="text.secondary">
              72°F · Clear Skies
            </Typography>
          </Stack>
        </Stack>
      </Card>

      {/* ================================================= TODOS ================================================= */}
      <Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
        {memberTodos.map((person) => (
          <Card key={person.memberId} sx={{ minWidth: 300, p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={person.avatar ?? undefined}>
                {person.name[0]}
              </Avatar>
              <Typography fontWeight={700}>{person.name}</Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack spacing={0.75}>
              {person.todos.map((task) => (
                <Stack key={task.id} direction="row" spacing={1} alignItems="center">
                  <Checkbox
                    size="small"
                    checked={task.completed}
                    onChange={() =>
                      toggleTodo(person.memberId, task.id, !task.completed)
                    }
                  />
                  <Typography
                    sx={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "text.secondary" : "text.primary",
                    }}
                  >
                    {task.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} mt={1}>
              <TextField
                size="small"
                placeholder="New task"
                fullWidth
                value={newTask[person.memberId] || ""}
                onChange={(e) =>
                  setNewTask((p) => ({
                    ...p,
                    [person.memberId]: e.target.value,
                  }))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && addTodo(person.memberId)
                }
              />
              <IconButton onClick={() => addTodo(person.memberId)}>
                <AddIcon />
              </IconButton>
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* ================================================= CALENDAR ================================================= */}
      <Card sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography fontWeight={700} fontSize={18}>
            Today’s Schedule
          </Typography>

          <CalendarSelector
            calendars={calendars}
            activeCalendarId={activeCalendarId}
            onChange={setActiveCalendarId}
            onCreate={() => {}}
          />
        </Stack>

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",

            /* ===== EXACT CalendarShell OVERRIDES ===== */
            "& .fc, & .fc-scrollgrid": { border: "none" },
            "& .fc-theme-standard td, & .fc-theme-standard th": { border: "none" },

            "& .fc-timegrid-axis, & .fc-timegrid-axis-frame, & .fc-timegrid-divider": {
              display: "none",
            },

            "& .fc-timegrid-slot-lane[data-time$=':00:00']": {
              borderBottom: `1px solid ${hourLine}`,
            },

            "& .fc-timegrid-slot": { height: "2.8rem" },

            "& .fc-col-header-cell-cushion": {
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.palette.text.secondary,
              padding: "6px 0",
            },

            "& .fc-day-today .fc-daygrid-day-number": {
              position: "relative",
              zIndex: 1,
              color: "#ef4444",
              fontWeight: 700,
            },
            "& .fc-day-today .fc-daygrid-day-number::before": {
              content: '""',
              position: "absolute",
              inset: "-4px",
              borderRadius: "999px",
              backgroundColor: alpha("#ef4444", 0.15),
              zIndex: -1,
            },

            "& .fc-day-today": {
              backgroundColor: "transparent !important",
            },

            "& .fc-event, & .fc-event-main, & .fc-event-main-frame": {
              background: "transparent !important",
              border: "none !important",
              boxShadow: "none !important",
            },

            "& .fc-timegrid-event, & .fc-daygrid-event": {
              background: "transparent !important",
              border: "none !important",
            },
          }}
        >
          {loadingEvents ? (
            <Stack alignItems="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : (
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={false}
              editable={false}
              selectable={false}
              nowIndicator
              allDaySlot={false}
              height="100%"
              slotDuration="00:30:00"
              snapDuration="00:15:00"
              events={events}
              eventContent={(arg) => {
                const event = arg.event
                const props = event.extendedProps || {}
                const color =
                  props.color ||
                  event.backgroundColor ||
                  theme.palette.primary.main

                const fillAlpha = isDark ? 0.18 : 0.1

                return (
                  <Box
                    sx={{
                      height: "100%",
                      px: 1,
                      py: 0.5,
                      borderLeft: `3px solid ${color}`,
                      backgroundColor: alpha(color, fillAlpha),
                      borderRadius: 1,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      fontSize={13}
                      fontWeight={700}
                      noWrap
                      sx={{ lineHeight: 1.2 }}
                    >
                      {event.title}
                    </Typography>

                    <Typography
                      fontSize={11}
                      sx={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo",
                        color: theme.palette.text.secondary,
                      }}
                      noWrap
                    >
                      {arg.timeText}
                    </Typography>

                    <Avatar
                      src={props.avatar ?? undefined}
                      sx={{
                        width: 20,
                        height: 20,
                        fontSize: 10,
                        position: "absolute",
                        bottom: 6,
                        left: 6,
                      }}
                    >
                      {props.initials || "?"}
                    </Avatar>
                  </Box>
                )
              }}
            />
          )}
        </Box>
      </Card>
    </Box>
  )
}
