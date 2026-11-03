import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProfile } from "@/entities/profile";
import { locales, pagePath } from "@/shared/i18n";
import { About } from "./ui";

describe.each(locales)("About (%s)", (locale) => {
  it("links the project total to the full list", () => {
    render(<About locale={locale} />);
    const total = getProfile(locale).highlights.find((item) => item.source === "project-count")!;
    expect(screen.getByRole("link", { name: total.label })).toHaveAttribute("href", pagePath(locale, "projects"));
  });
});
