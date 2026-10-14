import { contactIcons, profile } from "@/entities/profile";
import { Section } from "@/shared/ui/section";

export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="text-neutral-300">
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
                className="flex items-center gap-3 rounded-xl bg-neutral-800 p-3 transition hover:bg-neutral-700"
              >
                <Icon aria-hidden size={20} className="shrink-0 text-orange-400" />
                <span className="min-w-0">
                  <span className="block text-xs text-neutral-400">
                    {contact.id === "telegram" ? "Telegram / WhatsApp" : contact.label}
                  </span>
                  <span className="block truncate text-sm text-neutral-100">{contact.display}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
