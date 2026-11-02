import { profile } from "@/entities/profile";

export function Footer() {
  return (
    <footer className="space-y-2 border-t border-line py-10 text-sm text-muted">
      <p className="max-w-md leading-relaxed">
        Built with Next.js, TypeScript and Tailwind CSS. Tested with Vitest, React Testing Library
        and Playwright, with an axe accessibility scan in both themes, on GitHub Actions CI.
      </p>
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
