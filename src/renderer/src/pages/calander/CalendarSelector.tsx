import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { HubCalendar } from "../../../api/calender";

type Props = {
  calendars: HubCalendar[];
  activeCalendarId: string | null;
  onChange: (calendarId: string) => void;
  onDelete?: (calendar: HubCalendar) => void;
};

export function CalendarSelector({
  calendars,
  activeCalendarId,
  onChange,
  onDelete,
}: Props) {
  return (
    <FormControl size="small" sx={{ minWidth: 260 }}>
      <InputLabel>Calendar</InputLabel>

      <Select
        label="Calendar"
        value={activeCalendarId ?? ""}
        onChange={(e) => onChange(String(e.target.value))}
      >
        {calendars.map((cal) => (
          <MenuItem key={cal.id} value={cal.id}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              {/* left */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: cal.color,
                  }}
                />
                <Typography>{cal.name}</Typography>
              </Stack>

              {/* right (optional delete) */}
              {onDelete && (
                <IconButton
                  size="small"
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(cal);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
