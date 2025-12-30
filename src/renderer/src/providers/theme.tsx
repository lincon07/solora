import React from "react";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

/* ---------------- Context ---------------- */

export type ThemeMode = "light" | "dark" | "system";

export interface MyThemeContextType {
  mode: ThemeMode;
  darkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

export const MyThemeContext =
  React.createContext<MyThemeContextType | null>(null);

/* ---------------- System Preference ---------------- */

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* ---------------- Theme Factory (UKO) ---------------- */

const createUKOTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: mode === "dark" ? "#4F8CFF" : "#2563EB",
      },

      background: {
        default: mode === "dark" ? "#0E1117" : "#F9FAFB",
        paper: mode === "dark" ? "#111827" : "#FFFFFF",
      },

      text: {
        primary: mode === "dark" ? "#E5E7EB" : "#111827",
        secondary: mode === "dark" ? "#9CA3AF" : "#6B7280",
      },

      divider:
        mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(17,24,39,0.08)",
    },

    shape: {
      borderRadius: 10,
    },

    typography: {
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",

      h1: { fontWeight: 700, fontSize: "2rem" },
      h2: { fontWeight: 700, fontSize: "1.5rem" },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },

      body1: { fontSize: "0.95rem" },
      body2: { fontSize: "0.875rem" },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor:
              mode === "dark" ? "#0E1117" : "#F9FAFB",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          "*::-webkit-scrollbar": {
            display: "none",
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark" ? "#0E1117" : "#FFFFFF",
            borderBottom:
              mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(17,24,39,0.08)",
            boxShadow: "none",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border:
              mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(17,24,39,0.08)",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "none",
            border:
              mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(17,24,39,0.08)",
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: 14,
            paddingBlock: 8,
          },
          containedPrimary: {
            backgroundColor:
              mode === "dark" ? "#4F8CFF" : "#2563EB",
            "&:hover": {
              backgroundColor:
                mode === "dark" ? "#3B76E1" : "#1D4ED8",
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor:
              mode === "dark" ? "#0E1117" : "#FFFFFF",
            "& fieldset": {
              borderColor:
                mode === "dark"
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(17,24,39,0.15)",
            },
            "&.Mui-focused fieldset": {
              borderColor:
                mode === "dark" ? "#4F8CFF" : "#2563EB",
              borderWidth: 2,
            },
          },
        },
      },
    },
  });

/* ---------------- Provider ---------------- */

export const MyThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [mode, setMode] = React.useState<ThemeMode>("system");

  const resolvedMode =
    mode === "system" ? getSystemTheme() : mode;

  const muiTheme = React.useMemo(
    () => createUKOTheme(resolvedMode),
    [resolvedMode]
  );

  return (
    <MyThemeContext.Provider
      value={{
        mode,
        darkMode: resolvedMode === "dark",
        setThemeMode: setMode,
      }}
    >
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MyThemeContext.Provider>
  );
};
