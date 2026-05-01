import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation, useSearch } from "wouter";
import {
  Search, Filter, SlidersHorizontal, LayoutGrid, List,
  ChevronLeft, ChevronRight, ArrowRight,
  X, ChevronDown, ChevronUp, Star, Sparkles, ArrowUpDown,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, getProducts } from "@/lib/data";
import { Category, Product, StockStatus } from "@/lib/mockData";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/lib/seo";
import { buildSearchMessage, buildProductMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  stock: StockFilter;
  feat: boolean;
}

function readParams(s: string): Params {
  const sp = new URLSearchParams(s);
  return {
    view:  (sp.get("view") === "list" ? "list" : "grid") as ViewMode,
    page:  Math.max(1, parseInt(sp.get("page") || "1", 10) || 1),
    q:     sp.get("q") || "",
    sort:  (["featured","newest","price-asc","price-desc"].includes(sp.get("sort") || "")
              ? sp.get("sort") : "featured") as SortKey,
    price: (["all","low","mid","high","premium"].includes(sp.get("price") || "")
              ? sp.get("price") : "all") as PriceRange,
    stock: (["all","in_stock","low_stock"].includes(sp.get("stock") || "")
              ? sp.get("stock") : "all") as StockFilter,
    feat:  sp.get("feat") === "1",
  };
}

/* ── Price ranges ─────────────────────────────────────── */
const PRICE_RANGES: Record<PriceRange, { label: string; min: number; max: number }> = {
  all:     { label: "Tüm Fiyatlar", min: 0, max: Infinity },
  low:     { label: "₺500'a kadar",  min: 0, max: 500 },
  mid:     { label: "₺500 – ₺2.000", min: 500, max: 2000 },
  high:    { label: "₺2.000 – ₺5.000", min: 2000, max: 5000 },
  premium: { label: "₺5.000+",        min: 5000, max: Infinity },
};

const SORT_LABELS: Record<SortKey, string> = {
  featured:    "Öne Çıkanlar",
  newest:      "En Yeniler",
  "price-asc": "Fiyat: Artan",
  "price-desc":"Fiyat: Azalan",
};

/* ── Filtering + sorting (client-side) ───────────────── */
function applyFilters(
  products: Product[],
  params: Params
): Product[] {
  let list = [...products];

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
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3 rounded-full w-20" />
        <div className="skeleton h-4 rounded-full w-4/5" />
        <div className="skeleton h-3 rounded-full w-full" />
        <div className="skeleton h-3 rounded-full w-3/4" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-4 rounded-full w-20" />
          <div className="skeleton h-8 rounded-xl w-32" />
        </div>
        <div className="skeleton h-9 rounded-xl w-full mt-1" />
      </div>
    </div>
  );
}

