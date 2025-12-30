import { createTheme } from "@mui/material/styles";
import { PlaygroundTheme } from "./types/theme/theme-playground";


export function createPlaygroundTheme(t: PlaygroundTheme) {
  const spacing =
    t.density === "compact"
      ? 6
      : t.density === "touch"
      ? 12
      : 8;

  return createTheme({
    palette: {
      mode: t.mode,
      primary: { main: t.primary },
      background: {
        default: t.backgroundDefault,
        paper: t.backgroundPaper,
      },
    },

    shape: {
      borderRadius: t.radius,
    },

    spacing,

    typography: {
      fontFamily: t.fontFamily,
      button: { textTransform: "none" },
    },


    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: !t.shadows,
        },
      },

      MuiPaper: {
        defaultProps: {
          elevation: t.shadows ? 1 : 0,
        },
      },

      MuiAppBar: {
        defaultProps: {
          elevation: t.shadows ? 4 : 0,
        },
      },
    },
  });
}
