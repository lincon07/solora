import * as React from "react"
import {
  Box,
  Stack,
  Typography,
  Paper,
  useTheme,
  alpha,
} from "@mui/material"

/* =========================
 * CONFIG
 * ========================= */

const PHOTOS = [
  "https://plus.unsplash.com/premium_photo-1661741101938-6a9ea409dc3e?w=2000&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1661375271640-2b4a1f9687c0?w=2000&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1767082236152-801d9b5d6637?w=2000&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1767082236103-7c25a8146976?w=2000&auto=format&fit=crop&q=60",
]

const DISPLAY_MS = 9000
const FADE_MS = 1200

export default function Idle() {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  /* ---------- clock ---------- */
  const [now, setNow] = React.useState(new Date())
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  /* ---------- slideshow ---------- */
  const [index, setIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    const run = async () => {
      await sleep(DISPLAY_MS)
      if (cancelled) return

      setVisible(false)
      await sleep(FADE_MS)

      if (cancelled) return
      setIndex((i) => (i + 1) % PHOTOS.length)
      setVisible(true)

      run()
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const src = PHOTOS[index]

  /* ---------- time ---------- */
  const timeLine = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })

  const dateLine = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const glassBg = isDark
    ? "rgba(10,10,12,0.55)"
    : "rgba(255,255,255,0.6)"

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "black",
      }}
    >
      {/* ===== BLURRED BACKDROP (SAME IMAGE) ===== */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px)",
          transform: "scale(1.25)",
          opacity: 0.75,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(0,0,0,0.15), rgba(0,0,0,0.85))",
        }}
      />

      {/* ===== SINGLE IMAGE ===== */}
      <Box
        component="img"
        src={src}
        draggable={false}
        sx={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          maxWidth: "92%",
          maxHeight: "92%",
          objectFit: "contain",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.98)",
          transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        }}
      />

      {/* ===== HEADER ===== */}
      <Box sx={{ position: "absolute", top: 16, left: 16 }}>
        <Typography
          sx={{
            color: "white",
            fontWeight: 800,
            fontSize: 20,
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          Photos
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
          Idle display
        </Typography>
      </Box>

      {/* ===== GLASS PANEL ===== */}
      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          right: 16,
          bottom: 16,
          p: 2,
          borderRadius: 3,
          width: 360,
          bgcolor: glassBg,
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: `0 12px 40px ${alpha("#000", 0.4)}`,
        }}
      >
        <Stack spacing={1}>
          <Typography sx={{ fontSize: 34, fontWeight: 900, color: "white" }}>
            {timeLine}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            {dateLine}
          </Typography>

          <InfoRow label="Place" value="Solora" />
          <InfoRow label="Location" value="San Diego, CA" />
          <InfoRow label="Weather" value="Partly Cloudy • 68°F" />
        </Stack>
      </Paper>
    </Box>
  )
}

/* ========================= */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
