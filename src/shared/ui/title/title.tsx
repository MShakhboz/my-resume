import { tw } from "@/shared/lib/tw";
import { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  orange?: boolean;
  gray?: boolean;
  lg?: boolean;
  md?: boolean;
  sm?: boolean;
  xs?: boolean;
};

export function Title({
  children,
  as: Component = "h2",
  id,
  className,
  orange,
  gray,
  lg,
  md,
  sm,
  xs,
}: TitleProps) {
  return (
    <Component
      id={id}
      className={tw(
        "text-4xl font-bold tracking-tight text-foreground",
        lg && "text-4xl",
        md && "text-3xl",
        sm && "text-2xl",
        xs && "text-xl",
        orange && "text-accent",
        gray && "text-muted",
        className
      )}
    >
      {children}
    </Component>
  );
}
