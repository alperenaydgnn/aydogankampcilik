import type { Transition, Variants } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;
export const easeSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.6,
};

export const durations = {
  xs: 0.18,
  sm: 0.28,
  md: 0.45,
  lg: 0.65,
  xl: 0.9,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,
    transition: { duration: durations.md, ease: easeOut } },
};

export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0,
    transition: { duration: durations.sm, ease: easeOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: durations.md, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show:   { opacity: 1, scale: 1,
    transition: { duration: durations.md, ease: easeOut } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0,
    transition: { duration: durations.md, ease: easeOut } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0,
    transition: { duration: durations.md, ease: easeOut } },
};

export const stagger = (children = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: children,
      delayChildren,
    },
  },
});

/** Standard press/hover for primary surfaces — subtle and brand-correct. */
export const pressTap = {
  whileHover: { y: -2, transition: { duration: durations.xs, ease: easeOut } },
  whileTap:   { scale: 0.97, y: 0, transition: { duration: 0.1, ease: easeOut } },
};

/** Page transition variants — gentle fade + tiny y motion. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeOut } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.18, ease: easeOut } },
};
