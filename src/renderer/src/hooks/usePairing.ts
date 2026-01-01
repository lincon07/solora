import { useEffect, useRef, useState } from "react";
import { generateQR } from "@renderer/utils/qr";
import {
  createPairingSession,
  fetchPairingStatus,
} from "../../api/pairing";

type UsePairingOptions = {
  type: "hub" | "device" | "member";
  hubId?: string;
  onResolved?: (data: {
    userId?: string;
    hubId?: string;
    deviceToken?: string;
  }) => void;
};

export function usePairing(options: UsePairingOptions) {
  const { type, hubId, onResolved } = options;

  const [pairing, setPairing] = useState<{
    pairingId: string;
    pairingCode: string;
  } | null>(null);

  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cancelled = useRef(false);
  const timer = useRef<any>(null);

  function reset() {
    cancelled.current = true;
    if (timer.current) clearTimeout(timer.current);

    cancelled.current = false;
    setPairing(null);
    setQr(null);
  }

  async function start() {
    reset();
    setLoading(true);

    const session = await createPairingSession({ type, hubId });
    setPairing(session);

    const qrImg = await generateQR(
      JSON.stringify({ pairingId: session.pairingId })
    );

    setQr(qrImg);
    setLoading(false);
  }

  useEffect(() => {
    if (!pairing) return;

    async function poll() {
      if (cancelled.current) return;

      const res = await fetchPairingStatus(pairing?.pairingId as string);
      if (res.status === "paired" || res.status === "claimed") {
        onResolved?.(res as any);
        return;
      }

      timer.current = setTimeout(poll, 2000);
    }

    poll();

    return () => {
      cancelled.current = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pairing]);

  return { pairing, qr, loading, start, reset };
}
