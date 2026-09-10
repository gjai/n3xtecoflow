import {
  extractOpenAiUsage,
  recordAiUsage,
  type AiJob,
} from "./usage";
import type { SiteId } from "@/sites/types";
import { siteAllowsAi } from "@/sites/features";

export function resolveChatConfig(): {
  apiKey: string;
  base: string;
  model: string;
  usingGemini: boolean;
} | null {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.AI_API_KEY?.trim();
  if (!apiKey) return null;

  const usingGemini =
    Boolean(process.env.GEMINI_API_KEY?.trim()) ||
    (process.env.OPENAI_BASE_URL || "").includes(
      "generativelanguage.googleapis.com",
    );
  const base =
    process.env.OPENAI_BASE_URL?.trim() ||
    (usingGemini
      ? "https://generativelanguage.googleapis.com/v1beta/openai/"
      : "https://api.openai.com/v1");
  const model =
    process.env.OPENAI_MODEL?.trim() ||
    (usingGemini ? "gemini-2.5-flash-lite" : "gpt-4o-mini");

  return { apiKey, base, model, usingGemini };
}

function stripFences(content: string): string {
  return content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function completeChat(args: {
  job: AiJob;
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  logTag?: string;
  siteId?: SiteId;
}): Promise<{ content: string; model: string } | null> {
  if (args.siteId && !siteAllowsAi(args.siteId)) return null;
  const cfg = resolveChatConfig();
  if (!cfg) return null;

  const payload: Record<string, unknown> = {
    model: cfg.model,
    temperature: args.temperature ?? 0.45,
    max_tokens: args.maxTokens ?? 8192,
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
  };
  if (!cfg.usingGemini) {
    payload.response_format = { type: "json_object" };
  }

  try {
    const res = await fetch(`${cfg.base.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      ...(args.timeoutMs
        ? { signal: AbortSignal.timeout(args.timeoutMs) }
        : {}),
    });
    if (!res.ok) {
      console.error(
        args.logTag || "ai_chat_failed",
        res.status,
        await res.text(),
      );
      return null;
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: Record<string, unknown>;
    };
    const usage = extractOpenAiUsage(json);
    await recordAiUsage({
      kind: "text",
      job: args.job,
      model: cfg.model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
    });
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return null;
    return { content: stripFences(raw), model: cfg.model };
  } catch (err) {
    console.error(args.logTag || "ai_chat_error", err);
    return null;
  }
}
