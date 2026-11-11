import { ArrowRight } from "lucide-react";
import { getProfile } from "@/entities/profile";
import { getDictionary, Locale, pagePath } from "@/shared/i18n";
import { Section } from "@/shared/ui/section";

export function About({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);

  return (
    <Section id="about" title={getDictionary(locale).nav.about}>
      <p className="text-lg leading-relaxed text-body">{profile.summary}</p>

      {/* A light row of numbers, no cards: skimmable without crowding the summary. */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {profile.highlights.map((item) => (
          <div key={item.value} className="group relative flex flex-col-reverse justify-end gap-1">
            <dt className="text-sm leading-snug text-muted">
              {item.source === "project-count" ? (
                // The pseudo-element stretches the link over the number too.
                <a
                  href={pagePath(locale, "projects")}
                  className="underline decoration-subtle underline-offset-4 before:absolute before:inset-0 group-hover:text-accent group-hover:decoration-accent"
                >
                  {/* The arrow stays on the line of the label's last word instead of wrapping alone. */}
                  {item.label.slice(0, item.label.lastIndexOf(" ") + 1)}
                  <span className="whitespace-nowrap">
                    {item.label.slice(item.label.lastIndexOf(" ") + 1)}
                    <ArrowRight
                      aria-hidden
                      size={14}
                      className="ml-1 inline-block align-[-2px] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </a>
              ) : (
                item.label
              )}
            </dt>
            <dd className="text-2xl font-bold tracking-tight tabular-nums text-accent sm:text-3xl">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
