import { SkillGroup } from "./types";

// Source of truth: SKILLS in ../build_resume.py.
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js",
      "React Native",
      "Solid.js",
      "HTML5",
      "CSS3",
      "Sass",
    ],
  },
  {
    id: "data",
    label: "Data",
    items: [
      "Redux",
      "Redux Toolkit",
      "RTK Query",
      "TanStack Query",
      "Zustand",
      "GraphQL",
      "Apollo Client",
      "REST APIs",
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
    ],
  },
  {
    id: "forms",
    label: "Forms and tables",
    items: ["React Hook Form", "Zod", "AG Grid", "MUI X Data Grid", "TanStack Virtual (list virtualization)"],
  },
  {
    id: "testing",
    label: "Testing",
    items: ["Vitest", "React Testing Library", "Playwright", "MSW"],
  },
  {
    id: "tools",
    label: "Tools",
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
    label: "Practices",
    items: [
      "Accessibility (WCAG, WAVE, IBM Equal Access)",
      "Agile",
      "Scrum",
      "mentoring",
      "frontend architecture",
    ],
  },
];
