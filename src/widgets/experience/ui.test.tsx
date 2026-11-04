import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getJobs } from "@/entities/experience";
import { getDictionary, locales } from "@/shared/i18n";
import { Experience } from "./ui";

describe.each(locales)("Experience (%s)", (locale) => {
  const jobs = getJobs(locale);

  it("renders one entry per job in order", () => {
    render(<Experience locale={locale} />);
    const section = screen.getByRole("region", { name: getDictionary(locale).nav.experience });
    const companies = within(section)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(companies).toEqual(jobs.map((job) => job.company));
  });

  it("opens live sites in a new tab over https", () => {
    render(<Experience locale={locale} />);
    for (const site of jobs.flatMap((job) => job.liveSites)) {
      const link = screen.getByRole("link", { name: new RegExp(`(^|\\s)${site.replace(/\./g, "\\.")}`) });
      expect(link).toHaveAttribute("href", `https://${site}`);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
