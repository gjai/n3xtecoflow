/**
 * Bing Webmaster URL Submission API (JSON).
 * La clé est un secret : Coolify `BING_WEBMASTER_API_KEY`, jamais en dur.
 * Chaque hôte doit être vérifié dans le même compte Bing Webmaster.
 */
const ENDPOINT = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch";
const BATCH_MAX = 500;

function apiKey(): string | undefined {
  const key = process.env.BING_WEBMASTER_API_KEY?.trim();
  return key || undefined;
}

export async function submitBingWebmaster(
  urls: string[],
  host: string,
): Promise<void> {
  if (process.env.BING_WEBMASTER_DISABLED === "1") return;
  const key = apiKey();
  if (!key) return;
  const unique = [...new Set(urls)].slice(0, BATCH_MAX);
  if (unique.length === 0) return;
  const siteUrl = `https://${host}`;
  try {
    const res = await fetch(`${ENDPOINT}?apikey=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ siteUrl, urlList: unique }),
    });
    if (!res.ok) {
      console.error(
        "bing_webmaster_fail",
        host,
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("bing_webmaster_error", host, err);
  }
}
