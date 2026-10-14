type MonogramProps = {
  initials: string;
  size?: number;
};

/** Placeholder avatar until a real photo is added to public/. */
export function Monogram({ initials, size = 112 }: MonogramProps) {
  return (
    <div className="relative inline-block" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-25 blur-lg" />
      <div
        style={{ width: size, height: size, fontSize: size * 0.36 }}
        className="relative flex items-center justify-center rounded-full border-4 border-neutral-800 bg-gradient-to-br from-orange-400 to-orange-600 font-bold tracking-tight text-neutral-950 shadow-lg"
      >
        {initials}
      </div>
    </div>
  );
}
