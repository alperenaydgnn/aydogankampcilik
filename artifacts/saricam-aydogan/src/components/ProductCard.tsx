import { Link } from "wouter";
import { motion, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, XCircle, ArrowUpRight, Plus, Check, Heart, GitCompare } from "lucide-react";
import { Product, Category, StockStatus } from "@/lib/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlurImage } from "@/components/BlurImage";
import { getCategories } from "@/lib/data";
import { buildProductMessage } from "@/lib/whatsapp";
import { WhatsAppButton, OutOfStockButton } from "@/components/WhatsAppButton";
import { useTilt } from "@/lib/useTilt";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useCompare, COMPARE_MAX } from "@/lib/compare";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import { SwipeableProductCard } from "@/components/SwipeableProductCard";

function CardOverlayActions({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const compare = useCompare();
  const liked = wishlist.has(product.slug);
  const compared = compare.has(product.slug);

  const onLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const added = wishlist.toggle(product);
    haptics.tap();
    trackEvent({ event: added ? "wishlist_add" : "wishlist_remove", source: "product_card", product_id: product.id, product_name: product.name });
  };
  const onCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const r = compare.toggle(product);
    if (r.reason === "max") {
      haptics.warn();
      trackEvent({ event: "compare_limit", source: "product_card", product_id: product.id });
      return;
    }
    haptics.tap();
    trackEvent({ event: r.added ? "compare_add" : "compare_remove", source: "product_card", product_id: product.id, product_name: product.name });
  };

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
      <button
        onClick={onLike}
        aria-label={liked ? "Favorilerden çıkar" : "Favorilere ekle"}
        aria-pressed={liked}
        className={cn(
          "w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-foreground/8 flex items-center justify-center shadow-sm transition-all duration-300",
          liked ? "text-secondary" : "text-foreground/60 hover:text-secondary",
          !liked && "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
          liked && "opacity-100",
        )}
      >
        <Heart className={cn("w-3.5 h-3.5", liked && "fill-secondary")} strokeWidth={liked ? 2 : 1.75} />
      </button>
      <button
        onClick={onCompare}
        aria-label={compared ? "Karşılaştırmadan çıkar" : "Karşılaştırmaya ekle"}
        aria-pressed={compared}
        disabled={!compared && compare.isFull}
        title={!compared && compare.isFull ? `En fazla ${COMPARE_MAX} ürün` : undefined}
        className={cn(
          "w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-foreground/8 flex items-center justify-center shadow-sm transition-all duration-300",
          compared ? "text-secondary" : "text-foreground/60 hover:text-secondary",
          !compared && "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
          compared && "opacity-100",
          !compared && compare.isFull && "opacity-30 hover:text-foreground/60",
        )}
      >
        <GitCompare className="w-3.5 h-3.5" strokeWidth={compared ? 2.2 : 1.75} />
      </button>
    </div>
  );
}

/* ── Inline "Add to cart" pill ─────────────────────── */
function AddToCartPill({ product, category, compact, fullWidth }: {
  product: Product; category?: Category; compact?: boolean; fullWidth?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product);
    trackEvent({
      event: "cart_add",
      source: compact ? "product_card_compact" : "product_card",
      product_id: product.id,
      product_name: product.name,
      category_name: category?.name,
    });
    setAdded(true);
    haptics.success();
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={handle}
      aria-label={`${product.name} sepete ekle`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 border transition-all duration-200 font-bold uppercase tracking-[0.18em]",
        compact ? "text-[0.6rem] px-2.5 py-1.5" : "text-[0.7rem] px-4 py-2.5",
        fullWidth && "w-full",
        added
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "border-foreground/20 text-foreground/75 hover:border-secondary hover:text-secondary hover:bg-secondary/5"
      )}
    >
      {added ? <Check className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} /> : <Plus className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      {added ? "Eklendi" : "Sepete Ekle"}
    </button>
  );
}

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

function StockBadge({ status, stock }: { status: StockStatus; stock?: number }) {
  const cfg = stockConfig[status];
  if (status === "in_stock") return null;
  const Icon = cfg.icon;
  const label =
    status === "low_stock" && stock && stock > 0 && stock <= 10
      ? `Son ${stock} adet`
      : cfg.label;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.15em]", cfg.cls)} aria-label={label}>
      {Icon && <Icon className="w-2.5 h-2.5" />}
      {label}
    </span>
  );
}

