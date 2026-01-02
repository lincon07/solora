import * as React from "react"
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
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

  const hourLine = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)"

  const dayLine = isDark
    ? "rgba(255,255,255,0.14)"
    : "rgba(0,0,0,0.14)"

  const api = () => calendarRef.current?.getApi()

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* =========================
       * CUSTOM HEADER (MUI)
       * ========================= */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        {/* LEFT CONTROLS */}
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

        {/* TITLE */}
        <Typography fontWeight={700} fontSize={16}>
          {api()?.view?.title}
        </Typography>

        {/* VIEW CONTROLS */}
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

      {/* =========================
       * CALENDAR
       * ========================= */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",

          "& .fc, & .fc-scrollgrid": { border: "none" },
          "& .fc-theme-standard td, & .fc-theme-standard th": { border: "none" },

          "& .fc-timegrid-axis": { width: 0 },
          "& .fc-timegrid-axis-frame": { display: "none" },
          "& .fc-timegrid-divider": { display: "none" },

          "& .fc-timegrid-slot-lane": { borderBottom: "none" },
          "& .fc-timegrid-slot-lane[data-time$=':00:00']": {
            borderBottom: `1px solid ${hourLine}`,
          },

          "& .fc-timegrid-col:not(:first-of-type)": {
            boxShadow: `inset -1px 0 0 ${dayLine}`,
          },
          "& .fc-timegrid-col:last-of-type": {
            boxShadow: "none",
          },

          "& .fc-col-header-cell:not(:first-of-type)": {
            boxShadow: `inset -1px 0 0 ${dayLine}`,
          },
          "& .fc-col-header-cell:last-of-type": {
            boxShadow: "none",
          },
          "& .fc-col-header-cell-cushion": {
            padding: "8px 0",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: theme.palette.text.secondary,
          },

          "& .fc-day-today": {
            backgroundColor: "transparent !important",
          },

          "& .fc-timegrid-slot": {
            height: "2.5rem",
          },

          "& .fc-timegrid-event-harness": {
            zIndex: 5,
          },

          /* ================================
 * MONTH VIEW GRID LINES (dayGrid)
 * ================================ */

          /* vertical day lines */
          "& .fc-daygrid-day": {
            boxShadow: `inset -1px 0 0 ${dayLine}`,
          },
          "& .fc-daygrid-day:last-of-type": {
            boxShadow: "none",
          },

          /* horizontal week lines */
          "& .fc-daygrid-week": {
            boxShadow: `inset 0 -1px 0 ${dayLine}`,
          },
          "& .fc-daygrid-week:last-of-type": {
            boxShadow: "none",
          },

          /* header day names */
          "& .fc-daygrid-header th:not(:last-of-type)": {
            boxShadow: `inset -1px 0 0 ${dayLine}`,
          },
          "& .fc-daygrid-header th": {
            border: "none",
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
            headerToolbar={false} // 🔥 disable FC header
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
              return (
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack spacing={0.25}>
                      <Typography fontSize={13} fontWeight={700}>
                        {event.title}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        {arg.timeText}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(event)
                        }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(event)
                        }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              )
            }}
          />
        )}
      </Box>
    </Box>
  )
}
