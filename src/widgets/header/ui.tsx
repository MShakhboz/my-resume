import { SectionNav } from "@/features/section-nav";
import { ThemeToggle } from "@/features/theme-toggle";
import { tw } from "@/shared/lib/tw";

/** Sticky nav bar for small screens; on desktop the nav sits in the hero sidebar. */
export function Header({ className }: { className?: string }) {
  return (
    <div
      className={tw(
        "sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur lg:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-3 py-2 sm:px-8">
        <SectionNav variant="bar" className="min-w-0 flex-1" />
        <ThemeToggle />
      </div>
    </div>
  );
}
