import { NextResponse } from "next/server";
import { revalidateLotteryPagesInRequest } from "@/lib/euromillions/live";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const dynamic = "force-dynamic";

/** Revalidate ISR depuis un vrai Request — le poll VPS n’a pas de store Next. */
export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  revalidateLotteryPagesInRequest();
  return NextResponse.json({ ok: true });
}
