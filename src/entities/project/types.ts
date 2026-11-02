export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  /** Bare hostnames, listed under "Live:". The first one is also the title link. */
  links: string[];
  /** Shown by default; the rest sit behind a "View more" button. */
  featured?: boolean;
  /** A screenshot in public/projects/. Without one the card shows a placeholder tile. */
  image?: { src: string; alt: string };
};
