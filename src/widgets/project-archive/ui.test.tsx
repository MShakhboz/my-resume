import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getArchive } from "@/entities/archive";
import { getDictionary, locales, localePath } from "@/shared/i18n";
import { ProjectArchive } from "./ui";

describe.each(locales)("ProjectArchive (%s)", (locale) => {
  const t = getDictionary(locale);
  const archive = getArchive(locale);

  it("lists every project in a table, newest first", () => {
    render(<ProjectArchive locale={locale} />);
    expect(screen.getByRole("heading", { level: 1, name: t.archive.title })).toBeInTheDocument();
    const table = screen.getByRole("table", { name: t.archive.caption });
    const rows = within(table).getAllByRole("row").slice(1); // skip the header row
    expect(rows).toHaveLength(archive.length);
    rows.forEach((row, i) => expect(row).toHaveTextContent(archive[i].name));
  });

  it("links live sites in a new tab and labels the rest", () => {
    render(<ProjectArchive locale={locale} />);
    for (const { link } of archive.filter((entry) => entry.link)) {
      // Two copies per row (mobile and desktop columns), shown at different breakpoints.
      for (const anchor of screen.getAllByRole("link", { name: new RegExp(link!.replace(/\./g, "\\.")) })) {
        expect(anchor).toHaveAttribute("href", `https://${link}`);
        expect(anchor).toHaveAttribute("target", "_blank");
        expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
    const offline = archive.filter((entry) => entry.status === "offline").length;
    expect(screen.getAllByText(t.archive.status.offline)).toHaveLength(offline * 2);
  });

  it("links back to the resume in the same language", () => {
    render(<ProjectArchive locale={locale} />);
    expect(screen.getByRole("link", { name: t.archive.back })).toHaveAttribute("href", localePath(locale));
  });
});
