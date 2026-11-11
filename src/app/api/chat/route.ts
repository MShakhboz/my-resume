import {
  buildAttempts,
  buildSystemPrompt,
  CHAT_LIMITS,
  createRateLimiter,
  isDailyLimit,
  validateMessages,
} from "@/features/ai-chat/server";
import type { Attempt, ChatError } from "@/features/ai-chat/server";
import { siteUrl } from "@/shared/config";
import { toLocale } from "@/shared/i18n";
import { buildLlmsTxt } from "../../_lib/resume-markdown";

// The resume chat. Tries free models in order (Google Gemini first, then OpenRouter) until one
// starts answering, and streams the answer back as plain text. Keys stay on the server.
export const dynamic = "force-dynamic";

const checkLimit = createRateLimiter(CHAT_LIMITS);
const resume = buildLlmsTxt();

/** A model that sends no answer text for this long is skipped (before it starts) or cut off (after). */
const STALL_MS = 12_000;
const TOTAL_MS = 30_000;

const json = (status: number, error: ChatError | "bad_request") => Response.json({ error }, { status });

export async function POST(request: Request) {
  const attempts = buildAttempts(process.env, siteUrl);
  if (attempts.length === 0) return json(503, "unavailable");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const limited = checkLimit(ip);
  if (limited) return json(429, limited === "day" ? "daily_limit" : "rate_limited");

  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, "bad_request");
  }
  const messages = validateMessages(body.messages);
  if (!messages) return json(400, "bad_request");
  const locale = toLocale([typeof body.locale === "string" ? body.locale : ""]);
  const conversation = [{ role: "system", content: buildSystemPrompt(resume, locale) }, ...messages];

  const deadline = Date.now() + TOTAL_MS;
  const limits: boolean[] = []; // one entry per 429: true when it was a daily quota
  for (const attempt of attempts) {
    if (Date.now() >= deadline) break;
    const answer = await tryAttempt(attempt, conversation, deadline, limits);
    if (answer) {
      return new Response(answer, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
  }
  if (limits.length > 0) return json(429, limits.every(Boolean) ? "daily_limit" : "rate_limited");
  return json(502, "generic");
}

/** One model: returns the answer stream once the first text arrives, or null to try the next one. */
async function tryAttempt(
  attempt: Attempt,
  conversation: { role: string; content: string }[],
  deadline: number,
  limits: boolean[]
): Promise<ReadableStream<Uint8Array> | null> {
  const response = await fetch(attempt.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${attempt.key}`, "Content-Type": "application/json", ...attempt.headers },
    body: JSON.stringify({
      ...attempt.body,
      stream: true,
      max_tokens: 300,
      temperature: 0.1,
      messages: conversation,
    }),
    signal: AbortSignal.timeout(Math.max(1, deadline - Date.now())),
  }).catch(() => null);

  if (!response?.ok || !response.body) {
    if (response?.status === 429) limits.push(isDailyLimit(await response.text().catch(() => "")));
    return null;
  }
  const events = sseText(response.body, deadline);
  const first = await events.next();
  if (first === null) return null; // no answer text in time: try the next model

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(first));
    },
    async pull(controller) {
      const text = await events.next();
      if (text === null) controller.close();
      else controller.enqueue(encoder.encode(text));
    },
    cancel() {
      events.cancel();
    },
  });
}

/**
 * Reads an OpenAI-style server-sent event stream and hands out the answer text piece by piece.
 * `next()` resolves to null when the answer is complete, or when no text arrives for STALL_MS
 * (keep-alive comments don't count), so a stuck model never leaves the visitor waiting.
 */
function sseText(body: ReadableStream<Uint8Array>, deadline: number) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const pending: string[] = [];
  let buffer = "";
  let finished = false;

  const cancel = () => {
    finished = true;
    void reader.cancel().catch(() => {});
  };

  // Some models (Gemma) can write their private reasoning into the answer as <thought>…</thought>;
  // visitors must never see it.
  let inThought = false;
  const hideThoughts = (text: string) => {
    let visible = "";
    let rest = text;
    while (rest) {
      if (inThought) {
        const end = rest.indexOf("</thought>");
        if (end === -1) return visible;
        inThought = false;
        rest = rest.slice(end + "</thought>".length);
      } else {
        const start = rest.indexOf("<thought>");
        if (start === -1) return visible + rest;
        visible += rest.slice(0, start);
        inThought = true;
        rest = rest.slice(start + "<thought>".length);
      }
    }
    return visible;
  };

  async function next(): Promise<string | null> {
    const until = Math.min(Date.now() + STALL_MS, deadline);
    for (;;) {
      if (pending.length > 0) return pending.shift()!;
      if (finished) return null;
      const left = until - Date.now();
      const result =
        left > 0
          ? await Promise.race([
              reader.read(),
              new Promise<null>((resolve) => setTimeout(() => resolve(null), left)),
            ]).catch(() => null)
          : null;
      if (!result || result.done) {
        cancel();
        continue;
      }
      buffer += decoder.decode(result.value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.trim() === "data: [DONE]") {
          cancel();
          break;
        }
        if (!line.startsWith("data: ")) continue;
        try {
          const choice = JSON.parse(line.slice(6)).choices?.[0];
          if (choice?.delta?.content) {
            const visible = hideThoughts(choice.delta.content);
            if (visible) pending.push(visible);
          }
          if (choice?.finish_reason) {
            cancel();
            break;
          }
        } catch {
          // Keep-alive comments and partial lines are skipped.
        }
      }
    }
  }

  return { next, cancel };
}
