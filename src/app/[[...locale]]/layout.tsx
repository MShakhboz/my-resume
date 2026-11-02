import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getProfile } from "@/entities/profile";
import { themeInitScript } from "@/features/theme-toggle";
import { getDictionary, localePath, locales, toLocale } from "@/shared/i18n";
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

// "/" is English and "/ru" is Russian; any other path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale === "en" ? [] : [locale] }));
}

export async function generateMetadata({ params }: LayoutProps<"/[[...locale]]">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const profile = getProfile(locale);
  const title = `${profile.name} — ${profile.headline.split(" | ")[0]}`;

  return {
    // Set NEXT_PUBLIC_SITE_URL once the site has a domain so OG URLs are absolute.
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    title,
    description: profile.summary,
    authors: [{ name: profile.name }],
    alternates: {
      canonical: localePath(locale),
      languages: { ...Object.fromEntries(locales.map((l) => [l, localePath(l)])), "x-default": "/" },
    },
    openGraph: {
      type: "profile",
      title,
      description: profile.summary,
      locale: { en: "en_US", ru: "ru_RU", uz: "uz_UZ" }[locale],
    },
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
  const locale = toLocale((await params).locale);
  const profile = getProfile(locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: getProfile("en").name,
    jobTitle: profile.headline.split(" | ")[0],
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
        <Header locale={locale} />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
