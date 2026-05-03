import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation, useSearch } from "wouter";
import {
  Search, Filter, SlidersHorizontal, LayoutGrid, List,
  ChevronLeft, ChevronRight, ArrowRight,
  X, ChevronDown, ChevronUp, Star, Sparkles, ArrowUpDown,
  AlertTriangle, MessageCircle, ShoppingBag, Check,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { getCategories, getProducts } from "@/lib/data";
import { Category, Product, StockStatus } from "@/lib/mockData";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/schemas";
import { ProductCard } from "@/components/ProductCard";
import { RecommendationStrip } from "@/components/RecommendationStrip";
import { SEO } from "@/lib/seo";
import { buildSearchMessage, buildProductMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Slider } from "@/components/ui/slider";
import { formatPriceLabel } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  buildDoc, smartSearch,
  extractBrands, getProductBrand, getProductWeightKg, getProductCapacity, getProductSeason, getWaterproofMm,
} from "@/lib/search";
import { useRecentlyViewed } from "@/lib/recentlyViewed";
import { PineTrail } from "@/components/BrandIllustration";

const PRICE_SLIDER_MIN = 0;
const PRICE_SLIDER_MAX = 10000;
const PRICE_SLIDER_STEP = 50;

const PAGE_SIZE = 9;
type ViewMode = "grid" | "list";
type SortKey = "featured" | "newest" | "price-asc" | "price-desc";
type PriceRange = "all" | "low" | "mid" | "high" | "premium";
type StockFilter = "all" | "in_stock" | "low_stock";

/* ── URL param schema ─────────────────────────────────── */
interface Params {
  view: ViewMode;
  page: number;
  q: string;
  sort: SortKey;
  price: PriceRange;
  price_min: number | null;
  price_max: number | null;
  stock: StockFilter;
  feat: boolean;
  brands: string[];
  season: string;
  weight_max: number | null;
  capacity: number | null;
  waterproof_min: number | null;
}

function readParams(s: string): Params {
  const sp = new URLSearchParams(s);
  const parseNum = (v: string | null) => {
    if (v == null) return null;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };
  const brandsRaw = sp.get("brands");
  return {
    view:  (sp.get("view") === "list" ? "list" : "grid") as ViewMode,
    page:  Math.max(1, parseInt(sp.get("page") || "1", 10) || 1),
    q:     sp.get("q") || "",
    sort:  (["featured","newest","price-asc","price-desc"].includes(sp.get("sort") || "")
              ? sp.get("sort") : "featured") as SortKey,
    price: (["all","low","mid","high","premium"].includes(sp.get("price") || "")
              ? sp.get("price") : "all") as PriceRange,
    price_min: parseNum(sp.get("price_min")),
    price_max: parseNum(sp.get("price_max")),
    stock: (["all","in_stock","low_stock"].includes(sp.get("stock") || "")
              ? sp.get("stock") : "all") as StockFilter,
    feat:  sp.get("feat") === "1",
    brands: brandsRaw ? brandsRaw.split(",").map(s => s.trim()).filter(Boolean) : [],
    season: sp.get("season") || "",
    weight_max: parseNum(sp.get("weight_max")),
    capacity: parseNum(sp.get("capacity")),
    waterproof_min: parseNum(sp.get("waterproof_min")),
  };
}

/* ── Price ranges ─────────────────────────────────────── */
const PRICE_RANGES: Record<PriceRange, { label: string; min: number; max: number }> = {
  all:     { label: "Tüm Fiyatlar",     min: 0,    max: Infinity },
  low:     { label: "₺500'a kadar",     min: 0,    max: 500 },
  mid:     { label: "₺500 – ₺2.000",    min: 500,  max: 2000 },
  high:    { label: "₺2.000 – ₺5.000",  min: 2000, max: 5000 },
  premium: { label: "₺5.000+",          min: 5000, max: Infinity },
};

const SORT_LABELS: Record<SortKey, string> = {
  featured:    "Öne Çıkanlar",
  newest:      "En Yeniler",
  "price-asc": "Fiyat: Artan",
  "price-desc":"Fiyat: Azalan",
};

