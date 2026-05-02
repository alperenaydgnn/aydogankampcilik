import { useRef, useState, type ReactNode, type MouseEvent, type Ref } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

interface BaseProps {
  children:   ReactNode;
  className?: string;
  /** Magnetic strength in px. Default 6. */
  intensity?: number;
  ariaLabel?: string;
}

interface ButtonProps extends BaseProps {
  type?:    "button" | "submit";
  onClick?: (e: MouseEvent) => void;
  disabled?:boolean;
  href?:    undefined;
  external?:undefined;
}

interface AnchorProps extends BaseProps {
  href:      string;
  external?: boolean;
  onClick?:  (e: MouseEvent) => void;
}

type Props = ButtonProps | AnchorProps;

/**
 * `<MagneticButton>` — wraps a CTA with subtle cursor-follow + press scale.
 *
 * - Movement is small (≤ 6 px) so it feels confident, not gimmicky.
 * - Hover/active states are GPU-only transforms.
 * - Disabled entirely under `prefers-reduced-motion`.
 * - Renders as a real `<a>` (internal — wouter SPA-nav via setLocation), an
 *   `<a target="_blank">` (external), or `<button>` based on props passed.
 *   Motion + aria attach to the *interactive* element so screen readers and
 *   keyboard focus stay correct.
 */
export function MagneticButton(props: Props) {
  const { children, className, intensity = 6, ariaLabel } = props;
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [, setLocation] = useLocation();

  const handleMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setPos({
      x: Math.max(-1, Math.min(1, dx)) * intensity,
      y: Math.max(-1, Math.min(1, dy)) * intensity,
    });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const shell = {
    onMouseMove:   handleMove,
    onMouseLeave:  reset,
    animate:       { x: pos.x, y: pos.y },
    transition:    { type: "spring" as const, stiffness: 260, damping: 22, mass: 0.5 },
    whileHover:    reduce ? undefined : { scale: 1.015, transition: { duration: 0.18, ease: easeOut } },
    whileTap:      { scale: 0.96, transition: { duration: 0.1, ease: easeOut } },
    className:     cn("inline-flex items-center justify-center", className),
  };

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <motion.a
          ref={ref as Ref<HTMLAnchorElement>}
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={props.onClick}
          aria-label={ariaLabel}
          {...shell}
        >
          {children}
        </motion.a>
      );
    }
    // Internal: render a real <a> for accessibility/SEO/right-click, but
    // intercept the click for SPA navigation through wouter.
    const internalHref = props.href;
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        href={internalHref}
        onClick={(e) => {
          // Let modifier-clicks / non-primary buttons fall through (open new tab, etc).
          if (
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
            (typeof e.button === "number" && e.button !== 0)
          ) return;
          e.preventDefault();
          props.onClick?.(e);
          setLocation(internalHref);
        }}
        aria-label={ariaLabel}
        {...shell}
      >
        {children}
      </motion.a>
    );
  }

  const btn = props as ButtonProps;
  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      type={btn.type ?? "button"}
      onClick={btn.onClick}
      disabled={btn.disabled}
      aria-label={ariaLabel}
      {...shell}
    >
      {children}
    </motion.button>
  );
}
