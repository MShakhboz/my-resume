export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

/** English lives at "/", every other locale under its own prefix. */
export const localePath = (locale: Locale) => (locale === "en" ? "/" : `/${locale}`);

/** Maps the optional route segment ([[...locale]]) to a locale; no segment means English. */
export const toLocale = (segments: string[] | undefined): Locale =>
  locales.find((locale) => locale !== "en" && locale === segments?.[0]) ?? "en";
