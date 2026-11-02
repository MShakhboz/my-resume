import { SkillGroup } from "./types";

// Source of truth: SKILLS in ../build_resume_ru.py (its lists differ slightly from the English PDF).
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
    label: "Данные",
    items: [
      "Redux",
      "Redux Toolkit",
      "RTK Query",
      "Redux-Saga",
      "GraphQL",
      "Apollo Client",
      "Axios",
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
    ],
  },
  {
    id: "forms",
    label: "Формы и таблицы",
    items: ["React Hook Form", "AG Grid", "TanStack Virtual (виртуализация списков)"],
  },
  {
    id: "tools",
    label: "Инструменты",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Jira",
      "Linear",
      "ClickUp",
      "Postman",
      "Swagger",
      "Figma",
      "AWS Amplify",
      "Resend",
    ],
  },
  {
    id: "practices",
    label: "Практики",
    items: ["доступность (WCAG)", "Agile", "Scrum", "менторинг", "frontend-архитектура", "рефакторинг"],
  },
];
