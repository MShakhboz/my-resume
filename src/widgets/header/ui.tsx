import { SectionNav } from "@/features/section-nav";
import { ThemeToggle } from "@/features/theme-toggle";
import { Locale } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";

/** Sticky nav bar for small screens; on desktop the nav sits in the hero sidebar. The language switch
 *  is in the hero at every size: this bar has no room for it on 320px phones. */
export function Header({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <div
      className={tw(
        "sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur lg:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-[86rem] items-center gap-1 px-3 py-2 sm:px-8">
        <SectionNav variant="bar" locale={locale} className="min-w-0 flex-1" />
        <ThemeToggle locale={locale} />
      </div>
    </div>
  );
}
