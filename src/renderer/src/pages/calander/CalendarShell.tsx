import {
    Box,
    CircularProgress,
    Stack,
    Typography,
    IconButton,
    Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type Props = {
    loading: boolean;
    events: any[];
    onSelect: (arg: any) => void;
    onUpdate: (arg: any) => void;
    onEdit: (event: any) => void;
    onDelete: (event: any) => void;
};

export function CalendarShell({
    loading,
    events,
    onSelect,
    onUpdate,
    onEdit,
    onDelete,
}: Props) {
    return (
        <Box
            sx={{
                height: "100%",
                background: "transparent",

                /* =====================================================
                 * REMOVE FULLCALENDAR "TODAY" BACKGROUND (YELLOW)
                 * ===================================================== */
                "& .fc-day-today": {
                    background: "transparent !important",
                },

                "& .fc-timegrid-col.fc-day-today": {
                    background: "transparent !important",
                },

                "& .fc-highlight": {
                    background: "rgba(0,0,0,0.04)",
                },

                /* =====================================================
                 * GLOBAL BORDER REMOVAL
                 * ===================================================== */
                "& .fc, & .fc *": {
                    border: "none",
                },

                "& .fc-scrollgrid": {
                    border: "none",
                },

                /* =====================================================
                 * DAY HEADER
                 * ===================================================== */
                "& .fc-col-header": {
                    marginBottom: 6,
                },

                "& .fc-col-header-cell": {
                    paddingBottom: 2,
                },

                "& .fc-col-header-cell-cushion": {
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "rgba(0,0,0,0.65)",
                },

                /* =====================================================
                 * TIME AXIS
                 * ===================================================== */
                "& .fc-timegrid-axis": {
                    width: 54,
                },

              
                /* =====================================================
                 * HORIZONTAL GUIDE LINES
                 * ===================================================== */
                "& .fc-timegrid-slot": {
                    position: "relative",
                },

                 "& .fc-timegrid-axis-cushion": {
          fontSize: "0.75rem",
          color: "rgba(0,0,0,0.45)",
          transform: "translateY(42px)", // ⬅️ KEY FIX
        },

                "& .fc-timegrid-slot::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "1px",
                    background:
                        "linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0.02), rgba(0,0,0,0.06))",
                    pointerEvents: "none",
                    zIndex: 0,
                },

                "& .fc-timegrid-slot-minor::after": {
                    display: "none",
                },

                /* =====================================================
                 * VERTICAL GUIDE LINES (RIGHT SIDE ONLY)
                 * ===================================================== */
                "& .fc-timegrid-col": {
                    position: "relative",
                },

                "& .fc-timegrid-col:not(:last-child)::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: "1px",
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0.02), rgba(0,0,0,0.06))",
                    pointerEvents: "none",
                    zIndex: 0,
                },

                /* =====================================================
                 * NOW INDICATOR
                 * ===================================================== */
                "& .fc-timegrid-now-indicator-line": {
                    borderColor: "#3b82f6",
                    borderWidth: 2,
                },

                "& .fc-timegrid-now-indicator-arrow": {
                    display: "none",
                },

                /* =====================================================
                 * TOOLBAR
                 * ===================================================== */
                "& .fc-toolbar": {
                    marginBottom: 8,
                },

                "& .fc-toolbar-title": {
                    fontSize: "1.05rem",
                    fontWeight: 600,
                },

                "& .fc-button": {
                    background: "transparent",
                    border: "none",
                    color: "rgba(0,0,0,0.6)",
                },

                "& .fc-button:hover": {
                    background: "rgba(0,0,0,0.05)",
                },

                /* =====================================================
                 * EVENT CARDS
                 * ===================================================== */
                "& .fc-event": {
                    borderRadius: 1,
                    border: "none",
                    padding: "8px 10px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 2,
                },

                "& .event-actions": {
                    opacity: 0,
                    transition: "opacity 120ms ease",
                },

                "& .fc-event:hover .event-actions": {
                    opacity: 1,
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

                    /* ================= CORE ================= */
                    editable
                    selectable
                    nowIndicator
                    allDaySlot={false}

                    /* ================= DRAG / RESIZE ================= */
                    eventStartEditable
                    eventDurationEditable
                    slotDuration="00:30:00"
                    snapDuration="00:15:00"

                    /* ================= DATA ================= */
                    events={events}

                    /* ================= HANDLERS ================= */
                    select={onSelect}
                    eventDrop={onUpdate}
                    eventResize={onUpdate}
                    eventClick={() => { }}

                    /* ================= HEADER ================= */
                    headerToolbar={{
                        left: "prev",
                        center: "title",
                        right: "next",
                    }}

                    /* ================= CUSTOM DAY HEADER ================= */
                    dayHeaderContent={(arg) => {
                        const date = arg.date;
                        const weekday = date.toLocaleDateString(undefined, {
                            weekday: "short",
                        });
                        const monthDay = date.toLocaleDateString(undefined, {
                            month: "numeric",
                            day: "numeric",
                        });

                        const today = new Date();
                        const isToday =
                            date.getFullYear() === today.getFullYear() &&
                            date.getMonth() === today.getMonth() &&
                            date.getDate() === today.getDate();

                        return (
                            <Stack
                                alignItems="center"
                                spacing={0}
                                sx={{
                                    borderRadius: 6,
                                    px: 1,
                                    py: 0.5,
                                    backgroundColor: isToday
                                        ? "rgba(59,130,246,0.12)"
                                        : "transparent",
                                }}
                            >
                                <Typography fontSize={12} fontWeight={600}>
                                    {weekday}
                                </Typography>
                                <Typography fontSize={11} sx={{ opacity: 0.6 }}>
                                    {monthDay}
                                </Typography>
                            </Stack>
                        );
                    }}

                    /* ================= EVENT UI ================= */
                    eventContent={(arg) => {
                        const event = arg.event;
                        const avatarUrl = event.extendedProps?.memberAvatarUrl;
                        const displayName = event.extendedProps?.memberDisplayName;

                        return (
                            <Stack spacing={0.5}>
                                {/* ---------- title + actions ---------- */}
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                >
                                    <Stack spacing={0.5} maxWidth="calc(100% - 40px)">
                                        <Typography
                                            fontSize={13}
                                            fontWeight={700}
                                            sx={{ lineHeight: 1.15 }}
                                        >
                                            {event.title}
                                        </Typography>

                                        {/* time */}

                                        <Typography fontSize={11} sx={{ opacity: 0.8 }}>
                                            {arg.timeText}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0} className="event-actions">
                                        <IconButton
                                            size="small"
                                            sx={{ color: "rgba(255,255,255,0.9)" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(event);
                                            }}
                                        >
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            sx={{ color: "rgba(255,255,255,0.9)" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(event);
                                            }}
                                        >
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </Stack>

                                {/* ---------- member row ---------- */}
                                {displayName && (
                                    <Stack direction="row" spacing={0.75} alignItems="center">
                                        <Avatar
                                            src={avatarUrl ?? ""}
                                            sx={{
                                                width: 18,
                                                height: 18,
                                                fontSize: 10,
                                                bgcolor: "rgba(255,255,255,0.25)",
                                            }}
                                        >
                                            {displayName[0]?.toUpperCase()}
                                        </Avatar>
                                    </Stack>
                                )}
                            </Stack>
                        );
                    }}

                />
            )}
        </Box>
    );
}
