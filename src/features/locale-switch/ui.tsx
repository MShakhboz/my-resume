import { getDictionary, Locale, locales, Page, pagePath } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";

/** Links to the same page in each language. Each link is marked with its own language. */
type LocaleSwitchProps = {
  locale: Locale;
  /** The page to link to in each language. */
  page?: Page;
  className?: string;
};

export function LocaleSwitch({ locale, page = "home", className }: LocaleSwitchProps) {
  return (
    <ul
      aria-label={getDictionary(locale).languageSwitch}
      className={tw("flex items-center rounded-lg bg-raised p-0.5", className)}
    >
      {locales.map((target) => {
        const current = target === locale;
        return (
          <li key={target}>
            <a
              href={pagePath(target, page)}
              hrefLang={target}
              lang={target}
              title={getDictionary(target).languageName}
              aria-current={current ? "page" : undefined}
              className={tw(
                "flex min-h-10 min-w-11 items-center justify-center rounded-md px-2 text-xs font-semibold uppercase tracking-wide transition lg:min-h-0 lg:min-w-0 lg:py-1",
                current ? "bg-surface text-strong shadow-sm" : "text-muted hover:text-strong"
              )}
            >
              {target}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
