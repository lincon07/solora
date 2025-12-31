import { Box, Typography, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type Props = {
  onCreate: () => void;
};

export function CalendarEmptyState({ onCreate }: Props) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
      }}
    >
      <Box textAlign="center">
        <CalendarMonthIcon
          sx={{
            fontSize: 96,
            opacity: 0.25,
            mb: 2,
          }}
        />

        <Typography variant="h5" fontWeight={600}>
          No calendars yet
        </Typography>

        <Typography sx={{ mt: 1, maxWidth: 360 }}>
          Create your first calendar to start scheduling events.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={onCreate}
        >
          Create Calendar
        </Button>
      </Box>
    </Box>
  );
}
