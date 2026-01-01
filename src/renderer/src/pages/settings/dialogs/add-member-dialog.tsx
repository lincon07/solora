import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Avatar,
  Typography,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect, useState } from "react";

import { usePairing } from "@renderer/hooks/usePairing";
import { PairQRCode } from "../pairing/DevicePairQRCode";
import { createHubMember } from "../../../../api/members";

type Props = {
  hubId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddMemberDialog({
  hubId,
  open,
  onClose,
  onCreated,
}: Props) {
  const [displayName, setDisplayName] = useState("");
  const [lockedUserId, setLockedUserId] = useState<string | null>(null);

  const pairing = usePairing({
    type: "member",
    hubId,
    onResolved: ({ userId }) => {
      if (userId) {
        setLockedUserId(userId);
        pairing.reset(); // remove QR immediately
      }
    },
  });

  /* =========================================================
   * RESET STATE WHEN DIALOG CLOSES
   * ========================================================= */
  useEffect(() => {
    if (!open) {
      setDisplayName("");
      setLockedUserId(null);
      pairing.reset();
    }
  }, [open]);

  /* =========================================================
   * CREATE MEMBER
   * ========================================================= */
  async function handleCreate() {
    if (!lockedUserId || !displayName.trim()) return;

    await createHubMember(hubId, {
      userId: lockedUserId,
      displayName: displayName.trim(),
    });

    onCreated();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Hub Member</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Avatar */}
          <Stack alignItems="center">
            <Avatar sx={{ width: 64, height: 64 }}>
              <PersonIcon />
            </Avatar>
          </Stack>

          {/* Display Name */}
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
          />

          {/* Generate QR */}
          {!pairing.pairing && !lockedUserId && (
            <Button
              variant="outlined"
              onClick={pairing.start}
              disabled={pairing.loading}
            >
              Generate QR Code
            </Button>
          )}

          {/* QR Code */}
          {pairing.pairing && !lockedUserId && (
            <PairQRCode
              qr={pairing.qr}
              code={pairing.pairing.pairingCode}
              pairingId={pairing.pairing.pairingId}
            />
          )}

          {/* Success State */}
          {lockedUserId && (
            <Stack
              spacing={1}
              alignItems="center"
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                backgroundColor: (t) => t.palette.success.light + "22",
              }}
            >
              <Chip
                color="success"
                label="User linked successfully"
                sx={{ fontWeight: 600 }}
              />

              <Typography variant="caption" color="text.secondary">
                Linked User ID
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {lockedUserId}
                </Typography>

                <Button
                  size="small"
                  onClick={() => navigator.clipboard.writeText(lockedUserId)}
                >
                  <ContentCopyIcon fontSize="small" />
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!lockedUserId || !displayName.trim()}
          onClick={handleCreate}
        >
          Create Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}
