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
} from "@mui/material";

import {
  Home,
  Settings,
  CalendarMonth,
} from "@mui/icons-material";

import { Routes, Route, useNavigate } from "react-router-dom";

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

      {/* ================= Permanent Drawer ================= */}
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
            {/* ===== Dashboard Section (STATIC, NO COLLAPSE) ===== */}
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
                <Box sx={{ fontSize: 14, fontWeight: 500 }}>
                  Dashboard
                </Box>
              </ListItemButton>
            </ListItem>

            {/* ===== Sub-routes ===== */}
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
                <Box sx={{ fontSize: 13 }}>
                  Overview
                </Box>
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
                <Box sx={{ fontSize: 13 }}>
                  Calendar
                </Box>
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* ===== Settings ===== */}
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
                <Box sx={{ fontSize: 14, fontWeight: 500 }}>
                  Settings
                </Box>
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
        }}
      >
        <Toolbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
