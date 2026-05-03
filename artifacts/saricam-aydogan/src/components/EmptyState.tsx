import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial empty-state shell — pairs a branded illustration with an
 * eyebrow / serif heading / body / CTA cluster. Animates in with the
 * same easing curve used across the editorial page transitions.
 */
export function EmptyState({
  illustration,
  eyebrow,
  title,
  italicAccent,
  description,
  actions,
  className,
  bordered = true,
}: {
  illustration: ReactNode;
  eyebrow?: string;
  title: string;
  italicAccent?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.18 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "text-center py-20 md:py-24 px-6",
        bordered && "border-y border-foreground/15",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.18 : 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="inline-flex justify-center mb-8"
      >
        {illustration}
      </motion.div>

      {eyebrow && (
        <span className="eyebrow justify-center">{eyebrow}</span>
      )}

      <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl mb-6">
        {title}
        {italicAccent && (
          <>
            {" "}
            <em className="italic text-secondary">{italicAccent}</em>
          </>
        )}
      </h2>

      {description && (
        <p className="text-foreground/65 max-w-md mx-auto mb-10 font-light leading-relaxed">
          {description}
        </p>
      )}

      {actions && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          {actions}
        </div>
      )}
    </motion.div>
  );
}
