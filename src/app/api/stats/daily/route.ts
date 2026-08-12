import { NextResponse } from "next/server";
import { buildDailyDigest, sendDigestEmail } from "@/lib/analytics/digest";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { shiftParisDateKey, parisDateKey } from "@/lib/analytics/store";

export const maxDuration = 60;

function authorized(request: Request) {
  const secret =
    process.env.STATS_CRON_SECRET?.trim() ||
    process.env.NEWS_CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  return bearer === secret || query === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dayParam = url.searchParams.get("day");
  const dryRun = url.searchParams.get("dryRun") === "1";
  const dayKey = dayParam || shiftParisDateKey(parisDateKey(), -1);

  try {
    const digest = await buildDailyDigest({ dayKey });
    if (dryRun) {
      return NextResponse.json({ ok: true, dryRun: true, digest });
    }
    const sent = await sendDigestEmail(digest);
    if (!sent.ok) {
      await markCronFail("stats", sent.error || "email_failed");
      return NextResponse.json(
        {
          ok: false,
          error: sent.error,
          digest: { subject: digest.subject, dayKey },
        },
        { status: 502 },
      );
    }
    await markCronOk(
      "stats",
      digest.cronHealth?.ok ? "health_ok" : "health_alert",
    );
    return NextResponse.json({
      ok: true,
      dayKey: digest.dayKey,
      subject: digest.subject,
      totals: digest.totals,
      cronHealthOk: digest.cronHealth?.ok ?? true,
    });
  } catch (err) {
    console.error(err);
    await markCronFail(
      "stats",
      err instanceof Error ? err.message : "digest_failed",
    );
    return NextResponse.json({ error: "digest_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
