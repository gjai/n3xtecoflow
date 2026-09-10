/**
 * Hors pipeline horaire : génère 3 images 9:16 pour enrichir le pack stock.
 * Les Reels histoire lisent public/images/euromillions/news-short/, pas Gemini.
 * Lit /tmp/actu-short.json, écrit /tmp/news-short-scene-0.jpg …
 */
import { readFileSync, writeFileSync } from "node:fs";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  console.error("no_ai_key");
  process.exit(2);
}

const script = JSON.parse(readFileSync("/tmp/actu-short.json", "utf8"));
const visuels = Array.isArray(script.visuels) ? script.visuels.slice(0, 3) : [];
while (visuels.length < 3) {
  visuels.push({
    plan: "cinematic lottery ticket still",
    fond: "navy",
    imagePrompt: "",
  });
}

const primary =
  process.env.NEWS_IMAGE_MODEL?.trim() || "gemini-3.1-flash-lite-image";
const fallback = "gemini-2.5-flash-image";

function promptFor(v) {
  const custom = String(v.imagePrompt || "").trim();
  const scene = custom || String(v.plan || "crumpled lottery ticket");
  const fact = String(script.fact || script.title || "").slice(0, 120);
  const mood =
    v.fond === "gold"
      ? "warm gold lighting"
      : v.fond === "cold"
        ? "cold blue cinematic light"
        : v.fond === "warm"
          ? "warm indoor tungsten light"
          : "dark navy cinematic light";
  return `Vertical 9:16 photoreal cinematic still, no text, no letters, no logo, no watermark. Subject: ${scene}. Story: ${fact}. Lighting: ${mood}. Shallow depth of field, film still, lottery atmosphere, Europe.`;
}

function imageConfig(model) {
  const imageConfig = { aspectRatio: "9:16" };
  if (/gemini-3/i.test(model)) imageConfig.imageSize = "1K";
  return { responseModalities: ["IMAGE"], imageConfig };
}

async function oneImage(model, prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: imageConfig(model),
      }),
      signal: AbortSignal.timeout(90_000),
    },
  );
  const raw = await res.text();
  if (!res.ok) {
    console.error("img_http", model, res.status, raw.slice(0, 200));
    return null;
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  const parts = json?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const data = part.inlineData?.data || part.inline_data?.data;
    if (!data) continue;
    return Buffer.from(data, "base64");
  }
  return null;
}

const models = primary === fallback ? [primary] : [primary, fallback];
let ok = 0;
for (let i = 0; i < visuels.length; i += 1) {
  const prompt = promptFor(visuels[i]);
  let buf = null;
  for (const model of models) {
    buf = await oneImage(model, prompt);
    if (buf && buf.length > 4000) break;
    buf = null;
  }
  if (!buf) {
    console.error("img_fail", i);
    continue;
  }
  const file = `/tmp/news-short-scene-${i}.jpg`;
  writeFileSync(file, buf);
  console.error("img_ok", i, buf.length);
  ok += 1;
}
if (!ok) process.exit(1);
console.log(JSON.stringify({ scenes: ok }));
