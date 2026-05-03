import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  italicAccent?: string;
  products: Product[];
  onClear?: () => void;
}

export function RecommendationStrip({ eyebrow, title, italicAccent, products, onClear }: Props) {
  if (!products.length) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-end justify-between gap-6 mb-10 md:mb-12 flex-wrap">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="editorial-heading text-2xl md:text-3xl lg:text-4xl">
            {title}
            {italicAccent && (
              <> <em className="italic font-light text-secondary">{italicAccent}</em></>
            )}
          </h2>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-foreground/55 hover:text-rose-700 transition-colors"
          >
            Geçmişi Temizle
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6">
        {products.map(p => (
          <Link key={p.slug} href={`/urun/${p.slug}`} className="snap-start shrink-0 w-[180px] md:w-[210px] group">
            <div className="overflow-hidden bg-foreground/5 mb-3" style={{ aspectRatio: "4/5" }}>
              <img
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]",
                  p.stock_status === "out_of_stock" && "opacity-60",
                )}
              />
            </div>
            <h3 className="font-serif font-light text-sm md:text-base text-foreground tracking-tight line-clamp-2 group-hover:text-secondary transition-colors">
              {p.name}
            </h3>
            <p className={cn(
              "text-xs mt-1 font-serif",
              p.price_numeric ? "text-primary" : "text-foreground/55 italic",
            )}>
              {p.price_label}
            </p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
