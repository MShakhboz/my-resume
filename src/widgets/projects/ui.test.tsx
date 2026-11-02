import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { getProjects } from "@/entities/project";
import { getDictionary, locales } from "@/shared/i18n";
import { Projects } from "./ui";

describe.each(locales)("Projects (%s)", (locale) => {
  const t = getDictionary(locale);
  const projects = getProjects(locale);
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  const visibleTitles = () =>
    within(screen.getByRole("region", { name: t.nav.projects }))
      .queryAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent?.replace(t.newTab, ""));

  it("shows only the featured projects at first", () => {
    render(<Projects locale={locale} />);
    expect(visibleTitles()).toEqual(featured.map((project) => project.title));
  });

  it("reveals and hides the other projects with the toggle", async () => {
    const user = userEvent.setup();
    render(<Projects locale={locale} />);
    const toggle = screen.getByRole("button", { name: t.moreProjects(more.length) });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName(t.fewerProjects);
    expect(visibleTitles()).toEqual([...featured, ...more].map((project) => project.title));

    await user.click(toggle);
    expect(visibleTitles()).toEqual(featured.map((project) => project.title));
  });

  it("links each project's sites in a new tab over https", async () => {
    const user = userEvent.setup();
    render(<Projects locale={locale} />);
    await user.click(screen.getByRole("button", { name: t.moreProjects(more.length) }));
    for (const site of projects.flatMap((project) => project.links)) {
      const link = screen.getByRole("link", { name: new RegExp(site.replace(/\./g, "\\.")) });
      expect(link).toHaveAttribute("href", `https://${site}`);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

describe("Russian project count", () => {
  it("uses the right plural form", () => {
    const { moreProjects } = getDictionary("ru");
    expect([1, 2, 4, 5, 11, 21].map(moreProjects)).toEqual([
      "Ещё 1 проект",
      "Ещё 2 проекта",
      "Ещё 4 проекта",
      "Ещё 5 проектов",
      "Ещё 11 проектов",
      "Ещё 21 проект",
    ]);
  });
});
