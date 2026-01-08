import * as React from "react"
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Avatar,
} from "@mui/material"

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import TodayIcon from "@mui/icons-material/Today"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

type Props = {
  loading: boolean
  events: any[]
  onSelect: (arg: any) => void
  onUpdate: (update: { id: string; start: Date; end: Date }) => void
  onEdit: (event: any) => void
  onDelete: (event: any) => void
}

export function CalendarShell({
  loading,
  events,
  onSelect,
  onUpdate,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme()
  const calendarRef = React.useRef<FullCalendar | null>(null)

  const isDark = theme.palette.mode === "dark"
  const api = () => calendarRef.current?.getApi()

  const hourLine = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)"

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ================= HEADER ================= */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" spacing={0.5}>
          <IconButton onClick={() => api()?.prev()}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => api()?.today()}>
            <TodayIcon />
          </IconButton>
          <IconButton onClick={() => api()?.next()}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        <Typography fontWeight={700} fontSize={16}>
          {api()?.view?.title}
        </Typography>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={api()?.view?.type}
          onChange={(_, view) => view && api()?.changeView(view)}
        >
          <ToggleButton value="timeGridWeek">Week</ToggleButton>
          <ToggleButton value="timeGridDay">Day</ToggleButton>
          <ToggleButton value="dayGridMonth">Month</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* ================= CALENDAR ================= */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",

          /* base grid */
          "& .fc, & .fc-scrollgrid": { border: "none" },
          "& .fc-theme-standard td, & .fc-theme-standard th": { border: "none" },

          /* hide axis */
          "& .fc-timegrid-axis, & .fc-timegrid-axis-frame, & .fc-timegrid-divider": {
            display: "none",
          },

          /* hour lines */
          "& .fc-timegrid-slot-lane[data-time$=':00:00']": {
            borderBottom: `1px solid ${hourLine}`,
          },

          "& .fc-timegrid-slot": { height: "2.8rem" },

          /* ===== CUSTOM DAY HEADER ===== */
          "& .fc-col-header-cell-cushion": {
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: theme.palette.text.secondary,
            padding: "6px 0",
          },

          /* ===== APPLE-STYLE TODAY DOT ===== */
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
        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            editable
            selectable
            nowIndicator
            allDaySlot={false}
            height="100%"
            slotDuration="00:30:00"
            snapDuration="00:15:00"
            events={events}
            select={onSelect}
            eventResize={(arg) =>
              onUpdate({
                id: arg.event.id,
                start: arg.event.start!,
                end: arg.event.end!,
              })
            }
            eventDrop={(arg) =>
              onUpdate({
                id: arg.event.id,
                start: arg.event.start!,
                end: arg.event.end!,
              })
            }
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
                  {/* TITLE */}
                  <Typography
                    fontSize={13}
                    fontWeight={700}
                    noWrap
                    sx={{ lineHeight: 1.2 }}
                  >
                    {event.title}
                  </Typography>

                  {/* TIME */}
                  <Typography
                    fontSize={11}
                    sx={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo",
                      color: theme.palette.text.secondary,
                    }}
                    noWrap
                  >
                    {arg.timeText}
                  </Typography>

                  {/* AVATAR */}
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

                  {/* ACTIONS */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="flex-end"
                  >
                    <IconButton
                      size="small"
                      sx={{ p: 0.25 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(event)
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ p: 0.25 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(event)
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </Box>
              )
            }}
          />
        )}
      </Box>
    </Box>
  )
}
