import { motion, useReducedMotion } from "framer-motion";

/**
 * Editorial brand illustrations rendered as inline SVGs. All use the
 * primary green and secondary amber, with subtle motion. Decorative —
 * always paired with text, marked aria-hidden.
 */

type IllustrationProps = {
  className?: string;
  size?: number;
};

const INK = "hsl(149 43% 17%)";
const AMBER = "hsl(38 94% 45%)";
const PAPER = "hsl(38 30% 88%)";

/* ── Compass losing its bearing — used for 404 ──────────── */
export function CompassLost({ className, size = 200 }: IllustrationProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="100" cy="100" r="78" stroke={INK} strokeWidth="1.6" opacity="0.25" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="62" stroke={INK} strokeWidth="1.8" />
      <circle cx="100" cy="100" r="56" stroke={INK} strokeWidth="0.6" opacity="0.35" />

      {/* Cardinal ticks */}
      {[0, 90, 180, 270].map(deg => (
        <line
          key={deg}
          x1="100" y1="42" x2="100" y2="50"
          stroke={INK} strokeWidth="1.5" strokeLinecap="round"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
      {[45, 135, 225, 315].map(deg => (
        <line
          key={deg}
          x1="100" y1="46" x2="100" y2="50"
          stroke={INK} strokeWidth="1" strokeLinecap="round" opacity="0.5"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}

      {/* Spinning, uncertain needle */}
      <motion.g
        style={{ transformOrigin: "100px 100px" }}
        initial={{ rotate: -22 }}
        animate={reduced ? undefined : { rotate: [-22, 18, -8, 24, -14, -22] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points="100,55 105,100 100,108 95,100" fill={AMBER} />
        <polygon points="100,145 105,100 100,92 95,100" fill={INK} opacity="0.7" />
        <circle cx="100" cy="100" r="4" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      </motion.g>

      {/* Pin label N */}
      <text x="100" y="36" textAnchor="middle" fontFamily="serif" fontSize="11" fontStyle="italic" fill={INK} opacity="0.6">N</text>
    </svg>
  );
}

/* ── Empty wishlist — fishhook with a heart-shaped barb ───── */
export function FishhookHeart({ className, size = 160 }: IllustrationProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Line drifting down */}
      <motion.path
        d="M80 8 Q78 38 82 64 Q86 80 80 92"
        stroke={INK}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.55"
        initial={{ pathLength: 0 }}
        animate={reduced ? { pathLength: 1 } : { pathLength: [0, 1] }}
        transition={{ duration: 2.4, repeat: reduced ? 0 : Infinity, repeatDelay: 1.6, ease: "easeOut" }}
      />
      {/* Hook */}
      <motion.g
        style={{ transformOrigin: "80px 92px" }}
        initial={{ rotate: -6 }}
        animate={reduced ? undefined : { rotate: [-6, 6, -3, 5, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M80 92 L80 120 Q80 140 60 140 Q42 140 42 122"
          stroke={INK}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Barb shaped like a tiny heart */}
        <path
          d="M40 118 C36 112 28 114 30 122 C32 128 40 132 42 132 C44 132 52 128 54 122 C56 114 48 112 44 118 Z"
          fill={AMBER}
          stroke={AMBER}
          strokeWidth="1"
        />
        {/* Eyelet */}
        <circle cx="80" cy="92" r="3" fill="none" stroke={INK} strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

/* ── Empty compare — apothecary balance scale ───────────── */
export function BalanceScale({ className, size = 180 }: IllustrationProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Stand */}
      <line x1="90" y1="40" x2="90" y2="150" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="62" y1="150" x2="118" y2="150" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="90" cy="40" r="3" fill={AMBER} />

      {/* Tilting bar with two pans */}
      <motion.g
        style={{ transformOrigin: "90px 50px" }}
        initial={{ rotate: -8 }}
        animate={reduced ? undefined : { rotate: [-8, 8, -4, 5, -8] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="40" y1="50" x2="140" y2="50" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        {/* Left chains */}
        <line x1="46" y1="50" x2="46" y2="78" stroke={INK} strokeWidth="1" opacity="0.7" />
        {/* Left pan */}
        <path d="M30 78 Q46 92 62 78 Z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="30" y1="78" x2="62" y2="78" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        {/* Right chains */}
        <line x1="134" y1="50" x2="134" y2="78" stroke={INK} strokeWidth="1" opacity="0.7" />
        {/* Right pan */}
        <path d="M118 78 Q134 92 150 78 Z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="118" y1="78" x2="150" y2="78" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        {/* Tiny weight on left */}
        <rect x="40" y="70" width="12" height="6" rx="1" fill={AMBER} />
      </motion.g>
    </svg>
  );
}

/* ── Empty catalog / no results — pine + dotted trail ───── */
export function PineTrail({ className, size = 170 }: IllustrationProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 170 170"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Pine tree (sarıçam = scotch pine — brand mark) */}
      <g>
        <polygon points="85,30 60,72 110,72" fill={INK} />
        <polygon points="85,52 52,98 118,98" fill={INK} />
        <polygon points="85,76 44,124 126,124" fill={INK} />
        <rect x="80" y="124" width="10" height="14" fill={AMBER} />
      </g>

      {/* Sun/light disc behind */}
      <circle cx="85" cy="48" r="20" fill={AMBER} opacity="0.18" />

      {/* Dotted trail walking away */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle
          key={i}
          cx={20 + i * 8}
          cy={148 - i * 1.5}
          r="1.6"
          fill={INK}
          opacity={0.55}
          animate={reduced ? undefined : { opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle
          key={`r${i}`}
          cx={150 - i * 8}
          cy={148 - i * 1.5}
          r="1.6"
          fill={INK}
          opacity={0.4}
          animate={reduced ? undefined : { opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18 + 0.6 }}
        />
      ))}
    </svg>
  );
}
