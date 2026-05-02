import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/** Strip query and hash from a wouter location to get the pathname only. */
function pathOnly(loc: string) {
  return loc.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
}

/**
 * Scroll-to-top on route (path) change. No animation; just snap when the
 * pathname truly changes — preserves anchor/hash navigation and queries.
 */
export function ScrollToTop() {
  const [location] = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const next = pathOnly(location);
    if (prevPath.current !== null && prevPath.current !== next) {
      // Defer to the next frame so the new page has mounted first.
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }
    prevPath.current = next;
  }, [location]);

  return null;
}

/**
 * Premium top route progress bar.
 * - Animates 0% → 80% on route change start, → 100% briefly, then fades.
 * - 2 px high, brand-amber gradient.
 * - Hidden under `prefers-reduced-motion`.
 */
export function RouteProgress() {
  const [location] = useLocation();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const firstRun = useRef(true);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const next = pathOnly(location);
    if (firstRun.current) {
      firstRun.current = false;
      prevPath.current = next;
      return;
    }
    if (prevPath.current === next) return; // ignore hash/query-only changes
    prevPath.current = next;
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 600);
    return () => window.clearTimeout(t);
  }, [location]);

  if (reduce) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      aria-hidden
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key={location}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1,  opacity: 1 }}
            exit={{    scaleX: 1,  opacity: 0 }}
            transition={{
              scaleX:  { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.25, delay: 0.45 },
            }}
            className="h-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, hsl(38 94% 55%) 0%, hsl(38 94% 65%) 50%, hsl(149 43% 35%) 100%)",
              boxShadow: "0 0 8px hsl(38 94% 55% / 0.55)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