/* ── Filtering + sorting (client-side) ───────────────── */
function applyFilters(products: Product[], params: Params): Product[] {
  let list = [...products];

  if (params.q.trim()) {
    const docs = list.map(p => buildDoc(p));
    const results = smartSearch(params.q, docs);
    const order = new Map(results.map((r, i) => [r.product.slug, i] as [string, number]));
    list = list.filter(p => order.has(p.slug));
    list.sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  }

  if (params.brands.length) {
    const set = new Set(params.brands.map(b => b.toLowerCase()));
    list = list.filter(p => {
      const b = getProductBrand(p);
      return b ? set.has(b.toLowerCase()) : false;
    });
  }

  if (params.season) {
    const wanted = params.season.toLowerCase();
    list = list.filter(p => {
      const s = getProductSeason(p)?.toLowerCase();
      if (!s) return false;
      if (wanted === "4") return s.includes("4");
      if (wanted === "3") return s.includes("3") || s.includes("yaz") || s.includes("ilkbahar");
      if (wanted === "kis") return s.includes("kış") || s.includes("kis") || s.includes("4");
      return s.includes(wanted);
    });
  }

  if (params.weight_max != null) {
    list = list.filter(p => {
      const w = getProductWeightKg(p);
      return w != null && w <= (params.weight_max as number);
    });
  }

  if (params.capacity != null) {
    list = list.filter(p => {
      const c = getProductCapacity(p);
      return c != null && c >= (params.capacity as number);
    });
  }

  if (params.waterproof_min != null) {
    list = list.filter(p => {
      const w = getWaterproofMm(p);
      return w != null && w >= (params.waterproof_min as number);
    });
  }

  if (params.feat) list = list.filter(p => p.featured);

  if (params.stock !== "all") {
    const s = params.stock as StockStatus;
    list = list.filter(p => (p.stock_status ?? "in_stock") === s);
  }

  const pr = PRICE_RANGES[params.price];
  if (params.price !== "all") {
    list = list.filter(p => {
      if (!p.price_numeric) return false;
      return p.price_numeric >= pr.min && p.price_numeric < pr.max;
    });
  }

  // Slider range — overrides preset bounds when provided.
  // When max is at the slider ceiling, treat it as unbounded (no upper limit).
  if (params.price_min != null || params.price_max != null) {
    const lo = params.price_min ?? PRICE_SLIDER_MIN;
    const hi = params.price_max ?? PRICE_SLIDER_MAX;
    const unboundedTop = hi >= PRICE_SLIDER_MAX;
    list = list.filter(p => {
      if (!p.price_numeric) return false;
      if (p.price_numeric < lo) return false;
      if (!unboundedTop && p.price_numeric > hi) return false;
      return true;
    });
  }

  // Skip resorting when smart search has produced its own relevance order
  if (params.q.trim() && params.sort === "featured") return list;

  switch (params.sort) {
    case "featured":
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
    case "newest":
      list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
      break;
    case "price-asc":
      list.sort((a, b) => (a.price_numeric ?? 0) - (b.price_numeric ?? 0));
      break;
    case "price-desc":
      list.sort((a, b) => (b.price_numeric ?? 0) - (a.price_numeric ?? 0));
      break;
  }

  return list;
}

