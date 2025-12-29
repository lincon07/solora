import React, { useEffect } from "react";
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
} from "@mui/material";
import { UpdaterContext } from "@renderer/providers/updater";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

/* ---------------- Types ---------------- */

type ControlType = "switch" | "checkbox" | "select" | "text";

type SystemConfig = {
  platform?: string;
  arch?: string;
  memory?: { total: number };
  version?: string;
};

/* ---------------- Cozy Context ---------------- */

const CozyContext = React.createContext({ cozy: true });

/* ---------------- Reusable Row ---------------- */

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

/* ---------------- Settings Card ---------------- */

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
    defaultValue?: any;
    options?: { label: string; value: string }[];
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
                    return <Switch defaultChecked={s.defaultValue} />;
                  case "checkbox":
                    return <Checkbox defaultChecked={s.defaultValue} />;
                  case "text":
                    return (
                      <TextField
                        size="small"
                        placeholder="Enter value"
                        defaultValue={s.defaultValue}
                      />
                    );
                  case "select":
                    return (
                      <Select size="small" defaultValue={s.defaultValue}>
                        {s.options?.map((o) => (
                          <MenuItem key={o.value} value={o.value}>
                            {o.label}
                          </MenuItem>
                        ))}
                      </Select>
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

/* ---------------- Page ---------------- */

export default function SettingsPage() {
  const updater = React.useContext(UpdaterContext);
  const [cozyMode] = React.useState(true);
  const [systemConfig, setSystemConfig] = React.useState<SystemConfig | null>(
    null
  );

  /* ---------------- Settings Data ---------------- */

  const systemSettings = [
    {
      key: "sounds",
      label: "UI Sound Effects",
      description: "Play sound effects for interactions.",
      type: "switch",
      defaultValue: true,
    },
    {
      key: "updates",
      label: "Automatic Updates",
      description: "Download and install updates automatically.",
      type: "switch",
      defaultValue: true,
    },
    {
      key: "startup",
      label: "Launch on Startup",
      description: "Start app when your system boots.",
      type: "switch",
    },
  ];

  const preferenceSettings = [
    {
      key: "notifications",
      label: "Enable Notifications",
      type: "switch",
      defaultValue: true,
    },
    {
      key: "confirm",
      label: "Confirm Destructive Actions",
      type: "switch",
      defaultValue: true,
    },
    {
      key: "analytics",
      label: "Allow Analytics",
      type: "checkbox",
      defaultValue: true,
    },
  ];

  const appearanceSettings = [
    {
      key: "cozy",
      label: "Cozy Mode",
      description: "Increase spacing and control sizes (Discord-style).",
      type: "switch",
      defaultValue: true,
    },
    {
      key: "dashboard",
      label: "Default Dashboard",
      type: "select",
      defaultValue: "overview",
      options: [
        { label: "Overview", value: "overview" },
        { label: "Analytics", value: "analytics" },
        { label: "Activity", value: "activity" },
      ],
    },
  ];

  /* ---------------- System Info Fetch ---------------- */

  useEffect(() => {
    const loadSystemConfig = async () => {
      try {
        const config = await (window as any)?.system?.getSystemConfiguration?.();
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

  return (
    <CozyContext.Provider value={{ cozy: cozyMode }}>
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
          {/* Left */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Settings
              </Typography>
              <Typography color="text.secondary">
                Manage system preferences and appearance
              </Typography>
            </Box>
          </Stack>

          {/* Center (empty by design) */}
          <Box />

          {/* Right */}
          <Stack spacing={1} alignItems="flex-end">
            <Chip
              icon={<SystemUpdateAltIcon />}
              label="Check for Updates"
              color="primary"
              onClick={() => updater?.checkForUpdates?.()}
            />
          </Stack>
        </Box>

        {/* ================= CONTENT ================= */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <SettingsCard
              title="System Configuration"
              settings={systemSettings}
            />
            <SettingsCard
              title="User Preferences"
              settings={preferenceSettings}
            />
            <SettingsCard title="Appearance" settings={appearanceSettings} />

            {/* ================= System Info ================= */}
            <Box
              sx={{
                width: "100%",
                mt: 6,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography color="text.secondary">
                OS: <strong>{systemConfig?.platform ?? "Loading…"}</strong>
              </Typography>
              <Typography color="text.secondary">
                Architecture:{" "}
                <strong>{systemConfig?.arch ?? "Loading…"}</strong>
              </Typography>
              <Typography color="text.secondary">
                Memory:{" "}
                <strong>
                  {memoryGB ? `${memoryGB} GB` : "Loading…"}
                </strong>
              </Typography>
              <Typography color="text.secondary">
                Version:{" "}
                <strong>{systemConfig?.version ?? "Loading…"}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </CozyContext.Provider>
  );
}
