import { Code, Compass, Database, Palette, Table, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { skillGroups } from "@/entities/skill";
import { Section } from "@/shared/ui/section";
import { Tag } from "@/shared/ui/tag";

// Keyed by the group labels in the skill model; unknown labels fall back to Wrench.
const icons: Record<string, LucideIcon> = {
  Frontend: Code,
  "State and data": Database,
  UI: Palette,
  "Forms and tables": Table,
  Tools: Wrench,
  Practices: Compass,
};

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {skillGroups.map((group) => {
          const Icon = icons[group.label] ?? Wrench;
          return (
            <li key={group.label} className="space-y-3 rounded-2xl bg-surface p-5 ring-1 ring-line">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-strong">
                <Icon aria-hidden size={18} className="text-accent" />
                {group.label}
              </h3>
              <ul aria-label={group.label} className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
