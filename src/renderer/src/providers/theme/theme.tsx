import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemePlaygroundModal } from "./ThemePlaygroundModal";

/* =========================================================
 * Types
 * ========================================================= */

export type ThemeMode = "light" | "dark" | "system";
export type DesignMode = "uko" | "flat";
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
 * System Theme
 * ========================================================= */

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* =========================================================
 * Density Helpers (THE MAGIC)
 * ========================================================= */

function densityVars(density: DensityMode) {
  return density === "cozy"
    ? {
        buttonY: 10,
        buttonX: 18,
        inputY: 14,
        listItemY: 12,
        borderRadius: 12,
      }
    : {
        buttonY: 6,
        buttonX: 12,
        inputY: 8,
        listItemY: 6,
        borderRadius: 8,
      };
}

/* =========================================================
 * UKO THEME
 * ========================================================= */

function createUKOTheme(
  mode: "light" | "dark",
  density: DensityMode
) {
  const isDark = mode === "dark";
  const d = densityVars(density);

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? "#4F8CFF" : "#2563EB" },
      background: {
        default: isDark ? "#0E1117" : "#F9FAFB",
        paper: isDark ? "#111827" : "#FFFFFF",
      },
      text: {
        primary: isDark ? "#E5E7EB" : "#111827",
        secondary: isDark ? "#9CA3AF" : "#6B7280",
      },
      divider: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(17,24,39,0.08)",
    },

    shape: {
      borderRadius: d.borderRadius,
    },

    typography: {
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? "#0E1117" : "#F9FAFB",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${
              isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(17,24,39,0.08)"
            }`,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: d.borderRadius,
            boxShadow: "none",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: d.borderRadius,
            paddingInline: d.buttonX,
            paddingBlock: d.buttonY,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            paddingBlock: d.inputY,
          },
        },
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: d.listItemY,
            paddingBottom: d.listItemY,
          },
        },
      },
    },
  });
}

/* =========================================================
 * FLAT THEME
 * ========================================================= */

function createFlatTheme(
  mode: "light" | "dark",
  density: DensityMode
) {
  const isDark = mode === "dark";
  const d = densityVars(density);

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? "#7DD3FC" : "#0284C7" },
      background: {
        default: isDark ? "#0B0F14" : "#FFFFFF",
        paper: isDark ? "#0B0F14" : "#FFFFFF",
      },
      text: {
        primary: isDark ? "#E5E7EB" : "#0F172A",
        secondary: isDark ? "#94A3B8" : "#475569",
      },
      divider: "rgba(0,0,0,0)",
    },

    shape: {
      borderRadius: d.borderRadius,
    },

    typography: {
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto",
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? "#0B0F14" : "#FFFFFF",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: "none",
            boxShadow: "none",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: d.buttonX,
            paddingBlock: d.buttonY,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: d.borderRadius,
            paddingBlock: d.inputY,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
            "& fieldset": { border: "none" },
          },
        },
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: d.listItemY,
            paddingBottom: d.listItemY,
          },
        },
      },
    },
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
  return design === "flat"
    ? createFlatTheme(mode, density)
    : createUKOTheme(mode, density);
}

/* =========================================================
 * Provider
 * ========================================================= */

export const MyThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [playgroundOpen, setPlaygroundOpen] = React.useState(false);
  const [mode, setThemeMode] = React.useState<ThemeMode>("dark");
  const [design, setDesignMode] = React.useState<DesignMode>("uko");
  const [density, setDensityMode] =
    React.useState<DensityMode>("cozy");

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
