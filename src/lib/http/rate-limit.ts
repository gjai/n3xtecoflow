/**
 * Rate limit in-process (Coolify 1 replica aujourd’hui).
 * Les buckets sont élagués pour ne pas grandir sans borne.
 */

type Hits = number[];

const buckets = new Map<string, Hits>();
const MAX_KEYS = 4000;

function pruneHits(hits: Hits, now: number, windowMs: number): Hits {
  return hits.filter((at) => now - at < windowMs);
}

function gc(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, hits] of buckets) {
    const kept = hits.filter((at) => now - at < 24 * 3600_000);
    if (kept.length === 0) buckets.delete(key);
    else buckets.set(key, kept);
  }
}

/** true = trop de tentatives dans la fenêtre. */
export function isRateLimited(
  key: string,
  opts: { windowMs: number; max: number },
): boolean {
  const now = Date.now();
  const hits = pruneHits(buckets.get(key) || [], now, opts.windowMs);
  if (hits.length >= opts.max) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  gc(now);
  return false;
}

export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1]!;
  }
  return "unknown";
}
