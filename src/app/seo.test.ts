// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getJobs } from "@/entities/experience";
import { siteUrl } from "@/shared/config";
import { buildLlmsTxt } from "./_lib/resume-markdown";
import { GET } from "./llms.txt/route";
import robots from "./robots";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists every page in every language with its translations", () => {
    const entries = sitemap();
    expect(entries.map((e) => e.url.replace(siteUrl, ""))).toEqual([
      "/", "/ru", "/uz", "/projects", "/ru/projects", "/uz/projects",
    ]);
    for (const entry of entries) {
      expect(entry.url.startsWith(siteUrl)).toBe(true);
      expect(Object.keys(entry.alternates!.languages!)).toEqual(["en", "ru", "uz"]);
    }
  });
});

describe("robots.txt", () => {
  it("allows all crawlers and points to the sitemap", () => {
    expect(robots()).toMatchObject({ rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` });
  });
});

describe("llms.txt", () => {
  it("serves the resume as plain text Markdown", async () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    const text = await response.text();
    expect(text.startsWith("# Shaxboz Mirzomurotov")).toBe(true);
    for (const job of getJobs("en")) expect(text).toContain(job.company);
    expect(text).toContain(`${siteUrl}/projects`);
  });

  it("leaves out the confidential NestEgg figures", () => {
    expect(buildLlmsTxt()).not.toMatch(/£\s?11|11M|3,000 decisions/);
  });
});
