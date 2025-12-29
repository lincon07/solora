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
  ListItemText,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material"

import { BarChart } from "@mui/x-charts/BarChart"

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import PersonIcon from "@mui/icons-material/Person"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import InsightsIcon from "@mui/icons-material/Insights"
import AddIcon from "@mui/icons-material/Add"

/* ---------------- Component ---------------- */

export default function Dashboard() {
  const [now, setNow] = React.useState(new Date())
  const [activeDay, setActiveDay] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /* ---------------- Data ---------------- */

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const people = [
    {
      name: "Dan",
      color: "#2563eb",
      todosByDay: {
        Mon: ["Trash", "Dishes"],
        Tue: ["Vacuum"],
        Wed: ["Trash"],
        Thu: [],
        Fri: ["Dishes"],
        Sat: [],
        Sun: [],
      },
    },
    {
      name: "Michelle",
      color: "#db2777",
      todosByDay: {
        Mon: ["Laundry"],
        Tue: ["Groceries"],
        Wed: [],
        Thu: ["Meal Prep"],
        Fri: [],
        Sat: [],
        Sun: [],
      },
    },
  ]

  const stats = [5, 6, 4, 7, 3, 2, 1]

  /* ---------------- Render ---------------- */

  return (
    <Box sx={{ p: 3, width: "100%", overflowX: "hidden" }}>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          mb: 4,
        }}
      >
        {/* Left: Page info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Overview of your household activity
            </Typography>
          </Box>
        </Stack>

        {/* Center: Time */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            fontWeight={600}
            sx={{ lineHeight: 1 }}
          >
            {now.toLocaleTimeString()}
          </Typography>
          <Typography color="text.secondary">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Box>

        {/* Right: Actions */}
        <Stack spacing={1} alignItems="flex-end">
          <Chip
            icon={<CalendarMonthIcon />}
            label="Meal Calendar"
            color="primary"
          />
          <Chip
            icon={<RestaurantIcon />}
            label="Tap meal to edit"
          />
        </Stack>
      </Box>

      {/* ================= People ================= */}
      <Typography variant="h5" mb={2}>
        People
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,
          mb: 4,
        }}
      >
        {people.map((p) => (
          <Card key={p.name} sx={{ minWidth: 300, flexShrink: 0 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: p.color }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">{p.name}</Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Tabs
                value={activeDay}
                onChange={(_, v) => setActiveDay(v)}
                variant="scrollable"
                scrollButtons={false}
                sx={{ mb: 1 }}
              >
                {days.map((d) => (
                  <Tab key={d} label={d} />
                ))}
              </Tabs>

              <List dense>
                {(p.todosByDay[days[activeDay]] || []).map((t) => (
                  <ListItem key={t}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={t} />
                  </ListItem>
                ))}

                <ListItem>
                  <ListItemIcon>
                    <IconButton size="small">
                      <AddIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary">
                        Add chore
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Add Person */}
        <Card
          sx={{
            minWidth: 260,
            flexShrink: 0,
            border: "2px dashed",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Avatar sx={{ border: "1px dashed" }}>
              <AddIcon />
            </Avatar>
            <Typography color="text.secondary">
              Add Person
            </Typography>
          </Stack>
        </Card>
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
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ minWidth: 220, flexShrink: 0 }}>
            <CardContent>
              <EmojiEventsIcon color="warning" />
              <Typography variant="h6">
                Achievement {i}
              </Typography>
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
