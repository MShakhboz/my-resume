import { GraduationCap, Languages } from "lucide-react";
import { getEducation } from "@/entities/education";
import { getProfile } from "@/entities/profile";
import { getDictionary, Locale } from "@/shared/i18n";
import { Section } from "@/shared/ui/section";

/** "English (advanced)" → ["English", "advanced"]. */
const splitLevel = (language: string) => {
  const match = language.match(/^(.*) \((.*)\)$/);
  return match ? [match[1], match[2]] : [language, ""];
};

export function Education({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <Section id="education" title={t.nav.education}>
      <ul className="space-y-3">
        {getEducation(locale).map((item) => (
          <li key={item.school} className="flex gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line">
            <GraduationCap aria-hidden size={22} className="mt-0.5 shrink-0 text-accent" />
            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <p>
                <span className="block font-semibold text-strong">{item.field}</span>
                <span className="text-sm text-muted">{item.school}</span>
              </p>
              <p className="shrink-0 text-sm tabular-nums text-muted">{item.dates}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-strong">
          <Languages aria-hidden size={18} className="text-accent" />
          {t.languages}
        </h3>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {getProfile(locale).languages.map((language) => {
            const [name, level] = splitLevel(language);
            return (
              <li key={language} className="rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
                <span className="block font-medium text-strong">{name}</span>
                {level && <span className="text-sm capitalize text-muted">{level}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
