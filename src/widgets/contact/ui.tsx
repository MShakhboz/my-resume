import { Mail } from "lucide-react";
import { contactIcons, profile } from "@/entities/profile";
import { ButtonLink } from "@/shared/ui/button-link";
import { Section } from "@/shared/ui/section";

export function Contact() {
  const email = profile.contacts.find((contact) => contact.id === "email");

  return (
    <Section id="contact" title="Contact">
      <div className="space-y-4">
        <p className="text-2xl font-semibold tracking-tight text-strong sm:text-3xl">
          Open to senior React and Next.js roles, remote.
        </p>
        <p className="text-body">Based in {profile.location}.</p>
        {email && (
          <ButtonLink href={email.href} variant="primary" className="px-5 py-2.5">
            <Mail aria-hidden size={16} />
            Email me
          </ButtonLink>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {profile.contacts.map((contact) => {
          const Icon = contactIcons[contact.id];
          const external = contact.href.startsWith("http");
          return (
            <li key={contact.id}>
              <a
                href={contact.href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line transition hover:ring-accent"
              >
                <Icon aria-hidden size={20} className="shrink-0 text-accent" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">
                    {contact.id === "telegram" ? "Telegram / WhatsApp" : contact.label}
                  </span>
                  <span className="block truncate text-sm text-foreground">{contact.display}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
