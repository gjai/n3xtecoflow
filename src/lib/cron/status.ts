import { promises as fs } from "fs";
import path from "path";

export type CronJobId =
  | "news"
  | "catalog"
  | "guides"
  | "amazon"
  | "stats"
  | "alert"
  | "euromillions"
  | "fdj-games";

export type CronJobStatus = {
  lastOkAt?: string;
  lastFailAt?: string;
  lastError?: string;
  lastMeta?: string;
};

export type CronStatusStore = {
  updatedAt: string;
  jobs: Partial<Record<CronJobId, CronJobStatus>>;
};

const EMPTY: CronStatusStore = {
  updatedAt: new Date(0).toISOString(),
  jobs: {},
};

function dataPath() {
  return (
    process.env.CRON_STATUS_PATH?.trim() ||
    path.join(process.cwd(), "data", "cron-status.json")
  );
}

export async function readCronStatus(): Promise<CronStatusStore> {
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ dataPath(), "utf8");
    const parsed = JSON.parse(raw) as CronStatusStore;
    if (!parsed?.jobs || typeof parsed.jobs !== "object") return EMPTY;
    return parsed;
  } catch {
    return { ...EMPTY, jobs: {} };
  }
}

async function writeCronStatus(store: CronStatusStore) {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(store, null, 2) + "\n",
    "utf8",
  );
}

export async function markCronOk(
  job: CronJobId,
  meta?: string,
): Promise<void> {
  const store = await readCronStatus();
  store.jobs[job] = {
    ...store.jobs[job],
    lastOkAt: new Date().toISOString(),
    lastMeta: meta,
    lastError: undefined,
  };
  store.updatedAt = new Date().toISOString();
  await writeCronStatus(store);
}

export async function markCronFail(
  job: CronJobId,
  error: string,
): Promise<void> {
  const store = await readCronStatus();
  store.jobs[job] = {
    ...store.jobs[job],
    lastFailAt: new Date().toISOString(),
    lastError: error.slice(0, 500),
  };
  store.updatedAt = new Date().toISOString();
  await writeCronStatus(store);
}

/** Hours since last OK; null if never succeeded. */
export function hoursSinceOk(job: CronJobStatus | undefined): number | null {
  if (!job?.lastOkAt) return null;
  const t = Date.parse(job.lastOkAt);
  if (!Number.isFinite(t)) return null;
  return (Date.now() - t) / 3_600_000;
}

export type CronHealthRow = {
  job: CronJobId;
  label: string;
  maxAgeHours: number;
  ok: boolean;
  hours: number | null;
  lastOkAt?: string;
  lastFailAt?: string;
  lastError?: string;
  lastMeta?: string;
  note?: string;
};

const EXPECTED: {
  job: CronJobId;
  label: string;
  maxAgeHours: number;
  optional?: boolean;
}[] = [
  { job: "news", label: "Actus", maxAgeHours: 12 },
  { job: "catalog", label: "Catalogue EcoFlow", maxAgeHours: 18 },
  { job: "guides", label: "Guides IA", maxAgeHours: 240 }, // weekly + margin
  { job: "amazon", label: "Prix Amazon", maxAgeHours: 18, optional: true },
  { job: "stats", label: "Digest ops", maxAgeHours: 36 },
  { job: "euromillions", label: "EuroMillions", maxAgeHours: 36 },
  { job: "fdj-games", label: "Jeux FDJ (Loto…)", maxAgeHours: 18 },
];

export async function evaluateCronHealth(): Promise<{
  ok: boolean;
  rows: CronHealthRow[];
  alerts: string[];
}> {
  const store = await readCronStatus();
  const rows: CronHealthRow[] = [];
  const alerts: string[] = [];

  for (const exp of EXPECTED) {
    const st = store.jobs[exp.job];
    const hours = hoursSinceOk(st);
    const never = hours == null;
    const stale = hours != null && hours > exp.maxAgeHours;
    const failedAfterOk = Boolean(
      st?.lastFailAt &&
        (!st.lastOkAt || Date.parse(st.lastFailAt) > Date.parse(st.lastOkAt)),
    );

    // Amazon optional until Creators API is configured
    if (exp.optional && never && !failedAfterOk) {
      rows.push({
        job: exp.job,
        label: exp.label,
        maxAgeHours: exp.maxAgeHours,
        ok: true,
        hours,
        lastOkAt: st?.lastOkAt,
        lastFailAt: st?.lastFailAt,
        lastError: st?.lastError,
        lastMeta: st?.lastMeta,
        note: "inactif (Creators API)",
      });
      continue;
    }

    let note: string | undefined;
    if (never) note = "jamais réussi";
    else if (stale) note = `stale >${exp.maxAgeHours}h`;
    else if (failedAfterOk) note = "dernier run en échec";

    const ok = !never && !stale && !failedAfterOk;
    if (!ok) {
      alerts.push(
        `${exp.label}: ${note || "problème"} (dernier OK: ${st?.lastOkAt || "—"}${st?.lastError ? ` · ${st.lastError}` : ""})`,
      );
    }

    rows.push({
      job: exp.job,
      label: exp.label,
      maxAgeHours: exp.maxAgeHours,
      ok,
      hours,
      lastOkAt: st?.lastOkAt,
      lastFailAt: st?.lastFailAt,
      lastError: st?.lastError,
      lastMeta: st?.lastMeta,
      note,
    });
  }

  return { ok: alerts.length === 0, rows, alerts };
}
