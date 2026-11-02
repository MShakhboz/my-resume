import { getProfile } from "@/entities/profile";
import { getDictionary, Locale } from "@/shared/i18n";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="space-y-2 border-t border-line py-10 text-sm text-muted">
      <p className="max-w-md leading-relaxed">{getDictionary(locale).footer}</p>
      <p>
        © {new Date().getFullYear()} {getProfile(locale).name}
      </p>
    </footer>
  );
}
