import { describe, expect, it } from "vitest";
import { education } from "@/entities/education";
import { jobs } from "@/entities/experience";
import { profile } from "@/entities/profile";
import { skillGroups } from "@/entities/skill";

// Rules from HANDOFF.md: dates are years only; experience is newest first.
const YEARS_ONLY = /^\d{4} – (\d{4}|Present)$/;

const startYear = (dates: string) => Number(dates.slice(0, 4));

describe("resume content", () => {
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
    for (const site of jobs.flatMap((job) => job.liveSites)) {
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
      expect(resumeText).toMatch(new RegExp(`(^|\\D)${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    }
  });

  it("contains no template placeholder content", () => {
    const text = JSON.stringify({ profile, jobs, skillGroups, education });
    for (const placeholder of ["Christopher", "Lorem", "Framer Template", "TODO"]) {
      expect(text).not.toContain(placeholder);
    }
  });
});
