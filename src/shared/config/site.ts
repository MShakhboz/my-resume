/** Section anchors in page order. Labels live in the i18n dictionary (`nav`). */
export const sectionIds = ["about", "experience", "projects", "skills", "education", "contact"] as const;

export type SectionId = (typeof sectionIds)[number];

/** PDFs are copied from ../A4, ../US-Letter and ../CIS-Russian. Re-copy after rebuilding them. */
export const resumePdfs = [
  { id: "a4", href: "/resume/Shaxboz-Mirzomurotov-Resume-A4.pdf" },
  { id: "letter", href: "/resume/Shaxboz-Mirzomurotov-Resume-US-Letter.pdf" },
  { id: "ru", href: "/resume/Shaxboz-Mirzomurotov-Resume-RU.pdf", hrefLang: "ru" },
] as const;
