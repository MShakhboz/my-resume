import { Github, Linkedin, Mail, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ContactLink } from "./types";

export const contactIcons: Record<ContactLink["id"], LucideIcon> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  telegram: Send,
};
