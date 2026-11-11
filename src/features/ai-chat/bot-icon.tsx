import { useId } from "react";
import styles from "./bot-icon.module.css";

// Fixed colours so the robot reads on both themes without a background circle.
const TOP = "#fb923c"; // orange-400, the lit top of the shell
const BODY = "#f97316"; // orange-500, shell and arms
const BOTTOM = "#ea580c"; // orange-600, the shaded bottom of the shell
const DARK = "#c2410c"; // orange-700, headphones, neck and shoulder bands
const SCREEN = "#1c1917"; // stone-900
const GLOW = "#fdba74"; // orange-300, eyes, smile and chest ring
const LIGHT = "#fff7ed"; // orange-50, the chest light and the shine

/**
 * A small friendly robot for the chat launcher: a glossy rounded shell with headphones, a face
 * screen and soft capsule arms. Decorative: the button carries the label. Without a size it fills
 * its container, so one drawing works at every button size. `stillArms` keeps the arms down, for
 * the small robot in the chat header, where waving would distract from reading.
 */
export function BotIcon({
  size,
  talking = false,
  stillArms = false,
}: {
  size?: number;
  talking?: boolean;
  stillArms?: boolean;
}) {
  // Several robots can be on the page at once, so each needs its own gradient id.
  const shell = `bot-shell-${useId().replace(/:/g, "")}`;
  const fill = `url(#${shell})`;
  return (
    <svg
      aria-hidden
      width={size ?? "100%"}
      height={size ?? "100%"}
      viewBox="0 0 48 48"
      className={styles.bot}
      data-talking={talking || undefined}
      data-still-arms={stillArms || undefined}
    >
      <defs>
        <linearGradient id={shell} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TOP} />
          <stop offset="1" stopColor={BOTTOM} />
        </linearGradient>
      </defs>
      {/* Capsule arms with a shoulder and an elbow, drawn first so the body covers where they join
          it. They hang straight down; the stylesheet lifts and bends them. */}
      <g className={`${styles.arm} ${styles.left}`}>
        <path d="M16 32 L13.2 37.2" stroke={BODY} strokeWidth="5" strokeLinecap="round" />
        <path d="M13.2 37.2 L12.6 42" stroke={BODY} strokeWidth="5" strokeLinecap="round" className={styles.forearm} />
      </g>
      <g className={styles.arm}>
        <path d="M32 32 L34.8 37.2" stroke={BODY} strokeWidth="5" strokeLinecap="round" />
        <path d="M34.8 37.2 L35.4 42" stroke={BODY} strokeWidth="5" strokeLinecap="round" className={styles.forearm} />
      </g>
      {/* Body with a glowing chest ring, and a band at each shoulder */}
      <rect x="20" y="25.5" width="8" height="4" rx="1.5" fill={DARK} />
      <rect x="14" y="28" width="20" height="17.5" rx="8.5" fill={fill} />
      <path d="M17.6 31.4 Q19 30 21.2 29.8" stroke={LIGHT} strokeOpacity="0.55" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="13" y="29.4" width="4.4" height="6" rx="2.2" fill={DARK} />
      <rect x="30.6" y="29.4" width="4.4" height="6" rx="2.2" fill={DARK} />
      <circle cx="24" cy="37" r="3.3" fill="none" stroke={GLOW} strokeWidth="1.6" className={styles.light} />
      <circle cx="24" cy="37" r="1.3" fill={LIGHT} />
      {/* Head: headphones with little fins, the shell with a shine, the face screen */}
      <g className={styles.head}>
        <path d="M7.6 10 L8.2 6.6 Q8.8 5.8 9.4 6.6 L10.4 10 Z" fill={DARK} />
        <path d="M40.4 10 L39.8 6.6 Q39.2 5.8 38.6 6.6 L37.6 10 Z" fill={DARK} />
        <rect x="6.4" y="9.4" width="4.8" height="12" rx="2.4" fill={DARK} />
        <rect x="36.8" y="9.4" width="4.8" height="12" rx="2.4" fill={DARK} />
        <rect x="9.6" y="4" width="28.8" height="23" rx="10" fill={fill} />
        <path d="M13.6 8.6 Q15.4 6.4 19 6" stroke={LIGHT} strokeOpacity="0.6" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <rect x="13.2" y="8.4" width="21.6" height="15" rx="6.5" fill={SCREEN} />
        <circle cx="19.4" cy="14.8" r="2.6" fill={GLOW} className={styles.eye} />
        <circle cx="28.6" cy="14.8" r="2.6" fill={GLOW} className={styles.eye} />
        {talking ? (
          <ellipse cx="24" cy="19.6" rx="3.2" ry="2.2" fill={GLOW} className={styles.mouth} />
        ) : (
          <path d="M21 18.6 Q24 21.2 27 18.6" stroke={GLOW} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
