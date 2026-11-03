import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/config";

/** Open to every crawler, search engines and AI assistants alike, and points them at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
