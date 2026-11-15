import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProfile } from "@/entities/profile";
import { resumePdfs } from "@/shared/config";
import { getDictionary, localePath, locales } from "@/shared/i18n";
import { Hero } from "./ui";

// The view link's name is the label plus the hidden "(opens in a new tab)" note.
const startsWith = (label: string) => new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);

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

  it("opens each PDF in a new tab, with a separate download button, the page's own language first", () => {
    render(<Hero locale={locale} />);
    const list = screen.getByRole("list", { name: t.resumePdfs });
    expect(within(list).getAllByRole("listitem")).toHaveLength(resumePdfs.length);
    for (const pdf of resumePdfs) {
      const view = within(list).getByRole("link", { name: startsWith(t.pdf[pdf.id]) });
      expect(view).toHaveAttribute("href", pdf.href);
      expect(view).toHaveAttribute("target", "_blank");
      expect(view).not.toHaveAttribute("download");

      const download = within(list).getByRole("link", { name: t.downloadPdf(t.pdf[pdf.id]) });
      expect(download).toHaveAttribute("href", pdf.href);
      expect(download).toHaveAttribute("download");
    }
    const [first] = within(list).getAllByRole("link");
    expect(first).toHaveAccessibleName(startsWith(locale === "ru" ? t.pdf.ru : t.pdf.a4));
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
