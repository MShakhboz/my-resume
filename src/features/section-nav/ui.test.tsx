import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { navItems } from "@/shared/config";
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
    render(<SectionNav variant="sidebar" />);
    for (const { id, label } of navItems) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `#${id}`);
    }
  });

  it("marks the section in view as the current location", () => {
    vi.stubGlobal("IntersectionObserver", StubObserver);
    for (const { id } of navItems) {
      const section = document.createElement("section");
      section.id = id;
      document.body.append(section);
    }
    render(<SectionNav variant="bar" />);

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
