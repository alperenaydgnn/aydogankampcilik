import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPriceLabel } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function CartDrawer() {
  const { isOpen, close, items, setQty, remove, subtotal, combo, total, count, hasNumericPrices, clear, openCheckout } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  const startCheckout = () => {
    trackEvent({ event: "checkout_start", source: "cart_drawer", item_count: count, subtotal });
    openCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-foreground/40 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full sm:max-w-md bg-background flex flex-col shadow-2xl outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Sepetiniz"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-secondary" strokeWidth={1.75} />
                <span className="eyebrow !mb-0">Sepetiniz</span>
                {count > 0 && (
                  <span className="text-[0.7rem] text-foreground/55 font-semibold">({count} adet)</span>
                )}
              </div>
              <button
                onClick={close}
                aria-label="Sepeti kapat"
                className="p-2 -mr-2 text-foreground/55 hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-7 h-7 text-foreground/35" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif font-light text-2xl text-primary tracking-tight mb-3">
                    Sepetiniz <em className="italic text-secondary">boş.</em>
                  </h3>
                  <p className="text-sm text-foreground/55 leading-relaxed font-light mb-8 max-w-xs">
                    Beğendiğiniz ürünlere "Sepete Ekle" diyerek WhatsApp siparişinizi hızlıca tamamlayın.
                  </p>
                  <Link
                    href="/urunler"
                    onClick={close}
                    className="btn-cta-amber btn-cta !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
                  >
                    Ürünleri Keşfet
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-foreground/10">
                  {items.map(item => (
                    <li key={item.id} className="px-6 py-5 flex gap-4">
                      <Link
                        href={`/urun/${item.slug}`}
                        onClick={close}
                        className="shrink-0 w-20 h-24 bg-foreground/5 overflow-hidden block"
                      >
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <Link
                          href={`/urun/${item.slug}`}
                          onClick={close}
                          className="font-serif font-light text-base text-primary leading-tight tracking-tight line-clamp-2 hover:text-secondary transition"
                        >
                          {item.name}
                        </Link>
                        <p className={cn(
                          "font-serif text-sm mt-1",
                          item.price_numeric ? "text-primary" : "text-foreground/55 italic"
                        )}>
                          {item.price_label}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="inline-flex items-center border border-foreground/15 rounded-full overflow-hidden">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="px-2.5 py-1.5 text-foreground/65 hover:text-foreground hover:bg-foreground/5 transition disabled:opacity-30"
                              disabled={item.qty <= 1}
                              aria-label="Adet azalt"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold tabular-nums" aria-label={`${item.qty} adet`}>{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="px-2.5 py-1.5 text-foreground/65 hover:text-foreground hover:bg-foreground/5 transition"
                              aria-label="Adet artır"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.id)}
                            aria-label="Ürünü kaldır"
                            className="text-foreground/40 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-foreground/10 px-6 py-5 space-y-4 bg-background">
                {combo && (
                  <div className="flex items-start gap-3 p-3 border border-secondary/40 bg-secondary/5">
                    <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold uppercase tracking-[0.18em] text-secondary text-[0.65rem] mb-1">
                        {combo.combo.badge ?? "Kombo İndirim"} Uygulandı
                      </p>
                      <p className="text-foreground/70 font-light">
                        {combo.combo.name}: <span className="font-medium text-foreground">−{combo.discountLabel}</span>
                      </p>
                    </div>
                  </div>
                )}

                {hasNumericPrices ? (
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-foreground/65 font-light">
                      <span>Ara Toplam</span>
                      <span className="tabular-nums">{formatPriceLabel(subtotal)}</span>
                    </div>
                    {combo && (
                      <div className="flex justify-between text-secondary font-medium">
                        <span>İndirim</span>
                        <span className="tabular-nums">−{combo.discountLabel}</span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-2 border-t border-foreground/10">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/65">Toplam</span>
                      <span className="font-serif font-light text-2xl text-primary tracking-tight tabular-nums">
                        {formatPriceLabel(total)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-foreground/55 font-light leading-relaxed">
                    Sepetinizdeki bazı ürünler için fiyat WhatsApp'tan teyit edilecek. Toplam fiyatı sipariş esnasında bildireceğiz.
                  </p>
                )}

                <button
                  onClick={startCheckout}
                  className="w-full btn-cta-amber btn-cta justify-center !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
                >
                  WhatsApp ile Siparişi Tamamla
                </button>
                <button
                  onClick={() => { if (confirm("Sepeti boşaltmak istiyor musunuz?")) clear(); }}
                  className="w-full text-[0.65rem] uppercase tracking-[0.2em] text-foreground/45 hover:text-rose-600 transition py-1"
                >
                  Sepeti Temizle
                </button>
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
