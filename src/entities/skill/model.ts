import { SkillGroup } from "./types";

// Source of truth: SKILLS in ../build_resume.py.
export const skillGroups: SkillGroup[] = [
  {
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
    label: "State and data",
    items: [
      "Redux",
      "Redux Toolkit",
      "RTK Query",
      "Redux-Saga",
      "GraphQL",
      "Apollo Client",
      "Axios",
      "REST APIs",
    ],
  },
  {
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
    label: "Forms and tables",
    items: ["React Hook Form", "AG Grid", "TanStack Virtual (list virtualization)"],
  },
  {
    label: "Tools",
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
