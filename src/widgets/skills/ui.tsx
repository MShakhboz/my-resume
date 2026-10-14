import { skillGroups } from "@/entities/skill";
import { Section } from "@/shared/ui/section";
import { Tag } from "@/shared/ui/tag";

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="space-y-4">
        {skillGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <dt className="text-sm font-medium text-strong">{group.label}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
