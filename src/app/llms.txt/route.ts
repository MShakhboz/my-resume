import { getArchive } from "@/entities/archive";
import { getEducation } from "@/entities/education";
import { getJobs } from "@/entities/experience";
import { getProfile } from "@/entities/profile";
import { getSkillGroups } from "@/entities/skill";
import { resumePdfs, siteUrl } from "@/shared/config";
import { pagePath } from "@/shared/i18n";

export const dynamic = "force-static";

/**
 * /llms.txt: the resume as plain Markdown (llmstxt.org), so AI assistants and their crawlers can read
 * it without parsing the page. Built from the same English data as the site.
 */
export function buildLlmsTxt() {
  const profile = getProfile("en");
  const contacts = profile.contacts.map((c) => `${c.id === "telegram" ? "Telegram/WhatsApp" : c.label}: ${c.href}`);
  const pdfLabels = { a4: "A4", letter: "US Letter", ru: "Russian" } as const;

  return [
    `# ${profile.name}`,
    "",
    `> ${profile.headline}. ${profile.summary}`,
    "",
    `${profile.location}. ${profile.availability}.`,
    "",
    ...contacts.map((c) => `- ${c}`),
    "",
    "## Pages",
    "",
    `- [Resume (English)](${siteUrl}${pagePath("en")})`,
    `- [Резюме (Russian)](${siteUrl}${pagePath("ru")})`,
    `- [Rezyume (Uzbek)](${siteUrl}${pagePath("uz")})`,
    `- [All projects](${siteUrl}${pagePath("en", "projects")}): every project, with year, company, stack and link`,
    ...resumePdfs.map((pdf) => `- [PDF resume, ${pdfLabels[pdf.id]}](${siteUrl}${pdf.href})`),
    "",
    "## Experience",
    "",
    ...getJobs("en").flatMap((job) => [
      `### ${job.title}, ${job.company} (${job.location}), ${job.dates}`,
      "",
      ...job.bullets.map((b) => `- ${b}`),
      `- Stack: ${job.stack.join(", ")}`,
      ...(job.liveSites.length ? [`- Live: ${job.liveSites.map((s) => `https://${s}`).join(", ")}`] : []),
      "",
    ]),
    "## Projects",
    "",
    ...getArchive("en").map(
      (p) => `- ${p.name} (${p.year}): ${p.description}${p.link ? ` https://${p.link}` : ""}`
    ),
    "",
    "## Skills",
    "",
    ...getSkillGroups("en").map((g) => `- ${g.label}: ${g.items.join(", ")}`),
    "",
    "## Education",
    "",
    ...getEducation("en").map((e) => `- ${e.field}, ${e.school}, ${e.dates}`),
    "",
    "## Languages",
    "",
    `- ${profile.languages.join(", ")}`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
