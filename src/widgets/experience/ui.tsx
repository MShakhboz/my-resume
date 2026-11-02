import { JobCard, jobs } from "@/entities/experience";
import { Section } from "@/shared/ui/section";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-14">
        {jobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
