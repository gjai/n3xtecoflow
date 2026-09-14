import { revalidateLotteryPages } from "@/lib/euromillions/live";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import { notifySearchEngines } from "@/lib/seo/notify";
import { revalidatePath } from "next/cache";
import {
  buildOriginalEuroMillionsArticles,
  keepOriginalEuroMillionsNews,
} from "./original-euromillions";
import { pruneLowQualityNewsArticles } from "./quality";
import { readNewsStore, writeNewsStore } from "./store";
import type { NewsArticle } from "./types";

const ORIGIN = "https://euromillions-resultats.fr";

export async function publishOriginalEuroMillionsNews(): Promise<{
  created: NewsArticle[];
  purged: number;
}> {
  const [em, store] = await Promise.all([
    readEuroMillionsStore(),
    readNewsStore(),
  ]);
  const before = store.articles.length;
  store.articles = keepOriginalEuroMillionsNews(store.articles);
  const purged = before - store.articles.length;
  const created = buildOriginalEuroMillionsArticles(em.draws, store.articles);
  if (!created.length && !purged) {
    return { created: [], purged: 0 };
  }
  store.articles = [...created, ...store.articles];
  const quality = pruneLowQualityNewsArticles(store.articles);
  store.articles = quality.kept;
  const keptCreated = created.filter((article) =>
    store.articles.some((kept) => kept.slug === article.slug),
  );
  await writeNewsStore(store);
  revalidatePath("/[locale]/actualites", "page");
  revalidatePath("/[locale]/actualites/[slug]", "page");
  revalidatePath("/[locale]", "page");
  revalidatePath("/feed.xml");
  revalidatePath("/[locale]/feed.xml");
  revalidateLotteryPages();
  if (keptCreated.length) {
    await notifySearchEngines(
      [
        `${ORIGIN}/sitemap.xml`,
        `${ORIGIN}/feed.xml`,
        ...keptCreated.map((a) => `${ORIGIN}/fr/actualites/${a.slug}`),
      ],
      "euromillions-resultats.fr",
    );
  }
  return { created: keptCreated, purged };
}