/* ── Skeleton card ────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="space-y-3">
      <div className="skeleton" style={{ aspectRatio: "4/5" }} />
      <div className="skeleton h-3 rounded-full w-20 mt-4" />
      <div className="skeleton h-5 rounded-sm w-4/5" />
      <div className="skeleton h-4 rounded-full w-1/3" />
    </div>
  );
}

/* ── List row — editorial hairline ───────────────────── */
function ProductRow({ product, index, categoryName }: {
  product: Product; index: number; categoryName?: string;
}) {
  const isOOS = product.stock_status === "out_of_stock";
  const waMessage = buildProductMessage(product, { name: categoryName || "Kamp & Balık" });
  const { add } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.2) }}
      className={cn(
        "grid grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] gap-6 sm:gap-10 py-8 border-b border-foreground/15 group",
        isOOS && "opacity-65"
      )}
    >
      {/* Thumbnail — bare */}
      <Link href={`/urun/${product.slug}`} tabIndex={-1} className="block overflow-hidden bg-muted/40">
        <AspectRatio ratio={4/5}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </AspectRatio>
      </Link>

      {/* Content — editorial */}
      <div className="flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.22em] font-semibold mb-3 flex-wrap">
            {categoryName && <span className="text-secondary">{categoryName}</span>}
            {product.is_new && (
              <span className="inline-flex items-center gap-1 text-foreground/55">
                <Sparkles className="w-2.5 h-2.5" /> Yeni
              </span>
            )}
            {product.stock_status === "low_stock" && (
              <span className="inline-flex items-center gap-1 text-amber-700">
                <AlertTriangle className="w-2.5 h-2.5" />
                {product.stock && product.stock > 0 && product.stock <= 10 ? `Son ${product.stock} adet` : "Son Stoklar"}
              </span>
            )}
            {product.stock_status === "in_stock" && (
              <span className="text-emerald-700">Stokta</span>
            )}
            {product.stock_status === "out_of_stock" && (
              <span className="text-rose-700">Tükendi</span>
            )}
          </div>
          <Link href={`/urun/${product.slug}`}>
            <h3 className="font-serif font-light text-2xl md:text-3xl text-foreground tracking-tight leading-tight group-hover:text-secondary transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          <p className="text-foreground/60 text-sm mt-3 leading-relaxed font-light line-clamp-2 max-w-2xl">
            {product.description}
          </p>
        </div>
        <div className="flex items-baseline gap-6 flex-wrap pt-6 mt-6 border-t border-foreground/10">
          <span className={cn(
            "font-serif font-light tracking-tight",
            product.price_numeric ? "text-primary text-2xl md:text-3xl" : "text-foreground/55 text-base italic"
          )}>
            {product.price_label}
          </span>
          <div className="ml-auto flex items-center gap-6">
            <Link
              href={`/urun/${product.slug}`}
              className="link-hairline hover:text-secondary"
            >
              İncele <ArrowRight className="w-3 h-3" />
            </Link>
            {!isOOS && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); e.preventDefault();
                    add(product, 1);
                    trackEvent({
                      event: "cart_add",
                      source: "product_row",
                      product_id: product.id,
                      product_name: product.name,
                      product_slug: product.slug,
                      price_numeric: product.price_numeric ?? undefined,
                      category_name: categoryName,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-secondary border-b border-secondary/40 hover:border-secondary pb-1 transition"
                >
                  Sepete Ekle <ShoppingBag className="w-3 h-3" />
                </button>
                <WhatsAppButton
                  message={waMessage}
                  tracking={{
                    event: "product_order",
                    source: "product_card",
                    product_id: product.id,
                    product_name: product.name,
                    product_slug: product.slug,
                    price_numeric: product.price_numeric ?? undefined,
                    category_name: categoryName,
                  }}
                  size="sm"
                  rounded="pill"
                  label="Sipariş"
                  onClick={e => e.stopPropagation()}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Empty state — editorial ────────────────────────── */
function EmptyState({
  hasFilters,
  onClear,
  query,
  categoryName,
}: {
  hasFilters: boolean;
  onClear: () => void;
  query?: string;
  categoryName?: string;
}) {
  const waMessage = buildSearchMessage(query || "", categoryName);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-24 md:py-28 border-t border-b border-foreground/15"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="inline-flex justify-center mb-8"
      >
        <PineTrail size={150} />
      </motion.div>
      <span className="eyebrow justify-center">Sonuç Yok</span>
      <h3 className="editorial-heading text-3xl md:text-4xl mb-6">
        {query
          ? <>"{query}" için <em className="italic text-secondary">sonuç bulunamadı.</em></>
          : hasFilters
            ? <>Filtreyle eşleşen <em className="italic text-secondary">ürün yok.</em></>
            : <>Bu kategoride <em className="italic text-secondary">ürün yok.</em></>
        }
      </h3>
      <p className="text-foreground/60 text-base font-light mb-10 max-w-md mx-auto leading-relaxed">
        {query
          ? "Arama teriminizi genişletin ya da aradığınız ürünü doğrudan WhatsApp'tan sorun."
          : hasFilters
            ? "Seçtiğiniz filtre kriterlerine uygun ürün bulunamadı. Filtreleri genişletin."
            : "Bu kategoriye yakında ürün ekleyeceğiz. WhatsApp'tan sorabilirsiniz."}
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <button
          onClick={onClear}
          className="link-hairline hover:text-secondary"
        >
          <X className="w-3.5 h-3.5" />
          {hasFilters ? "Filtreleri Temizle" : "Tüm Ürünlere Dön"}
        </button>
        <WhatsAppButton
          message={waMessage}
          tracking={{
            event: query ? "search_inquiry" : "catalog_inquiry",
            source: "catalog_empty",
            category_name: categoryName,
            search_query: query,
          }}
          size="md"
          rounded="pill"
          label="WhatsApp'tan Sorun"
        />
      </div>
    </motion.div>
  );
}

/* ── Sort dropdown — minimal ─────────────────────────── */
function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-[0.18em] font-semibold text-foreground hover:border-secondary hover:text-secondary transition-colors"
      >
        <ArrowUpDown className="w-3 h-3" />
        {SORT_LABELS[value]}
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1 w-52 bg-card border border-foreground/15 z-40 overflow-hidden"
            onMouseLeave={() => setOpen(false)}
          >
            {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm transition-colors border-b border-foreground/10 last:border-0",
                  value === key
                    ? "bg-foreground/5 text-secondary font-serif italic"
                    : "text-foreground/75 hover:bg-foreground/5"
                )}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sidebar filter sections (rendered in main + drawer) */
interface FilterSectionsProps {
  p: Params;
  pushParams: (patch: Partial<Record<string, string | number | boolean | undefined>>) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  allProducts: Product[];
}

const SEASON_OPTIONS: { value: string; label: string }[] = [
  { value: "",    label: "Tümü" },
  { value: "4",   label: "4 Mevsim / Kış" },
  { value: "3",   label: "3 Mevsim" },
  { value: "yaz", label: "Yazlık" },
];
const WEIGHT_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Tümü" },
  { value: 1.5,  label: "≤ 1.5 kg" },
  { value: 3,    label: "≤ 3 kg" },
  { value: 5,    label: "≤ 5 kg" },
];
const CAPACITY_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Tümü" },
  { value: 1, label: "1+ Kişi" },
  { value: 2, label: "2+ Kişi" },
  { value: 4, label: "4+ Kişi" },
  { value: 6, label: "6+ Kişi" },
];
const WATERPROOF_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Tümü" },
  { value: 1500, label: "≥ 1.500 mm" },
  { value: 3000, label: "≥ 3.000 mm" },
  { value: 5000, label: "≥ 5.000 mm" },
];

