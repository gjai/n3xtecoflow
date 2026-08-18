import { NextResponse } from "next/server";
import { requestAlertSubscribe } from "@/lib/euromillions/alerts";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const dynamic = "force-dynamic";

const recent = new Map<string, number>();

type Body = {
  email?: string;
  locale?: string;
  age?: boolean;
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
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

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
    return NextResponse.json({ ok: true, already: false });
  }

  const result = await requestAlertSubscribe({
    email: body.email || "",
    locale: body.locale || "fr",
    ageConfirmed: body.age === true,
  });
  if (!result.ok) {
    const status =
      result.error === "mail_unconfigured"
        ? 503
        : result.error === "age" || result.error === "invalid"
          ? 400
          : 502;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true, already: result.already });
}
