import { promises as fs } from "fs";
import path from "path";
import {
  ANALYTICS_RETENTION_DAYS,
  type AnalyticsStore,
  type DayStats,
  type HostDayStats,
} from "./types";

const EMPTY: AnalyticsStore = {
  updatedAt: new Date(0).toISOString(),
  days: {},
};

let writeChain: Promise<void> = Promise.resolve();

function dataPath() {
  return (
    process.env.ANALYTICS_DATA_PATH?.trim() ||
    path.join(process.cwd(), "data", "analytics.json")
  );
}

export function parisDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function shiftParisDateKey(key: string, deltaDays: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d + deltaDays, 12, 0, 0);
  return parisDateKey(new Date(utc));
}

function emptyHost(): HostDayStats {
  return { views: 0, contacts: 0, paths: {} };
}

function emptyDay(): DayStats {
  return { hosts: {} };
}

export async function readAnalyticsStore(): Promise<AnalyticsStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ file, "utf8");
    const parsed = JSON.parse(raw) as AnalyticsStore;
    if (!parsed?.days || typeof parsed.days !== "object") return { ...EMPTY };
    return parsed;
  } catch {
    return { ...EMPTY, days: {} };
  }
}

async function writeAnalyticsStore(store: AnalyticsStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const pruned = pruneOldDays(store);
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(pruned, null, 2) + "\n",
    "utf8",
  );
}

function pruneOldDays(store: AnalyticsStore): AnalyticsStore {
  const today = parisDateKey();
  const keep = new Set<string>();
  for (let i = 0; i < ANALYTICS_RETENTION_DAYS; i += 1) {
    keep.add(shiftParisDateKey(today, -i));
  }
  const days: AnalyticsStore["days"] = {};
  for (const [key, value] of Object.entries(store.days)) {
    if (keep.has(key)) days[key] = value;
  }
  return { updatedAt: new Date().toISOString(), days };
}

function enqueueWrite(mutator: (store: AnalyticsStore) => void): Promise<void> {
  writeChain = writeChain
    .then(async () => {
      const store = await readAnalyticsStore();
      mutator(store);
      await writeAnalyticsStore(store);
    })
    .catch((err) => {
      console.error("analytics_write_failed", err);
    });
  return writeChain;
}

export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "unknown";
  return host.split(":")[0].trim().toLowerCase() || "unknown";
}

export function normalizePath(raw: string | null | undefined): string {
  if (!raw) return "/";
  try {
    const u = raw.startsWith("http") ? new URL(raw) : new URL(raw, "https://x");
    let p = u.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p.slice(0, 180) || "/";
  } catch {
    return "/";
  }
}

export async function recordPageview(input: {
  host: string;
  path: string;
  day?: string;
}): Promise<void> {
  const day = input.day || parisDateKey();
  const host = normalizeHost(input.host);
  const pathKey = normalizePath(input.path);
  await enqueueWrite((store) => {
    if (!store.days[day]) store.days[day] = emptyDay();
    if (!store.days[day].hosts[host]) store.days[day].hosts[host] = emptyHost();
    const h = store.days[day].hosts[host];
    h.views += 1;
    h.paths[pathKey] = (h.paths[pathKey] || 0) + 1;
  });
}

export async function recordContact(input: {
  host: string;
  day?: string;
}): Promise<void> {
  const day = input.day || parisDateKey();
  const host = normalizeHost(input.host);
  await enqueueWrite((store) => {
    if (!store.days[day]) store.days[day] = emptyDay();
    if (!store.days[day].hosts[host]) store.days[day].hosts[host] = emptyHost();
    store.days[day].hosts[host].contacts += 1;
  });
}

export function topPaths(
  paths: Record<string, number>,
  limit = 8,
): { path: string; views: number }[] {
  return Object.entries(paths)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
