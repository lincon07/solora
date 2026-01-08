import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemePlaygroundModal } from "./ThemePlaygroundModal";

/* =========================================================
 * Types
 * ========================================================= */

export type ThemeMode = "light" | "dark" | "system";

export type DesignMode =
  | "material"
  | "ant"
  | "saas"
  | "shadcn"
  | "flat"
  | "glass";

export type DensityMode = "cozy" | "compact";

export interface MyThemeContextType {
  mode: ThemeMode;
  design: DesignMode;
  density: DensityMode;
  darkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setDesignMode: (design: DesignMode) => void;
  setDensityMode: (density: DensityMode) => void;
  handleOpenPlayground: (open: boolean) => void;
}

export const MyThemeContext =
  React.createContext<MyThemeContextType | null>(null);

/* =========================================================
 * System Mode Resolver
 * ========================================================= */

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* =========================================================
 * Density System
 * ========================================================= */

function densityVars(density: DensityMode) {
  return density === "cozy"
    ? { buttonY: 10, buttonX: 18, inputY: 14, listItemY: 12, radius: 10 }
    : { buttonY: 6, buttonX: 12, inputY: 8, listItemY: 6, radius: 6 };
}

/* =========================================================
 * Base Typography
 * ========================================================= */

const baseTypography = {
  fontFamily:
    "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: {
    textTransform: "none",
    fontWeight: 500,
  },
};

/* =========================================================
 * SHADCN DESIGN (Neutral / Token-Based)
 * ========================================================= */

function createShadcnTheme(
  mode: "light" | "dark",
  density: DensityMode
) {
  const d = densityVars(density);
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? "#E5E7EB" : "#111827" },
      background: {
        default: isDark ? "#09090B" : "#FFFFFF",
        paper: isDark ? "#09090B" : "#FFFFFF",
      },
      text: {
        primary: isDark ? "#FAFAFA" : "#09090B",
        secondary: isDark ? "#A1A1AA" : "#52525B",
      },
      divider: isDark ? "#27272A" : "#E4E4E7",
    },
    shape: { borderRadius: d.radius },
    typography: baseTypography,
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: `1px solid ${
              isDark ? "#27272A" : "#E4E4E7"
            }`,
            boxShadow: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            paddingInline: d.buttonX,
            paddingBlock: d.buttonY,
            border: `1px solid ${
              isDark ? "#27272A" : "#E4E4E7"
            }`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            paddingBlock: d.inputY,
            backgroundColor: isDark ? "#09090B" : "#FFFFFF",
            "& fieldset": {
              borderColor: isDark ? "#27272A" : "#E4E4E7",
            },
          },
        },
      },
    },
  });
}

/* =========================================================
 * OTHER THEMES (UNCHANGED, CLEANED)
 * ========================================================= */

function createMaterialTheme(mode: "light" | "dark", density: DensityMode) {
  const d = densityVars(density);
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#1976D2" },
      background: {
        default: isDark ? "#121212" : "#F5F5F5",
        paper: isDark ? "#1E1E1E" : "#FFFFFF",
      },
    },
    shape: { borderRadius: d.radius },
    typography: baseTypography,
  });
}

function createAntTheme(mode: "light" | "dark", density: DensityMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#1677FF" },
      background: {
        default: isDark ? "#0F172A" : "#F0F2F5",
        paper: isDark ? "#020617" : "#FFFFFF",
      },
      divider: isDark ? "#1E293B" : "#E5E7EB",
    },
    shape: { borderRadius: 6 },
    typography: baseTypography,
  });
}

function createSaasTheme(mode: "light" | "dark", density: DensityMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#4F46E5" },
      background: {
        default: isDark ? "#0B0F19" : "#F9FAFB",
        paper: isDark ? "#111827" : "#FFFFFF",
      },
    },
    shape: { borderRadius: 10 },
    typography: baseTypography,
  });
}

function createFlatTheme(mode: "light" | "dark", density: DensityMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#0284C7" },
      background: {
        default: isDark ? "#020617" : "#FFFFFF",
        paper: isDark ? "#020617" : "#FFFFFF",
      },
    },
    shape: { borderRadius: 0 },
    typography: baseTypography,
  });
}

function createGlassTheme(mode: "light" | "dark", density: DensityMode) {
  const d = densityVars(density);
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#7C9CFF" },
      background: {
        default: isDark ? "#05070C" : "#EEF2FF",
        paper: isDark
          ? "rgba(20,25,40,0.65)"
          : "rgba(255,255,255,0.75)",
      },
    },
    shape: { borderRadius: d.radius },
    typography: baseTypography,
  });
}

/* =========================================================
 * Resolver
 * ========================================================= */

function resolveTheme(
  design: DesignMode,
  mode: "light" | "dark",
  density: DensityMode
) {
  switch (design) {
    case "shadcn":
      return createShadcnTheme(mode, density);
    case "material":
      return createMaterialTheme(mode, density);
    case "ant":
      return createAntTheme(mode, density);
    case "saas":
      return createSaasTheme(mode, density);
    case "flat":
      return createFlatTheme(mode, density);
    case "glass":
      return createGlassTheme(mode, density);
    default:
      return createShadcnTheme(mode, density);
  }
}

/* =========================================================
 * Provider
 * ========================================================= */

export const MyThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [playgroundOpen, setPlaygroundOpen] = React.useState(false);
  const [mode, setThemeMode] = React.useState<ThemeMode>("system");
  const [design, setDesignMode] = React.useState<DesignMode>("shadcn");
  const [density, setDensityMode] = React.useState<DensityMode>("cozy");

  const resolvedMode =
    mode === "system" ? getSystemTheme() : mode;

  const theme = React.useMemo(
    () => resolveTheme(design, resolvedMode, density),
    [design, resolvedMode, density]
  );

  return (
    <MyThemeContext.Provider
      value={{
        mode,
        design,
        density,
        darkMode: resolvedMode === "dark",
        setThemeMode,
        setDesignMode,
        setDensityMode,
        handleOpenPlayground: setPlaygroundOpen,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemePlaygroundModal
          open={playgroundOpen}
          onClose={() => setPlaygroundOpen(false)}
        />
        {children}
      </ThemeProvider>
    </MyThemeContext.Provider>
  );
};
