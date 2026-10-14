import { contactIcons, profile } from "@/entities/profile";
import { Section } from "@/shared/ui/section";

export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="text-body">
        Open to senior React and Next.js roles, remote. Based in {profile.location}.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {profile.contacts.map((contact) => {
          const Icon = contactIcons[contact.id];
          const external = contact.href.startsWith("http");
          return (
            <li key={contact.id}>
              <a
                href={contact.href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="flex items-center gap-3 rounded-xl bg-raised p-3 transition hover:bg-raised-hover"
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
