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
} from "@mui/material"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import WbSunnyIcon from "@mui/icons-material/WbSunny"

/* =========================================================
 * STATIC MOCK DATA (TODAY)
 * ========================================================= */

const TODAY_EVENTS = [
  {
    id: "1",
    title: "Morning Briefing",
    start: new Date().setHours(9, 0),
    end: new Date().setHours(10, 0),
    extendedProps: {
      color: "#4F46E5",
      avatar: "https://i.pravatar.cc/40?img=12",
      initials: "JD",
    },
  },
  {
    id: "2",
    title: "Patrol Shift",
    start: new Date().setHours(12, 30),
    end: new Date().setHours(17, 0),
    extendedProps: {
      color: "#22C55E",
      avatar: "https://i.pravatar.cc/40?img=32",
      initials: "JS",
    },
  },
]

const TODAY_TASKS = [
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=12",
    tasks: [
      { id: 1, text: "Morning briefing", done: true },
      { id: 2, text: "Submit patrol report", done: false },
      { id: 3, text: "Vehicle inspection", done: false },
    ],
  },
  {
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?img=32",
    tasks: [
      { id: 1, text: "Radio check", done: true },
      { id: 2, text: "Community patrol", done: false },
      { id: 3, text: "Evidence intake", done: false },
    ],
  },
  {
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/40?img=45",
    tasks: [
      { id: 1, text: "Briefing notes", done: false },
      { id: 2, text: "Unit inspection", done: false },
    ],
  },
]

/* =========================================================
 * HOME PAGE
 * ========================================================= */

export default function HomePage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

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
      {/* =================================================
       * WEATHER (TOP)
       * ================================================= */}
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

      {/* =================================================
       * TODO LISTS (HORIZONTAL PER PERSON)
       * ================================================= */}
      <Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
        {TODAY_TASKS.map((person) => (
          <Card
            key={person.name}
            sx={{
              minWidth: 280,
              p: 2,
              flexShrink: 0,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
              <Avatar src={person.avatar} />
              <Typography fontWeight={700}>
                {person.name}
              </Typography>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Stack spacing={0.75}>
              {person.tasks.map((task) => (
                <Stack
                  key={task.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Checkbox size="small" checked={task.done} />
                  <Typography
                    sx={{
                      textDecoration: task.done
                        ? "line-through"
                        : "none",
                      color: task.done
                        ? "text.secondary"
                        : "text.primary",
                    }}
                  >
                    {task.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* =================================================
       * LARGE TODAY CALENDAR (LOCKED, FULL OVERRIDES)
       * ================================================= */}
      <Card
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontWeight={700} fontSize={18} mb={1}>
          Today’s Schedule
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",

            /* ===== BASE GRID ===== */
            "& .fc, & .fc-scrollgrid": { border: "none" },
            "& .fc-theme-standard td, & .fc-theme-standard th": {
              border: "none",
            },

            /* ===== AXIS / DIVIDERS ===== */
            "& .fc-timegrid-axis, & .fc-timegrid-axis-frame, & .fc-timegrid-divider": {
              display: "none",
            },

            /* ===== HOUR LINES ===== */
            "& .fc-timegrid-slot-lane[data-time$=':00:00']": {
              borderBottom: `1px solid ${hourLine}`,
            },

            "& .fc-timegrid-slot": {
              height: "3rem",
            },

            /* ===== DAY HEADER ===== */
            "& .fc-col-header-cell-cushion": {
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.palette.text.secondary,
              padding: "6px 0",
            },

            /* ===== TODAY DOT ===== */
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

            /* ===== KILL FC EVENT BACKGROUNDS ===== */
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
            events={TODAY_EVENTS}
            eventContent={(arg) => {
              const props = arg.event.extendedProps || {}
              const color =
                props.color ||
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
                    fontSize={14}
                    fontWeight={700}
                    noWrap
                    sx={{ lineHeight: 1.2 }}
                  >
                    {arg.event.title}
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
                    src={props.avatar}
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: 10,
                      position: "absolute",
                      bottom: 6,
                      left: 6,
                    }}
                  >
                    {props.initials}
                  </Avatar>
                </Box>
              )
            }}
          />
        </Box>
      </Card>
    </Box>
  )
}
