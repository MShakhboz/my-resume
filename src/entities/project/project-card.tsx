import Image from "next/image";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { getDictionary, Locale } from "@/shared/i18n";
import { Tag } from "@/shared/ui/tag";
import { Project } from "./types";

type Props = {
  project: Project;
  locale: Locale;
};

export function ProjectCard({ project, locale }: Props) {
  const t = getDictionary(locale);
  const [mainLink] = project.links;

  return (
    <article className="group relative grid gap-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
      {/* Hover backdrop, same as JobCard. */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -inset-y-5 hidden rounded-2xl transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-surface lg:group-hover:shadow-lg lg:group-hover:ring-1 lg:group-hover:ring-line"
      />

      <div className="relative space-y-3 sm:col-start-2 sm:row-start-1">
        <h3 className="text-lg font-semibold leading-snug text-strong">
          {mainLink ? (
            <a
              href={`https://${mainLink}`}
              target="_blank"
              rel="noopener noreferrer"
              // The pseudo-element stretches the link over the whole card.
              className="group/link inline-flex items-baseline gap-1 hover:text-accent focus-visible:text-accent before:absolute before:-inset-x-4 before:-inset-y-5 before:rounded-2xl lg:before:-inset-x-6"
            >
              {project.title}
              <ArrowUpRight
                aria-hidden
                size={16}
                className="shrink-0 translate-y-0.5 transition-transform group-hover:-translate-y-0 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
              <span className="sr-only">{t.newTab}</span>
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="text-base leading-relaxed text-body lg:text-[15px]">{project.description}</p>

        {project.links.length > 0 && (
          <p className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>{project.links.length === 1 ? t.live.one : t.live.many}</span>
            {project.links.map((site) => (
              <a
                key={site}
                href={`https://${site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-6 items-center gap-0.5 py-1 font-medium text-foreground underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent"
              >
                {site}
                <ArrowUpRight aria-hidden size={14} />
                <span className="sr-only">{t.newTab}</span>
              </a>
            ))}
          </p>
        )}

        <ul aria-label={t.techStack(project.title)} className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Tag variant="accent">{tech}</Tag>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative max-w-60 sm:col-start-1 sm:row-start-1 sm:max-w-none sm:pt-1">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={640}
            height={400}
            sizes="(min-width: 640px) 144px, 240px"
            className="aspect-[16/10] w-full rounded-lg object-cover object-top ring-1 ring-line transition group-hover:ring-accent motion-reduce:transition-none"
          />
        ) : (
          // Shown until a screenshot is added: hidden from screen readers, and on phones, where it would only add scrolling.
          <div
            aria-hidden
            className="hidden aspect-[16/10] sm:flex w-full items-center justify-center rounded-lg bg-raised text-subtle ring-1 ring-line"
          >
            <ImageIcon size={24} />
          </div>
        )}
      </div>
    </article>
  );
}
