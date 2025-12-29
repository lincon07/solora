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
  ListItemText,
  Collapse,
} from "@mui/material";

import {
  Home,
  Settings,
  CalendarMonth,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import { Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "./pages/dashboard/dashboard";
import CalendarPage from "./pages/calander/calander";
import SettingsPage from "./pages/settings/settings";

const drawerWidth = 240;

export default function AppLayout() {
  const nav = useNavigate();
  const [dashboardOpen, setDashboardOpen] = React.useState(true);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />

      {/* ================= AppBar ================= */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
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
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflowY: "auto" }}>
          <List>
            {/* ===== Dashboard Group ===== */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDashboardOpen((v) => !v)}>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => nav("/")}>
                  <ListItemIcon>
                    <Home fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Overview" />
                </ListItemButton>

                <ListItemButton sx={{ pl: 4 }} onClick={() => nav("/calendar")}>
                  <ListItemIcon>
                    <CalendarMonth fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Calendar" />
                </ListItemButton>
              </List>
            </Collapse>

            <Divider sx={{ my: 1 }} />

            {/* ===== Settings ===== */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => nav("/settings")}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
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
