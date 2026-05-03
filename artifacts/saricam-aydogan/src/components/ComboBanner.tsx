import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { COMBOS } from "@/lib/combos";
import { getProducts } from "@/lib/data";
import { Product, formatPriceLabel } from "@/lib/mockData";
import { useCart } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ComboBanner() {
  const [products, setProducts] = useState<Product[]>([]);
  const { add, open } = useCart();

  useEffect(() => {
    getProducts({ limit: 50 }).then(setProducts);
  }, []);

  const enriched = COMBOS.map(combo => {
    const items = combo.productIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p);
    const subtotal = items.reduce((s, p) => s + (p.price_numeric ?? 0), 0);
    const discounted = Math.round(subtotal * (1 - combo.discountPct / 100));
    return { combo, items, subtotal, discounted, complete: items.length === combo.productIds.length };
  }).filter(c => c.complete && c.subtotal > 0);

  if (enriched.length === 0) return null;

  return (
    <section className="section bg-background" aria-labelledby="combo-heading">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow">/ 05 — Kombo Avantajlar</span>
            <h2 id="combo-heading" className="editorial-heading text-4xl md:text-5xl">
              Birlikte aldıkça <em className="italic text-secondary">kazanın.</em>
            </h2>
            <p className="text-foreground/60 font-light leading-relaxed mt-5 max-w-lg">
              Karadeniz'de denenmiş kombolar — paket olarak alınca ekstra indirim sepete otomatik düşer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {enriched.map(({ combo, items, subtotal, discounted }, i) => (
            <motion.article
              key={combo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border border-foreground/15 bg-background flex flex-col group hover:border-secondary/50 transition-colors"
            >
              {/* Image stack */}
              <div className="grid grid-cols-3 gap-px bg-foreground/10 aspect-[16/9] overflow-hidden">
                {items.slice(0, 3).map(p => (
                  <div key={p.id} className="bg-foreground/5 overflow-hidden">
                    {p.images[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-2 py-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      {combo.badge ?? `%${combo.discountPct} İndirim`}
                    </span>
                  </div>
                  <h3 className="font-serif font-light text-xl md:text-2xl text-primary tracking-tight leading-tight">
                    {combo.name}
                  </h3>
                  <p className="text-xs text-foreground/55 font-light mt-1">{combo.tagline}</p>
                </div>

                <ul className="text-xs space-y-1 text-foreground/65 font-light">
                  {items.map(p => (
                    <li key={p.id} className="flex items-baseline gap-2">
                      <span className="w-1 h-1 rounded-full bg-secondary shrink-0" />
                      <span className="line-clamp-1">{p.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4 border-t border-foreground/10 flex items-baseline justify-between gap-3">
                  <div>
                    <span className="text-foreground/40 line-through text-xs tabular-nums">
                      {formatPriceLabel(subtotal)}
                    </span>
                    <p className="font-serif font-light text-2xl text-primary tracking-tight tabular-nums">
                      {formatPriceLabel(discounted)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      items.forEach(p => add(p));
                      trackEvent({ event: "combo_add", source: "combo_banner", combo_id: combo.id, item_count: items.length });
                      open();
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-secondary border-b border-secondary/40 hover:border-secondary pb-1 transition"
                    )}
                  >
                    Sepete Ekle <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
