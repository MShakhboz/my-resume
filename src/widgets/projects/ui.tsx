import { ArrowRight } from "lucide-react";
import { getArchive } from "@/entities/archive";
import { getProjects, ProjectCard } from "@/entities/project";
import { getDictionary, Locale, pagePath } from "@/shared/i18n";
import { Section } from "@/shared/ui/section";
import { ShowMore } from "@/shared/ui/show-more";

export function Projects({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const projects = getProjects(locale);
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <Section id="projects" title={t.nav.projects}>
      <div>
        <ul className="space-y-14">
          {featured.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} locale={locale} />
            </li>
          ))}
        </ul>
        {more.length > 0 && (
          <ShowMore moreLabel={t.moreProjects(more.length)} lessLabel={t.fewerProjects}>
            <ul className="mt-14 space-y-14">
              {more.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} locale={locale} />
                </li>
              ))}
            </ul>
          </ShowMore>
        )}
        <p className="mt-8">
          <a
            href={pagePath(locale, "projects")}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            {t.archive.viewAll(getArchive(locale).length)}
            <ArrowRight
              aria-hidden
              size={16}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </a>
        </p>
      </div>
    </Section>
  );
}
