import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCompare, COMPARE_MAX } from "@/lib/compare";
import { getProducts } from "@/lib/data";
import type { Product } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { slugs, remove, clear } = useCompare();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!slugs.length) { setProducts([]); return; }
    let cancel = false;
    getProducts({ limit: 500 }).then(all => {
      if (cancel) return;
      setProducts(slugs.map(s => all.find(p => p.slug === s)).filter(Boolean) as Product[]);
    });
    return () => { cancel = true; };
  }, [slugs]);

  const visible = slugs.length > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(960px,calc(100%-2rem))]"
        >
          <div className="bg-[#111111] text-white border border-white/10 shadow-2xl rounded-sm px-4 py-3 md:px-5 md:py-4">
            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden md:flex items-center gap-2 shrink-0 pr-4 border-r border-white/15">
                <GitCompare className="w-4 h-4 text-secondary" />
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/85">
                  Karşılaştır
                </span>
                <span className="text-[0.7rem] tabular-nums text-white/55">
                  {slugs.length}/{COMPARE_MAX}
                </span>
              </div>

              <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {products.map(p => (
                  <div key={p.slug} className="shrink-0 flex items-center gap-2 bg-white/5 border border-white/10 rounded-sm pl-1 pr-2 py-1">
                    <img src={p.images[0]} alt="" className="w-9 h-9 object-cover rounded-sm" />
                    <span className="text-[0.7rem] line-clamp-1 max-w-[120px] md:max-w-[160px] text-white/85">
                      {p.name}
                    </span>
                    <button
                      onClick={() => remove(p.slug)}
                      aria-label={`${p.name} karşılaştırmadan çıkar`}
                      className="text-white/55 hover:text-rose-400 transition-colors p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, COMPARE_MAX - slugs.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="hidden md:flex shrink-0 w-[170px] h-[44px] border border-dashed border-white/15 rounded-sm items-center justify-center">
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] text-white/35">+ Ürün ekle</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={clear}
                  className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55 hover:text-white transition-colors px-2 py-1.5 hidden sm:inline-flex"
                  aria-label="Karşılaştırmayı temizle"
                >
                  Temizle
                </button>
                <Link
                  href="/karsilastir"
                  className={cn(
                    "inline-flex items-center gap-2 px-3 md:px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] rounded-sm transition",
                    slugs.length >= 2
                      ? "bg-secondary text-white hover:bg-secondary/90"
                      : "bg-white/10 text-white/45 pointer-events-none"
                  )}
                >
                  Karşılaştır <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {slugs.length < 2 && (
              <p className="text-[0.65rem] text-white/45 mt-2 md:hidden">
                Karşılaştırmak için en az 2 ürün ekleyin.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
