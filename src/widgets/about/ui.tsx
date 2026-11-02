import { profile } from "@/entities/profile";
import { Section } from "@/shared/ui/section";

export function About() {
  return (
    <Section id="about" title="About">
      <p className="text-lg leading-relaxed text-body">{profile.summary}</p>

      <dl className="grid grid-cols-2 gap-3">
        {profile.highlights.map((item) => (
          <div
            key={item.value}
            className="flex flex-col-reverse gap-1 rounded-2xl bg-surface p-4 ring-1 ring-line sm:p-5"
          >
            <dt className="text-sm leading-snug text-muted">{item.label}</dt>
            <dd className="text-3xl font-bold tracking-tight tabular-nums text-accent">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
