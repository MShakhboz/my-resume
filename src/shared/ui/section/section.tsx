import { tw } from "@/shared/lib/tw";
import { Title } from "@/shared/ui/title";
import { ReactNode, ElementType } from "react";

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** Renders an h2 and labels the section with it. Requires `id`. */
  title?: string;
} & React.ComponentPropsWithoutRef<T>;

export function Section<T extends ElementType = "section">({
  as,
  children,
  className,
  title,
  id,
  ...props
}: SectionProps<T>) {
  const Component = as || "section";
  const titleId = title && id ? `${id}-title` : undefined;

  return (
    <Component
      id={id}
      aria-labelledby={titleId}
      className={tw(
        "scroll-mt-24 rounded-2xl bg-surface px-6 py-6 sm:px-8",
        title && "space-y-5",
        className
      )}
      {...props}
    >
      {title && (
        <Title id={titleId} sm orange>
          {title}
        </Title>
      )}
      {children}
    </Component>
  );
}
