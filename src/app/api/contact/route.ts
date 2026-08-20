import { NextResponse } from "next/server";
import { sendResendEmail } from "@/lib/mail/resend";
import { getSiteByHost } from "@/sites";
import { clientIp, isRateLimited } from "@/lib/http/rate-limit";
import {
  contactOriginOk,
  isSpammyContact,
  verifyContactGuard,
} from "@/lib/http/form-guard";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL?.trim() || "djgjai@gmail.com";

type Body = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  guard?: string;
};

function silentOk() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  if (!contactOriginOk(request)) {
    return silentOk();
  }

  const ip = clientIp(request);
  if (
    isRateLimited(`contact-ip:${ip}`, { windowMs: 60_000, max: 1 }) ||
    isRateLimited(`contact-ip-hour:${ip}`, { windowMs: 3600_000, max: 5 })
  ) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.website) return silentOk();
  if (!verifyContactGuard(body.guard)) {
    return NextResponse.json({ error: "invalid_guard" }, { status: 400 });
  }

  const name = (body.name || "").trim().slice(0, 120);
  const email = (body.email || "").trim().slice(0, 160);
  const message = (body.message || "").trim().slice(0, 4000);

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  if (
    isRateLimited(`contact-mail:${email.toLowerCase()}`, {
      windowMs: 3600_000,
      max: 3,
    })
  ) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (isSpammyContact({ name, email, message })) {
    return silentOk();
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
