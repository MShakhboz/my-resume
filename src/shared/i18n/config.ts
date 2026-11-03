export const locales = ["en", "ru", "uz"] as const;

export type Locale = (typeof locales)[number];

export const pages = ["home", "projects"] as const;

export type Page = (typeof pages)[number];

/** English lives at "/", every other locale under its own prefix; subpages follow it ("/ru/projects"). */
export const pagePath = (locale: Locale, page: Page = "home") => {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return page === "home" ? prefix || "/" : `${prefix}/${page}`;
};

export const localePath = (locale: Locale) => pagePath(locale, "home");

/** Maps the optional route segments ([[...locale]]) to a locale and page; only valid ones are generated. */
export const toRoute = (segments: string[] | undefined): { locale: Locale; page: Page } => {
  const [first, second] = segments ?? [];
  const locale = locales.find((l) => l !== "en" && l === first) ?? "en";
  const pageSegment = locale === "en" ? first : second;
  const page = pages.find((p) => p !== "home" && p === pageSegment) ?? "home";
  return { locale, page };
};

export const toLocale = (segments: string[] | undefined): Locale => toRoute(segments).locale;

/** Every valid route as [[...locale]] segments, for generateStaticParams. */
export const routeSegments = () =>
  locales.flatMap((locale) =>
    pages.map((page) => pagePath(locale, page).split("/").filter(Boolean))
  );
