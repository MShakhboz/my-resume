import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sectionIds } from "@/shared/config";
import { getDictionary } from "@/shared/i18n";
import { SectionNav } from "./ui";

// jsdom has no IntersectionObserver; this stub lets the test report which section is in view.
let report: IntersectionObserverCallback = () => {};
class StubObserver {
  constructor(callback: IntersectionObserverCallback) {
    report = callback;
  }
  observe() {}
  disconnect() {}
}

afterEach(() => vi.unstubAllGlobals());

describe("SectionNav", () => {
  it("links every section", () => {
    render(<SectionNav variant="sidebar" locale="en" />);
    for (const id of sectionIds) {
      expect(screen.getByRole("link", { name: getDictionary("en").nav[id] })).toHaveAttribute("href", `#${id}`);
    }
  });

  it("uses the page's language", () => {
    render(<SectionNav variant="sidebar" locale="ru" />);
    expect(screen.getByRole("navigation", { name: "Разделы" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Опыт" })).toHaveAttribute("href", "#experience");
  });

  it("marks the section in view as the current location", () => {
    vi.stubGlobal("IntersectionObserver", StubObserver);
    for (const id of sectionIds) {
      const section = document.createElement("section");
      section.id = id;
      document.body.append(section);
    }
    render(<SectionNav variant="bar" locale="en" />);

    act(() =>
      report(
        [{ isIntersecting: true, target: document.getElementById("skills")! } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    );

    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });
});
