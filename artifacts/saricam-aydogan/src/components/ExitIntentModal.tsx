import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { formatPriceLabel } from "@/lib/mockData";

const SHOWN_KEY = "saricam-exit-intent-shown-v1";

export function ExitIntentModal() {
  const { items, count, total, hasNumericPrices, openCheckout } = useCart();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SHOWN_KEY) === "1") return;
    if (items.length === 0) return;
    // Arm after a short delay so it doesn't trigger right after page load
    const t = setTimeout(() => setArmed(true), 6000);
    return () => clearTimeout(t);
  }, [items.length]);

  useEffect(() => {
    if (!armed) return;
    if (sessionStorage.getItem(SHOWN_KEY) === "1") return;

    const trigger = () => {
      if (sessionStorage.getItem(SHOWN_KEY) === "1") return;
      sessionStorage.setItem(SHOWN_KEY, "1");
      setOpen(true);
      trackEvent({ event: "exit_intent_shown", source: "exit_intent_modal", item_count: count });
    };

    const onMouseOut = (e: MouseEvent) => {
      // Top edge exit
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };

    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [armed, count]);

  const close = () => setOpen(false);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (f.length === 0) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const goCheckout = () => {
    trackEvent({ event: "exit_intent_cta", source: "exit_intent_modal", item_count: count });
    setOpen(false);
    openCheckout();
  };

  return (
    <AnimatePresence>
      {open && items.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-foreground/65 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Sepetinizi tamamlayın"
              className="bg-background w-full max-w-lg pointer-events-auto shadow-2xl relative overflow-hidden outline-none"
            >
              <button
                onClick={close}
                aria-label="Kapat"
                className="absolute top-4 right-4 z-10 p-2 text-foreground/55 hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Editorial header band */}
              <div className="bg-primary px-8 py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag className="w-6 h-6 text-secondary" strokeWidth={1.75} />
                </div>
                <span className="inline-block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-secondary mb-3">
                  Bir Saniye —
                </span>
                <h3 className="font-serif font-light text-white text-3xl md:text-4xl tracking-tight leading-tight">
                  Sepetinizi <em className="italic text-secondary">unutmayın.</em>
                </h3>
              </div>

              <div className="px-8 py-8 text-center">
                <p className="text-foreground/65 font-light leading-relaxed mb-2">
                  Sepetinizde {count} ürün sizi bekliyor{hasNumericPrices && total > 0 && (
                    <> · Toplam <span className="font-medium text-foreground">{formatPriceLabel(total)}</span></>
                  )}.
                </p>
                <p className="text-sm text-foreground/55 font-light leading-relaxed mb-6">
                  WhatsApp üzerinden 2 dakikada siparişinizi tamamlayabilir, stok ve kargo bilgisini anında alabilirsiniz.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center">
                  <button
                    onClick={goCheckout}
                    className="btn-cta-amber btn-cta inline-flex items-center justify-center gap-2 !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
                  >
                    Şimdi Gönder <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={close}
                    className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/55 hover:text-foreground transition py-3"
                  >
                    Daha Sonra
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
