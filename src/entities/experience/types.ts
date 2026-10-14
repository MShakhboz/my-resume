export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  /** Years only, e.g. "2021 – 2022" or "2026 – Present". */
  dates: string;
  bullets: string[];
  stack: string[];
  /** Bare hostnames, shown as text like in the PDF. */
  liveSites: string[];
};
