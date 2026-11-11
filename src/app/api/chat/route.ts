import {
  buildSystemPrompt,
  CHAT_LIMITS,
  createRateLimiter,
  DEFAULT_MODELS,
  validateMessages,
} from "@/features/ai-chat/server";
import { siteUrl } from "@/shared/config";
import { toLocale } from "@/shared/i18n";
import { buildLlmsTxt } from "../../_lib/resume-markdown";

// The resume chat. The OpenRouter key stays on the server (OPENROUTER_API_KEY); the answer streams
// back as plain text.
export const dynamic = "force-dynamic";

const allow = createRateLimiter(CHAT_LIMITS);
const resume = buildLlmsTxt();

const json = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return json(503, "unavailable");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!allow(ip)) return json(429, "rate_limited");

  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, "bad_request");
  }
  const messages = validateMessages(body.messages);
  if (!messages) return json(400, "bad_request");
  const locale = toLocale([typeof body.locale === "string" ? body.locale : ""]);

  const models = process.env.OPENROUTER_MODEL
    ? [process.env.OPENROUTER_MODEL, ...DEFAULT_MODELS.filter((m) => m !== process.env.OPENROUTER_MODEL)]
    : DEFAULT_MODELS;

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-Title": "Shaxboz Mirzomurotov resume",
    },
    body: JSON.stringify({
      models,
      stream: true,
      // Answer directly: hidden "thinking" would use up max_tokens and slow the reply.
      reasoning: { enabled: false },
      max_tokens: 300,
      temperature: 0.1,
      messages: [{ role: "system", content: buildSystemPrompt(resume, locale) }, ...messages],
    }),
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    return json(upstream?.status === 429 ? 429 : 502, upstream?.status === 429 ? "rate_limited" : "upstream");
  }
  return new Response(toTextStream(upstream.body), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** Gives up on a free model that stops sending mid-answer, so the visitor isn't left waiting. */
const STALL_MS = 12_000;
const TOTAL_MS = 30_000;

/** OpenRouter's server-sent events → just the answer's text, ended cleanly if the model stalls. */
function toTextStream(events: ReadableStream<Uint8Array>) {
  const reader = events.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const deadline = Date.now() + TOTAL_MS;
  // Measured from the last piece of answer text: OpenRouter's keep-alive comments don't count.
  let lastText = Date.now();
  let buffer = "";

  const timeLeft = () => Math.min(lastText + STALL_MS, deadline) - Date.now();
  const nextChunk = () =>
    Promise.race([
      reader.read(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), Math.max(0, timeLeft()))),
    ]);

  return new ReadableStream<Uint8Array>({
    // Keeps reading until it has text to hand on or the answer ends: a pull that returns without
    // enqueueing anything is not called again, which would leave the visitor waiting forever.
    async pull(controller) {
      for (;;) {
        const result = timeLeft() > 0 ? await nextChunk().catch(() => null) : null;
        if (!result || result.done) {
          void reader.cancel().catch(() => {});
          controller.close();
          return;
        }
        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        let sent = false;
        for (const line of lines) {
          if (line.trim() === "data: [DONE]") {
            // The answer is complete; don't wait for the upstream connection to close.
            void reader.cancel().catch(() => {});
            controller.close();
            return;
          }
          if (!line.startsWith("data: ")) continue;
          try {
            const choice = JSON.parse(line.slice(6)).choices?.[0];
            if (choice?.delta?.content) {
              controller.enqueue(encoder.encode(choice.delta.content));
              lastText = Date.now();
              sent = true;
            }
            if (choice?.finish_reason) {
              void reader.cancel().catch(() => {});
              controller.close();
              return;
            }
          } catch {
            // Keep-alive comments and partial lines are skipped.
          }
        }
        if (sent) return;
      }
    },
    cancel() {
      void reader.cancel().catch(() => {});
    },
  });
}
