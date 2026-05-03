import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Brand-aligned loader: a tiny campfire — two crossed logs with three
 * flickering flames in the brand amber. Falls back to a simple spinner
 * for users with prefers-reduced-motion.
 */
export function BrandLoader({
  size = 64,
  label,
  className,
  withLabel = true,
}: {
  size?: number;
  label?: string;
  className?: string;
  withLabel?: boolean;
}) {
  const t = useT();
  const reduced = useReducedMotion();
  const text = label ?? t("loading.page");

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-3", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden
      >
        {/* embers / sparks halo */}
        {!reduced && [0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx={32 + (i - 1) * 8}
            cy={20}
            r={0.8}
            fill="hsl(38 94% 55%)"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, -16, -22] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
          />
        ))}

        {/* outer flame */}
        <motion.path
          d="M32 50 C18 44 20 30 28 22 C26 30 32 32 32 26 C36 32 42 28 38 20 C46 28 48 42 32 50 Z"
          fill="hsl(38 94% 55%)"
          initial={{ scaleY: 0.94, opacity: 0.85 }}
          animate={reduced ? undefined : { scaleY: [0.94, 1.06, 0.97, 1.02, 0.94], opacity: [0.85, 1, 0.9, 1, 0.85] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "32px 50px" }}
        />
        {/* inner flame */}
        <motion.path
          d="M32 48 C25 44 26 35 30 30 C30 34 33 34 33 31 C35 35 38 33 36 28 C40 33 41 42 32 48 Z"
          fill="hsl(38 94% 70%)"
          initial={{ scaleY: 1, opacity: 0.9 }}
          animate={reduced ? undefined : { scaleY: [1, 1.1, 0.95, 1.05, 1], opacity: [0.9, 1, 0.85, 1, 0.9] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          style={{ transformOrigin: "32px 48px" }}
        />
        {/* core hottest flame */}
        <motion.ellipse
          cx="32"
          cy="44"
          rx="2.6"
          ry="4"
          fill="hsl(38 100% 88%)"
          animate={reduced ? undefined : { ry: [4, 5, 3.6, 4.4, 4], opacity: [0.85, 1, 0.85, 1, 0.85] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* crossed logs */}
        <g stroke="hsl(149 43% 17%)" strokeWidth="2.4" strokeLinecap="round">
          <line x1="14" y1="56" x2="50" y2="50" />
          <line x1="14" y1="50" x2="50" y2="56" />
        </g>
        <g stroke="hsl(38 30% 80%)" strokeWidth="0.6" strokeLinecap="round">
          <line x1="18" y1="55.4" x2="46" y2="51.6" />
          <line x1="18" y1="50.6" x2="46" y2="54.4" />
        </g>
      </svg>

      {withLabel && (
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-foreground/55">
          {text}
          <motion.span
            aria-hidden
            initial={{ opacity: 0.2 }}
            animate={reduced ? undefined : { opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            …
          </motion.span>
        </span>
      )}
      <span className="sr-only">{text}</span>
    </div>
  );
}
