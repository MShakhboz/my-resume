import { Project } from "./types";

// Website only (not in the PDF). Every fact here comes from the job bullets in
// ../build_resume.py. To add a screenshot, put it in
// public/projects/ (16:10 crops best) and set `image`. `featured` projects show first;
// the rest are behind the "View more" button.
export const projects: Project[] = [
  {
    id: "hibro",
    featured: true,
    title: "Hi Bro",
    description:
      "AI guide to restaurant menus: guests scan a QR code or a menu, ask about dishes and build an order. " +
      "Built the Next.js guest app from scratch, the admin panel's features, and a headless-browser menu " +
      "reader for the Laravel API that reads menu sites like a guest's phone.",
    stack: ["Next.js", "TypeScript", "TanStack Query", "Zustand", "Laravel", "Playwright"],
    links: ["hibro.am"],
  },
  {
    id: "tradetaxi-crm",
    featured: true,
    title: "TradeTaxi fleet CRM",
    description:
      "Fleet-management CRM for a Russia-based taxi company, used by about 2,000 drivers. As the sole " +
      "frontend developer, built a browser-style multi-tab workspace that keeps each tab's page state and " +
      "scroll position, the Drivers, Vehicles and Fines modules with virtualized tables, and a real-time " +
      "support chat over WebSockets.",
    stack: ["Next.js", "TypeScript", "Mantine", "RTK Query", "TanStack Virtual", "Laravel Echo"],
    links: ["dev.tradetaxi.ru"],
  },
  {
    id: "nestegg-borrower-app",
    featured: true,
    title: "NestEgg borrower app",
    description:
      "Borrower-facing app for NestEgg, a UK loan-matching platform that connects borrowers with credit " +
      "unions. Built from scratch at Softwhere: the multi-step loan application, TrueLayer open-banking " +
      "connection, document upload, Ideal Postcodes address lookup and status tracking.",
    stack: ["React", "TypeScript", "Redux Toolkit", "RTK Query", "Material UI", "TrueLayer", "Ideal Postcodes"],
    links: ["loans.nestegg.ai"],
  },
  {
    id: "nestegg-lender-dashboard",
    featured: true,
    title: "NestEgg lender dashboard",
    description:
      "Dashboard for the credit unions that lend through NestEgg, used by 20+ lenders. Built from scratch " +
      "at Softwhere: application review with approve and decline decisions, filterable MUI X Data Grid Pro " +
      "tables, charts and reports, and LaunchDarkly feature flags.",
    stack: ["React", "TypeScript", "Redux Toolkit", "RTK Query", "MUI X Data Grid Pro", "LaunchDarkly", "Vite"],
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
      "Back-office ERP for restaurants. As the main frontend developer, built the warehouse documents " +
      "(invoices; transfer, write-off and inventory acts), stock balances, price lists, menu data with " +
      "recipe tech cards, an expenses register and sales charts, with Excel import/export and printing.",
    stack: ["React", "TypeScript", "Redux Toolkit", "Material UI", "MUI X Data Grid", "Recharts"],
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
  {
    id: "paybek-crm",
    title: "Paybek CRM systems",
    description:
      "CRM systems for 4 of Paybek's fintech web products. Led the frontend team and mentored 3 developers; " +
      "built the CRMs from scratch, then extended, refactored and supported them.",
    stack: ["React", "Next.js", "TypeScript", "Redux", "AG Grid", "Tailwind CSS"],
    links: ["portal.my-uhl.com"],
  },
];
