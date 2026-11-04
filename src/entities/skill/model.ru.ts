import { SkillGroup } from "./types";

// Source of truth: SKILLS in ../build_resume_ru.py (its lists differ slightly from the English PDF).
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
    label: "Данные",
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
    label: "Формы и таблицы",
    items: ["React Hook Form", "Zod", "AG Grid", "MUI X Data Grid", "TanStack Virtual (виртуализация)"],
  },
  {
    id: "testing",
    label: "Тестирование",
    items: ["Vitest", "React Testing Library", "Playwright", "MSW"],
  },
  {
    id: "tools",
    label: "Инструменты",
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
    ],
  },
  {
    id: "practices",
    label: "Практики",
    items: ["доступность (WCAG)", "Agile", "Scrum", "менторинг", "frontend-архитектура", "рефакторинг"],
  },
];
