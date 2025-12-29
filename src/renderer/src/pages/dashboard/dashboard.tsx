import * as React from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { BarChart } from "@mui/x-charts/BarChart"

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import PersonIcon from "@mui/icons-material/Person"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import InsightsIcon from "@mui/icons-material/Insights"

/* ---------------- Component ---------------- */

export default function Dashboard() {
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /* ---------------- Meal Events ---------------- */

  const mealEvents = [
    { title: "Breakfast • Cereal", start: startAt(0, 8), end: startAt(0, 9), color: "#22c55e" },
    { title: "Lunch • Spaghetti & Meatballs", start: startAt(0, 12), end: startAt(0, 13), color: "#f59e0b" },
    { title: "Dinner • Grilled Chicken", start: startAt(0, 18), end: startAt(0, 19), color: "#ef4444" },
    { title: "Lunch • Sandwich", start: startAt(1, 12), end: startAt(1, 13), color: "#3b82f6" }
  ]

  /* ---------------- Data ---------------- */

  const people = [
    {
      name: "Dan",
      color: "#2563eb",
      todos: ["Trash", "Dishes", "Vacuum"]
    },
    {
      name: "Michelle",
      color: "#db2777",
      todos: ["Laundry", "Groceries", "Meal Prep"]
    }
  ]

  const stats = [5, 6, 4, 7, 3, 2, 1]
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  /* ---------------- Render ---------------- */

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      {/* ================= Header ================= */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h2" fontWeight={600}>
            {now.toLocaleTimeString()}
          </Typography>
          <Typography color="text.secondary">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </Typography>
        </Box>

        <Stack spacing={1} alignItems="flex-end">
          <Chip icon={<CalendarMonthIcon />} label="Meal Calendar" color="primary" />
          <Chip icon={<RestaurantIcon />} label="Tap meal to edit" />
        </Stack>
      </Stack>

      {/* ================= Meal Calendar ================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ height: 520, overflow: 'auto' }}>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            aspectRatio={ 1.8}
            height={1200}          // 👈 REAL PX HEIGHT (critical)
            expandRows
            nowIndicator
            editable
            selectable
            firstDay={1}
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            slotDuration="01:00:00"
            events={mealEvents}
            eventClick={(info) => alert(info.event.title)}
          />
        </CardContent>
      </Card>

      {/* ================= People (Horizontal Scroll) ================= */}
      <Typography variant="h5" mb={2}>
        People
      </Typography>

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mb: 4 }}>
        {people.map(p => (
          <Card key={p.name} sx={{ minWidth: 260 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: p.color }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">{p.name}</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <List dense>
                {p.todos.map(t => (
                  <ListItem key={t}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={t} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ================= Statistics ================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" spacing={1} mb={2} alignItems="center">
            <InsightsIcon />
            <Typography variant="h5">Weekly Tasks</Typography>
          </Stack>

          <BarChart
            height={300}
            series={[{ data: stats, label: "Completed" }]}
            xAxis={[{ data: days, scaleType: "band" }]}
          />
        </CardContent>
      </Card>

      {/* ================= Achievements ================= */}
      <Typography variant="h5" mb={2}>
        Achievements
      </Typography>

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {[1, 2, 3].map(i => (
          <Card key={i} sx={{ minWidth: 220 }}>
            <CardContent>
              <EmojiEventsIcon color="warning" />
              <Typography variant="h6">Achievement {i}</Typography>
              <Typography color="text.secondary">
                Streak maintained!
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

/* ---------------- Helpers ---------------- */

function startAt(dayOffset: number, hour: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour)
  return d
}
