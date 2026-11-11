import { getProfile } from "@/entities/profile";
import { getDictionary, Locale } from "@/shared/i18n";

export function Footer({ locale }: { locale: Locale }) {
  // Extra bottom room on phones so the round chat button never covers the last line.
  return (
    <footer className="space-y-2 border-t border-line pt-10 pb-24 text-sm text-muted sm:pb-10">
      <p className="max-w-md leading-relaxed">{getDictionary(locale).footer}</p>
      <p>
        © {new Date().getFullYear()} {getProfile(locale).name}
      </p>
    </footer>
  );
}
