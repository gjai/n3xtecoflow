import { NextResponse } from "next/server";
import {
  buildDailyDigest,
  parisDateKey,
  sendDigestEmail,
  shiftParisDateKey,
} from "@/lib/ops/digest";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (
    !cronAuthorized(
      request,
      process.env.STATS_CRON_SECRET || process.env.NEWS_CRON_SECRET,
    )
  ) {
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