/* ── List row ─────────────────────────────────────────── */
function ProductRow({ product, index, categoryName }: {
  product: Product; index: number; categoryName?: string;
}) {
  const isOOS = product.stock_status === "out_of_stock";
  const waMessage = buildProductMessage(product, { name: categoryName || "Kamp & Balık" });

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.2) }}
      className={cn(
        "flex gap-0 bg-card border border-card-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 group",
        isOOS && "opacity-65"
      )}
    >
      {/* Thumbnail */}
      <div className="w-28 sm:w-40 shrink-0 bg-muted relative">
        {categoryName && (
          <span className="absolute top-2 left-2 z-10 badge-category">{categoryName}</span>
        )}
        {product.is_new && (
          <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-secondary text-white">
            <Sparkles className="w-2.5 h-2.5" /> Yeni
          </span>
        )}
        <Link href={`/urun/${product.slug}`} tabIndex={-1}>
          <AspectRatio ratio={1}>
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-2 min-w-0">
        <div className="min-w-0">
          {/* Stock pill */}
          {product.stock_status && product.stock_status !== "in_stock" && (
            <div className="mb-1.5">
              {product.stock_status === "low_stock" && (
                <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> Son stoklar
                </span>
              )}
              {product.stock_status === "out_of_stock" && (
                <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                  Tükendi
                </span>
              )}
            </div>
          )}
          <Link href={`/urun/${product.slug}`}>
            <h3 className="font-serif font-semibold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-border/50">
          <span className={cn(
            "font-bold",
            product.price_numeric ? "text-primary text-base" : "text-muted-foreground text-xs italic"
          )}>
            {product.price_label}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/urun/${product.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary uppercase tracking-wide transition-colors"
            >
              İncele <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            {!isOOS && (
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
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Empty state ──────────────────────────────────────── */
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
      className="text-center py-20 px-8 bg-card border border-card-border rounded-3xl"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
        <SlidersHorizontal className="w-7 h-7 text-muted-foreground opacity-60" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
        {query
          ? `"${query}" için sonuç bulunamadı`
          : hasFilters ? "Filtrelerle Eşleşen Ürün Yok" : "Bu Kategoride Ürün Yok"}
      </h3>
      <p className="text-muted-foreground text-sm mb-7 max-w-xs mx-auto leading-relaxed">
        {query
          ? "Arama teriminizi genişletin ya da aradığınız ürünü doğrudan WhatsApp'tan sorun — yardımcı olalım."
          : hasFilters
            ? "Seçtiğiniz filtre kriterlerine uygun ürün bulunamadı. Filtreleri genişletin ya da WhatsApp'tan sorun."
            : "Bu kategoriye yakında ürün ekleyeceğiz. WhatsApp'tan sorabilirsiniz."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:bg-muted/50 transition-all duration-200"
        >
          <X className="w-4 h-4" />
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

/* ── Sort dropdown ────────────────────────────────────── */
function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/30 transition-all"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-secondary" />
        {SORT_LABELS[value]}
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-xl shadow-lg z-40 overflow-hidden"
            onMouseLeave={() => setOpen(false)}
          >
            {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2",
                  value === key
                    ? "bg-primary/8 text-primary font-semibold"
                    : "text-foreground hover:bg-muted/60"
                )}
              >
                {value === key && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                {value !== key && <span className="w-3.5 h-3.5 shrink-0" />}
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    getProducts({ categorySlug, search: p.q }).then(data => {
      setAllProducts(data);
      setLoading(false);
    });
  }, [categorySlug, p.q]);

  /* ── Push URL params ───────────────────────────────── */
  function pushParams(patch: Partial<Record<string, string | number | boolean | undefined>>) {
    const sp = new URLSearchParams(searchString);
    const defaults: Record<string, string> = { view: "grid", page: "1", sort: "featured", price: "all", stock: "all", feat: "" };

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

  /* ── Pagination ────────────────────────────────────── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(p.page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Active filters (for chip display) ─────────────── */
  const activeFilters: { label: string; clearKey: string; clearVal?: string }[] = [];
  if (p.sort !== "featured") activeFilters.push({ label: SORT_LABELS[p.sort], clearKey: "sort" });
  if (p.price !== "all")     activeFilters.push({ label: PRICE_RANGES[p.price].label, clearKey: "price" });
  if (p.stock !== "all")     activeFilters.push({
    label: p.stock === "in_stock" ? "Stokta Mevcut" : "Son Stoklar",
    clearKey: "stock",
  });
  if (p.feat)                activeFilters.push({ label: "Öne Çıkanlar", clearKey: "feat" });
  const hasActiveFilters = activeFilters.length > 0 || !!p.q;

  function clearAllFilters() {
    setSearchInput("");
    setLocation(basePath);
  }

  /* ── Sidebar filter sections ────────────────────────── */
  const FilterSections = () => (
    <>
      {/* Sort */}
      <div>
        <h3 className="filter-section-title">
          <ArrowUpDown className="w-3.5 h-3.5 text-secondary" />
          Sıralama
        </h3>
        <div className="flex flex-col gap-0.5">
          {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => pushParams({ sort: key, page: 1 })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all duration-200 w-full",
                p.sort === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", p.sort !== key && "invisible")} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="filter-section-title">
          <SlidersHorizontal className="w-3.5 h-3.5 text-secondary" />
          Fiyat Aralığı
        </h3>
        <div className="flex flex-col gap-0.5">
          {(Object.entries(PRICE_RANGES) as [PriceRange, { label: string }][]).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => pushParams({ price: key, page: 1 })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all duration-200 w-full",
                p.price === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", p.price !== key && "invisible")} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div>
        <h3 className="filter-section-title">
          <Filter className="w-3.5 h-3.5 text-secondary" />
          Stok Durumu
        </h3>
        <div className="flex flex-col gap-0.5">
          {([
            ["all",      "Tümü"],
            ["in_stock", "Stokta Mevcut"],
            ["low_stock","Son Stoklar"],
          ] as [StockFilter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => pushParams({ stock: key, page: 1 })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all duration-200 w-full",
                p.stock === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", p.stock !== key && "invisible")} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured toggle */}
      <div>
        <h3 className="filter-section-title">
          <Star className="w-3.5 h-3.5 text-secondary" />
          Ürün Tipi
        </h3>
        <button
          onClick={() => pushParams({ feat: !p.feat ? "1" : undefined, page: 1 })}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            p.feat
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", !p.feat && "invisible")} />
          <Star className="w-3.5 h-3.5 shrink-0" />
          Yalnızca Öne Çıkanlar
        </button>
        <button
          onClick={() => pushParams({ sort: p.sort === "newest" ? "featured" : "newest", feat: undefined, page: 1 })}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 mt-0.5",
            p.sort === "newest"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", p.sort !== "newest" && "invisible")} />
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          Yeni Gelenler Önce
        </button>
      </div>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground border border-border hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <X className="w-3.5 h-3.5" />
          Tüm Filtreleri Temizle
        </button>
      )}
    </>
  );

  /* ── Sidebar content (categories + search + filters) ── */
  const SidebarContent = () => (
    <div className="space-y-7">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Ürün ara..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="input-outdoor w-full pl-9 pr-4"
          aria-label="Ürün ara"
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="filter-section-title">
          <Filter className="w-3.5 h-3.5 text-secondary" />
          Kategoriler
        </h3>
        <div className="flex flex-col gap-0.5">
          <Link href="/urunler" onClick={() => setMobileFiltersOpen(false)}>
            <div className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
              !categorySlug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}>
              <span className="text-base">🛒</span>
              <span>Tüm Ürünler</span>
              {!categorySlug && (
                <span className="ml-auto text-xs bg-white/20 rounded-full px-2 py-0.5">
                  {loading ? "…" : allProducts.length}
                </span>
              )}
            </div>
          </Link>
          {categories.map(cat => {
            const catMeta = getCategoryMeta(cat.slug);
            const isActive = categorySlug === cat.slug;
            return (
              <Link key={cat.id} href={`/urunler/${cat.slug}`} onClick={() => setMobileFiltersOpen(false)}>
                <div className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}>
                  <span className="text-base shrink-0">{'icon' in catMeta ? catMeta.icon : '📦'}</span>
                  <span className="line-clamp-1">{cat.name}</span>
                  {isActive && (
                    <span className="ml-auto text-xs bg-white/20 rounded-full px-2 py-0.5">
                      {loading ? "…" : allProducts.length}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter sections */}
      <FilterSections />

      {/* WhatsApp CTA */}
      <div className="rounded-2xl p-4 text-white" style={{ background: "hsl(149 43% 17%)" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-white/60">Şu an aktif</span>
        </div>
        <p className="font-serif font-bold text-sm mb-1">WhatsApp'tan Sipariş</p>
        <p className="text-white/55 text-xs leading-relaxed mb-3">
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
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title={meta.seoTitle} description={meta.seoDescription} />

      {/* ── Category Hero ────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ marginTop: "4rem" }}>
        {activeCategory?.image_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={activeCategory.image_url}
              alt={activeCategory.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(135deg, rgba(26,61,43,0.92) 0%, rgba(26,61,43,0.78) 50%, rgba(26,61,43,0.55) 100%)"
            }} />
          </div>
        )}

        <div className={cn(
          "relative z-10 container px-4 md:px-6",
          activeCategory ? "py-12 md:py-16" : "py-10 md:py-12 gradient-outdoor"
        )}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs mb-4">
            <Link href="/" className={cn("font-medium transition-colors", activeCategory ? "text-white/60 hover:text-white/90" : "text-primary-foreground/60 hover:text-primary-foreground")}>
              Ana Sayfa
            </Link>
            <ChevronRight className={cn("w-3 h-3", activeCategory ? "text-white/40" : "text-primary-foreground/40")} />
            <Link href="/urunler" className={cn("font-medium transition-colors", activeCategory ? "text-white/60 hover:text-white/90" : "text-primary-foreground/60 hover:text-primary-foreground")}>
              Ürünler
            </Link>
            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-white/40" />
                <span className="text-secondary font-semibold">{activeCategory.name}</span>
              </>
            )}
          </nav>

          <motion.div
            key={categorySlug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className={cn(
              "font-serif font-bold tracking-tight leading-tight mb-3 text-3xl md:text-4xl",
              activeCategory ? "text-white" : "text-primary-foreground"
            )}>
              {meta.heroTitle}
            </h1>
            <p className={cn(
              "text-sm md:text-base leading-relaxed max-w-xl",
              activeCategory ? "text-white/68" : "text-primary-foreground/68"
            )}>
              {meta.heroSubtitle}
            </p>
            {'keywords' in meta && meta.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {meta.keywords.map(kw => (
                  <span key={kw} className={cn(
                    "text-[0.7rem] font-medium px-3 py-1 rounded-full border",
                    activeCategory
                      ? "border-white/20 text-white/65 bg-white/8"
                      : "border-primary-foreground/20 text-primary-foreground/65 bg-primary-foreground/8"
                  )}>
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Mobile category pills ─────────────────────── */}
      <div className="lg:hidden sticky top-[4rem] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-0">
          <button
            onClick={() => setMobileFiltersOpen(o => !o)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-r border-border shrink-0 transition-colors",
              hasActiveFilters ? "text-primary" : "text-foreground"
            )}
          >
            <Filter className="w-4 h-4 text-secondary" />
            Filtre
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[0.6rem] font-bold flex items-center justify-center">
                {activeFilters.length + (p.q ? 1 : 0)}
              </span>
            )}
            {mobileFiltersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2 px-3 overflow-x-auto scrollbar-hide py-2.5">
            <Link href="/urunler">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                !categorySlug ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}>
                🛒 Tümü
              </span>
            </Link>
            {categories.map(cat => {
              const catMeta = getCategoryMeta(cat.slug);
              return (
                <Link key={cat.id} href={`/urunler/${cat.slug}`}>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                    categorySlug === cat.slug ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}>
                    {'icon' in catMeta ? catMeta.icon : '📦'} {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-border bg-background px-4 py-5"
            >
              <div className="space-y-5">
                {/* Search in drawer */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Ürün ara..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="input-outdoor w-full pl-9 pr-4"
                  />
                </div>
                <FilterSections />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main layout ──────────────────────────────── */}
      <div className="container px-4 md:px-6 flex-1 py-8 md:py-10">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {/* Result count */}
              <div className="flex items-center gap-2 text-sm flex-wrap">
                {loading ? (
                  <span className="text-muted-foreground">Yükleniyor…</span>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">{filtered.length}</span>
                    <span className="text-muted-foreground">ürün</span>
                    {p.q && (
                      <>
                        <span className="text-muted-foreground">
                          — "<span className="text-foreground font-medium">{p.q}</span>"
                        </span>
                        <button
                          onClick={() => { setSearchInput(""); pushParams({ q: undefined }); }}
                          className="inline-flex items-center gap-0.5 text-secondary hover:text-primary text-xs font-medium"
                        >
                          <X className="w-3.5 h-3.5" /> Temizle
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Sort + view toggle */}
              <div className="flex items-center gap-2">
                <SortDropdown
                  value={p.sort}
                  onChange={v => pushParams({ sort: v, page: 1 })}
                />
                <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 gap-0">
                  {(["grid", "list"] as ViewMode[]).map(v => (
                    <button
                      key={v}
                      onClick={() => pushParams({ view: v })}
                      aria-pressed={p.view === v}
                      aria-label={v === "grid" ? "Izgara görünümü" : "Liste görünümü"}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                        p.view === v
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v === "grid"
                        ? <><LayoutGrid className="w-3.5 h-3.5" /><span className="hidden sm:inline">Izgara</span></>
                        : <><List className="w-3.5 h-3.5" /><span className="hidden sm:inline">Liste</span></>
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search hint — appears when user has an active query */}
            <AnimatePresence>
              {p.q && !loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#25D366]/8 border border-[#25D366]/20">
                    <p className="text-xs text-muted-foreground leading-snug">
                      <span className="font-semibold text-foreground">"{p.q}"</span> için aradığınızı bulamadınız mı?
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
                  className="flex flex-wrap items-center gap-2 mb-5 overflow-hidden"
                >
                  <span className="text-xs text-muted-foreground font-medium">Aktif filtreler:</span>
                  {activeFilters.map(f => (
                    <button
                      key={f.clearKey}
                      onClick={() => pushParams({ [f.clearKey]: undefined, page: 1 })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    >
                      {f.label}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-red-500 font-medium underline underline-offset-2 transition-colors"
                  >
                    Tümünü temizle
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products */}
            {loading ? (
              <div className={cn(
                p.view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "flex flex-col gap-3"
              )}>
                {Array.from({ length: 6 }).map((_, i) =>
                  p.view === "grid"
                    ? <SkeletonCard key={i} />
                    : <div key={i} className="skeleton h-28 rounded-2xl" />
                )}
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
                <AnimatePresence mode="popLayout">
                  {p.view === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {paged.map((prod, i) => (
                        <ProductCard key={prod.id} product={prod} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {paged.map((prod, i) => (
                        <ProductRow
                          key={prod.id}
                          product={prod}
                          index={i}
                          categoryName={categories.find(c => c.id === prod.category_id)?.name}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Sayfalama" className="flex items-center justify-center gap-2 mt-12">
                    <button
                      disabled={safePage <= 1}
                      onClick={() => pushParams({ page: safePage - 1 })}
                      aria-label="Önceki sayfa"
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => pushParams({ page: pg })}
                        aria-current={pg === safePage ? "page" : undefined}
                        className={cn(
                          "w-9 h-9 rounded-full text-sm font-medium transition-all",
                          pg === safePage
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                        )}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      disabled={safePage >= totalPages}
                      onClick={() => pushParams({ page: safePage + 1 })}
                      aria-label="Sonraki sayfa"
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </>
            )}

            {/* WhatsApp CTA strip */}
            {!loading && allProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-12 rounded-2xl overflow-hidden"
              >
                <div
                  className="flex flex-col sm:flex-row items-center justify-between gap-5 p-6 md:p-8"
                  style={{ background: "hsl(149 43% 17%)" }}
                >
                  <div className="text-center sm:text-left">
                    <p className="font-serif font-bold text-white text-lg md:text-xl mb-1">
                      Aradığınızı bulamadınız mı?
                    </p>
                    <p className="text-white/55 text-sm">
                      WhatsApp'tan yazın, size en uygun ürünü birlikte bulalım.
                    </p>
                  </div>
                  <WhatsAppButton
                    message={buildSearchMessage(p.q, activeCategory?.name)}
                    tracking={{
                      event: p.q ? "search_inquiry" : "catalog_inquiry",
                      source: "catalog_strip",
                      category_name: activeCategory?.name,
                      search_query: p.q || undefined,
                    }}
                    size="md"
                    rounded="pill"
                    label="WhatsApp'tan Yaz"
                    className="shrink-0"
                  />
                </div>
              </motion.div>
            )}

            {/* Category info section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-10 bg-card border border-card-border rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">
                {meta.infoTitle}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {meta.infoText}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {'keywords' in meta && meta.keywords.map(kw => (
                  <span key={kw} className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
