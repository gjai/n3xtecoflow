import { markCronFail, markCronOk } from "@/lib/cron/status";
import { isEuroMillionsLiveWindow, parisDateKey } from "./datetime";
import { withLotteryRefreshLock } from "./live";
import { refreshEuroMillionsData } from "./refresh";
import {
  isEuroMillionsDrawPublished,
  readEuroMillionsStore,
} from "./store";

/** Hors pic : 30 s. Pic résultats (21h30–22h05 Paris) : 15 s. */
const INTERVAL_MS = 15_000;

let started = false;
let tickRunning = false;

function isPeakLiveWindow(now = new Date()): boolean {
  if (!isEuroMillionsLiveWindow(now)) return false;
  const paris = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(paris.find((p) => p.type === "hour")?.value);
  const minute = Number(paris.find((p) => p.type === "minute")?.value);
  const t = hour * 60 + minute;
  return t >= 21 * 60 + 30 && t < 22 * 60 + 5;
}

export function startVpsLivePoll(): void {
  if (started) return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.EM_VPS_LIVE_POLL === "0") return;
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.EM_VPS_LIVE_POLL !== "1"
  ) {
    return;
  }
  started = true;
  console.info("em_vps_live_poll_start");

  const tick = async () => {
    if (!isEuroMillionsLiveWindow()) return;
    if (tickRunning) return;
    tickRunning = true;
    try {
      const store = await readEuroMillionsStore();
      const today = parisDateKey();
      if (
        store.latest?.date === today &&
        isEuroMillionsDrawPublished(store.latest)
      ) {
        return;
      }
      const locked = await withLotteryRefreshLock(
        () => refreshEuroMillionsData({ mode: "live" }),
      );
      if (!locked.ok) {
        console.info("em_vps_live_skip", locked.reason);
        return;
      }
      const result = locked.value;
      console.info(
        "em_vps_live",
        result.latest,
        `changed=${result.changed}`,
        result.sources.join(","),
        isPeakLiveWindow() ? "peak" : "warm",
      );
      await markCronOk(
        "euromillions",
        `vps-live latest=${result.latest || "—"} changed=${result.changed}`,
      );
    } catch (err) {
      console.error("em_vps_live_fail", err);
      await markCronFail(
        "euromillions",
        err instanceof Error ? err.message : "vps_live_fail",
      );
    } finally {
      tickRunning = false;
    }
  };

  setInterval(() => {
    // Interval fixe 15 s ; hors pic le tick no-op hors fenêtre, en pic on poll.
    void tick();
  }, INTERVAL_MS);
  void tick();
}
