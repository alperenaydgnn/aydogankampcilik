import { useRef, type MouseEvent, type RefObject } from "react";
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from "framer-motion";

interface TiltState {
  ref:        RefObject<HTMLDivElement | null>;
  rotateX:    MotionValue<number>;
  rotateY:    MotionValue<number>;
  shineX:     MotionValue<string>;
  shineY:     MotionValue<string>;
  onMove:     (e: MouseEvent) => void;
  onLeave:    () => void;
  onEnter:    () => void;
  isHovered:  MotionValue<number>;
  reduced:    boolean;
}

/**
 * Mouse-follow 3D tilt + radial spotlight tracker for premium card hovers.
 * - Springs are critically damped so cards never feel rubbery.
 * - Disabled entirely under `prefers-reduced-motion` (returns frozen MVs).
 * - Tilt magnitude is intentionally subtle (≤6°) so it reads as confident,
 *   not gimmicky.
 */
export function useTilt(maxTilt = 6): TiltState {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rxRaw = useMotionValue(0);
  const ryRaw = useMotionValue(0);
  const sxRaw = useMotionValue("50%");
  const syRaw = useMotionValue("50%");
  const hov   = useMotionValue(0);

  const spring = { stiffness: 220, damping: 24, mass: 0.5 } as const;
  const rotateX = useSpring(rxRaw, spring);
  const rotateY = useSpring(ryRaw, spring);
  const shineX  = useSpring(sxRaw, { stiffness: 180, damping: 26 }) as unknown as MotionValue<string>;
  const shineY  = useSpring(syRaw, { stiffness: 180, damping: 26 }) as unknown as MotionValue<string>;
  const isHovered = useSpring(hov, { stiffness: 220, damping: 26 });

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;
    rxRaw.set(-(py - 0.5) * 2 * maxTilt);
    ryRaw.set(  (px - 0.5) * 2 * maxTilt);
    sxRaw.set(`${px * 100}%`);
    syRaw.set(`${py * 100}%`);
  };

  const onEnter = () => { if (!reduced) hov.set(1); };
  const onLeave = () => {
    rxRaw.set(0);
    ryRaw.set(0);
    sxRaw.set("50%");
    syRaw.set("50%");
    hov.set(0);
  };

  return { ref, rotateX, rotateY, shineX, shineY, onMove, onEnter, onLeave, isHovered, reduced };
}
