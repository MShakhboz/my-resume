import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { projects } from "@/entities/project";
import { Projects } from "./ui";

const featured = projects.filter((project) => project.featured);
const more = projects.filter((project) => !project.featured);

const visibleTitles = () =>
  within(screen.getByRole("region", { name: "Projects" }))
    .queryAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent?.replace("(opens in a new tab)", ""));

describe("Projects", () => {
  it("shows only the featured projects at first", () => {
    render(<Projects />);
    expect(visibleTitles()).toEqual(featured.map((project) => project.title));
  });

  it("reveals and hides the other projects with the toggle", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const toggle = screen.getByRole("button", { name: `View ${more.length} more projects` });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Show fewer projects");
    expect(visibleTitles()).toEqual([...featured, ...more].map((project) => project.title));

    await user.click(toggle);
    expect(visibleTitles()).toEqual(featured.map((project) => project.title));
  });

  it("links each project's sites in a new tab over https", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole("button", { name: /more projects/ }));
    for (const site of projects.flatMap((project) => project.links)) {
      const link = screen.getByRole("link", { name: new RegExp(site.replace(/\./g, "\\.")) });
      expect(link).toHaveAttribute("href", `https://${site}`);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
