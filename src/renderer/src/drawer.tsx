import * as React from "react";
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import {
  Home,
  Settings,
  CalendarMonth,
  DeviceHub,
} from "@mui/icons-material";

import { Routes, Route, useNavigate } from "react-router-dom";
import PairSettings from "./pages/settings/pairing/pair";

/* ================= Lazy Pages ================= */

const Dashboard = React.lazy(() =>
  import("./pages/dashboard/dashboard")
);

const CalendarPage = React.lazy(() =>
  import("./pages/calander/calander")
);

const SettingsPage = React.lazy(() =>
  import("./pages/settings/settings")
);

const drawerWidth = 220;

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
      <CircularProgress size={36} />
      <Typography
        variant="body2"
        color="text.secondary"
      >
        Loading…
      </Typography>
    </Backdrop>
  );
}

/* ================= Layout ================= */

export default function AppLayout() {
  const nav = useNavigate();
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
        <Toolbar>
          <Typography fontWeight={600}>
            Solora
          </Typography>
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
          },
        }}
      >
        <Toolbar />

        <Box sx={{ overflowY: "auto", px: 1 }}>
          <List disablePadding>

            {/* Dashboard */}
            <ListItem disablePadding>
              <ListItemButton
                disableRipple
                disableTouchRipple
                sx={{ gap: 2 }}
                onClick={() => nav("/")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Home />
                </ListItemIcon>
                <Typography fontSize={14} fontWeight={500}>
                  Dashboard
                </Typography>
              </ListItemButton>
            </ListItem>

            {/* Sub routes */}
            <ListItem disablePadding>
              <ListItemButton
                disableRipple
                disableTouchRipple
                sx={{ pl: 4, gap: 2 }}
                onClick={() => nav("/")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Home fontSize="small" />
                </ListItemIcon>
                <Typography fontSize={13}>
                  Overview
                </Typography>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                disableRipple
                disableTouchRipple
                sx={{ pl: 4, gap: 2 }}
                onClick={() => nav("/calendar")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CalendarMonth fontSize="small" />
                </ListItemIcon>
                <Typography fontSize={13}>
                  Calendar
                </Typography>
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* Settings */}
            <ListItem disablePadding>
              <ListItemButton
                disableRipple
                disableTouchRipple
                sx={{ gap: 2 }}
                onClick={() => nav("/settings")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Settings />
                </ListItemIcon>
                <Typography fontSize={14} fontWeight={500}>
                  Settings
                </Typography>
              </ListItemButton>
            </ListItem>

              <ListItem disablePadding>
              <ListItemButton
                disableRipple
                disableTouchRipple
                sx={{ pl: 4, gap: 2 }}
                onClick={() => nav("/settings/pair")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DeviceHub fontSize="small" />
                </ListItemIcon>
                <Typography fontSize={13}>
                  Devices
                </Typography>
              </ListItemButton>
            </ListItem>


          </List>
        </Box>
      </Drawer>

      {/* ================= Main Content ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "auto",
          position: "relative", // 🔥 REQUIRED for Backdrop
        }}
      >
        <Toolbar />

        <React.Suspense fallback={<MainBackdropLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/pair" element={<PairSettings />} />
          </Routes>
        </React.Suspense>
      </Box>
    </Box>
  );
}
