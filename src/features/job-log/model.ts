// The job-application log behind /logs. The plain list lives in private/applications.json
// (git-ignored); `pnpm logs:encrypt` writes the encrypted copy that ships with the site.

export const STATUSES = ["Sent", "Screening", "Interview", "Offer", "Rejected", "No reply", "Withdrawn"] as const;
export type Status = (typeof STATUSES)[number];

/** Still waiting on the company, so it counts as in progress and may need a follow-up. */
export const ACTIVE: ReadonlySet<Status> = new Set(["Sent", "Screening", "Interview"]);

export type Application = {
  id: string;
  company: string;
  role: string;
  channel: string;
  contact: string;
  salary: string;
  status: Status;
  /** Dates are YYYY-MM-DD. */
  applied: string;
  followUp: string;
  followedUpOn: string;
  link: string;
  notes: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Monday of the week that contains `today`. */
export function weekStart(today: Date) {
  const back = (today.getDay() + 6) % 7;
  return isoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - back));
}

export const isFollowUpDue = (app: Application, today: string) =>
  app.status === "Sent" && app.followUp !== "" && app.followUp <= today && app.followedUpOn === "";

/** The plan's daily target: 10 applications Monday to Friday, 5 on Saturday, Sunday off. */
export function dailyTarget(today: Date) {
  const day = today.getDay();
  return day === 0 ? 0 : day === 6 ? 5 : 10;
}

export function summarize(apps: Application[], today: Date) {
  const day = isoDate(today);
  const monday = weekStart(today);
  return {
    total: apps.length,
    today: apps.filter((a) => a.applied === day).length,
    target: dailyTarget(today),
    thisWeek: apps.filter((a) => a.applied >= monday && a.applied <= day).length,
    inProgress: apps.filter((a) => ACTIVE.has(a.status)).length,
    followUpsDue: apps.filter((a) => isFollowUpDue(a, day)).length,
  };
}

/** Newest first, then by company. */
export const sortApplications = (apps: Application[]) =>
  [...apps].sort((a, b) => b.applied.localeCompare(a.applied) || a.company.localeCompare(b.company));
