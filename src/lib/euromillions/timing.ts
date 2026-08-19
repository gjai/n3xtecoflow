import { promises as fs } from "fs";
import path from "path";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw, EuroMillionsStore } from "./types";

type TimingRow = {
  date: string;
  detectedAt: string;
  source: EuroMillionsDraw["source"];
};

function timingPath() {
  const em =
    process.env.EUROMILLIONS_DATA_PATH?.trim() ||
    path.join(process.cwd(), "data", "euromillions.json");
  return path.join(path.dirname(em), "em-timing.json");
}

/** Première fois qu’un tirage passe à 5+2 — pour comparer vs fdj.fr. */
export async function recordFirstPublish(
  prev: EuroMillionsStore,
  next: EuroMillionsStore,
): Promise<void> {
  const latest = next.latest;
  if (!isEuroMillionsDrawPublished(latest) || !latest) return;
  const old = prev.draws.find((d) => d.date === latest.date);
  if (isEuroMillionsDrawPublished(old)) return;
  const row: TimingRow = {
    date: latest.date,
    detectedAt: new Date().toISOString(),
    source: latest.source,
  };
  console.info("em_draw_first_publish", row.date, row.detectedAt, row.source);
  try {
    const file = timingPath();
    let rows: TimingRow[] = [];
    try {
      const raw = await fs.readFile(file, "utf8");
      const parsed = JSON.parse(raw) as { draws?: TimingRow[] };
      if (Array.isArray(parsed.draws)) rows = parsed.draws;
    } catch {
      /* first run */
    }
    if (rows.some((r) => r.date === row.date)) return;
    rows = [...rows, row].slice(-20);
    await fs.writeFile(
      file,
      JSON.stringify({ updatedAt: row.detectedAt, draws: rows }, null, 2) + "\n",
      "utf8",
    );
  } catch (err) {
    console.error("em_timing_write_fail", err);
  }
}
