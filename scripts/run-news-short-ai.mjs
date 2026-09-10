/**
 * À exécuter DANS le conteneur Coolify : utilise GEMINI_API_KEY / OPENAI_API_KEY
 * déjà présents en env. Ne loggue jamais la clé.
 */
import { readFileSync } from "node:fs";

const system = readFileSync("/tmp/news-short-system.txt", "utf8");
const user = readFileSync("/tmp/news-short-user.txt", "utf8");
const apiKey =
  process.env.GEMINI_API_KEY?.trim() ||
  process.env.OPENAI_API_KEY?.trim() ||
  process.env.AI_API_KEY?.trim();
if (!apiKey) {
  console.error("no_ai_key");
  process.exit(2);
}

const usingGemini =
  Boolean(process.env.GEMINI_API_KEY?.trim()) ||
  (process.env.OPENAI_BASE_URL || "").includes(
    "generativelanguage.googleapis.com",
  );
const base = (
  process.env.OPENAI_BASE_URL?.trim() ||
  (usingGemini
    ? "https://generativelanguage.googleapis.com/v1beta/openai/"
    : "https://api.openai.com/v1")
).replace(/\/$/, "");
const model =
  process.env.OPENAI_MODEL?.trim() ||
  (usingGemini ? "gemini-2.5-flash-lite" : "gpt-4o-mini");

const payload = {
  model,
  temperature: 0.7,
  max_tokens: 2200,
  messages: [
    { role: "system", content: system },
    { role: "user", content: user },
  ],
};

const res = await fetch(`${base}/chat/completions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
const raw = await res.text();
if (!res.ok) {
  console.error("ai_http", res.status, raw.slice(0, 500));
  process.exit(1);
}
let data;
try {
  data = JSON.parse(raw);
} catch {
  console.error("ai_json", raw.slice(0, 500));
  process.exit(1);
}
const content = data?.choices?.[0]?.message?.content;
if (!content || typeof content !== "string") {
  console.error("ai_empty");
  process.exit(1);
}
process.stdout.write(content);
console.error("ai_ok", model, content.length);
