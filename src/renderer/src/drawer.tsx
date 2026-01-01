import * as React from "react";
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
} from "@mui/material";

import {
  CalendarMonth,
  Settings,
  ListSharp,
} from "@mui/icons-material";

import { Routes, Route, useNavigate } from "react-router-dom";
import PairSettings from "./pages/settings/pairing/pair";
import TaskListsPage from "./pages/Lists/task-lists";
import { useWeatherByPostalCode } from "./hooks/useWeather";
import { getWeatherIcon } from "./utils/icons_map";

/* ================= Lazy Pages ================= */

const CalendarPage = React.lazy(() =>
  import("./pages/calander/CalendarPage")
);

const SettingsPage = React.lazy(() =>
  import("./pages/settings/settings")
);

/* ================= Constants ================= */

const drawerWidth = 88;

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
  );
}

/* ================= Layout ================= */

export default function AppLayout() {
  const nav = useNavigate();
  const { weather } = useWeatherByPostalCode("95864");
  const [now, setNow] = React.useState(new Date());

  /* live clock (updates every second) */
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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

          {/* CENTER (TIME + DATE) */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{ lineHeight: 1 }}
            >
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

          {/* RIGHT (WEATHER) */}
          {weather && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                position: "absolute",
                right: 16,
              }}
            >
              {getWeatherIcon(weather.iconCode)}
              <Box textAlign="right">
                <Typography fontWeight={600}>
                  {weather.temp}°F
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {weather.label}
                </Typography>
              </Box>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* ================= Icon Drawer ================= */}
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
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => nav("/calendar")}
              disableRipple
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                justifyContent: "center",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <CalendarMonth sx={{ fontSize: 34 }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => nav("/task-lists")}
              disableRipple
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                justifyContent: "center",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <ListSharp sx={{ fontSize: 34 }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>

          <Box sx={{ flexGrow: 1 }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => nav("/settings")}
              disableRipple
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                justifyContent: "center",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <Settings sx={{ fontSize: 34 }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* ================= Main Content ================= */}
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
            <Route path="/" element={<div>Dashboard Page (Coming Soon)</div>} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/pair" element={<PairSettings />} />
            <Route path="/task-lists" element={<TaskListsPage />} />
          </Routes>
        </React.Suspense>
      </Box>
    </Box>
  );
}
