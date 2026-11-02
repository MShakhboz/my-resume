import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/entities/project";
import { Projects } from "./ui";

describe("Projects", () => {
  it("renders one entry per project in order", () => {
    render(<Projects />);
    const section = screen.getByRole("region", { name: "Projects" });
    const titles = within(section)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent?.replace("(opens in a new tab)", ""));
    expect(titles).toEqual(projects.map((project) => project.title));
  });

  it("links each project's sites in a new tab over https", () => {
    render(<Projects />);
    for (const site of projects.flatMap((project) => project.links)) {
      const link = screen.getByRole("link", { name: new RegExp(site.replace(/\./g, "\\.")) });
      expect(link).toHaveAttribute("href", `https://${site}`);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
