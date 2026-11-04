import { SkillGroup } from "./types";

// Website only: translated from SKILLS in ../build_resume.py. Technology names stay as they are;
// only group labels and descriptions are translated.
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "React Native",
      "Solid.js",
      "HTML5",
      "CSS3",
      "Sass",
      "WebSockets",
    ],
  },
  {
    id: "data",
    label: "Maʼlumotlar",
    items: [
      "Redux",
      "Redux Toolkit",
      "RTK Query",
      "TanStack Query",
      "Zustand",
      "GraphQL",
      "Apollo Client",
      "REST API",
    ],
  },
  {
    id: "ui",
    label: "UI",
    items: [
      "Mantine",
      "Material UI",
      "Ant Design",
      "Tailwind CSS",
      "Styled Components",
      "Framer Motion",
      "MUI X Charts",
      "Recharts",
    ],
  },
  {
    id: "forms",
    label: "Formalar va jadvallar",
    items: [
      "React Hook Form",
      "Zod",
      "AG Grid",
      "MUI X Data Grid",
      "TanStack Virtual (roʻyxatlarni virtualizatsiya qilish)",
    ],
  },
  {
    id: "testing",
    label: "Testlash",
    items: ["Vitest", "React Testing Library", "Playwright", "MSW"],
  },
  {
    id: "tools",
    label: "Vositalar",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Vite",
      "Docker",
      "Jira",
      "Linear",
      "Postman",
      "Swagger",
      "Figma",
      "LaunchDarkly",
      "AWS Amplify",
    ],
  },
  {
    id: "practices",
    label: "Amaliyotlar",
    items: [
      "Foydalanish qulayligi (WCAG, WAVE, IBM Equal Access)",
      "Agile",
      "Scrum",
      "mentorlik",
      "frontend arxitekturasi",
    ],
  },
];
