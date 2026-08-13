import { NextResponse } from "next/server";
import {
  readLotteryFingerprint,
  withLotteryRefreshLock,
} from "@/lib/euromillions/live";
import { refreshEuroMillionsData } from "@/lib/euromillions/refresh";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Poll léger post-tirage : FDJ only, max ~1 hit / 15 s.
 * Public volontairement — throttlé + uniquement si un tirage est en attente.
 */
export async function GET() {
  const current = await readLotteryFingerprint();
  if (!current.pending) {
    return NextResponse.json({
      ok: true,
      pending: false,
      fetched: false,
      fingerprint: current.fingerprint,
    });
  }

  const locked = await withLotteryRefreshLock(() =>
    refreshEuroMillionsData({ mode: "fast" }),
  );
  if (!locked.ok) {
    const again = await readLotteryFingerprint();
    return NextResponse.json({
      ok: true,
      pending: again.pending,
      fetched: false,
      skipped: locked.reason,
      fingerprint: again.fingerprint,
    });
  }

  const after = await readLotteryFingerprint();
  return NextResponse.json({
    ok: true,
    pending: after.pending,
    fetched: true,
    changed: locked.value.changed,
    fingerprint: after.fingerprint,
    latest: locked.value.latest,
  });
}
