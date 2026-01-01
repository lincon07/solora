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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

type Props = {
  open: boolean;
  initialStart?: Date | null;
  initialEnd?: Date | null;
  onClose: () => void;
  onCreate: (data: {
    id: string;
    title: string;
    startAt: Date;
    endAt: Date;
    color: string;
  }) => Promise<void> | void;
};

/* ================= Color Options ================= */

const EVENT_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#f97316", // orange
  "#ef4444", // red
  "#06b6d4", // cyan
];

/* ================= Helpers ================= */

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseLocalInputValue(value: string) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/* ================= Dialog ================= */

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
  const [color, setColor] = React.useState<string>(EVENT_COLORS[0]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setStart(null);
      setEnd(null);
      setColor(EVENT_COLORS[0]);
      setSaving(false);
      return;
    }

    const base = initialStart ?? new Date();
    setTitle("");
    setStart(base);
    setEnd(initialEnd ?? new Date(base.getTime() + 60 * 60 * 1000));
    setColor(EVENT_COLORS[0]);
  }, [open, initialStart, initialEnd]);

  const error =
    !title.trim()
      ? "Title required"
      : !start || !end
      ? "Start and end required"
      : end <= start
      ? "End must be after start"
      : null;

  const submit = async () => {
    if (error || !start || !end) return;

    setSaving(true);
    try {
      await onCreate({
        id: crypto.randomUUID(),
        title: title.trim(),
        startAt: start,
        endAt: end,
        color,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create Event</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            autoFocus
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            fullWidth
          />

          <TextField
            label="Start"
            type="datetime-local"
            value={start ? toLocalInputValue(start) : ""}
            onChange={(e) =>
              setStart(parseLocalInputValue(e.target.value))
            }
            disabled={saving}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End"
            type="datetime-local"
            value={end ? toLocalInputValue(end) : ""}
            onChange={(e) =>
              setEnd(parseLocalInputValue(e.target.value))
            }
            disabled={saving}
            InputLabelProps={{ shrink: true }}
          />

          {/* ================= COLOR PICKER ================= */}
          <Stack spacing={0.5}>
            <Typography fontSize={13} fontWeight={600}>
              Color
            </Typography>

            <ToggleButtonGroup
              exclusive
              value={color}
              onChange={(_, v) => v && setColor(v)}
              size="small"
            >
              {EVENT_COLORS.map((c) => (
                <ToggleButton
                  key={c}
                  value={c}
                  sx={{
                    width: 36,
                    height: 36,
                    p: 0,
                    borderRadius: 1,
                    backgroundColor: c,
                    border: "2px solid transparent",
                    "&.Mui-selected": {
                      borderColor: "#000",
                    },
                  }}
                />
              ))}
            </ToggleButtonGroup>
          </Stack>

          {error && (
            <Typography color="error" fontSize={13}>
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={!!error || saving}
        >
          {saving ? "Creating…" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
