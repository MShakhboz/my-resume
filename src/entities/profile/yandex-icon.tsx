import type { SVGProps } from "react";

/**
 * The Yandex "Я", drawn in the same outline style as the Lucide icons beside it (which has no
 * Yandex icon): a stem, a bowl and a leg, in the current text colour.
 */
export function YandexIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16.5 3v18" />
      <path d="M16.5 3H12a4.75 4.75 0 0 0 0 9.5h4.5" />
      <path d="M12.6 12.5 7.5 21" />
    </svg>
  );
}
