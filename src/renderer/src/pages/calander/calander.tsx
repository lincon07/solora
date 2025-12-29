import * as React from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";

/* ---------------- Page ---------------- */

export default function CalendarPage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ================= Header ================= */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Calendar
            </Typography>
            <Typography color="text.secondary">
              Manage meals, chores, and household events
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              icon={<AddIcon />}
              label="Add Event"
              color="primary"
              clickable
            />
            <Chip
              icon={<CalendarMonthIcon />}
              label="Full View"
            />
          </Stack>
        </Stack>
      </Box>

      {/* ================= Calendar Container ================= */}
      <Card
        sx={{
          flexGrow: 1,
          p: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",

            /* Root */
            "& .fc": {
              height: "100%",
            },

            /* Toolbar */
            "& .fc-toolbar-title": {
              fontSize: "1.25rem",
              fontWeight: 600,
            },

            "& .fc-button": {
              borderRadius: 8,
              textTransform: "none",
            },

            /* ================= GRID COLORS ================= */

            /* Vertical & horizontal grid lines */
            "& .fc-theme-standard td, & .fc-theme-standard th": {
              borderColor: "rgba(255,255,255,0.08)", // 🩶 neutral silver
            },

            /* Hour separators (slightly stronger) */
            "& .fc-timegrid-slot": {
              height: "100px",
              borderColor: "rgba(255,255,255,0.12)",
            },

            "& .fc-timegrid-slot-label": {
              height: "100px",
              fontSize: "0.85rem",
              paddingTop: "8px",
              color: "rgba(255,255,255,0.6)",
            },

            "& .fc-timegrid-axis": {
              width: "64px",
              borderColor: "rgba(255,255,255,0.12)",
            },

            /* Day header borders */
            "& .fc-col-header-cell": {
              borderColor: "rgba(255,255,255,0.12)",
            },

            /* ================= EVENTS ================= */

            "& .fc-event": {
              borderRadius: 2,          // ⛔ no rounded pills
              padding: "6px 8px",
              fontSize: "0.9rem",
              border: "none",
              backgroundColor: "#3b82f6", // subtle blue
            },

            "& .fc-event-title": {
              fontWeight: 500,
            },

            /* ================= NOW INDICATOR ================= */

            "& .fc-now-indicator-line": {
              borderColor: "rgba(239,68,68,0.6)", // softer red
            },

            "& .fc-now-indicator-arrow": {
              borderColor: "rgba(239,68,68,0.6)",
            },
          }}
        >
          <FullCalendar
            plugins={[
              timeGridPlugin,
              dayGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="100%"
            editable
            selectable
            nowIndicator
            allDaySlot={false}

            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"

            events={[
              {
                title: "Breakfast",
                start: new Date().setHours(8, 0, 0, 0),
                end: new Date().setHours(9, 0, 0, 0),
              },
              {
                title: "Lunch",
                start: new Date().setHours(12, 0, 0, 0),
                end: new Date().setHours(13, 0, 0, 0),
              },
              {
                title: "Dinner",
                start: new Date().setHours(18, 0, 0, 0),
                end: new Date().setHours(19, 0, 0, 0),
              },
            ]}
          />
        </Box>
      </Card>
    </Box>
  );
}
