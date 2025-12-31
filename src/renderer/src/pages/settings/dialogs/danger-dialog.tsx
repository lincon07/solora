
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export function DangerConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    onConfirm,
    onClose,
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WarningAmberIcon color="error" />
                {title}
            </DialogTitle>

            <DialogContent>
                <Typography color="text.secondary">{description}</Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}