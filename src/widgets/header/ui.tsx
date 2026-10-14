import { Briefcase, GraduationCap, Mail, User, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { navItems, SectionId } from "@/shared/config";
import { tw } from "@/shared/lib/tw";

const icons: Record<SectionId, LucideIcon> = {
  about: User,
  experience: Briefcase,
  skills: Wrench,
  education: GraduationCap,
  contact: Mail,
};

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={tw(
        "sticky top-0 z-50 rounded-b-2xl bg-neutral-900/90 px-4 py-3 backdrop-blur",
        className
      )}
    >
      <nav aria-label="Sections">
        <ul className="flex items-center justify-between gap-1 sm:justify-center sm:gap-2">
          {navItems.map(({ id, label }) => {
            const Icon = icons[id];
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                >
                  <Icon aria-hidden size={18} />
                  <span className="sr-only sm:not-sr-only">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
