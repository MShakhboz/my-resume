import { Download, MapPin } from "lucide-react";
import { contactIcons, profile } from "@/entities/profile";
import { resumePdfs } from "@/shared/config";
import { ButtonLink } from "@/shared/ui/button-link";
import { Monogram } from "@/shared/ui/monogram";
import { Section } from "@/shared/ui/section";
import { Title } from "@/shared/ui/title";

export function Hero() {
  const [headlineRole, headlineStack] = profile.headline.split(" | ");

  return (
    <Section aria-labelledby="hero-title">
      <div className="flex flex-col items-center gap-5 text-center">
        <Monogram initials={profile.initials} />

        <div className="space-y-2">
          <Title as="h1" id="hero-title" md>
            {profile.name}
          </Title>
          <p className="text-lg text-neutral-200">
            {headlineRole}
            {headlineStack && (
              <span className="block text-orange-400 sm:inline">
                <span className="hidden sm:inline"> · </span>
                {headlineStack}
              </span>
            )}
          </p>
          <p className="flex items-center justify-center gap-1.5 text-sm text-neutral-400">
            <MapPin aria-hidden size={16} />
            {profile.location} · {profile.availability}
          </p>
        </div>

        <ul aria-label="Contact links" className="flex items-center justify-center gap-2">
          {profile.contacts.map((contact) => {
            const Icon = contactIcons[contact.id];
            const external = contact.href.startsWith("http");
            return (
              <li key={contact.id}>
                <a
                  href={contact.href}
                  aria-label={contact.label}
                  title={contact.label}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition hover:bg-neutral-700 hover:text-orange-400"
                >
                  <Icon aria-hidden size={18} />
                </a>
              </li>
            );
          })}
        </ul>

        <ul aria-label="Download resume" className="flex flex-wrap items-center justify-center gap-2">
          {resumePdfs.map((pdf, i) => (
            <li key={pdf.href}>
              <ButtonLink
                href={pdf.href}
                download
                hrefLang={"hrefLang" in pdf ? pdf.hrefLang : undefined}
                variant={i === 0 ? "primary" : "secondary"}
              >
                <Download aria-hidden size={16} />
                {pdf.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
