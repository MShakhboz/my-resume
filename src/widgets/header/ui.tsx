import { Briefcase, GraduationCap, Mail, User, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/features/theme-toggle";
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
        "sticky top-0 z-50 flex items-center gap-1 rounded-b-2xl bg-surface/90 px-2 py-3 backdrop-blur sm:px-4",
        className
      )}
    >
      <nav aria-label="Sections" className="min-w-0 flex-1">
        <ul className="flex items-center justify-between gap-1 sm:justify-center sm:gap-2">
          {navItems.map(({ id, label }) => {
            const Icon = icons[id];
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm sm:px-3 text-muted transition hover:bg-raised hover:text-strong"
                >
                  <Icon aria-hidden size={18} />
                  <span className="sr-only sm:not-sr-only">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  );
}
