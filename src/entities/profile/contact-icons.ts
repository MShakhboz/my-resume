import { Github, Linkedin, Mail, Send } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { ContactLink } from "./types";
import { YandexIcon } from "./yandex-icon";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export const contactIcons: Record<ContactLink["id"], Icon> = {
  email: Mail,
  "email-yandex": YandexIcon,
  linkedin: Linkedin,
  github: Github,
  telegram: Send,
};
