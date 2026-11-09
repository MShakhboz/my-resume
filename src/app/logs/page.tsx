import { encryptedApplications, JobLog } from "@/features/job-log";

// Private: not linked from the resume, not in the sitemap, and the data is encrypted (see features/job-log).
export default function LogsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-10">
      <JobLog payload={encryptedApplications} />
    </div>
  );
}
