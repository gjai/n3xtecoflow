import { submitBingWebmaster } from "@/lib/seo/bing";
import { submitIndexNow } from "@/lib/seo/indexnow";

/** IndexNow (Bing/Yandex) + soumission directe Bing Webmaster. */
export async function notifySearchEngines(
  urls: string[],
  host: string,
): Promise<void> {
  await Promise.all([
    submitIndexNow(urls, host),
    submitBingWebmaster(urls, host),
  ]);
}
