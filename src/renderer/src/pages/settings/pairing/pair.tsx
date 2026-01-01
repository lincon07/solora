// PairSettings.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { fetchHubMe } from "../../../../api/hub";
import { usePairing } from "../../../hooks/usePairing";
import { PairQRCode } from "./DevicePairQRCode";

export default function PairSettings() {
  const [hubId, setHubId] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [loadingHub, setLoadingHub] = useState(true);

  /* =========================================================
   * Load hub status
   * ========================================================= */
  useEffect(() => {
    async function loadHub() {
      try {
        const res = await fetchHubMe();
        setHubId(res?.hub?.id ?? null);
      } catch {
        setHubId(null);
      } finally {
        setLoadingHub(false);
      }
    }
    loadHub();
  }, []);

  /* =========================================================
   * Hub claim pairing
   * ========================================================= */
  const hubClaim = usePairing({
    type: "hub",
    onResolved: ({ deviceToken }) => {
      if (!deviceToken) return;

      localStorage.setItem("deviceToken", deviceToken);
      window.location.reload();
      // navigate 
    },
  });

  if (loadingHub) {
    return (
      <Card sx={{ maxWidth: 900, mx: "auto" }}>
        <CardContent>
          <Typography>Loading hub status…</Typography>
        </CardContent>
      </Card>
    );
  }

  /* =========================================================
   * UNCLAIMED HUB
   * ========================================================= */
  if (!hubId) {
    return (
      <>
        <Card sx={{ maxWidth: 900, mx: "auto" }}>
          <CardHeader
            title="Welcome to Soloras"
            subheader="Your personal home hub"
          />

          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Before you start
            </Typography>

            <Box component="ul" sx={{ pl: 2, mb: 4 }}>
              {[
                "You’ll need the Soloras mobile app",
                "The first account becomes the hub owner",
                "You can add members and devices later",
              ].map((text) => (
                <li key={text}>
                  <Typography color="text.secondary">{text}</Typography>
                </li>
              ))}
            </Box>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Ready to claim your hub?
              </Typography>

              <Button
                size="large"
                variant="contained"
                onClick={() => {
                  hubClaim.start();
                  setQrOpen(true);
                }}
                disabled={hubClaim.loading}
              >
                Claim This Hub
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* QR Dialog */}
        <Dialog open={qrOpen && !!hubClaim.pairing} onClose={() => setQrOpen(false)}>
          <DialogTitle textAlign="center">Scan to Claim Hub</DialogTitle>
          <DialogContent sx={{ textAlign: "center", m: 3 }}>
            {hubClaim.pairing && (
              <PairQRCode
                qr={hubClaim.qr}
                code={hubClaim.pairing.pairingCode}
                pairingId={hubClaim.pairing.pairingId}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  /* =========================================================
   * CLAIMED HUB
   * ========================================================= */
  return (
    <Card sx={{ maxWidth: 900, mx: "auto" }}>
      <CardHeader title="Hub Claimed" />
      <CardContent>
        <Typography color="text.secondary">
          This hub has been successfully claimed.
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Hub ID: <strong>{hubId}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
}
