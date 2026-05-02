import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface HeroSliderProps {
  images: string[];
  intervalMs?: number;
  className?: string;
}

/**
 * Cinematic hero slider — slides left every `intervalMs` (default 4000).
 * Falls back to a single static image when reduced motion is requested
 * or when only one image is provided.
 */
export function HeroSlider({
  images,
  intervalMs = 4000,
  className = "",
}: HeroSliderProps) {
  const safe = images.filter(Boolean);
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (safe.length <= 1 || reduce) return;
    const t = window.setTimeout(() => {
      setIdx((i) => (i + 1) % safe.length);
    }, intervalMs);
    return () => window.clearTimeout(t);
  }, [idx, safe.length, intervalMs, reduce]);

  // Preload the next image to keep transitions smooth.
  useEffect(() => {
    if (safe.length <= 1) return;
    const next = safe[(idx + 1) % safe.length];
    if (next) {
      const img = new Image();
      img.src = next;
    }
  }, [idx, safe]);

  if (safe.length === 0) {
    return <div className={`absolute inset-0 bg-primary ${className}`} />;
  }

  if (safe.length === 1 || reduce) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <img
          src={safe[0]}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={idx}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0"
        >
          <img
            src={safe[idx]}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : "auto"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators (bottom-left, hairline) */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex items-center gap-2.5">
        {safe.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}. görsele geç`}
            onClick={() => setIdx(i)}
            className="group/dot relative h-px w-8 md:w-10 overflow-hidden bg-white/30"
          >
            <span
              className={`absolute inset-0 origin-left bg-white transition-transform duration-500 ${
                i === idx ? "scale-x-100" : "scale-x-0 group-hover/dot:scale-x-50"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
