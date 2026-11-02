import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/entities/profile";
import { themeInitScript } from "@/features/theme-toggle";
import { Spotlight } from "@/shared/ui/spotlight";
import { Header } from "@/widgets/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} — Senior Frontend Developer`;

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL once the site has a domain so OG URLs are absolute.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title,
  description: profile.summary,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "profile",
    title,
    description: profile.summary,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
  ],
  colorScheme: "dark light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Senior Frontend Developer",
  address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
  email: `mailto:${profile.contacts.find((c) => c.id === "email")?.display}`,
  sameAs: profile.contacts.filter((c) => c.href.startsWith("https://")).map((c) => c.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The init script sets data-theme before hydration, so the attribute differs from the server HTML.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-neutral-950"
        >
          Skip to content
        </a>
        <Spotlight />
        <Header />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
