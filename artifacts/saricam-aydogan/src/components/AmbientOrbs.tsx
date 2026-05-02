import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AmbientOrbsProps {
  /** Tone of the orbs. */
  variant?: "amber" | "primary" | "mixed";
  /** Reduce orb size + count for tighter heros. */
  size?:    "sm" | "md" | "lg";
  className?: string;
}

/**
 * Slow, decorative gradient blobs that drift behind hero content.
 * - GPU-only transforms (translate / scale).
 * - Hidden under `prefers-reduced-motion`.
 * - Disabled below `md` breakpoint to spare mobile GPUs.
 * - Pointer-events disabled; purely cosmetic.
 */
export function AmbientOrbs({
  variant = "mixed",
  size = "md",
  className,
}: AmbientOrbsProps) {
  const prefersReduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Only render on tablet+ to spare mobile GPUs (large blurred radial gradients
  // are expensive). We listen to the `(min-width: 768px)` media query.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (prefersReduce || !enabled) return null;

  const dim = size === "sm" ? 280 : size === "lg" ? 480 : 380;

  const orbs = (variant === "primary"
    ? [
        { color: "hsl(149 60% 35% / 0.55)", x: "10%", y: "20%", delay: 0 },
        { color: "hsl(149 50% 25% / 0.45)", x: "75%", y: "70%", delay: 4 },
      ]
    : variant === "amber"
    ? [
        { color: "hsl(38 94% 55% / 0.40)", x: "12%", y: "25%", delay: 0 },
        { color: "hsl(28 95% 50% / 0.32)", x: "78%", y: "68%", delay: 5 },
      ]
    : [
        { color: "hsl(38 94% 55% / 0.32)", x: "8%",  y: "18%", delay: 0 },
        { color: "hsl(149 50% 35% / 0.32)", x: "82%", y: "70%", delay: 4 },
        { color: "hsl(38 75% 55% / 0.20)", x: "65%", y: "12%", delay: 7 },
      ]
  );

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden
    >
      {orbs.map((o, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full"
          style={{
            left: o.x,
            top: o.y,
            width: dim,
            height: dim,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            willChange: "transform",
          }}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x:    [0, 30, -20, 0],
            y:    [0, -25, 15, 0],
            scale:[1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 18,
            ease: "easeInOut",
            repeat: Infinity,
            delay: o.delay,
          }}
        />
      ))}
    </div>
  );
}
