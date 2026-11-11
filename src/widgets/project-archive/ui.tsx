import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ArchiveEntry, getArchive } from "@/entities/archive";
import { getJobs } from "@/entities/experience";
import { getProfile } from "@/entities/profile";
import { LocaleSwitch } from "@/features/locale-switch";
import { ThemeToggle } from "@/features/theme-toggle";
import { Dictionary, getDictionary, Locale, localePath } from "@/shared/i18n";
import { Tag } from "@/shared/ui/tag";

/** The live link, or a pill saying why there is none. */
function LinkCell({ entry, t }: { entry: ArchiveEntry; t: Dictionary }) {
  if (entry.link) {
    return (
      <a
        href={`https://${entry.link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link inline-flex min-h-6 items-center gap-0.5 py-1 font-medium text-foreground underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent"
      >
        {entry.link}
        <ArrowUpRight
          aria-hidden
          size={14}
          className="shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
        />
        <span className="sr-only">{t.newTab}</span>
      </a>
    );
  }
  return (
    <span className="inline-block rounded-full bg-raised px-2.5 py-0.5 text-xs text-muted">
      {entry.status === "internal" ? t.archive.status.internal : t.archive.status.offline}
    </span>
  );
}

/** Every project behind the "20+ projects" highlight, as a table like brittanychiang.com/archive. */
export function ProjectArchive({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const entries = getArchive(locale);
  const companyById = new Map(getJobs(locale).map((job) => [job.id, job.company]));
  const companyCount = new Set(entries.map((entry) => entry.jobId)).size;
  const { columns } = t.archive;

  return (
    <main id="main" className="pt-8 pb-24 lg:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <a
          href={localePath(locale)}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-accent"
        >
          <ArrowLeft
            aria-hidden
            size={16}
            className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
          />
          {t.archive.back}
        </a>
        <div className="flex items-center gap-2">
          <LocaleSwitch locale={locale} page="projects" />
          <ThemeToggle locale={locale} />
        </div>
      </div>

      <p className="mt-12 text-sm font-semibold text-accent">{getProfile(locale).name}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-strong sm:text-5xl">{t.archive.title}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-body">
        {t.archive.intro(entries.length, companyCount)}
      </p>

      <table className="mt-12 w-full border-collapse text-left">
        <caption className="sr-only">{t.archive.caption}</caption>
        <thead className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
          <tr className="text-xs font-semibold tracking-wide text-muted uppercase">
            <th scope="col" className="py-4 pr-4 sm:pr-6">
              {columns.year}
            </th>
            <th scope="col" className="py-4 pr-4 sm:pr-6">
              {columns.project}
            </th>
            <th scope="col" className="hidden py-4 pr-6 lg:table-cell">
              {columns.madeAt}
            </th>
            <th scope="col" className="hidden py-4 pr-6 lg:table-cell">
              {columns.builtWith}
            </th>
            <th scope="col" className="hidden py-4 sm:table-cell">
              {columns.link}
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const company = companyById.get(entry.jobId);
            return (
              <tr key={entry.id} className="border-b border-line last:border-0">
                <td className="py-5 pr-4 align-top text-sm text-muted tabular-nums sm:pr-6">{entry.year}</td>
                <td className="py-5 pr-4 align-top sm:pr-6">
                  <p className="leading-snug font-semibold text-strong">{entry.name}</p>
                  <p className="mt-1 max-w-md text-base leading-relaxed text-body lg:text-sm">{entry.description}</p>
                  {/* Columns hidden on small screens move under the description. */}
                  <p className="mt-2 text-xs text-muted lg:hidden">{company}</p>
                  <div className="mt-2 text-sm sm:hidden">
                    <LinkCell entry={entry} t={t} />
                  </div>
                </td>
                <td className="hidden py-5 pr-6 align-top text-sm whitespace-nowrap text-muted lg:table-cell">
                  {company}
                </td>
                <td className="hidden py-5 pr-6 align-top lg:table-cell">
                  <ul aria-label={t.techStack(entry.name)} className="flex flex-wrap gap-1.5">
                    {entry.stack.map((tech) => (
                      <li key={tech}>
                        <Tag>{tech}</Tag>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="hidden py-5 align-top text-sm whitespace-nowrap sm:table-cell">
                  <LinkCell entry={entry} t={t} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
