import { buildLlmsTxt } from "../_lib/resume-markdown";

export const dynamic = "force-static";

/** /llms.txt: the resume as plain Markdown, so AI assistants and their crawlers can read it without parsing the page. */
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
