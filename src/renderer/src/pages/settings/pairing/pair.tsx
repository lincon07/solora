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

import { fetchHubMe } from "../../../../api/hubDevices";
import { useHubClaimPairing } from "@renderer/hooks/useHubClaimPairing";
import { PairQRCode } from "./DevicePairQRCode";

export default function PairSettings() {
  const [hubId, setHubId] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [loadingHub, setLoadingHub] = useState(true);

  /**
   * =========================================================
   * Load hub status (claimed vs unclaimed)
   * =========================================================
   */
  useEffect(() => {
    async function loadHub() {
      try {
        const res = await fetchHubMe();
        setHubId(res?.hub?.id ?? null);
      } catch {
        // Not claimed yet
        setHubId(null);
      } finally {
        setLoadingHub(false);
      }
    }

    loadHub();
  }, []);

  /**
   * =========================================================
   * Hub claim pairing hook
   * =========================================================
   */
  const hubClaim = useHubClaimPairing(async (t) => {
    console.log("Hub claimed!", t);

    localStorage.setItem("deviceToken", t);

    // reload window to acesses token 

    window.location.reload();
    
    // After successful claim, reload hub info
    const res = await fetchHubMe();
    setHubId(res.hub.id);
    setQrOpen(false);

    // save token into local state/storage if needed

  });

  if (loadingHub) {
    return (
      <Card sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
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
        <Card sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
          <CardHeader
            title="Welcome to Soloras"
            subheader="Your personal home hub"
          />

          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              What is Soloras?
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Soloras is a secure, always-on home hub that connects dashboards,
              automations, and future devices into one unified system.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Before you start
            </Typography>

            <Box component="ul" sx={{ pl: 2, mb: 4 }}>
              {[
                "You’ll need the Soloras mobile app",
                "The first account becomes the hub owner",
                "You can add devices later",
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

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Open the Soloras mobile app and scan the QR code.
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

        {/* ================= QR DIALOG ================= */}
        <Dialog
          open={qrOpen && !!hubClaim.pairing}
          onClose={() => setQrOpen(false)}
        >
          <DialogTitle textAlign="center">
            Scan to Claim Hub
          </DialogTitle>

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
    <Card sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
      <CardHeader title="Hub Claimed" />

      <CardContent>
        <Typography color="text.secondary">
          This hub has been successfully claimed.
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Hub ID: <strong>{hubId}</strong>
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Device pairing and management will be available here later.
        </Typography>
      </CardContent>
    </Card>
  );
}
