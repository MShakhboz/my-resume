import { ProjectCard, projects } from "@/entities/project";
import { Section } from "@/shared/ui/section";
import { ShowMore } from "@/shared/ui/show-more";

const featured = projects.filter((project) => project.featured);
const more = projects.filter((project) => !project.featured);

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div>
        <ul className="space-y-14">
          {featured.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        {more.length > 0 && (
          <ShowMore moreLabel={`View ${more.length} more projects`} lessLabel="Show fewer projects">
            <ul className="mt-14 space-y-14">
              {more.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </ShowMore>
        )}
      </div>
    </Section>
  );
}
