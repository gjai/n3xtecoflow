import { NextResponse } from "next/server";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import { buildEmbedPayload } from "@/lib/news/embed";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const revalidate = 120;

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Cache-Control", "public, max-age=60, s-maxage=120");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) {
    return cors(NextResponse.json({ error: "not_found" }, { status: 404 }));
  }
  const store = await readEuroMillionsStore();
  const payload = buildEmbedPayload(
    store.draws,
    `https://${site.primaryHost}`,
  );
  return cors(NextResponse.json(payload));
}
