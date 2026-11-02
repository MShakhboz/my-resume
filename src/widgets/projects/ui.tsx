import { ProjectCard, projects } from "@/entities/project";
import { Section } from "@/shared/ui/section";

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <ul className="space-y-14">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
