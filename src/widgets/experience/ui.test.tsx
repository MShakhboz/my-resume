import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { jobs } from "@/entities/experience";
import { Experience } from "./ui";

describe("Experience", () => {
  it("renders one entry per job in order", () => {
    render(<Experience />);
    const section = screen.getByRole("region", { name: "Experience" });
    const companies = within(section)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(companies).toEqual(jobs.map((job) => job.company));
  });

  it("opens live sites in a new tab over https", () => {
    render(<Experience />);
    for (const site of jobs.flatMap((job) => job.liveSites)) {
      const link = screen.getByRole("link", { name: new RegExp(site.replace(/\./g, "\\.")) });
      expect(link).toHaveAttribute("href", `https://${site}`);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
