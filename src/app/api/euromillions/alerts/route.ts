import { NextResponse } from "next/server";
import { requestAlertSubscribe } from "@/lib/euromillions/alerts";
import { clientIp, isRateLimited } from "@/lib/http/rate-limit";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const dynamic = "force-dynamic";

type Body = {
  email?: string;
  locale?: string;
  age?: boolean;
  website?: string;
  games?: unknown;
};

export async function POST(request: Request) {
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const ip = clientIp(request);
  if (
    isRateLimited(`alert-ip:${ip}`, { windowMs: 45_000, max: 1 }) ||
    isRateLimited(`alert-ip-hour:${ip}`, { windowMs: 3600_000, max: 6 })
  ) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

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
    games: body.games,
  });
  if (!result.ok) {
    const status =
      result.error === "mail_unconfigured"
        ? 503
        : result.error === "rate_limited"
          ? 429
          : result.error === "age" ||
              result.error === "invalid" ||
              result.error === "games"
            ? 400
            : 502;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true, already: result.already });
}
