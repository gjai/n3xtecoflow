import { NextResponse } from "next/server";

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

  const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: `[EcoFlow Stream] Message de ${name}`,
      _template: "table",
      _captcha: "false",
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
