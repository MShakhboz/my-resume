export type ArchiveEntry = {
  id: string;
  /** Year the work started: the job's start year, or the owner's first commit for Lumex sites. */
  year: number;
  name: string;
  /** One short sentence: what the project is. */
  description: string;
  /** The job (experience entry) the project belongs to. */
  jobId: string;
  stack: string[];
  /** Bare hostname of the live site. */
  link?: string;
  /** Why there is no link: the site is down, or it was never public. */
  status?: "offline" | "internal";
};
