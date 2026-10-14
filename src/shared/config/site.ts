export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

/** PDFs are copied from ../A4, ../US-Letter and ../CIS-Russian. Re-copy after rebuilding them. */
export const resumePdfs = [
  { label: "PDF (A4)", href: "/resume/Shaxboz-Mirzomurotov-Resume-A4.pdf" },
  { label: "PDF (US Letter)", href: "/resume/Shaxboz-Mirzomurotov-Resume-US-Letter.pdf" },
  { label: "PDF (Russian)", href: "/resume/Shaxboz-Mirzomurotov-Resume-RU.pdf", hrefLang: "ru" },
] as const;
