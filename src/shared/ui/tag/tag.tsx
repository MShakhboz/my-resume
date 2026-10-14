import { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
      {children}
    </span>
  );
}
