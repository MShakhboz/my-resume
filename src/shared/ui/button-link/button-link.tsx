import { tw } from "@/shared/lib/tw";
import { ComponentPropsWithoutRef } from "react";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  variant = "secondary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={tw(
        "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition",
        variant === "primary"
          ? "bg-orange-500 text-neutral-950 hover:bg-orange-400"
          : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white",
        className
      )}
      {...props}
    />
  );
}
