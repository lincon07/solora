import * as React from "react"
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
  Avatar,
  useTheme,
} from "@mui/material"

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
  const isDark = theme.palette.mode === "dark"

  const hourLine = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)"

  const dayLine = isDark
    ? "rgba(255,255,255,0.14)"
    : "rgba(0,0,0,0.14)"

  return (
    <Box
      sx={{
        height: "100%",

        /* =====================================
         * SLOT HEIGHT (CONTROLS HOUR SPACING)
         * ===================================== */

        /* =====================================
         * REMOVE ALL DEFAULT BORDERS
         * ===================================== */
        "& .fc, & .fc-scrollgrid": {
          border: "none",
        },
        "& .fc-theme-standard td, & .fc-theme-standard th": {
          border: "none",
        },

        /* =====================================
         * REMOVE ALL SLOT LINES
         * ===================================== */
        "& .fc-timegrid-slot-lane": {
          borderBottom: "none",
        },

        /* =====================================
         * HOUR LINES ONLY
         * ===================================== */
        "& .fc-timegrid-slot-lane[data-time$=':00:00']": {
          borderBottom: `1px solid ${hourLine}`,
          zIndex: 1,
        },

        /* =====================================
         * EVENTS ABOVE GRID
         * ===================================== */
        "& .fc-timegrid-event-harness": {
          zIndex: 5,
        },

        /* =====================================
         * VERTICAL DAY COLUMN LINES
         * ===================================== */
        "& .fc-timegrid-col": {
          borderRight: `1px solid ${dayLine}`,
        },
        "& .fc-timegrid-col:last-of-type": {
          borderRight: "none",
        },

        /* =====================================
         * DAY HEADER (Sun / Mon / Tue)
         * ===================================== */
        "& .fc-col-header-cell": {
          borderRight: `1px solid ${dayLine}`,
        },
        "& .fc-col-header-cell:last-of-type": {
          borderRight: "none",
        },
        "& .fc-col-header-cell-cushion": {
          padding: "8px 0",
          fontSize: 13,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: theme.palette.text.secondary,
        },

        /* =====================================
         * REMOVE TIME AXIS
         * ===================================== */
        "& .fc-timegrid-axis": {
          width: 0,
        },
        "& .fc-timegrid-axis-frame": {
          display: "none",
        },

        /* =====================================
         * HEADER TOOLBAR CLEANUP
         * ===================================== */
        "& .fc-toolbar": {
          marginBottom: theme.spacing(1),
        },
      }}
    >
      {loading ? (
        <Stack alignItems="center" py={6}>
          <CircularProgress />
        </Stack>
      ) : (
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable
          selectable
          nowIndicator
          allDaySlot={false}

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

          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}

          eventContent={(arg) => {
            const event = arg.event
            const displayName = event.extendedProps?.memberDisplayName
            const avatarUrl = event.extendedProps?.memberAvatarUrl

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

                {displayName && (
                  <Stack direction="row" spacing={0.75}>
                    <Avatar
                      src={avatarUrl}
                      sx={{
                        width: 18,
                        height: 18,
                        fontSize: 10,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {displayName[0]}
                    </Avatar>
                  </Stack>
                )}
              </Stack>
            )
          }}
        />
      )}
    </Box>
  )
}
