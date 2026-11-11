import { useId } from "react";
import styles from "./bot-icon.module.css";

// Fixed colours so the robot reads on both themes without a background circle.
const TOP = "#fb923c"; // orange-400, the lit top of the shell
const BODY = "#f97316"; // orange-500, shell and arms
const BOTTOM = "#ea580c"; // orange-600, the shaded bottom of the shell
const DARK = "#c2410c"; // orange-700, headphones, neck and shoulder bands
const SCREEN = "#1c1917"; // stone-900
const GLOW = "#fdba74"; // orange-300, eyes, smile, the AI badge and the antenna glow
const LIGHT = "#fff7ed"; // orange-50, the antenna tip and the shine

/**
 * A small friendly robot for the chat launcher: a glossy rounded shell with headphones, a face
 * screen and soft capsule arms. Decorative: the button carries the label. Without a size it fills
 * its container, so one drawing works at every button size. `stillArms` keeps the arms down, for
 * the small robot in the chat header, where waving would distract from reading.
 */
export function BotIcon({
  size,
  talking = false,
  thinking = false,
  stillArms = false,
}: {
  size?: number;
  talking?: boolean;
  /** While an answer is loading: the antenna light blinks. */
  thinking?: boolean;
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
      data-thinking={thinking || undefined}
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
      {/* Body, with a band at each shoulder and an AI badge */}
      <rect x="20" y="25.5" width="8" height="4" rx="1.5" fill={DARK} />
      {/* An egg-shaped torso: gently rounded shoulders, a fuller rounded belly */}
      <path d="M19 27.6 H29 Q34 27.6 34 33 V39.5 Q34 47.4 24 47.4 Q14 47.4 14 39.5 V33 Q14 27.6 19 27.6 Z" fill={fill} />
      <path d="M17.4 31.6 Q18.6 29.9 21 29.6" stroke={LIGHT} strokeOpacity="0.55" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* An "AI" badge on the chest: a small screen like the face, lettered in the eyes' glow */}
      <rect x="18.6" y="34.4" width="10.8" height="7.2" rx="2.6" fill={SCREEN} />
      <text
        x="24"
        y="39.9"
        textAnchor="middle"
        fontSize="5.4"
        fontWeight="800"
        letterSpacing="0.3"
        fill={GLOW}
        fontFamily="inherit"
      >
        AI
      </text>
      <rect x="13" y="29.4" width="4.4" height="6" rx="2.2" fill={DARK} />
      <rect x="30.6" y="29.4" width="4.4" height="6" rx="2.2" fill={DARK} />
      {/* Head: an antenna with a glowing tip, headphones with little fins, the shell with a shine,
          the face screen */}
      <g className={styles.head}>
        <line x1="24" y1="4.5" x2="24" y2="1.6" stroke={DARK} strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="24" cy="0.4" r="2.6" fill={GLOW} className={styles.antenna} />
        <circle cx="24" cy="0.4" r="1.5" fill={LIGHT} stroke={DARK} strokeWidth="0.7" />
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
