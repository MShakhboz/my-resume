import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getEducation } from "@/entities/education";
import { getJobs } from "@/entities/experience";
import { getProfile } from "@/entities/profile";
import { getProjects } from "@/entities/project";
import { getSkillGroups } from "@/entities/skill";
import { locales } from "@/shared/i18n";

// Rules from HANDOFF.md: dates are years only; experience is newest first.
const YEARS_ONLY = /^\d{4} – (\d{4}|Present|настоящее время|hozirgacha)$/;
const PRESENT = /настоящее время|hozirgacha/;

const startYear = (dates: string) => Number(dates.slice(0, 4));
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe.each(locales)("resume content (%s)", (locale) => {
  const profile = getProfile(locale);
  const jobs = getJobs(locale);
  const projects = getProjects(locale);
  const skillGroups = getSkillGroups(locale);
  const education = getEducation(locale);

  it("uses years-only dates with an en dash", () => {
    for (const { dates } of [...jobs, ...education]) {
      expect(dates).toMatch(YEARS_ONLY);
    }
  });

  it("lists jobs newest first", () => {
    const years = jobs.map((job) => startYear(job.dates));
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it("has unique job ids", () => {
    expect(new Set(jobs.map((job) => job.id)).size).toBe(jobs.length);
  });

  it("stores live sites as bare hostnames", () => {
    for (const site of [...jobs.flatMap((job) => job.liveSites), ...projects.flatMap((p) => p.links)]) {
      expect(site).toMatch(/^[a-z0-9.-]+\.[a-z]{2,}$/);
    }
  });

  it("has no duplicate skills within a group", () => {
    for (const group of skillGroups) {
      expect(new Set(group.items).size).toBe(group.items.length);
    }
  });

  it("only highlights numbers the resume states", () => {
    const resumeText = [profile.summary, ...jobs.flatMap((job) => job.bullets)].join(" ");
    for (const { value } of profile.highlights) {
      expect(resumeText).toMatch(new RegExp(`(^|\\D)${escape(value)}`));
    }
  });

  it("has a file in public/ for every project screenshot", () => {
    for (const { image } of projects) {
      if (image) expect(existsSync(`public${image.src}`), image.src).toBe(true);
    }
  });

  it("contains no template placeholder content", () => {
    const text = JSON.stringify({ profile, jobs, projects, skillGroups, education });
    for (const placeholder of ["Christopher", "Lorem", "Framer Template", "TODO"]) {
      expect(text).not.toContain(placeholder);
    }
  });
});

const translated = locales.filter((locale) => locale !== "en");

describe.each(translated)("%s translation", (locale) => {
  // Facts must not differ between languages; only the wording may.
  it("keeps the same jobs, dates, work modes, stacks and links", () => {
    const facts = (l: (typeof locales)[number]) =>
      getJobs(l).map(({ id, dates, mode, stack, liveSites }) => ({
        id,
        dates: dates.replace(PRESENT, "Present"),
        mode,
        stack,
        liveSites,
      }));
    expect(facts(locale)).toEqual(facts("en"));
  });

  it("keeps the same projects, stacks and links", () => {
    const facts = (l: (typeof locales)[number]) =>
      getProjects(l).map(({ id, featured, stack, links }) => ({ id, featured, stack, links }));
    expect(facts(locale)).toEqual(facts("en"));
  });

  it("keeps the same skill groups, contacts and highlight count", () => {
    expect(getSkillGroups(locale).map((group) => group.id)).toEqual(getSkillGroups("en").map((group) => group.id));
    expect(getProfile(locale).contacts).toEqual(getProfile("en").contacts);
    expect(getProfile(locale).highlights).toHaveLength(getProfile("en").highlights.length);
  });

  it("translates every job and project", () => {
    const enBullets = new Set(getJobs("en").flatMap((job) => job.bullets));
    for (const bullet of getJobs(locale).flatMap((job) => job.bullets)) expect(enBullets.has(bullet)).toBe(false);
    const enDescriptions = new Set(getProjects("en").map((project) => project.description));
    for (const { description } of getProjects(locale)) expect(enDescriptions.has(description)).toBe(false);
  });

  it("leaves technology names untranslated", () => {
    const enItems = new Set(getSkillGroups("en").flatMap((group) => group.items));
    const techItems = getSkillGroups(locale)
      .filter((group) => !["practices"].includes(group.id))
      .flatMap((group) => group.items)
      .filter((item) => !item.includes("("));
    for (const item of techItems) expect(enItems.has(item) || item === "REST API", item).toBe(true);
  });
});
