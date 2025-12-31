import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  initialStart?: Date | null;
  initialEnd?: Date | null;
  onClose: () => void;
  onCreate: (data: { title: string; startAt: Date; endAt: Date }) => Promise<void> | void;
};

function toLocalInputValue(date: Date) {
  // yyyy-MM-ddTHH:mm (local time)
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function parseLocalInputValue(value: string) {
  // The browser interprets "YYYY-MM-DDTHH:mm" as local time
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function CreateEventDialog({
  open,
  initialStart,
  initialEnd,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = React.useState("");
  const [start, setStart] = React.useState<Date | null>(null);
  const [end, setEnd] = React.useState<Date | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const now = new Date();
    const defaultStart = initialStart ?? now;
    const defaultEnd = initialEnd ?? new Date(defaultStart.getTime() + 60 * 60 * 1000);

    setTitle("");
    setStart(defaultStart);
    setEnd(defaultEnd);
    setSaving(false);
  }, [open, initialStart, initialEnd]);

  const startStr = start ? toLocalInputValue(start) : "";
  const endStr = end ? toLocalInputValue(end) : "";

  const error =
    !title.trim()
      ? "Title is required"
      : !start || !end
      ? "Start and end are required"
      : end.getTime() <= start.getTime()
      ? "End must be after start"
      : null;

  const canSubmit = !saving && !error;

  const submit = async () => {
    if (!canSubmit || !start || !end) return;

    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        startAt: start,
        endAt: end,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Event</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            autoFocus
            label="Title"
            placeholder="e.g. Dinner, Pickup, Appointment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            fullWidth
          />

          <TextField
            label="Start"
            type="datetime-local"
            value={startStr}
            onChange={(e) => setStart(parseLocalInputValue(e.target.value))}
            disabled={saving}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End"
            type="datetime-local"
            value={endStr}
            onChange={(e) => setEnd(parseLocalInputValue(e.target.value))}
            disabled={saving}
            InputLabelProps={{ shrink: true }}
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit}>
          {saving ? "Creating…" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
