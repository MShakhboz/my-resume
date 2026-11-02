import { ReactNode } from "react";
import { tw } from "@/shared/lib/tw";

type TagProps = {
  children: ReactNode;
  /** `accent` highlights tech used on a job; `neutral` suits long skill lists. */
  variant?: "accent" | "neutral";
};

export function Tag({ children, variant = "neutral" }: TagProps) {
  return (
    <span
      className={tw(
        "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "accent" ? "bg-accent-soft text-accent" : "bg-raised text-body"
      )}
    >
      {children}
    </span>
  );
}
