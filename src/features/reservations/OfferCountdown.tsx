import { useEffect, useState } from "react";

function remainingMs(iso: string): number {
  return Math.max(0, new Date(iso).getTime() - Date.now());
}

/** Contagem regressiva até o fim da oferta (offerExpiresAt). */
export function OfferCountdown({ expiresAt }: { expiresAt: string }) {
  const [ms, setMs] = useState(() => remainingMs(expiresAt));
  useEffect(() => {
    const t = setInterval(() => setMs(remainingMs(expiresAt)), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (ms <= 0) return <span className="text-destructive">Oferta expirada</span>;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return <span>Expira em {h}h {m}m {s}s</span>;
}
