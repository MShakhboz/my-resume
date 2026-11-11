import styles from "./bot-icon.module.css";

/** A small friendly robot for the chat launcher. Decorative: the button carries the label. */
export function BotIcon({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" className={styles.bot}>
      {/* Antenna */}
      <line x1="12" y1="4.6" x2="12" y2="7.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="3.4" r="1.6" fill="#fff7ed" className={styles.antenna} />
      {/* Ears */}
      <rect x="2.6" y="11.4" width="1.8" height="5" rx="0.9" fill="currentColor" />
      <rect x="19.6" y="11.4" width="1.8" height="5" rx="0.9" fill="currentColor" />
      {/* Head and face screen */}
      <rect x="4.2" y="7.2" width="15.6" height="13.4" rx="5" fill="currentColor" />
      <rect x="6.4" y="9.8" width="11.2" height="8" rx="3.6" fill="#7c2d12" />
      {/* Eyes and smile */}
      <circle cx="9.7" cy="13.2" r="1.35" fill="#fed7aa" className={styles.eye} />
      <circle cx="14.3" cy="13.2" r="1.35" fill="#fed7aa" className={styles.eye} />
      <path d="M10.3 15.6 Q12 16.9 13.7 15.6" stroke="#fed7aa" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
