import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProfile } from "@/entities/profile";
import { siteUrl } from "@/shared/config";
import { Locale, locales, toLocale } from "@/shared/i18n";

// One preview image per language, built once at build time: /og/en, /og/ru, /og/uz.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const ogImageSize = { width: 1200, height: 630 };

// The site's dark theme (globals.css) plus the fixed orange of the monogram.
const colors = {
  background: "#111110",
  surface: "#191918",
  line: "#31312e",
  strong: "#eeeeec",
  body: "#c8c6c0",
  muted: "#a9a7a0",
  accent: "#ffa057",
  accentSoft: "#331e0b",
};

// Geist (the site font, SIL OFL 1.1, see fonts/OFL.txt). The default font has no Cyrillic.
async function loadFonts() {
  const dir = join(process.cwd(), "src/app/og/fonts");
  const weights = [
    { file: "Geist-Regular.ttf", weight: 400 },
    { file: "Geist-SemiBold.ttf", weight: 600 },
    { file: "Geist-Bold.ttf", weight: 700 },
  ] as const;
  return Promise.all(
    weights.map(async ({ file, weight }) => ({
      name: "Geist",
      data: await readFile(join(dir, file)),
      weight,
      style: "normal" as const,
    })),
  );
}

// Geist has no U+02BB (the Uzbek oʻ/gʻ letter); U+2018 looks the same.
const forGeist = (text: string) => text.replaceAll("\u02BB", "\u2018");

/** A digital business card: what Telegram, LinkedIn, Slack and others show when the link is shared. */
function OgCard({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const [title, stack = ""] = profile.headline.split(" | ");
  const email = profile.contacts.find((c) => c.id === "email")?.display;
  const host = new URL(siteUrl).host;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 40,
        backgroundColor: colors.background,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 60px 44px",
          borderRadius: 28,
          border: `1px solid ${colors.line}`,
          backgroundColor: colors.surface,
          backgroundImage: "radial-gradient(circle at 88% 0%, rgba(255,160,87,0.16), rgba(255,160,87,0) 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              width: 88,
              height: 88,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 44,
              backgroundImage: "linear-gradient(135deg, #fb923c, #ea580c)",
              color: "#0a0a0a",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {profile.initials}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 22px",
              borderRadius: 999,
              backgroundColor: colors.accentSoft,
              color: colors.accent,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {forGeist(profile.availability)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: colors.strong, fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", marginTop: 10, color: colors.accent, fontSize: 38, fontWeight: 600 }}>
            {forGeist(title)}
          </div>
          <div style={{ display: "flex", marginTop: 14, color: colors.body, fontSize: 28 }}>
            {stack.split(", ").join("  ·  ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: 26,
            borderTop: `1px solid ${colors.line}`,
            color: colors.muted,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: colors.strong, fontWeight: 600 }}>{host}</span>
            <span>{email}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <span>{forGeist(profile.location)}</span>
            <span>Telegram {profile.messengerHandle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[locale]">) {
  const locale = toLocale([(await params).locale]);
  return new ImageResponse(<OgCard locale={locale} />, { ...ogImageSize, fonts: await loadFonts() });
}
