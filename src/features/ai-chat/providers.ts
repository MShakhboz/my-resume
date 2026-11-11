// Where the resume chat gets its answers: free models, tried in order until one answers.
// Server only: the keys come from environment variables and never reach the browser.

export type Attempt = {
  /** For logs and tests. */
  label: string;
  url: string;
  key: string;
  /** Extra request fields for this provider and model (model name, reasoning switches). */
  body: Record<string, unknown>;
  headers?: Record<string, string>;
};

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Google's free tier (limits per model, per project, checked in AI Studio Nov 2026): the Flash Lite
 * models allow 500 requests a day each, Gemma 4 31B 14,400 a day but only 16K tokens a minute.
 * Each model has its own quota, so falling back to the next one also works when the first is used up.
 * Thinking settings were tested per model (Nov 2026): 3.5 Flash Lite rejects reasoning_effort "none"
 * but answers directly without it; Gemma rejects "none" and, with no setting, writes its reasoning
 * into the answer, so it gets "minimal" (clean, but about 14 s).
 */
export const GEMINI_MODELS: { model: string; options: Record<string, unknown> }[] = [
  { model: "gemini-3.5-flash-lite", options: {} },
  { model: "gemini-3.1-flash-lite", options: { reasoning_effort: "none" } },
  { model: "gemma-4-31b-it", options: { reasoning_effort: "minimal" } },
];

/**
 * OpenRouter's free models, the last resort (50 free requests a day per account). OpenRouter tries
 * them in order itself. Each must allow turning reasoning off, or it spends the token budget
 * thinking and returns no answer.
 */
export const OPENROUTER_MODELS = [
  "nvidia/nemotron-3.5-super-vl:free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-31b-it:free",
];

/** The attempts for this server's keys, in order. Empty when no key is set. */
export function buildAttempts(env: Record<string, string | undefined>, siteUrl: string): Attempt[] {
  const attempts: Attempt[] = [];
  if (env.GEMINI_API_KEY) {
    for (const { model, options } of GEMINI_MODELS) {
      attempts.push({ label: `gemini:${model}`, url: GEMINI_URL, key: env.GEMINI_API_KEY, body: { model, ...options } });
    }
  }
  if (env.OPENROUTER_API_KEY) {
    attempts.push({
      label: "openrouter",
      url: OPENROUTER_URL,
      key: env.OPENROUTER_API_KEY,
      body: { models: OPENROUTER_MODELS, reasoning: { enabled: false } },
      headers: { "HTTP-Referer": siteUrl, "X-Title": "Shaxboz Mirzomurotov resume" },
    });
  }
  return attempts;
}
