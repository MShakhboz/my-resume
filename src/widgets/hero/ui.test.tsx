import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProfile } from "@/entities/profile";
import { resumePdfs } from "@/shared/config";
import { getDictionary, localePath, locales } from "@/shared/i18n";
import { Hero } from "./ui";

describe.each(locales)("Hero (%s)", (locale) => {
  const profile = getProfile(locale);
  const t = getDictionary(locale);

  it("renders the name as the page heading", () => {
    render(<Hero locale={locale} />);
    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
  });

  it("links every contact channel", () => {
    render(<Hero locale={locale} />);
    const list = screen.getByRole("list", { name: t.contactLinks });
    for (const contact of profile.contacts) {
      expect(within(list).getByRole("link", { name: contact.label })).toHaveAttribute(
        "href",
        contact.href
      );
    }
  });

  it("offers each PDF as a download, the page's own language first", () => {
    render(<Hero locale={locale} />);
    const links = within(screen.getByRole("list", { name: t.downloadResume })).getAllByRole("link");
    expect(links).toHaveLength(resumePdfs.length);
    for (const pdf of resumePdfs) {
      const link = screen.getByRole("link", { name: t.pdf[pdf.id] });
      expect(link).toHaveAttribute("href", pdf.href);
      expect(link).toHaveAttribute("download");
    }
    expect(links[0]).toHaveAccessibleName(locale === "ru" ? t.pdf.ru : t.pdf.a4);
  });

  it("links to every language", () => {
    render(<Hero locale={locale} />);
    // Two copies (mobile and desktop), shown at different breakpoints.
    const [switcher] = screen.getAllByRole("list", { name: t.languageSwitch });
    for (const target of locales) {
      expect(within(switcher).getByRole("link", { name: target })).toHaveAttribute("href", localePath(target));
    }
    expect(within(switcher).getByRole("link", { name: locale })).toHaveAttribute("aria-current", "page");
  });
});
