import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Switch,
  TextField,
  Typography,
  Select,
  MenuItem,
  Stack,
  Chip,
  Button,
  Slider,
} from "@mui/material";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import { UpdaterContext } from "@renderer/providers/updater";
import { MyThemeContext } from "@renderer/providers/theme/theme";
import MembersManagement from "./members-managment";
import DangerArea from "./danger-area/danger-area";
import PairSettings from "./pairing/pair";

/* ================= TYPES ================= */

type ControlType = "switch" | "checkbox" | "select" | "text" | "slider";

type SystemConfig = {
  platform?: string;
  arch?: string;
  memory?: { total: number };
  version?: string;
};

/* ================= COZY CONTEXT ================= */

const CozyContext = React.createContext({ cozy: true });

/* ================= SETTING ROW ================= */

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description?: string;
  control: React.ReactNode;
}) {
  const { cozy } = React.useContext(CozyContext);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        py: cozy ? 2.5 : 1.5,
      }}
    >
      <Box>
        <Typography fontWeight={600} fontSize={cozy ? "1rem" : "0.9rem"}>
          {title}
        </Typography>
        {description && (
          <Typography
            color="text.secondary"
            fontSize={cozy ? "0.9rem" : "0.8rem"}
            sx={{ mt: 0.5 }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {control}
    </Box>
  );
}

/* ================= SETTINGS CARD ================= */

function SettingsCard({
  title,
  settings,
}: {
  title: string;
  settings: Array<{
    key: string;
    label: string;
    description?: string;
    type: ControlType;
    value?: any;
    defaultValue?: any;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: any) => void;
    options?: { label: string; value: string; action?: () => void }[];
  }>;
}) {
  return (
    <Card sx={{ width: "100%", maxWidth: 900 }}>
      <CardHeader title={title} />
      <CardContent>
        {settings.map((s, i) => (
          <React.Fragment key={s.key}>
            <SettingRow
              title={s.label}
              description={s.description}
              control={(() => {
                switch (s.type) {
                  case "switch":
                    return (
                      <Switch
                        defaultChecked={s.defaultValue}
                        onChange={(_, v) => s.onChange?.(v)}
                      />
                    );

                  case "checkbox":
                    return (
                      <Checkbox
                        defaultChecked={s.defaultValue}
                        onChange={(_, v) => s.onChange?.(v)}
                      />
                    );

                  case "text":
                    return (
                      <TextField
                        size="small"
                        defaultValue={s.defaultValue}
                        onBlur={(e) => s.onChange?.(e.target.value)}
                      />
                    );

                  case "select":
                    return (
                      <Select size="small" defaultValue={s.defaultValue}>
                        {s.options?.map((o) => (
                          <MenuItem
                            key={o.value}
                            value={o.value}
                            onClick={() => o.action?.()}
                          >
                            {o.label}
                          </MenuItem>
                        ))}
                      </Select>
                    );

                  case "slider":
                    return (
                      <Box sx={{ width: 220 }}>
                        <Slider
                          value={s.value}
                          min={s.min ?? 0}
                          max={s.max ?? 100}
                          step={s.step ?? 1}
                          valueLabelDisplay="auto"
                          onChange={(_, v) => s.onChange?.(v)}
                        />
                      </Box>
                    );
                }
              })()}
            />
            {i < settings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

/* ================= PAGE ================= */

export default function SettingsPage() {
  const updater = React.useContext(UpdaterContext);
  const theme = React.useContext(MyThemeContext);

  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [screenBrightness, setScreenBrightness] = useState<number>(70);
  const brightnessTimeout = useRef<NodeJS.Timeout | null>(null);

  /* -------- Load brightness once -------- */
  useEffect(() => {
    const loadBrightness = async () => {
      try {
        const value = await window.system?.getScreenBrightness?.();
        if (typeof value === "number") {
          setScreenBrightness(value);
        }
      } catch (err) {
        console.error("Failed to load screen brightness", err);
      }
    };

    loadBrightness();
  }, []);

  /* -------- Debounced brightness update -------- */
  const setBrightness = (value: number) => {
    setScreenBrightness(value);

    if (brightnessTimeout.current) {
      clearTimeout(brightnessTimeout.current);
    }

    brightnessTimeout.current = setTimeout(() => {
      window.system?.setScreenBrightness?.(value);
    }, 80);
  };

  /* -------- Load system config -------- */
  useEffect(() => {
    const loadSystemConfig = async () => {
      try {
        const config = await window.system?.getSystemConfiguration?.();
        setSystemConfig(config ?? null);
      } catch (err) {
        console.error("Failed to load system configuration", err);
      }
    };

    loadSystemConfig();
  }, []);

  const memoryGB =
    systemConfig?.memory?.total != null
      ? (systemConfig.memory.total / 1024 / 1024 / 1024).toFixed(1)
      : null;

  /* ================= SETTINGS DATA ================= */

  const systemSettings = [
    {
      key: "sounds",
      label: "UI Sound Effects",
      description: "Play sound effects for interactions.",
      type: "switch" as const,
      defaultValue: true,
    },
    {
      key: "updates",
      label: "Automatic Updates",
      description: "Download and install updates automatically.",
      type: "switch" as const,
      defaultValue: true,
    },
    {
      key: "brightness",
      label: "Screen Brightness",
      description: "Adjust the physical screen brightness.",
      type: "slider" as const,
      value: screenBrightness,
      min: 0,
      max: 100,
      step: 1,
      onChange: setBrightness,
    },
  ];

  const appearanceSettings = [
    {
      key: "theme",
      label: "Theme",
      description: "Select the application theme.",
      type: "select" as const,
      defaultValue: theme?.mode || "system",
      options: [
        { label: "Light", value: "light", action: () => theme?.setThemeMode("light") },
        { label: "Dark", value: "dark", action: () => theme?.setThemeMode("dark") },
        { label: "System", value: "system", action: () => theme?.setThemeMode("system") },
      ],
    },
    {
      key: "density",
      label: "Density",
      description: "Select UI density.",
      type: "select" as const,
      defaultValue: theme?.density || "cozy",
      options: [
        { label: "Cozy", value: "cozy", action: () => theme?.setDensityMode("cozy") },
        { label: "Compact", value: "compact", action: () => theme?.setDensityMode("compact") },
      ],
    },
  ];

  return (
    <CozyContext.Provider value={{ cozy: true }}>
      <Box sx={{ p: 3 }}>
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Settings
            </Typography>
            <Typography color="text.secondary">
              Manage system preferences and appearance
            </Typography>
          </Box>

          <Chip
            icon={<SystemUpdateAltIcon />}
            label="Check for Updates"
            color="primary"
            onClick={() => updater?.checkForUpdates?.()}
          />
        </Stack>

        <Stack spacing={4} alignItems="center">
          <SettingsCard title="System Configuration" settings={systemSettings} />
          <SettingsCard title="Appearance" settings={appearanceSettings} />

          <MembersManagement />
          <PairSettings />
          <DangerArea />

          {/* SYSTEM INFO */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Typography color="text.secondary">
              OS: <strong>{systemConfig?.platform ?? "Loading…"}</strong>
            </Typography>
            <Typography color="text.secondary">
              Arch: <strong>{systemConfig?.arch ?? "Loading…"}</strong>
            </Typography>
            <Typography color="text.secondary">
              Memory: <strong>{memoryGB ? `${memoryGB} GB` : "Loading…"}</strong>
            </Typography>
            <Typography color="text.secondary">
              Version: <strong>{systemConfig?.version ?? "Loading…"}</strong>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </CozyContext.Provider>
  );
}
