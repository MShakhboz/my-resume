import { profile } from "@/entities/profile";

export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-muted">
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
