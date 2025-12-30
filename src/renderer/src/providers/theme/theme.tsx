import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemePlaygroundModal } from "./ThemePlaygroundModal";

/* =========================================================
 * Context Types
 * ========================================================= */

export type ThemeMode = "light" | "dark" | "system";
export type DesignMode = "uko" | "flat";

export interface MyThemeContextType {
  mode: ThemeMode;
  design: DesignMode;
  darkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setDesignMode: (design: DesignMode) => void;
  handleOpenPlayground: (open: boolean) => void;
}

export const MyThemeContext =
  React.createContext<MyThemeContextType | null>(null);

/* =========================================================
 * System Preference
 * ========================================================= */

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* =========================================================
 * UKO THEME (Structured / Border-based)
 * ========================================================= */

function createUKOTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

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

    shape: { borderRadius: 10 },

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
            border: `1px solid ${isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(17,24,39,0.08)"
              }`,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "none",
            border: `1px solid ${isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(17,24,39,0.08)"
              }`,
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: 14,
            paddingBlock: 8,
          },
        },
      },
    },
  });
}

/* =========================================================
 * FLAT THEME (No borders, no shadows)
 * ========================================================= */

function createFlatTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

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

      // ✅ FIX: must be rgba(), NOT "transparent"
      divider: "rgba(0,0,0,0)",
    },

    shape: { borderRadius: 6 },

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

      MuiCard: {
        styleOverrides: {
          root: {
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: 16,
            paddingBlock: 10,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
            "& fieldset": {
              border: "none",
            },
          },
        },
      },
    },
  });
}

/* =========================================================
 * Theme Resolver
 * ========================================================= */

function resolveTheme(
  design: DesignMode,
  mode: "light" | "dark"
) {
  return design === "flat"
    ? createFlatTheme(mode)
    : createUKOTheme(mode);
}

/* =========================================================
 * Provider
 * ========================================================= */

export const MyThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [playgroundOpen, setPlaygroundOpen] =
    React.useState(false);
  const [mode, setThemeMode] =
    React.useState<ThemeMode>("dark");

  const [design, setDesignMode] =
    React.useState<DesignMode>("uko");

  const resolvedMode =
    mode === "system" ? getSystemTheme() : mode;

  const theme = React.useMemo(
    () => resolveTheme(design, resolvedMode),
    [design, resolvedMode]
  );

  const handleOpenPlayground = React.useCallback(
    (open: boolean) => {
      setPlaygroundOpen(open);
    },
    []
  );

  return (
    <MyThemeContext.Provider
      value={{
        mode,
        design,
        darkMode: resolvedMode === "dark",
        setThemeMode,
        setDesignMode,
        handleOpenPlayground,
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
