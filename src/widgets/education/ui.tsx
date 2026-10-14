import { education } from "@/entities/education";
import { profile } from "@/entities/profile";
import { Section } from "@/shared/ui/section";
import { Title } from "@/shared/ui/title";

export function Education() {
  return (
    <Section id="education" title="Education">
      <ul className="space-y-3">
        {education.map((item) => (
          <li
            key={item.school}
            className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <p>
              <span className="font-semibold text-strong">{item.field}</span>
              <span className="text-muted"> · {item.school}</span>
            </p>
            <p className="shrink-0 text-sm tabular-nums text-muted">{item.dates}</p>
          </li>
        ))}
      </ul>

      <div className="space-y-3 pt-2">
        <Title as="h3" xs className="text-strong">
          Languages
        </Title>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-body">
          {profile.languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
