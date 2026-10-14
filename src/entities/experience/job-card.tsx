import { ArrowUpRight } from "lucide-react";
import { Tag } from "@/shared/ui/tag";
import { Job } from "./types";

type Props = {
  job: Job;
};

export function JobCard({ job }: Props) {
  return (
    <article className="space-y-3">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="font-semibold text-white">
          {job.company}
          <span className="font-normal text-neutral-400"> · {job.location}</span>
        </h3>
        <p className="shrink-0 text-sm tabular-nums text-neutral-400">
          {job.dates}
        </p>
      </header>
      <p className="text-sm text-orange-400">{job.title}</p>

      <ul className="list-disc space-y-1.5 pl-5 text-neutral-300 marker:text-neutral-600">
        {job.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <ul aria-label={`${job.company} tech stack`} className="flex flex-wrap gap-1.5">
        {job.stack.map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>

      {job.liveSites.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-400">
          <span>Live:</span>
          {job.liveSites.map((site) => (
            <a
              key={site}
              href={`https://${site}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-neutral-200 underline decoration-neutral-600 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400"
            >
              {site}
              <ArrowUpRight aria-hidden size={14} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </p>
      )}
    </article>
  );
}
