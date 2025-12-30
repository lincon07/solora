import * as React from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material"

import { BarChart } from "@mui/x-charts/BarChart"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import InsightsIcon from "@mui/icons-material/Insights"
import People from "./people"

/* ---------------- Component ---------------- */

export default function Dashboard() {
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /* ---------------- Data ---------------- */

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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

          <People />

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
