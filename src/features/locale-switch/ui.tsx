import { getDictionary, Locale, localePath, locales } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";

/** EN / RU links to the same page in each language. Each link is marked with its own language. */
export function LocaleSwitch({ locale, className }: { locale: Locale; className?: string }) {
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
              href={localePath(target)}
              hrefLang={target}
              lang={target}
              title={getDictionary(target).languageName}
              aria-current={current ? "page" : undefined}
              className={tw(
                "block rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide transition",
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
