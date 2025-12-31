import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { HubCalendar } from "../../../../api/calender";

type Props = {
  open: boolean;
  calendar?: HubCalendar;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteCalendarDialog({
  open,
  calendar,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Calendar</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Typography>
            Delete <strong>{calendar?.name}</strong>?
          </Typography>
          <Typography color="error">
            All events will be permanently removed.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
