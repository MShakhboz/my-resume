export type SkillGroup = {
  /** Language-neutral; picks the group's icon. */
  id: "frontend" | "data" | "ui" | "forms" | "tools" | "practices";
  label: string;
  items: string[];
};
