import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, XCircle } from "lucide-react";
import { Product, Category, StockStatus } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlurImage } from "@/components/BlurImage";
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
  in_stock:    { label: "Stokta",      cls: "text-emerald-700",  icon: null },
  low_stock:   { label: "Son stoklar", cls: "text-amber-700",    icon: AlertTriangle },
  out_of_stock:{ label: "Tükendi",     cls: "text-red-600",      icon: XCircle },
};

function StockBadge({ status }: { status: StockStatus }) {
  const cfg = stockConfig[status];
  if (status === "in_stock") return null;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.15em]", cfg.cls)}>
      {Icon && <Icon className="w-2.5 h-2.5" />}
      {cfg.label}
    </span>
  );
}

/* ── Main card (Editorial / Meridian) ─────────────────── */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const categories = useCategories();
  const category = categories.find(c => c.id === product.category_id);
  const isOOS = product.stock_status === "out_of_stock";

  const waMessage = category
    ? buildProductMessage(product, category)
    : `Merhaba! 👋\n\n📦 *${product.name}* ürünü hakkında bilgi almak istiyorum.\n\nStok teyidi alabilir miyim?`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={cn("group product-card flex flex-col", isOOS && "opacity-60")}
      aria-label={product.name}
    >
      {/* Editorial bare image */}
      <Link href={`/urun/${product.slug}`} tabIndex={-1} aria-hidden className="block">
        <div className="product-card-image relative overflow-hidden bg-foreground/5 transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          {/* Out of stock overlay */}
          {isOOS && (
            <div className="absolute inset-0 z-10 bg-background/70 flex items-center justify-center">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-red-700 bg-background px-4 py-1.5 border border-red-300">
                Tükendi
              </span>
            </div>
          )}

          <AspectRatio ratio={4 / 5}>
            <BlurImage
              src={product.images[0]}
              alt={product.name}
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              loading="lazy"
            />
            {/* Subtle dark wash on hover for editorial depth */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
          </AspectRatio>
        </div>
      </Link>

      {/* Editorial body */}
      <div className="flex flex-col flex-1 pt-6 gap-3">
        {/* Category eyebrow */}
        {category && (
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-foreground/45">
            {category.name}
            {product.is_new && <span className="ml-2 text-secondary">— Yeni</span>}
          </span>
        )}

        {/* Title (Fraunces) */}
        <Link href={`/urun/${product.slug}`} className="flex-1">
          <h3 className="font-serif font-light text-xl md:text-2xl leading-snug text-primary tracking-tight line-clamp-2 group-hover:text-secondary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Stock + Price row */}
        <div className="flex items-baseline justify-between pt-2">
          <span
            className={cn(
              "font-serif",
              product.price_numeric
                ? "text-primary text-lg font-medium tracking-tight"
                : "text-foreground/50 text-sm italic"
            )}
          >
            {product.price_label}
          </span>
          {product.stock_status && product.stock_status !== "in_stock" ? (
            <StockBadge status={product.stock_status} />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              <span className="w-1 h-1 rounded-full bg-emerald-600" />
              Stokta
            </span>
          )}
        </div>

        {/* Hairline */}
        <div className="h-px w-full bg-foreground/10 mt-2" />

        {/* CTA */}
        <div className="pt-1">
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
      </div>
    </motion.article>
  );
}
