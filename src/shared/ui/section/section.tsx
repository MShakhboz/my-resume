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
      // Clears the sticky mobile nav bar; on desktop the nav lives in the sidebar.
      className={tw("scroll-mt-20 lg:scroll-mt-16", title && "space-y-8", className)}
      {...props}
    >
      {title && (
        <Title
          id={titleId}
          className="flex items-center gap-4 text-sm uppercase tracking-widest text-strong"
        >
          {title}
          <span aria-hidden className="h-px flex-1 bg-line" />
        </Title>
      )}
      {children}
    </Component>
  );
}
