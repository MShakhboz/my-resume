import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { themeInitScript } from "@/features/theme-toggle";
import { siteUrl } from "@/shared/config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });

// A second root layout: /logs sits outside the [[...locale]] resume pages and is never indexed.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Job hunt log",
  robots: { index: false, follow: false },
};

export default function LogsLayout({ children }: LayoutProps<"/logs">) {
  return (
    // The init script sets data-theme before hydration, so the attribute differs from the server HTML.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
