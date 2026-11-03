import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/config";
import { locales, pagePath, pages } from "@/shared/i18n";

/** Every page in every language, each listing its translations so search engines group them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteUrl}${pagePath(locale, page)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${pagePath(l, page)}`])),
      },
    }))
  );
}