function CollapsibleFilter({ label, children, defaultOpen = true }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left mb-2"
      >
        <span className="eyebrow text-foreground/70">{label}</span>
        <ChevronDown className={cn("w-3 h-3 text-foreground/50 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="flex flex-col gap-0">{children}</div>}
    </div>
  );
}

function PriceSlider({ p, pushParams }: { p: Params; pushParams: FilterSectionsProps["pushParams"] }) {
  const lo = p.price_min ?? PRICE_SLIDER_MIN;
  const hi = p.price_max ?? PRICE_SLIDER_MAX;
  const [val, setVal] = useState<[number, number]>([lo, hi]);

  useEffect(() => {
    setVal([p.price_min ?? PRICE_SLIDER_MIN, p.price_max ?? PRICE_SLIDER_MAX]);
  }, [p.price_min, p.price_max]);

  const commit = (v: number[]) => {
    const [a, b] = v as [number, number];
    pushParams({
      price_min: a > PRICE_SLIDER_MIN ? a : undefined,
      price_max: b < PRICE_SLIDER_MAX ? b : undefined,
      price: "all",
      page: 1,
    });
  };

  const active = p.price_min != null || p.price_max != null;

  return (
    <div className="mt-4 pt-4 border-t border-foreground/10">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/55">Özel Aralık</span>
        {active && (
          <button
            onClick={() => pushParams({ price_min: undefined, price_max: undefined, page: 1 })}
            className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-secondary hover:text-rose-700 transition-colors"
          >
            Sıfırla
          </button>
        )}
      </div>
      <Slider
        value={val}
        min={PRICE_SLIDER_MIN}
        max={PRICE_SLIDER_MAX}
        step={PRICE_SLIDER_STEP}
        onValueChange={(v) => setVal(v as [number, number])}
        onValueCommit={commit}
        aria-label="Fiyat aralığı"
        className="my-3"
      />
      <div className="flex items-center justify-between text-xs font-light text-foreground/65 tabular-nums">
        <span>{formatPriceLabel(val[0])}</span>
        <span>
          {val[1] >= PRICE_SLIDER_MAX ? `${formatPriceLabel(PRICE_SLIDER_MAX)}+` : formatPriceLabel(val[1])}
        </span>
      </div>
    </div>
  );
}

function FilterSections({ p, pushParams, hasActiveFilters, clearAllFilters, allProducts }: FilterSectionsProps) {
  const brands = useMemo(() => extractBrands(allProducts), [allProducts]);
  const toggleBrand = (b: string) => {
    const set = new Set(p.brands);
    if (set.has(b)) set.delete(b); else set.add(b);
    pushParams({ brands: set.size ? Array.from(set).join(",") : undefined, page: 1 });
  };
  return (
    <>
      {/* Sort */}
      <div>
        <span className="eyebrow text-foreground/70">Sıralama</span>
        <div className="flex flex-col gap-0">
          {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => pushParams({ sort: key, page: 1 })}
              className={cn(
                "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
                p.sort === key
                  ? "text-secondary font-serif italic"
                  : "text-foreground/65 hover:text-foreground"
              )}
            >
              <span>{label}</span>
              {p.sort === key && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <span className="eyebrow text-foreground/70">Fiyat Aralığı</span>
        <div className="flex flex-col gap-0">
          {(Object.entries(PRICE_RANGES) as [PriceRange, { label: string }][]).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => pushParams({ price: key, price_min: undefined, price_max: undefined, page: 1 })}
              className={cn(
                "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
                p.price === key
                  ? "text-secondary font-serif italic"
                  : "text-foreground/65 hover:text-foreground"
              )}
            >
              <span>{label}</span>
              {p.price === key && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
            </button>
          ))}
        </div>
        <PriceSlider p={p} pushParams={pushParams} />
      </div>

      {/* Stock */}
      <div>
        <span className="eyebrow text-foreground/70">Stok Durumu</span>
        <div className="flex flex-col gap-0">
          {([
            ["all",      "Tümü"],
            ["in_stock", "Stokta Mevcut"],
            ["low_stock","Son Stoklar"],
          ] as [StockFilter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => pushParams({ stock: key, page: 1 })}
              className={cn(
                "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
                p.stock === key
                  ? "text-secondary font-serif italic"
                  : "text-foreground/65 hover:text-foreground"
              )}
            >
              <span>{label}</span>
              {p.stock === key && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Featured toggle */}
      <div>
        <span className="eyebrow text-foreground/70">Ürün Tipi</span>
        <button
          onClick={() => pushParams({ feat: !p.feat ? "1" : undefined, page: 1 })}
          className={cn(
            "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 w-full",
            p.feat
              ? "text-secondary font-serif italic"
              : "text-foreground/65 hover:text-foreground"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Star className="w-3.5 h-3.5" />
            Yalnızca Öne Çıkanlar
          </span>
          {p.feat && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
        </button>
        <button
          onClick={() => pushParams({ sort: p.sort === "newest" ? "featured" : "newest", feat: undefined, page: 1 })}
          className={cn(
            "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 w-full",
            p.sort === "newest"
              ? "text-secondary font-serif italic"
              : "text-foreground/65 hover:text-foreground"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Yeni Gelenler Önce
          </span>
          {p.sort === "newest" && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
        </button>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <CollapsibleFilter label="Marka">
          {brands.map(b => {
            const checked = p.brands.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBrand(b)}
                aria-pressed={checked}
                className={cn(
                  "flex items-center justify-between py-2 text-left text-sm cursor-pointer border-b border-foreground/10 last:border-0 transition-colors",
                  checked ? "text-secondary font-serif italic" : "text-foreground/65 hover:text-foreground",
                )}
              >
                <span className="inline-flex items-center gap-2.5">
                  <span className={cn(
                    "w-3.5 h-3.5 border flex items-center justify-center transition-colors shrink-0",
                    checked ? "border-secondary bg-secondary" : "border-foreground/30",
                  )}>
                    {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                  {b}
                </span>
              </button>
            );
          })}
        </CollapsibleFilter>
      )}

      {/* Season */}
      <CollapsibleFilter label="Mevsim">
        {SEASON_OPTIONS.map(opt => (
          <button
            key={opt.value || "all"}
            onClick={() => pushParams({ season: opt.value || undefined, page: 1 })}
            className={cn(
              "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
              p.season === opt.value
                ? "text-secondary font-serif italic"
                : "text-foreground/65 hover:text-foreground",
            )}
          >
            <span>{opt.label}</span>
            {p.season === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
          </button>
        ))}
      </CollapsibleFilter>

      {/* Weight */}
      <CollapsibleFilter label="Ağırlık">
        {WEIGHT_OPTIONS.map(opt => (
          <button
            key={String(opt.value)}
            onClick={() => pushParams({ weight_max: opt.value ?? undefined, page: 1 })}
            className={cn(
              "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
              p.weight_max === opt.value
                ? "text-secondary font-serif italic"
                : "text-foreground/65 hover:text-foreground",
            )}
          >
            <span>{opt.label}</span>
            {p.weight_max === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
          </button>
        ))}
      </CollapsibleFilter>

      {/* Capacity */}
      <CollapsibleFilter label="Kişi Sayısı">
        {CAPACITY_OPTIONS.map(opt => (
          <button
            key={String(opt.value)}
            onClick={() => pushParams({ capacity: opt.value ?? undefined, page: 1 })}
            className={cn(
              "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
              p.capacity === opt.value
                ? "text-secondary font-serif italic"
                : "text-foreground/65 hover:text-foreground",
            )}
          >
            <span>{opt.label}</span>
            {p.capacity === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
          </button>
        ))}
      </CollapsibleFilter>

      {/* Waterproof */}
      <CollapsibleFilter label="Su Geçirmezlik">
        {WATERPROOF_OPTIONS.map(opt => (
          <button
            key={String(opt.value)}
            onClick={() => pushParams({ waterproof_min: opt.value ?? undefined, page: 1 })}
            className={cn(
              "flex items-center justify-between py-2 text-left text-sm transition-colors border-b border-foreground/10 last:border-0",
              p.waterproof_min === opt.value
                ? "text-secondary font-serif italic"
                : "text-foreground/65 hover:text-foreground",
            )}
          >
            <span>{opt.label}</span>
            {p.waterproof_min === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
          </button>
        ))}
      </CollapsibleFilter>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="link-hairline w-full justify-center hover:text-rose-700"
        >
          <X className="w-3.5 h-3.5" />
          Tüm Filtreleri Temizle
        </button>
      )}
    </>
  );
}

/* ── Main component ───────────────────────────────────── */
export default function Catalog() {
  const rawParams = useParams();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const categorySlug = rawParams.kategori;

  const p = useMemo(() => readParams(searchString), [searchString]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(p.q);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const basePath = categorySlug ? `/urunler/${categorySlug}` : "/urunler";
  const meta = getCategoryMeta(categorySlug);
  const activeCategory = categories.find(c => c.slug === categorySlug);
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const heroImage = activeCategory?.image_url ?? `${baseUrl}/mock/hero.jpg`;

  /* Sync search input when URL changes */
  useEffect(() => { setSearchInput(p.q); }, [p.q]);

  /* Debounce search → URL */
  useEffect(() => {
    if (searchInput === p.q) return;
    const t = setTimeout(() => pushParams({ q: searchInput || undefined, page: 1 }), 350);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => { getCategories().then(setCategories); }, []);

  useEffect(() => {
    setLoading(true);
    // Fetch full category list — smartSearch (Levenshtein + synonyms) runs in applyFilters
    getProducts({ categorySlug, limit: 500 }).then(data => {
      setAllProducts(data);
      setLoading(false);
    });
  }, [categorySlug]);

  /* ── Push URL params ───────────────────────────────── */
  function pushParams(patch: Partial<Record<string, string | number | boolean | undefined>>) {
    const sp = new URLSearchParams(searchString);
    const defaults: Record<string, string> = { view: "grid", page: "1", sort: "featured", price: "all", stock: "all", feat: "" };
    // Special composite key — clears both min and max
    if ("price_range" in patch) {
      sp.delete("price_min");
      sp.delete("price_max");
      delete (patch as Record<string, unknown>).price_range;
    }

    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === false || String(v) === defaults[k]) {
        sp.delete(k);
      } else {
        sp.set(k, String(v));
      }
    }
    const qs = sp.toString();
    setLocation(qs ? `${basePath}?${qs}` : basePath);
  }

  /* ── Apply filters client-side ─────────────────────── */
  const filtered = useMemo(() => applyFilters(allProducts, p), [allProducts, p]);

  /* Recently viewed strip */
  const recentlyViewed = useRecentlyViewed();
  const recentlyViewedProducts = useMemo(() => {
    if (!recentlyViewed.length || !allProducts.length) return [];
    return recentlyViewed
      .map(rv => allProducts.find(p => p.slug === rv.slug))
      .filter(Boolean) as Product[];
  }, [recentlyViewed, allProducts]);

  /* ── Pagination ────────────────────────────────────── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(p.page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Active filters (for chip display) ─────────────── */
  const activeFilters: { label: string; clearKey: string }[] = [];
  if (p.sort !== "featured") activeFilters.push({ label: SORT_LABELS[p.sort], clearKey: "sort" });
  if (p.price !== "all")     activeFilters.push({ label: PRICE_RANGES[p.price].label, clearKey: "price" });
  if (p.price_min != null || p.price_max != null) {
    const lo = p.price_min ?? PRICE_SLIDER_MIN;
    const hi = p.price_max ?? PRICE_SLIDER_MAX;
    const hiLabel = hi >= PRICE_SLIDER_MAX ? `${formatPriceLabel(PRICE_SLIDER_MAX)}+` : formatPriceLabel(hi);
    activeFilters.push({ label: `${formatPriceLabel(lo)} – ${hiLabel}`, clearKey: "price_range" });
  }
  if (p.stock !== "all")     activeFilters.push({
    label: p.stock === "in_stock" ? "Stokta Mevcut" : "Son Stoklar",
    clearKey: "stock",
  });
  if (p.feat)                activeFilters.push({ label: "Öne Çıkanlar", clearKey: "feat" });
  if (p.brands.length)       activeFilters.push({ label: `Marka: ${p.brands.join(", ")}`, clearKey: "brands" });
  if (p.season) {
    const lbl = SEASON_OPTIONS.find(o => o.value === p.season)?.label ?? p.season;
    activeFilters.push({ label: lbl, clearKey: "season" });
  }
  if (p.weight_max != null)    activeFilters.push({ label: `≤ ${p.weight_max} kg`, clearKey: "weight_max" });
  if (p.capacity != null)      activeFilters.push({ label: `${p.capacity}+ Kişi`, clearKey: "capacity" });
  if (p.waterproof_min != null) activeFilters.push({ label: `≥ ${p.waterproof_min.toLocaleString("tr-TR")} mm`, clearKey: "waterproof_min" });
  const hasActiveFilters = activeFilters.length > 0 || !!p.q;

  function clearAllFilters() {
    setSearchInput("");
    setLocation(basePath);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={meta.seoTitle}
        description={meta.seoDescription}
        url={categorySlug ? `/urunler/${categorySlug}` : "/urunler"}
        keywords={"keywords" in meta ? (meta as { keywords?: string[] }).keywords?.join(", ") : undefined}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa",   url: "/" },
            { name: "Ürünler",     url: "/urunler" },
            ...(categorySlug && activeCategory
              ? [{ name: activeCategory.name, url: `/urunler/${categorySlug}` }]
              : []
            ),
          ])
        )}</script>
        {filtered.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(
            buildItemListSchema(
              filtered.map(prod => ({
                name:  prod.name,
                url:   `/urun/${prod.slug}`,
                image: prod.images[0],
              }))
            )
          )}</script>
        )}
      </Helmet>

      {/* ── Cinematic Editorial Hero ─────────────────── */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-50"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/95" />
        </div>

        <div className="container relative z-10 px-6">
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex justify-center"
          >
            <ol className="flex flex-wrap items-center gap-1 text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground/55">
              <li><Link href="/" className="hover:text-primary-foreground transition-colors">Ana Sayfa</Link></li>
              <li><ChevronRight className="w-3 h-3 mx-1.5 text-primary-foreground/30" /></li>
              <li>
                {activeCategory ? (
                  <Link href="/urunler" className="hover:text-primary-foreground transition-colors">Ürünler</Link>
                ) : (
                  <span className="text-primary-foreground/85">Ürünler</span>
                )}
              </li>
              {activeCategory && (
                <>
                  <li><ChevronRight className="w-3 h-3 mx-1.5 text-primary-foreground/30" /></li>
                  <li><span className="text-primary-foreground/85">{activeCategory.name}</span></li>
                </>
              )}
            </ol>
          </motion.nav>

          <motion.div
            key={categorySlug || "all"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2.5 mb-8 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-secondary">
              <span className="w-6 h-px bg-secondary" />
              {activeCategory ? "Kategori" : "Tüm Koleksiyon"}
              <span className="w-6 h-px bg-secondary" />
            </span>
            <h1 className="font-serif font-light tracking-tight leading-[1.05] text-primary-foreground text-5xl md:text-6xl lg:text-7xl">
              {meta.heroTitle}
            </h1>
            <p className="mt-8 text-base md:text-lg text-primary-foreground/70 font-light max-w-2xl mx-auto leading-relaxed">
              {meta.heroSubtitle}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary-foreground/10" />
      </section>

      {/* ── Mobile category pills ─────────────────────── */}
      <div className="lg:hidden sticky top-[4rem] z-30 bg-background/95 backdrop-blur-md border-b border-foreground/15">
        <div className="flex items-center gap-0">
          <button
            onClick={() => setMobileFiltersOpen(o => !o)}
            className={cn(
              "flex items-center gap-2 px-5 py-4 text-xs uppercase tracking-[0.18em] font-semibold border-r border-foreground/15 shrink-0 transition-colors",
              hasActiveFilters ? "text-secondary" : "text-foreground"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filtre
            {hasActiveFilters && (
              <span className="text-[0.65rem] text-secondary font-serif italic">
                · {activeFilters.length + (p.q ? 1 : 0)}
              </span>
            )}
            {mobileFiltersOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="flex items-center gap-5 px-5 overflow-x-auto scrollbar-hide py-3">
            <Link href="/urunler">
              <span className={cn(
                "inline-flex items-center text-xs uppercase tracking-[0.18em] font-semibold whitespace-nowrap transition-colors cursor-pointer",
                !categorySlug ? "text-secondary border-b border-secondary pb-1" : "text-foreground/55 hover:text-foreground"
              )}>
                Tümü
              </span>
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/urunler/${cat.slug}`}>
                <span className={cn(
                  "inline-flex items-center text-xs uppercase tracking-[0.18em] font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  categorySlug === cat.slug ? "text-secondary border-b border-secondary pb-1" : "text-foreground/55 hover:text-foreground"
                )}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-foreground/15 bg-background px-6 py-8"
            >
              <div className="space-y-8">
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Ürün ara..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-foreground/30 focus:border-secondary outline-none text-base font-serif font-light placeholder:text-foreground/40 placeholder:italic"
                  />
                </div>
                <FilterSections p={p} pushParams={pushParams} hasActiveFilters={hasActiveFilters} clearAllFilters={clearAllFilters} allProducts={allProducts} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main layout ──────────────────────────────── */}
      <div className="container px-6 flex-1 py-16 md:py-24">
        <div className="flex gap-12 lg:gap-16">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-32 space-y-10">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Ürün ara..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-foreground/30 focus:border-secondary outline-none text-base font-serif font-light placeholder:text-foreground/40 placeholder:italic"
                  aria-label="Ürün ara"
                />
              </div>

              {/* Categories */}
              <div>
                <span className="eyebrow text-foreground/70">Kategoriler</span>
                <div className="flex flex-col gap-0">
                  <Link href="/urunler">
                    <div className={cn(
                      "flex items-center justify-between py-2 text-sm transition-colors cursor-pointer border-b border-foreground/10",
                      !categorySlug
                        ? "text-secondary font-serif italic"
                        : "text-foreground/65 hover:text-foreground"
                    )}>
                      <span>Tüm Ürünler</span>
                      {!categorySlug && <span className="text-xs text-foreground/45">{loading ? "…" : allProducts.length}</span>}
                    </div>
                  </Link>
                  {categories.map(cat => {
                    const isActive = categorySlug === cat.slug;
                    return (
                      <Link key={cat.id} href={`/urunler/${cat.slug}`}>
                        <div className={cn(
                          "flex items-center justify-between py-2 text-sm transition-colors cursor-pointer border-b border-foreground/10 last:border-0",
                          isActive
                            ? "text-secondary font-serif italic"
                            : "text-foreground/65 hover:text-foreground"
                        )}>
                          <span className="line-clamp-1">{cat.name}</span>
                          {isActive && <span className="text-xs text-foreground/45">{loading ? "…" : allProducts.length}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <FilterSections p={p} pushParams={pushParams} hasActiveFilters={hasActiveFilters} clearAllFilters={clearAllFilters} allProducts={allProducts} />

              {/* WhatsApp CTA — bare hairline */}
              <div className="border-t border-foreground/15 pt-6">
                <div className="flex items-center gap-2 mb-3 text-[0.65rem] uppercase tracking-[0.22em] text-foreground/55 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  Şu an aktif
                </div>
                <h4 className="font-serif font-light text-xl mb-3 tracking-tight">
                  WhatsApp'tan <em className="italic text-secondary">sipariş.</em>
                </h4>
                <p className="text-foreground/55 text-xs leading-relaxed font-light mb-5">
                  Ürünü seçin, mesaj atın — aynı gün yanıt alın.
                </p>
                <WhatsAppButton
                  message={buildSearchMessage("", activeCategory?.name)}
                  tracking={{
                    event: "catalog_inquiry",
                    source: "catalog_sidebar",
                    category_name: activeCategory?.name,
                  }}
                  size="sm"
                  fullWidth
                  label="WhatsApp'tan Yaz"
                />
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">

            {/* Recently viewed strip */}
            {recentlyViewedProducts.length >= 2 && (
              <div className="mb-12">
                <RecommendationStrip
                  eyebrow="Geçmiş"
                  title="Son"
                  italicAccent="görüntülenenler."
                  products={recentlyViewedProducts}
                />
              </div>
            )}

            {/* Toolbar — minimal */}
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-12 pb-6 border-b border-foreground/15">
              <div className="flex items-baseline gap-3 text-sm flex-wrap">
                {loading ? (
                  <span className="text-foreground/55 font-light italic">Yükleniyor…</span>
                ) : (
                  <>
                    <span className="font-serif font-light text-3xl text-foreground tracking-tight">
                      {String(filtered.length).padStart(2, "0")}
                    </span>
                    <span className="text-foreground/55 uppercase text-xs tracking-[0.22em] font-semibold">ürün</span>
                    {p.q && (
                      <>
                        <span className="text-foreground/55 italic font-serif font-light">
                          — "{p.q}"
                        </span>
                        <button
                          onClick={() => { setSearchInput(""); pushParams({ q: undefined }); }}
                          className="inline-flex items-center gap-0.5 text-secondary hover:text-primary text-xs uppercase tracking-[0.18em] font-semibold transition-colors"
                        >
                          <X className="w-3 h-3" /> Temizle
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <SortDropdown
                  value={p.sort}
                  onChange={v => pushParams({ sort: v, page: 1 })}
                />
                <div className="inline-flex items-center border border-foreground/20 divide-x divide-foreground/20">
                  {(["grid", "list"] as ViewMode[]).map(v => (
                    <button
                      key={v}
                      onClick={() => pushParams({ view: v })}
                      aria-pressed={p.view === v}
                      aria-label={v === "grid" ? "Izgara görünümü" : "Liste görünümü"}
                      className={cn(
                        "p-2.5 transition-colors",
                        p.view === v
                          ? "bg-foreground text-background"
                          : "text-foreground/55 hover:text-foreground"
                      )}
                    >
                      {v === "grid" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search hint — hairline */}
            <AnimatePresence>
              {p.q && !loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4 py-4 border-y border-foreground/15 flex-wrap">
                    <p className="text-sm text-foreground/65 leading-snug font-light">
                      <span className="font-serif italic text-foreground">"{p.q}"</span> için aradığınızı bulamadınız mı?
                    </p>
                    <WhatsAppButton
                      message={buildSearchMessage(p.q, activeCategory?.name)}
                      tracking={{
                        event: "search_inquiry",
                        source: "catalog_search_hint",
                        category_name: activeCategory?.name,
                        search_query: p.q,
                      }}
                      size="sm"
                      rounded="pill"
                      label="WhatsApp'tan Sor"
                      className="shrink-0 whitespace-nowrap"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 overflow-hidden"
                >
                  <span className="eyebrow !mb-0">Aktif</span>
                  {activeFilters.map(f => (
                    <button
                      key={f.clearKey}
                      onClick={() => pushParams({ [f.clearKey]: undefined, page: 1 })}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-semibold text-secondary border-b border-secondary/40 hover:text-rose-700 hover:border-rose-700/40 pb-1 transition-colors"
                    >
                      {f.label}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                {[...Array(24)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paged.length === 0 ? (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClear={clearAllFilters}
                query={p.q}
                categoryName={activeCategory?.name}
              />
            ) : (
              <>
                {p.view === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                    {paged.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} compact />
                    ))}
                  </div>
                ) : (
                  <div className="border-t border-foreground/15">
                    {paged.map((product, i) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        index={i}
                        categoryName={activeCategory?.name}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination — minimal */}
                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-16 pt-12 border-t border-foreground/15">
                    <button
                      disabled={safePage <= 1}
                      onClick={() => pushParams({ page: safePage - 1 })}
                      aria-label="Önceki sayfa"
                      className="p-2 text-foreground/55 hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => pushParams({ page: pg })}
                        aria-current={pg === safePage ? "page" : undefined}
                        className={cn(
                          "w-9 h-9 text-sm font-serif transition-colors",
                          pg === safePage
                            ? "text-secondary italic font-light text-lg"
                            : "text-foreground/55 hover:text-foreground font-light"
                        )}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      disabled={safePage >= totalPages}
                      onClick={() => pushParams({ page: safePage + 1 })}
                      aria-label="Sonraki sayfa"
                      className="p-2 text-foreground/55 hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </>
            )}

            {/* Category info — editorial */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mt-24 md:mt-32 pt-12 border-t border-foreground/15"
              >
                <span className="eyebrow">Hakkında</span>
                <h2 className="editorial-heading text-3xl md:text-4xl mb-6 max-w-3xl">
                  {meta.infoTitle}
                </h2>
                <p className="text-foreground/65 text-base md:text-lg leading-relaxed font-light max-w-3xl">
                  {meta.infoText}
                </p>
                {'keywords' in meta && meta.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
                    {meta.keywords.map(kw => (
                      <span key={kw} className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground/55">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* ── Final WhatsApp CTA — Dark editorial band ── */}
      {!loading && allProducts.length > 0 && (
        <section className="section-sm bg-[#111111] text-white">
          <div className="container px-6 max-w-4xl text-center">
            <span className="eyebrow justify-center text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              Şu an aktifiz
            </span>
            <h2 className="editorial-heading text-white text-4xl md:text-5xl lg:text-6xl mb-8">
              Aradığınızı bulamadınız mı.
              <br />
              <em className="italic font-light text-white/70">Birlikte bulalım.</em>
            </h2>
            <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
              WhatsApp'tan yazın, size en uygun ürünü birlikte bulalım.
            </p>
            <WhatsAppButton
              message={buildSearchMessage(p.q, activeCategory?.name)}
              tracking={{
                event: p.q ? "search_inquiry" : "catalog_inquiry",
                source: "catalog_strip",
                category_name: activeCategory?.name,
                search_query: p.q || undefined,
              }}
              size="lg"
              rounded="pill"
              label="WhatsApp'tan Yaz"
            />
            <div className="mt-6 text-xs uppercase tracking-[0.18em] text-white/40 inline-flex items-center gap-2">
              <MessageCircle className="w-3 h-3" />
              Genellikle dakikalar içinde dönüş
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
