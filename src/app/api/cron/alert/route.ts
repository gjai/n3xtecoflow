import { NextResponse } from "next/server";
import { sendDigestEmail } from "@/lib/ops/digest";
import { markCronFail } from "@/lib/cron/status";

export const maxDuration = 30;

function authorized(request: Request) {
  const secret = process.env.NEWS_CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  return bearer === secret || query === secret;
}

/** Called by GitHub Actions on workflow failure. */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { job?: string; workflow?: string; runUrl?: string; error?: string } =
    {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    /* empty */
  }

  const job = (body.job || "alert") as
    | "news"
    | "catalog"
    | "guides"
    | "amazon"
    | "stats"
    | "alert";
  const label = body.workflow || job;
  const detail = [
    body.error || "workflow_failed",
    body.runUrl ? `run: ${body.runUrl}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  await markCronFail(job, detail);

  const subject = `[n3xtecoflow] ALERTE cron — ${label}`;
  const text = [
    `Échec d’un cron GitHub Actions / pipeline.`,
    `Workflow : ${label}`,
    `Job id : ${job}`,
    `Détail : ${detail}`,
    `Horodatage : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
    "",
    `Vérifier Actions GitHub et les logs Coolify.`,
  ].join("\n");

  const sent = await sendDigestEmail({ subject, text });
  return NextResponse.json(
    { ok: sent.ok, emailed: sent.ok, error: sent.error },
    { status: sent.ok ? 200 : 502 },
  );
}
