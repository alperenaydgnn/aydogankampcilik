import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { Product, Category, StockStatus } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getCategories } from "@/lib/data";
import { buildProductMessage } from "@/lib/whatsapp";
import { WhatsAppButton, OutOfStockButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

/* ── Shared category cache ────────────────────────────── */
let _cache: Category[] | null = null;
const _subs = new Set<(c: Category[]) => void>();

function useCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>(_cache ?? []);
  useEffect(() => {
    if (_cache) return;
    let dead = false;
    _subs.add(setCats);
    getCategories().then(data => {
      if (dead) return;
      _cache = data;
      _subs.forEach(fn => fn(data));
    });
    return () => { dead = true; _subs.delete(setCats); };
  }, []);
  return cats;
}

/* ── Stock badge ──────────────────────────────────────── */
const stockConfig: Record<StockStatus, { label: string; cls: string; icon: typeof AlertTriangle | null }> = {
  in_stock:    { label: "Stokta",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",   icon: null },
  low_stock:   { label: "Son stoklar", cls: "bg-amber-50 text-amber-700 border-amber-200",          icon: AlertTriangle },
  out_of_stock:{ label: "Tükendi",     cls: "bg-red-50 text-red-600 border-red-200",                icon: XCircle },
};

function StockBadge({ status }: { status: StockStatus }) {
  const cfg = stockConfig[status];
  if (status === "in_stock") return null;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border", cfg.cls)}>
      {Icon && <Icon className="w-2.5 h-2.5" />}
      {cfg.label}
    </span>
  );
}

/* ── Main card ────────────────────────────────────────── */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const categories = useCategories();
  const category = categories.find(c => c.id === product.category_id);
  const isOOS = product.stock_status === "out_of_stock";

  const waMessage = category
    ? buildProductMessage(product, category)
    : `Merhaba! 👋\n\n📦 *${product.name}* ürünü hakkında bilgi almak istiyorum.\n\nStok teyidi alabilir miyim?`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className={cn("group product-card flex flex-col", isOOS && "opacity-70")}
      aria-label={product.name}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl bg-muted/40">
        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          {category && (
            <span className="badge-category">{category.name}</span>
          )}
          {product.is_new && (
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-secondary text-white shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Yeni
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOOS && (
          <div className="absolute inset-0 z-10 bg-background/60 flex items-center justify-center">
            <span className="text-xs font-bold text-red-600 bg-white px-3 py-1.5 rounded-full border border-red-200 shadow">
              Tükendi
            </span>
          </div>
        )}

        <Link href={`/urun/${product.slug}`} tabIndex={-1} aria-hidden>
          <AspectRatio ratio={4 / 3}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </AspectRatio>
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Stock row */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.stock_status && product.stock_status !== "in_stock" && (
            <StockBadge status={product.stock_status} />
          )}
          {product.stock_status === "in_stock" && (
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stokta mevcut
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/urun/${product.slug}`} className="flex-1">
          <h3 className="font-serif font-semibold text-[1rem] leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Price + detail link */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
          <span className={cn(
            "font-bold text-sm",
            product.price_numeric ? "text-primary text-base" : "text-muted-foreground text-xs italic"
          )}>
            {product.price_label}
          </span>
          <Link
            href={`/urun/${product.slug}`}
            className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-secondary hover:text-primary uppercase tracking-wide transition-colors group/link"
          >
            İncele <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* WhatsApp CTA */}
        {isOOS ? (
          <OutOfStockButton size="sm" fullWidth />
        ) : (
          <WhatsAppButton
            message={waMessage}
            tracking={{
              event: "product_order",
              source: "product_card",
              product_id: product.id,
              product_name: product.name,
              product_slug: product.slug,
              category_id: product.category_id,
              category_name: category?.name,
              price_numeric: product.price_numeric ?? undefined,
            }}
            size="sm"
            fullWidth
            label="WhatsApp ile Sipariş"
            onClick={e => e.stopPropagation()}
          />
        )}
      </div>
    </motion.article>
  );
}
