import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, Loader2 } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackWhatsAppClick, WhatsAppTrackingData } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type FeedbackState = "idle" | "opening" | "done";

type Size = "sm" | "md" | "lg";
type Variant = "solid" | "outline";

interface WhatsAppButtonProps {
  message: string;
  tracking?: WhatsAppTrackingData;
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  rounded?: "pill" | "xl";
  label?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2.5 text-xs gap-1.5",
  md: "px-6 py-3.5 text-sm gap-2",
  lg: "px-8 py-4 text-base gap-2.5",
};

const iconSize: Record<Size, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const labelsByState: Record<FeedbackState, string> = {
  idle: "",
  opening: "Açılıyor...",
  done: "WhatsApp Açıldı!",
};

/* ── Animated inner content ──────────────────────────────────────────── */
function ButtonContent({
  state,
  label,
  size,
  variant,
}: {
  state: FeedbackState;
  label: string;
  size: Size;
  variant: Variant;
}) {
  const icon = iconSize[size];
  const color = variant === "outline" ? "text-[#25D366]" : "text-white";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "idle" && (
        <motion.span
          key="idle"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-[inherit]"
        >
          <MessageCircle className={cn(icon, color)} />
          <span>{label}</span>
        </motion.span>
      )}
      {state === "opening" && (
        <motion.span
          key="opening"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-[inherit]"
        >
          <Loader2 className={cn(icon, color, "animate-spin")} />
          <span>Açılıyor...</span>
        </motion.span>
      )}
      {state === "done" && (
        <motion.span
          key="done"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="flex items-center gap-[inherit]"
        >
          <Check className={cn(icon, color)} />
          <span>WhatsApp Açıldı!</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
export function WhatsAppButton({
  message,
  tracking,
  size = "md",
  variant = "solid",
  fullWidth = false,
  rounded = "xl",
  label = "WhatsApp ile Sipariş Ver",
  className,
  onClick,
}: WhatsAppButtonProps) {
  const [state, setState] = useState<FeedbackState>("idle");

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);

    if (tracking) trackWhatsAppClick(tracking);

    setState("opening");
    const t1 = setTimeout(() => setState("done"), 900);
    const t2 = setTimeout(() => setState("idle"), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  const solidStyle: React.CSSProperties =
    state === "done"
      ? { background: "hsl(142 76% 42%)", boxShadow: "0 0 0 3px rgba(37,211,102,0.25)" }
      : { background: "linear-gradient(135deg, #25D366 0%, #1aaa57 100%)", boxShadow: "0 4px 16px rgba(37,211,102,0.28)" };

  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "relative inline-flex items-center justify-center font-bold select-none overflow-hidden transition-all duration-200",
        sizeStyles[size],
        rounded === "pill" ? "rounded-full" : "rounded-xl",
        fullWidth && "w-full",
        variant === "solid" && "text-white hover:opacity-92 hover:-translate-y-px active:scale-[0.98]",
        variant === "outline" && "border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/8 active:scale-[0.98]",
        state === "done" && "scale-[0.99]",
        className
      )}
      style={variant === "solid" ? solidStyle : undefined}
    >
      {/* Ripple on done */}
      <AnimatePresence>
        {state === "done" && variant === "solid" && (
          <motion.span
            key="ripple"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0 rounded-[inherit] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      <ButtonContent state={state} label={label} size={size} variant={variant} />
    </a>
  );
}

/* ── Convenience: disabled OOS button ──────────────────────────────── */
export function OutOfStockButton({ size = "md", fullWidth = false }: { size?: Size; fullWidth?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold text-muted-foreground bg-muted rounded-xl cursor-not-allowed select-none",
        sizeStyles[size],
        fullWidth && "w-full"
      )}
      aria-disabled="true"
    >
      <MessageCircle className={cn(iconSize[size], "opacity-40")} />
      <span>Ürün Tükendi</span>
    </div>
  );
}
