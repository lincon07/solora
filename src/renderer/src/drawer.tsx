import * as React from "react"
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  CircularProgress,
  Backdrop,
  Typography,
  Stack,
} from "@mui/material"

import {
  CalendarMonth,
  Settings,
  ListSharp,
  Home,
  Lock,
} from "@mui/icons-material"

import { Routes, Route, useNavigate } from "react-router-dom"

import PairSettings from "./pages/settings/pairing/pair"
import TaskListsPage from "./pages/Lists/task-lists"
import HomePage from "./pages/Home/home"

import { useWeatherByPostalCode } from "./hooks/useWeather"
import { getWeatherIcon } from "./utils/icons_map"
import { HubInfoContext } from "./providers/hub-info"
import CalendarPage from "./pages/calander/page"



const SettingsPage = React.lazy(() =>
  import("./pages/settings/settings")
)

/* ================= Constants ================= */

const drawerWidth = 88

/* ================= Loader ================= */

function MainBackdropLoader() {
  return (
    <Backdrop
      open
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal,
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        Loading…
      </Typography>
    </Backdrop>
  )
}

/* ================= Pairing Lock Overlay ================= */

function PairingLockOverlay() {
  return (
    <Backdrop
      open
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 10,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.65)",
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Lock sx={{ fontSize: 64, color: "warning.main" }} />
        <Typography variant="h5" fontWeight={700}>
          Device Not Paired
        </Typography>
        <Typography color="text.secondary" maxWidth={320}>
          This device must be paired with a hub before it can be used.
          Please complete pairing in Settings.
        </Typography>
      </Stack>
    </Backdrop>
  )
}

/* ================= Layout ================= */

export default function AppLayout() {
  const nav = useNavigate()
  const hubInfo = React.useContext(HubInfoContext)

  const paired = hubInfo?.paired ?? false
  const loading = hubInfo?.loading ?? true

  const { weather } = useWeatherByPostalCode("95864")
  const [now, setNow] = React.useState(new Date())

  /* ================= Live Clock ================= */

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  /* ================= Force Pairing Route ================= */

  React.useEffect(() => {
    if (!loading && !paired) {
      nav("/settings/pair", { replace: true })
    }
  }, [paired, loading, nav])

  /* ================= Loading Gate ================= */

  if (loading) {
    return <MainBackdropLoader />
  }

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />

      {/* ================= AppBar ================= */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ position: "relative", minHeight: 72 }}>
          {/* LEFT */}
          <Typography fontWeight={900} variant="h6" noWrap>
            Solora
          </Typography>

          {/* CENTER */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <Typography variant="h4" fontWeight={600} sx={{ lineHeight: 1 }}>
              {now.toLocaleTimeString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {now.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>

          {/* RIGHT */}
          {weather && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ position: "absolute", right: 16 }}
            >
              {getWeatherIcon(weather.iconCode)}
              <Box textAlign="right">
                <Typography fontWeight={600}>
                  {weather.temp}°F
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {weather.label}
                </Typography>
              </Box>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* ================= Drawer ================= */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            opacity: paired ? 1 : 0.5,
            pointerEvents: paired ? "auto" : "none",
          },
        }}
      >
        <Toolbar />

        <List
          disablePadding
          sx={{
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 2,
          }}
        >
          <NavIcon icon={<Home sx={{ fontSize: 34 }} />} onClick={() => nav("/")} />
          <NavIcon
            icon={<CalendarMonth sx={{ fontSize: 34 }} />}
            onClick={() => nav("/calendar")}
          />
          <NavIcon
            icon={<ListSharp sx={{ fontSize: 34 }} />}
            onClick={() => nav("/task-lists")}
          />

          <Box sx={{ flexGrow: 1 }} />

          <NavIcon
            icon={<Settings sx={{ fontSize: 34 }} />}
            onClick={() => nav("/settings")}
          />
        </List>
      </Drawer>

      {/* ================= Main ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "auto",
          position: "relative",
        }}
      >
        <Toolbar />


        <React.Suspense fallback={<MainBackdropLoader />}>
          <Routes>
            {/* Always allowed */}
            <Route path="/settings/pair" element={<PairSettings />} />

            {/* Locked routes */}
            {paired && (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/task-lists" element={<TaskListsPage />} />
              </>
            )}
          </Routes>
        </React.Suspense>
      </Box>
    </Box>
  )
}

/* ================= Icon Button ================= */

function NavIcon({
  icon,
  onClick,
}: {
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        disableRipple
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          justifyContent: "center",
        }}
      >
        <ListItemIcon sx={{ minWidth: "auto" }}>
          {icon}
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  )
}
