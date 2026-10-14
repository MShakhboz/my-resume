import { profile } from "@/entities/profile";
import { Section } from "@/shared/ui/section";

export function About() {
  return (
    <Section id="about" title="About">
      <p className="leading-relaxed text-neutral-300">{profile.summary}</p>
    </Section>
  );
}
