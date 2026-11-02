import { Job } from "./types";

// Source of truth: ../build_resume.py (newest first). The PDF's "Stack:" and
// "Live:" bullet text is split into `stack` and `liveSites` here.
export const jobs: Job[] = [
  {
    id: "tradetaxi",
    title: "Frontend Developer",
    company: "TradeTaxi",
    location: "Remote",
    dates: "2026 – Present",
    bullets: [
      "Sole frontend developer on a 7-person team building a fleet-management CRM for a Russia-based " +
        "taxi company; took over a stalled, AI-generated codebase and built about 70% of the frontend.",
      "Designed a browser-style multi-tab workspace that preserves each tab's page state and scroll position.",
      "Built the Drivers module (driver list, support, registration, chat campaigns) and Vehicles module " +
        "for 37,822 drivers and 5,405 vehicles, using TanStack Virtual to keep large tables fast.",
      "Delivered the Fines module (GIBDD traffic-police and TsKAD toll-road fines, payment batches, appeals) " +
        "in the first release cycle, which centered on GIBDD and Yandex integrations.",
      "Works with a PHP/Laravel backend and Flutter mobile app. The platform is used by about 2,000 drivers.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "RTK Query",
      "Mantine",
      "React Hook Form",
      "TanStack Virtual",
    ],
    liveSites: ["dev.tradetaxi.ru"],
  },
  {
    id: "lumex",
    title: "Frontend Developer",
    company: "Lumex Agency (USA)",
    location: "Remote",
    dates: "2024 – 2025",
    bullets: [
      "Led 2 frontend developers and delivered 12 client websites: new builds, features, refactoring, maintenance.",
      "Raised accessibility scores from 70–80% to 95–100% through WAVE and IBM Equal Access audits.",
    ],
    stack: [
      "React.js",
      "Next.js",
      "Solid.js",
      "TypeScript",
      "Redux Toolkit",
      "Tailwind CSS",
      "Framer Motion",
      "Payload CMS",
    ],
    liveSites: ["nxtarmor.com", "earendelartists.com"],
  },
  {
    id: "softwhere",
    title: "Frontend Developer",
    company: "Softwhere",
    location: "Remote",
    dates: "2022 – 2024",
    bullets: [
      "Built 2 fintech apps from scratch for NestEgg, a UK loan-matching platform that connects borrowers " +
        "with credit unions: the borrower-facing loans.nestegg.ai and a lender dashboard used by 20+ lenders.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "RTK Query",
      "Material UI",
      "Styled Components",
      "Ant Design",
      // Website only (owner-requested); they don't fit on the 1-page US Letter PDF.
      "Ideal Postcodes",
      "Intercom",
    ],
    // db2-testing.nestegg.ai is website only, like dev.tradetaxi.ru.
    liveSites: ["loans.nestegg.ai", "db2-testing.nestegg.ai"],
  },
  {
    id: "coyote",
    title: "Frontend Developer",
    company: "COYOTE (Kazakhstan)",
    location: "Remote",
    dates: "2021 – 2022",
    bullets: [
      "Completed projects left unfinished by junior developers, improving code quality, performance and " +
        "maintainability.",
    ],
    stack: ["Next.js", "RTK Query", "Tailwind CSS", "Sass"],
    liveSites: ["qamqorshy.kz", "erp.cascompany.org"],
  },
  {
    id: "paybek",
    title: "Frontend Developer",
    company: "Paybek (FinTech)",
    location: "On-site, Uzbekistan",
    dates: "2020 – 2021",
    bullets: [
      "Led the frontend team and mentored 3 frontend developers with day-to-day supervision.",
      "Built CRM systems for 4 web products from scratch, then extended, refactored and supported them.",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux",
      "AG Grid",
      "Tailwind CSS",
      "Styled Components",
      "Sass",
    ],
    liveSites: ["portal.my-uhl.com"],
  },
  {
    id: "epam",
    title: "Frontend Developer",
    company: "EPAM Systems",
    location: "On-site, Uzbekistan",
    dates: "2019 – 2020",
    bullets: [
      "Built frontend authentication and authorization for a React Native app in a Scrum team using Jira and Figma.",
    ],
    stack: ["React Native", "Redux", "GraphQL", "TypeScript"],
    liveSites: [],
  },
];
