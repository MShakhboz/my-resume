import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getProfile } from "@/entities/profile";
import { getSkillGroups } from "@/entities/skill";
import { themeInitScript } from "@/features/theme-toggle";
import { siteUrl } from "@/shared/config";
import { getDictionary, locales, pagePath, routeSegments, toRoute } from "@/shared/i18n";
import { Spotlight } from "@/shared/ui/spotlight";
import { Header } from "@/widgets/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// "/" and "/projects" in English, the same under "/ru" and "/uz"; any other path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return routeSegments().map((segments) => ({ locale: segments }));
}

export async function generateMetadata({ params }: LayoutProps<"/[[...locale]]">): Promise<Metadata> {
  const { locale, page } = toRoute((await params).locale);
  const profile = getProfile(locale);
  const t = getDictionary(locale);
  const title =
    page === "projects"
      ? `${t.archive.title} — ${profile.name}`
      : `${profile.name} — ${profile.headline.split(" | ")[0]}`;

  return {
    // Makes canonical, hreflang and Open Graph URLs absolute (see siteUrl).
    metadataBase: new URL(siteUrl),
    title,
    description: profile.summary,
    authors: [{ name: profile.name }],
    alternates: {
      canonical: pagePath(locale, page),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pagePath(l, page)])),
        "x-default": pagePath("en", page),
      },
    },
    openGraph: {
      type: "profile",
      title,
      description: profile.summary,
      locale: { en: "en_US", ru: "ru_RU", uz: "uz_UZ" }[locale],
      url: pagePath(locale, page),
      // The business-card preview from app/og/[locale]/route.tsx.
      images: [{ url: `/og/${locale}`, width: 1200, height: 630, alt: `${profile.name} — ${profile.headline}` }],
    },
    twitter: { card: "summary_large_image", title, description: profile.summary, images: [`/og/${locale}`] },
    // Google Search Console's HTML-tag verification, if the owner sets it in Vercel.
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
    { media: "(prefers-color-scheme: light)", color: "#f9f9f8" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[[...locale]]">) {
  const { locale, page } = toRoute((await params).locale);
  const profile = getProfile(locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: getProfile("en").name,
    jobTitle: profile.headline.split(" | ")[0],
    url: `${siteUrl}${pagePath(locale)}`,
    knowsAbout: getSkillGroups("en")
      .filter((group) => ["frontend", "data", "testing"].includes(group.id))
      .flatMap((group) => group.items),
    address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
    email: `mailto:${profile.contacts.find((c) => c.id === "email")?.display}`,
    sameAs: profile.contacts.filter((c) => c.href.startsWith("https://")).map((c) => c.href),
  };

  return (
    // The init script sets data-theme before hydration, so the attribute differs from the server HTML.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-neutral-950"
        >
          {getDictionary(locale).skipLink}
        </a>
        <Spotlight />
        {/* The mobile section bar links to anchors that exist only on the home page. */}
        {page === "home" && <Header locale={locale} />}
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
