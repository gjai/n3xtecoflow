import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DrawBalls } from "@/components/EuroMillionsHome";
import { formatEuroMillionsLongDate } from "@/lib/euromillions/datetime";
import {
  getLatestDraw,
  isEuroMillionsDrawPublished,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const revalidate = 120;

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Widget résultats EuroMillions",
};

export default async function EmbedResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const published = isEuroMillionsDrawPublished(latest) ? latest : null;
  const origin = `https://${site.primaryHost}`;

  return (
    <div className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        EuroMillions
      </p>
      {published ? (
        <>
          <p className="mt-2 text-sm font-semibold text-[var(--heading)]">
            {formatEuroMillionsLongDate(published.date, locale)}
          </p>
          <div className="mt-3">
            <DrawBalls
              draw={published}
              ballsLabel="Boules"
              starsLabel="Étoiles"
              compact
            />
          </div>
          {published.myMillionCode ? (
            <p className="mt-2 font-mono text-xs text-[var(--accent)]">
              My Million {published.myMillionCode}
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--muted)]">Tirage à paraître.</p>
      )}
      <p className="mt-4 text-xs text-[var(--muted)]">
        <a href={`${origin}/fr`} className="font-semibold text-[var(--heading)] underline">
          euromillions-resultats.fr
        </a>
      </p>
    </div>
  );
}
