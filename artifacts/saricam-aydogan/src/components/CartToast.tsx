import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

export function CartToast() {
  const { toast, dismissToast, open } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-24 right-4 sm:right-6 z-[75] bg-background border border-foreground/15 shadow-xl max-w-sm w-[calc(100vw-2rem)] sm:w-auto"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-1">
                Sepete eklendi
              </p>
              <p className="text-sm text-foreground/85 font-light line-clamp-1">
                {toast.item.name}
              </p>
              <p className="text-[0.7rem] text-foreground/55 font-light mt-1">
                Sepetinizde {toast.totalCount} ürün
              </p>
            </div>
            <button
              onClick={dismissToast}
              aria-label="Bildirimi kapat"
              className="text-foreground/40 hover:text-foreground transition p-1 -mr-1 -mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="border-t border-foreground/10 px-4 py-2 flex justify-end">
            <button
              onClick={() => {
                trackEvent({ event: "cart_open", source: "toast", item_count: toast.totalCount });
                open();
                dismissToast();
              }}
              className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-secondary hover:text-primary transition"
            >
              Sepeti Görüntüle <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
