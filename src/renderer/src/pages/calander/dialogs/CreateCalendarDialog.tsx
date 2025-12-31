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
  defaultColor?: string;
  onClose: () => void;
  onCreate: (data: { name: string; color: string }) => Promise<void> | void;
};

export function CreateCalendarDialog({
  open,
  defaultColor = "#3b82f6",
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(defaultColor);
  const [saving, setSaving] = React.useState(false);

  // Reset when opening
  React.useEffect(() => {
    if (!open) return;
    setName("");
    setColor(defaultColor);
    setSaving(false);
  }, [open, defaultColor]);

  const canSubmit = name.trim().length >= 2 && color.trim().length >= 3 && !saving;

  const submit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await onCreate({
        name: name.trim(),
        color: color.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Calendar</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            autoFocus
            label="Name"
            placeholder="e.g. Family, Work, Kiosk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <TextField
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={saving}
            helperText="Hex like #3b82f6"
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Preview:
            </Typography>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: color,
                display: "inline-block",
              }}
            />
            <Typography variant="body2">{name.trim() || "New Calendar"}</Typography>
          </Stack>
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