/* ── Main card (Editorial / Meridian) ─────────────────── */
export function ProductCard({ product, index = 0, compact = false }: { product: Product; index?: number; compact?: boolean }) {
  const categories = useCategories();
  const category = categories.find(c => c.id === product.category_id);
  const isOOS = product.stock_status === "out_of_stock";

  const { ref, rotateX, rotateY, shineX, shineY, isHovered, onMove, onEnter, onLeave, reduced } = useTilt(5);
  // Radial spotlight that follows the cursor — opacity bound to hover
  const spotlight = useTransform(
    [shineX, shineY, isHovered],
    ([x, y, h]) =>
      `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,${0.18 * (h as number)}), transparent 55%)`
  );

  const waMessage = category
    ? buildProductMessage(product, category)
    : `Merhaba! 👋\n\n📦 *${product.name}* ürünü hakkında bilgi almak istiyorum.\n\nStok teyidi alabilir miyim?`;

  return (
    <SwipeableProductCard product={product}>
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className={cn("group product-card flex flex-col", isOOS && "opacity-60")}
      aria-label={product.name}
    >
      {/* Tilt shell — owns mouse listeners + perspective transform */}
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
        className="flex flex-col flex-1 will-change-transform"
      >
        {/* Editorial bare image */}
        <Link href={`/urun/${product.slug}`} tabIndex={-1} aria-hidden className="block">
          <div className="product-card-image relative overflow-hidden bg-foreground/5 transition-transform duration-500 ease-out group-hover:-translate-y-2">
            <CardOverlayActions product={product} />
            {/* Out of stock overlay */}
            {isOOS && (
              <div className="absolute inset-0 z-30 bg-background/70 flex items-center justify-center">
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
                className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
                loading="lazy"
              />

              {/* Cursor-following radial spotlight */}
              {!reduced && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={{ background: spotlight }}
                />
              )}

              {/* Diagonal sheen sweep (CSS keyframe, triggers on hover) */}
              <div aria-hidden className="card-sheen pointer-events-none absolute inset-0 overflow-hidden" />

              {/* Subtle dark wash on hover for editorial depth */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />

              {/* Top-right circular arrow chip — slides + rotates in on hover */}
              {!isOOS && (
                <div
                  aria-hidden
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-foreground/8
                             flex items-center justify-center shadow-sm
                             opacity-0 -translate-y-1 translate-x-1 scale-90
                             group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-100
                             transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: "translateZ(40px)" } as React.CSSProperties}
                >
                  <ArrowUpRight className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform duration-500 ease-out" />
                </div>
              )}
            </AspectRatio>
          </div>
        </Link>

        {/* Editorial body */}
        <div className={cn("flex flex-col flex-1 gap-3", compact ? "pt-3 gap-1.5" : "pt-6")}>
          {/* Category eyebrow — hidden in compact to keep card tight */}
          {category && !compact && (
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-foreground/45 inline-flex items-center gap-2">
              <span className="inline-block w-3 h-px bg-foreground/30 group-hover:w-6 group-hover:bg-secondary transition-all duration-500 ease-out" />
              {category.name}
              {product.is_new && <span className="ml-1 text-secondary">— Yeni</span>}
            </span>
          )}

          {/* Title (Fraunces) — animated underline draw */}
          <Link href={`/urun/${product.slug}`} className="flex-1">
            <h3 className={cn(
              "font-serif font-light leading-snug text-primary tracking-tight line-clamp-2",
              "group-hover:text-secondary transition-colors duration-300 inline-block",
              compact ? "text-sm md:text-[0.95rem]" : "text-xl md:text-2xl"
            )}>
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%]
                               group-hover:bg-[length:100%_1px] transition-[background-size] duration-700 ease-out">
                {product.name}
              </span>
            </h3>
          </Link>

          {/* Stock + Price row */}
          <div className={cn("flex items-baseline justify-between", compact ? "pt-0" : "pt-2")}>
            <span
              className={cn(
                "font-serif",
                product.price_numeric
                  ? cn("text-primary font-medium tracking-tight", compact ? "text-sm" : "text-lg")
                  : cn("text-foreground/50 italic", compact ? "text-[0.7rem]" : "text-sm")
              )}
            >
              {product.price_label}
            </span>
            {!compact && (product.stock_status && product.stock_status !== "in_stock" ? (
              <StockBadge status={product.stock_status} stock={product.stock} />
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse-soft" />
                Stokta
              </span>
            ))}
            {compact && (product.stock_status && product.stock_status !== "in_stock" ? (
              <StockBadge status={product.stock_status} stock={product.stock} />
            ) : (
              <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-emerald-700">
                <span className="w-1 h-1 rounded-full bg-emerald-600" />
                Stokta
              </span>
            ))}
          </div>

          {/* Hairline that grows on hover */}
          {!compact && (
            <div className="relative h-px w-full bg-foreground/10 mt-2 overflow-hidden">
              <span aria-hidden
                className="absolute inset-y-0 left-0 w-0 bg-secondary group-hover:w-full transition-[width] duration-700 ease-out" />
            </div>
          )}

          {/* CTAs */}
          {!compact && (
            <div className="pt-1 flex flex-col gap-2">
              {isOOS ? (
                <OutOfStockButton size="sm" fullWidth />
              ) : (
                <>
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
                  <AddToCartPill product={product} category={category} fullWidth />
                </>
              )}
            </div>
          )}
          {compact && !isOOS && (
            <div className="pt-1.5">
              <AddToCartPill product={product} category={category} compact fullWidth />
            </div>
          )}
        </div>
      </motion.div>
    </motion.article>
    </SwipeableProductCard>
  );
}
