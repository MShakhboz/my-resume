/**
 * Absolute site address for the sitemap, robots.txt, canonical links and llms.txt. NEXT_PUBLIC_SITE_URL
 * wins (set it for a custom domain); otherwise Vercel's production domain, available at build time.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** Section anchors in page order. Labels live in the i18n dictionary (`nav`). */
export const sectionIds = ["about", "experience", "projects", "skills", "education", "contact"] as const;

export type SectionId = (typeof sectionIds)[number];

/** PDFs are copied from ../A4, ../US-Letter and ../CIS-Russian. Re-copy after rebuilding them. */
export const resumePdfs = [
  { id: "a4", href: "/resume/Shaxboz-Mirzomurotov-Resume-A4.pdf" },
  { id: "letter", href: "/resume/Shaxboz-Mirzomurotov-Resume-US-Letter.pdf" },
  { id: "ru", href: "/resume/Shaxboz-Mirzomurotov-Resume-RU.pdf", hrefLang: "ru" },
] as const;
