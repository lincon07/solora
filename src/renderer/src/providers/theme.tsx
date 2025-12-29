import React from "react";
import {
    ThemeProvider,
    createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

/* ---------------- Context ---------------- */

export interface MyThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const MyThemeContext =
    React.createContext<MyThemeContextType | null>(null);

/* ---------------- Theme Factory ---------------- */

const createUKOTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,

            primary: {
                main: mode === "dark" ? "#4F8CFF" : "#2563EB", // UKO-like blue
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
            borderRadius: 10, // UKO uses tighter radii
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
            /* ---------- Global ---------- */
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor:
                            mode === "dark" ? "#0E1117" : "#F9FAFB",
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    /* Chrome / Edge / Safari */
                    "*::-webkit-scrollbar": {
                        display: "none",
                    },
                },
            },

            /* ---------- AppBar ---------- */
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

            /* ---------- Sidebar / Paper ---------- */
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

            /* ---------- Cards ---------- */
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

            /* ---------- Buttons ---------- */
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
                    outlined: {
                        borderColor:
                            mode === "dark"
                                ? "rgba(255,255,255,0.15)"
                                : "rgba(17,24,39,0.15)",
                    },
                },
            },

            /* ---------- Inputs ---------- */
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
                        "&:hover fieldset": {
                            borderColor:
                                mode === "dark"
                                    ? "rgba(255,255,255,0.25)"
                                    : "rgba(17,24,39,0.25)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor:
                                mode === "dark" ? "#4F8CFF" : "#2563EB",
                            borderWidth: 2,
                        },
                    },
                },
            },

            /* ---------- Tables (Admin Feel) ---------- */
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 600,
                        color:
                            mode === "dark" ? "#9CA3AF" : "#6B7280",
                        backgroundColor:
                            mode === "dark" ? "#0E1117" : "#F9FAFB",
                    },
                    body: {
                        fontSize: "0.875rem",
                    },
                },
            },

            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor:
                            mode === "dark"
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(17,24,39,0.08)",
                    },
                },
            },
        },
    });

/* ---------------- Provider ---------------- */

export const MyThemeProvider: React.FC<
    React.PropsWithChildren<{}>
> = ({ children }) => {
    const [darkMode, setDarkMode] = React.useState(true);

    const toggleDarkMode = () =>
        setDarkMode((prev) => !prev);

    const theme = React.useMemo(
        () => createUKOTheme(darkMode ? "dark" : "light"),
        [darkMode]
    );

    return (
        <MyThemeContext.Provider
            value={{ darkMode, toggleDarkMode }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </MyThemeContext.Provider>
    );
};
