import { Download, FileText, MapPin } from "lucide-react";
import { contactIcons, getProfile } from "@/entities/profile";
import { LocaleSwitch } from "@/features/locale-switch";
import { SectionNav } from "@/features/section-nav";
import { ThemeToggle } from "@/features/theme-toggle";
import { resumePdfs } from "@/shared/config";
import { getDictionary, Locale } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";
import { ButtonLink } from "@/shared/ui/button-link";
import { Monogram } from "@/shared/ui/monogram";
import { Title } from "@/shared/ui/title";

/** Identity column: sticky on desktop with the section nav, stacked on top on mobile. */
export function Hero({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const t = getDictionary(locale);
  const [headlineRole, headlineStack] = profile.headline.split(" | ");
  // The visitor's own language first: the Russian page leads with the Russian PDF.
  const pdfs =
    locale === "ru"
      ? [...resumePdfs.filter((pdf) => pdf.id === "ru"), ...resumePdfs.filter((pdf) => pdf.id !== "ru")]
      : resumePdfs;

  return (
    <header className="pt-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[calc(42%+3rem)] lg:shrink-0 lg:flex-col lg:justify-between lg:-mx-6 lg:overflow-y-auto lg:px-6 lg:py-16">
      <div>
        <div className="flex items-start justify-between gap-4">
          <Monogram initials={profile.initials} size={64} />
          {/* Below lg; on desktop the switch sits at the bottom of the sidebar. */}
          <LocaleSwitch locale={locale} className="lg:hidden" />
        </div>

        <Title as="h1" className="mt-6 text-4xl text-strong sm:text-5xl">
          {profile.name}
        </Title>
        <p className="mt-3 text-lg font-medium text-foreground sm:text-xl">{headlineRole}</p>
        {headlineStack && <p className="mt-1 text-accent">{headlineStack}</p>}

        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden size={16} />
            {profile.location}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-raised px-2.5 py-1 text-xs font-medium text-foreground">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </span>
        </p>

        <SectionNav variant="sidebar" locale={locale} className="mt-12 hidden lg:block" />
      </div>

      <div className="mt-8 space-y-6">
        {/* Each PDF opens in the browser's viewer; the small button next to it downloads the file. */}
        <ul aria-label={t.resumePdfs} className="flex flex-wrap items-center gap-2">
          {pdfs.map((pdf, i) => {
            const variant = i === 0 ? "primary" : "secondary";
            const hrefLang = "hrefLang" in pdf ? pdf.hrefLang : undefined;
            return (
              <li key={pdf.href} className="flex">
                <ButtonLink
                  href={pdf.href}
                  target="_blank"
                  rel="noopener"
                  hrefLang={hrefLang}
                  variant={variant}
                  className="min-h-11 rounded-r-none lg:min-h-0"
                >
                  <FileText aria-hidden size={16} />
                  {t.pdf[pdf.id]}
                  <span className="sr-only">{t.newTab}</span>
                </ButtonLink>
                <ButtonLink
                  href={pdf.href}
                  download
                  hrefLang={hrefLang}
                  variant={variant}
                  aria-label={t.downloadPdf(t.pdf[pdf.id])}
                  className={tw(
                    "group/dl relative min-h-11 min-w-11 justify-center rounded-l-none border-l px-2.5 lg:min-h-0 lg:min-w-0",
                    variant === "primary" ? "border-neutral-950/20" : "border-line"
                  )}
                >
                  <Download aria-hidden size={16} />
                  {/* Hover and keyboard-focus hint; screen readers get the aria-label instead. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 rounded-md bg-strong px-2 py-1 text-xs font-medium whitespace-nowrap text-background opacity-0 shadow-lg transition group-hover/dl:translate-y-0 group-hover/dl:opacity-100 group-focus-visible/dl:translate-y-0 group-focus-visible/dl:opacity-100 motion-reduce:transition-none"
                  >
                    {t.download}
                  </span>
                </ButtonLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ul aria-label={t.contactLinks} className="flex items-center gap-2">
            {profile.contacts.map((contact) => {
              const Icon = contactIcons[contact.id];
              const external = contact.href.startsWith("http");
              return (
                <li key={contact.id}>
                  <a
                    href={contact.href}
                    aria-label={contact.label}
                    title={contact.label}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="flex size-11 items-center justify-center rounded-full lg:size-10 bg-raised text-body transition hover:-translate-y-0.5 hover:bg-raised-hover hover:text-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <Icon aria-hidden size={18} />
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <LocaleSwitch locale={locale} />
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
