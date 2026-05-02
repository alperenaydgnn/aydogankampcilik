import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode, type ElementType } from "react";
import { easeOut, durations } from "@/lib/motion";

type RevealAs = "div" | "section" | "article" | "header" | "footer" |
  "h1" | "h2" | "h3" | "h4" | "p" | "span" | "ul" | "li" | "nav";

interface RevealProps {
  children:   ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?:     number;
  /** Travel distance in px. Default 24. */
  y?:         number;
  /** HTML element rendered as. Default `div`. */
  as?:        RevealAs;
  /** Animate every time the element enters the viewport. Default false. */
  repeat?:    boolean;
  /** IntersectionObserver root margin. Default `-50px`. */
  margin?:    string;
  /** Animation duration. Default 0.55s. */
  duration?:  number;
  /** Disable motion entirely. */
  disabled?:  boolean;
}

/**
 * `<Reveal>` — drop-in scroll-reveal wrapper.
 *
 * - Respects `prefers-reduced-motion` (fades only, no translation, very fast).
 * - Uses brand-standard ease curve.
 * - Polymorphic via `as` prop so it can replace any block element directly.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
  repeat = false,
  margin = "-50px",
  duration = durations.md + 0.1,
  disabled = false,
}: RevealProps) {
  const prefersReduce = useReducedMotion();
  const Tag = motion[as] as ElementType;

  if (disabled) {
    const Static = as as ElementType;
    return <Static className={className}>{children}</Static>;
  }

  const variants: Variants = prefersReduce
    ? {
        hidden: { opacity: 0 },
        show:   { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y },
        show:   {
          opacity: 1, y: 0,
          transition: { duration, delay, ease: easeOut },
        },
      };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin }}
    >
      {children}
    </Tag>
  );
}
