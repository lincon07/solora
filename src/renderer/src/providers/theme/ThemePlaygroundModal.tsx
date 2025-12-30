import {
  Box,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Slider,
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { PlaygroundTheme } from "@renderer/utils/types/theme/theme-playground";
import { createPlaygroundTheme } from "@renderer/utils/theme-playground.factory";
import { loadUserTheme, saveUserTheme } from "@renderer/utils/theme-playground.storage";


const DEFAULT_THEME: PlaygroundTheme = {
  mode: "light",
  primary: "#2563EB",
  backgroundDefault: "#F9FAFB",
  backgroundPaper: "#FFFFFF",
  radius: 10,
  fontFamily: "Inter, system-ui",
  density: "comfortable",
  shadows: true,
};

export function ThemePlaygroundModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [theme, setTheme] = useState<PlaygroundTheme>(
    () => loadUserTheme() ?? DEFAULT_THEME
  );

  const muiTheme = useMemo(
    () => createPlaygroundTheme(theme),
    [theme]
  );

  function update<K extends keyof PlaygroundTheme>(
    key: K,
    value: PlaygroundTheme[K]
  ) {
    setTheme((t) => ({ ...t, [key]: value }));
  }

  function save() {
    saveUserTheme(theme);
    onClose();
  }

  function reset() {
    setTheme(DEFAULT_THEME);
  }

  return (
    <Dialog open={open} fullScreen>
      <ThemeProvider theme={muiTheme}>
        <AppBar position="relative">
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6">
              Theme Playground
            </Typography>
            <Button color="inherit" onClick={onClose}>
              <CloseIcon />
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", height: "100%" }}>
          {/* ================= CONTROLS ================= */}
          <Box
            sx={{
              width: 360,
              borderRight: "1px solid",
              borderColor: "divider",
              p: 3,
              overflowY: "auto",
            }}
          >
            <Stack spacing={3}>
              <Select
                value={theme.mode}
                onChange={(e) =>
                  update("mode", e.target.value as any)
                }
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>

              <TextField
                label="Primary Color"
                type="color"
                value={theme.primary}
                onChange={(e) =>
                  update("primary", e.target.value)
                }
              />

              <TextField
                label="Background"
                type="color"
                value={theme.backgroundDefault}
                onChange={(e) =>
                  update("backgroundDefault", e.target.value)
                }
              />

              <TextField
                label="Paper"
                type="color"
                value={theme.backgroundPaper}
                onChange={(e) =>
                  update("backgroundPaper", e.target.value)
                }
              />

              <Typography>Border Radius</Typography>
              <Slider
                min={0}
                max={24}
                value={theme.radius}
                onChange={(_, v) =>
                  update("radius", v as number)
                }
              />

              <Select
                value={theme.density}
                onChange={(e) =>
                  update("density", e.target.value as any)
                }
              >
                <MenuItem value="compact">Compact</MenuItem>
                <MenuItem value="comfortable">Comfortable</MenuItem>
                <MenuItem value="touch">Touch</MenuItem>
              </Select>

              <FormControlLabel
                control={
                  <Switch
                    checked={theme.shadows}
                    onChange={(e) =>
                      update("shadows", e.target.checked)
                    }
                  />
                }
                label="Enable Shadows"
              />

              <Stack direction="row" spacing={2}>
                <Button fullWidth onClick={reset}>
                  Reset
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={save}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* ================= PREVIEW ================= */}
          <Box sx={{ flex: 1, p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Live Preview
            </Typography>

            <Stack spacing={2}>
              <Button variant="contained">
                Primary Button
              </Button>
              <Button variant="outlined">
                Outlined Button
              </Button>
              <TextField label="Input Field" />
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              >
                Card / Paper Example
              </Box>
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </Dialog>
  );
}
