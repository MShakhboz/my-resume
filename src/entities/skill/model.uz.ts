import { SkillGroup } from "./types";

// Website only: translated from SKILLS in ../build_resume.py. Technology names stay as they are;
// only group labels and descriptions are translated.
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
    label: "Holat va maʼlumotlar",
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
    label: "Formalar va jadvallar",
    items: ["React Hook Form", "AG Grid", "TanStack Virtual (roʻyxatlarni virtualizatsiya qilish)"],
  },
  {
    id: "tools",
    label: "Vositalar",
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
      "GoDaddy",
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
