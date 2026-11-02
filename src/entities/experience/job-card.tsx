import { ArrowUpRight, Building2, Globe } from "lucide-react";
import { Tag } from "@/shared/ui/tag";
import { Job } from "./types";

type Props = {
  job: Job;
};

export function JobCard({ job }: Props) {
  const LocationIcon = job.location === "Remote" ? Globe : Building2;

  return (
    <article className="group relative grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-6">
      {/* Hover backdrop: bleeds past the text so the card reads as one block. */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -inset-y-5 hidden rounded-2xl transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-surface lg:group-hover:shadow-lg lg:group-hover:ring-1 lg:group-hover:ring-line"
      />

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-col sm:items-start sm:pt-1">
        <p className="text-xs font-semibold uppercase tracking-wide tabular-nums text-muted">
          {job.dates}
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted">
          <LocationIcon aria-hidden size={14} />
          {job.location}
        </p>
      </div>

      <div className="relative space-y-4">
        <header>
          <h3 className="text-lg font-semibold leading-snug text-strong">{job.company}</h3>
          <p className="text-sm text-accent">{job.title}</p>
        </header>

        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-body marker:text-accent">
          {job.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>

        <ul aria-label={`${job.company} tech stack`} className="flex flex-wrap gap-1.5">
          {job.stack.map((tech) => (
            <li key={tech}>
              <Tag variant="accent">{tech}</Tag>
            </li>
          ))}
        </ul>

        {job.liveSites.length > 0 && (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span>Live:</span>
            {job.liveSites.map((site) => (
              <a
                key={site}
                href={`https://${site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent"
              >
                {site}
                <ArrowUpRight
                  aria-hidden
                  size={14}
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
