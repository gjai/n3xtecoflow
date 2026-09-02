import { markCronFail, markCronOk } from "@/lib/cron/status";
import { isEuroMillionsLiveWindow, parisDateKey } from "./datetime";
import { withLotteryRefreshLock } from "./live";
import { refreshEuroMillionsData } from "./refresh";
import {
  isEuroMillionsDrawPublished,
  readEuroMillionsStore,
} from "./store";

const INTERVAL_MS = 30_000;

let started = false;

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
    }
  };

  setInterval(() => {
    void tick();
  }, INTERVAL_MS);
  void tick();
}
