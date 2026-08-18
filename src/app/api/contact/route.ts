import { NextResponse } from "next/server";
import { sendResendEmail } from "@/lib/mail/resend";
import { getSiteByHost } from "@/sites";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL?.trim() || "djgjai@gmail.com";
const recent = new Map<string, number>();

type Body = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const now = Date.now();
  const last = recent.get(ip) || 0;
  if (now - last < 15_000) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  recent.set(ip, now);

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || "").trim().slice(0, 120);
  const email = (body.email || "").trim().slice(0, 160);
  const message = (body.message || "").trim().slice(0, 4000);

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const site = getSiteByHost(request.headers.get("host"));
  const sent = await sendResendEmail({
    to: CONTACT_TO,
    replyTo: email,
    subject: `[${site.brand.name}] Message de ${name}`,
    text: [
      `Site : ${site.brand.name} (${site.primaryHost})`,
      `Nom : ${name}`,
      `E-mail : ${email}`,
      "",
      message,
    ].join("\n"),
  });

  if (!sent.ok) {
    const status = sent.error === "mail_unconfigured" ? 503 : 502;
    return NextResponse.json({ error: sent.error || "send_failed" }, { status });
  }

  return NextResponse.json({ ok: true });
}
