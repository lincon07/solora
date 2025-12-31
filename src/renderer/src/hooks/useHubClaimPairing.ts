import { useEffect, useState } from "react";
import { generateQR } from "@renderer/utils/qr";
import { createPairingSession, fetchPairingStatus } from "../../api/pairing";
import { toast } from "react-toastify";

export function useHubClaimPairing(onPaired: (deviceToken) => void) {
  const [pairing, setPairing] = useState<{
    pairingId: string;
    pairingCode: string;
  } | null>(null);

  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);

    const session = await createPairingSession();
    setPairing(session);

    const qrImg = await generateQR(
      JSON.stringify({ pairingId: session.pairingId })
    );

    setQr(qrImg);
    setLoading(false);
  }

  useEffect(() => {
    if (!pairing) {
      toast.info("Start a pairing session to scan the QR code.");
    };

    let timer: any;
    let cancelled = false;

    async function poll() {
      if (cancelled) {
        return;
      };

      const res = await fetchPairingStatus(pairing?.pairingId as string);

      if (res.status === "paired" && res.deviceToken) {
        // Electron IPC should persist this securely
        onPaired(res.deviceToken);
        toast.success("Device paired successfully!");
        return;
      }

      timer = setTimeout(poll, 2000);
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pairing, onPaired]);

  return { pairing, qr, loading, start };
}
