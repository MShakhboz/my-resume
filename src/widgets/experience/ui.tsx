import { getJobs, JobCard } from "@/entities/experience";
import { getDictionary, Locale } from "@/shared/i18n";
import { Section } from "@/shared/ui/section";

export function Experience({ locale }: { locale: Locale }) {
  return (
    <Section id="experience" title={getDictionary(locale).nav.experience}>
      <ol className="space-y-14">
        {getJobs(locale).map((job) => (
          <li key={job.id}>
            <JobCard job={job} locale={locale} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
