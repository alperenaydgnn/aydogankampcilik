import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Heart, GitCompare } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCompare, COMPARE_MAX } from "@/lib/compare";
import type { Product } from "@/lib/mockData";
import { haptics } from "@/lib/haptics";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 70;

/**
 * Touch wrapper that adds horizontal swipe gestures + haptic feedback
 * to a ProductCard. Right swipe → toggle wishlist. Left swipe → toggle
 * compare. Reveals colored action hints behind the card while dragging.
 * No-op on devices with a fine pointer (mouse/desktop).
 */
export function SwipeableProductCard({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  const wishlist = useWishlist();
  const compare = useCompare();
  const x = useMotionValue(0);

  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: none) and (pointer: coarse)").matches;

  const [feedback, setFeedback] = useState<null | "wishlist" | "compare" | "compare-full">(null);

  // Visual hints behind the card
  const rightOpacity = useTransform(x, [0, 30, SWIPE_THRESHOLD], [0, 0.4, 1]);
  const leftOpacity  = useTransform(x, [-SWIPE_THRESHOLD, -30, 0], [1, 0.4, 0]);

  if (!isCoarse) return <>{children}</>;

  function handleEnd(_e: unknown, info: PanInfo) {
    const dx = info.offset.x;
    if (dx > SWIPE_THRESHOLD) {
      const added = wishlist.toggle(product);
      haptics.success();
      setFeedback("wishlist");
      trackEvent({
        event: added ? "wishlist_add" : "wishlist_remove",
        source: "swipe",
        product_id: product.id,
        product_name: product.name,
      });
    } else if (dx < -SWIPE_THRESHOLD) {
      const r = compare.toggle(product);
      if (r.reason === "max") {
        haptics.warn();
        setFeedback("compare-full");
        trackEvent({ event: "compare_limit", source: "swipe", product_id: product.id });
      } else {
        haptics.success();
        setFeedback("compare");
        trackEvent({
          event: r.added ? "compare_add" : "compare_remove",
          source: "swipe",
          product_id: product.id,
          product_name: product.name,
        });
      }
    }
    if (feedback) window.setTimeout(() => setFeedback(null), 600);
  }

  return (
    <div className="relative overflow-hidden touch-pan-y">
      {/* right hint (revealed when swiping right → wishlist) */}
      <motion.div
        style={{ opacity: rightOpacity }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 flex items-center justify-start pl-4 bg-gradient-to-r from-secondary/15 to-transparent"
      >
        <div className="flex items-center gap-2 text-secondary">
          <Heart className="w-5 h-5 fill-secondary" strokeWidth={2} />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em]">Favori</span>
        </div>
      </motion.div>
      {/* left hint (revealed when swiping left → compare) */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-4 bg-gradient-to-l from-primary/15 to-transparent"
      >
        <div className="flex items-center gap-2 text-primary">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em]">Karşılaştır</span>
          <GitCompare className="w-5 h-5" strokeWidth={2} />
        </div>
      </motion.div>

      <motion.div
        drag="x"
        style={{ x }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.45}
        dragDirectionLock
        onDragEnd={handleEnd}
      >
        {children}
      </motion.div>

      {/* Toast feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            "pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-30",
            "px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-[0.18em]",
            feedback === "wishlist" && "bg-secondary text-secondary-foreground",
            feedback === "compare" && "bg-primary text-primary-foreground",
            feedback === "compare-full" && "bg-foreground/85 text-background",
          )}
        >
          {feedback === "wishlist" && (wishlist.has(product.slug) ? "Favorilere eklendi" : "Favorilerden çıkarıldı")}
          {feedback === "compare" && (compare.has(product.slug) ? "Karşılaştırmaya eklendi" : "Karşılaştırmadan çıkarıldı")}
          {feedback === "compare-full" && `En fazla ${COMPARE_MAX} ürün`}
        </motion.div>
      )}
    </div>
  );
}
