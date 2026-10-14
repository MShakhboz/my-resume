import { JobCard, jobs } from "@/entities/experience";
import { Section } from "@/shared/ui/section";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-8">
        {jobs.map((job) => (
          <li key={job.id} className="border-l-2 border-line pl-4 sm:pl-6">
            <JobCard job={job} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
