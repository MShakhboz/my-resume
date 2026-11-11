import styles from "./bot-icon.module.css";

// Fixed colours so the robot reads on both themes without a background circle.
const BODY = "#f97316"; // orange-500
const DARK = "#c2410c"; // orange-700, ears and arms
const SCREEN = "#1c1917"; // stone-900
const GLOW = "#fdba74"; // orange-300, eyes and smile
const LIGHT = "#fff7ed"; // orange-50, antenna and chest lights

/**
 * A small friendly robot for the chat launcher. Decorative: the button carries the label. Without
 * a size it fills its container, so one drawing works at every button size.
 */
export function BotIcon({ size, talking = false }: { size?: number; talking?: boolean }) {
  return (
    <svg
      aria-hidden
      width={size ?? "100%"}
      height={size ?? "100%"}
      viewBox="0 0 48 48"
      className={styles.bot}
      data-talking={talking || undefined}
    >
      {/* Body, chest light and the resting left arm */}
      <path d="M15.5 38 L10 42.5" stroke={DARK} strokeWidth="3.2" strokeLinecap="round" />
      <rect x="15" y="34" width="18" height="11" rx="5" fill="#ea580c" />
      <circle cx="24" cy="39.5" r="1.6" fill={LIGHT} className={styles.light} />
      {/* The waving right arm, with a hand */}
      <g className={styles.arm}>
        <path d="M33 37.5 L39 31.5" stroke={DARK} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="39.6" cy="30.6" r="2.2" fill={DARK} />
      </g>
      {/* Head: antenna, ears, face screen, eyes and smile */}
      <g className={styles.head}>
        <line x1="24" y1="7.6" x2="24" y2="11.5" stroke={DARK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="5.6" r="2.6" fill={LIGHT} stroke={DARK} strokeWidth="1" className={styles.light} />
        <rect x="5.6" y="17" width="3.6" height="9" rx="1.8" fill={DARK} />
        <rect x="38.8" y="17" width="3.6" height="9" rx="1.8" fill={DARK} />
        <rect x="9" y="11" width="30" height="22" rx="9" fill={BODY} />
        <rect x="13" y="15" width="22" height="14" rx="6" fill={SCREEN} />
        <circle cx="19" cy="21.6" r="2.6" fill={GLOW} className={styles.eye} />
        <circle cx="29" cy="21.6" r="2.6" fill={GLOW} className={styles.eye} />
        {talking ? (
          <ellipse cx="24" cy="26.2" rx="3.8" ry="2.6" fill={GLOW} className={styles.mouth} />
        ) : (
          <path d="M20.4 25.2 Q24 28 27.6 25.2" stroke={GLOW} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
