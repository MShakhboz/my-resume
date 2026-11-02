import { Project } from "./types";

// Website only (not in the PDF). Every fact here comes from the job bullets in
// ../build_resume.py. To add a screenshot, put it in
// public/projects/ (16:10 crops best) and set `image`.
export const projects: Project[] = [
  {
    id: "tradetaxi-crm",
    title: "TradeTaxi fleet CRM",
    description:
      "Fleet-management CRM for a Russia-based taxi company, used by about 2,000 drivers. As the sole " +
      "frontend developer, built a browser-style multi-tab workspace that keeps each tab's page state and " +
      "scroll position, and the Drivers, Vehicles and Fines modules with virtualized tables.",
    stack: ["Next.js", "TypeScript", "Mantine", "RTK Query", "TanStack Virtual"],
    links: ["dev.tradetaxi.ru"],
  },
  {
    id: "nestegg-borrower-app",
    title: "NestEgg borrower app",
    description:
      "Borrower-facing app for NestEgg, a UK loan-matching platform that connects borrowers with credit " +
      "unions. Built from scratch at Softwhere.",
    stack: ["React", "TypeScript", "Redux Toolkit", "RTK Query", "Material UI"],
    links: ["loans.nestegg.ai"],
  },
  {
    id: "nestegg-lender-dashboard",
    title: "NestEgg lender dashboard",
    description:
      "Dashboard for the credit unions that lend through NestEgg, used by 20+ lenders. Built from scratch " +
      "at Softwhere.",
    stack: ["React", "TypeScript", "Redux Toolkit", "RTK Query", "Material UI"],
    links: ["db2-testing.nestegg.ai"],
  },
  {
    id: "lumex-client-sites",
    title: "Client websites at Lumex Agency",
    description:
      "Led 2 frontend developers on 12 websites for a US agency's clients: new builds, features, " +
      "refactoring and maintenance. Raised accessibility scores from 70–80% to 95–100% through WAVE and " +
      "IBM Equal Access audits.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Payload CMS"],
    links: ["nxtarmor.com", "earendelartists.com"],
  },
  {
    id: "coyote-crm",
    title: "COYOTE CRM",
    description:
      "CRM for COYOTE, a company in Kazakhstan. Took over work that junior developers had left " +
      "unfinished and completed it, improving code quality, performance and maintainability.",
    stack: ["Next.js", "RTK Query", "Tailwind CSS", "Sass"],
    links: ["erp.cascompany.org"],
  },
  {
    id: "qamqorshy",
    title: "Qamqorshy",
    description:
      "Project at COYOTE (Kazakhstan) that junior developers had left unfinished; completed it and " +
      "improved its code quality and performance.",
    stack: ["Next.js", "RTK Query", "Tailwind CSS", "Sass"],
    links: ["qamqorshy.kz"],
  },
];
