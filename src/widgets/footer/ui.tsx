import { profile } from "@/entities/profile";

export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-neutral-400">
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
