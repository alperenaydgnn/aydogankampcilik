import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation, useSearch } from "wouter";
import {
  Search, Filter, SlidersHorizontal, LayoutGrid, List,
  ChevronLeft, ChevronRight, MessageCircle, ArrowRight,
  X, ChevronDown, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, getProducts } from "@/lib/data";
import { Category, Product } from "@/lib/mockData";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const PAGE_SIZE = 9;
type ViewMode = "grid" | "list";

/* ─── URL param helpers ──────────────────────────────── */
function readParams(s: string) {
  const sp = new URLSearchParams(s);
  return {
    view: (sp.get("view") === "list" ? "list" : "grid") as ViewMode,
    page: Math.max(1, parseInt(sp.get("page") || "1", 10) || 1),
    q: sp.get("q") || "",
  };
}

/* ─── Skeleton card ──────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3.5 rounded-full w-20" />
        <div className="skeleton h-5 rounded-full w-4/5" />
        <div className="skeleton h-4 rounded-full w-full" />
        <div className="skeleton h-4 rounded-full w-3/4" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-5 rounded-full w-24" />
          <div className="skeleton h-8 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

/* ─── List row ───────────────────────────────────────── */
function ProductRow({ product, index, categoryName }: {
  product: Product; index: number; categoryName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25) }}
    >
      <Link
        href={`/urun/${product.slug}`}
        className="group flex gap-0 bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 relative"
      >
        <div className="w-28 sm:w-44 shrink-0 bg-muted relative">
          {categoryName && (
            <span className="absolute top-2 left-2 z-10 badge-category">
              {categoryName}
            </span>
          )}
          <AspectRatio ratio={1}>
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
        </div>
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <h3 className="font-serif font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="font-bold text-sm sm:text-base text-primary">{product.price_label}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary uppercase tracking-wide">
              İncele <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Empty state ────────────────────────────────────── */
function EmptyState({ hasQuery, onClear }: { hasQuery: boolean; onClear: () => void }) {
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
        {hasQuery ? "Ürün Bulunamadı" : "Bu Kategoride Ürün Yok"}
      </h3>
      <p className="text-muted-foreground text-sm mb-7 max-w-xs mx-auto leading-relaxed">
        {hasQuery
          ? "Arama kriterlerine uygun ürün bulunamadı. Farklı anahtar kelimeler deneyin."
          : "Bu kategoriye yakında ürün ekleyeceğiz. WhatsApp'tan sorabilirsiniz."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:bg-muted/50 transition-all duration-200"
        >
          <X className="w-4 h-4" />
          {hasQuery ? "Aramayı Temizle" : "Tüm Ürünlere Dön"}
        </button>
        <a
          href={buildWhatsAppLink("Merhaba! Aradığım ürünü bulamadım, yardımcı olur musunuz?")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200"
          style={{ background: "#25D366" }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp'tan Sorun
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function Catalog() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const categorySlug = params.kategori;

  const initial = useMemo(() => readParams(searchString), [searchString]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(initial.q);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const view: ViewMode = initial.view;
  const page: number = initial.page;
  const debouncedQ: string = initial.q;

  const basePath = categorySlug ? `/urunler/${categorySlug}` : "/urunler";
  const meta = getCategoryMeta(categorySlug);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => { setSearchInput(initial.q); }, [initial.q]);
  useEffect(() => {
    if (searchInput === debouncedQ) return;
    const t = setTimeout(() => updateParams({ q: searchInput || undefined, page: 1 }), 350);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);
  useEffect(() => { getCategories().then(setCategories); }, []);
  useEffect(() => {
    setLoading(true);
    getProducts({ categorySlug, search: debouncedQ }).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [categorySlug, debouncedQ]);

  function updateParams(patch: { q?: string | undefined; view?: ViewMode; page?: number }) {
    const sp = new URLSearchParams(searchString);
    if ("q" in patch) { if (patch.q) sp.set("q", patch.q); else sp.delete("q"); }
    if (patch.view) { if (patch.view === "grid") sp.delete("view"); else sp.set("view", patch.view); }
    if (patch.page !== undefined) { if (patch.page <= 1) sp.delete("page"); else sp.set("page", String(patch.page)); }
    const qs = sp.toString();
    setLocation(qs ? `${basePath}?${qs}` : basePath);
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = products.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeCategory = categories.find(c => c.slug === categorySlug);

  function clearAll() {
    setSearchInput("");
    setLocation("/urunler");
  }

  /* ── Sidebar content (reused on mobile drawer + desktop) ── */
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
        <h3 className="font-serif text-sm font-bold text-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-secondary" />
          Kategoriler
        </h3>
        <div className="flex flex-col gap-1">
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
                  {products.length}
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
                      {loading ? "…" : products.length}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* WhatsApp CTA in sidebar */}
      <div
        className="rounded-2xl p-4 text-white"
        style={{ background: "hsl(149 43% 17%)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-white/60">Şu an aktif</span>
        </div>
        <p className="font-serif font-bold text-sm mb-1">WhatsApp'tan Sipariş</p>
        <p className="text-white/55 text-xs leading-relaxed mb-3">
          Ürünü seçin, mesaj atın — aynı gün yanıt alın.
        </p>
        <a
          href={buildWhatsAppLink(
            activeCategory
              ? `Merhaba! ${activeCategory.name} kategorisinde ürün arıyorum. Yardımcı olur musunuz?`
              : "Merhaba! Kamp ve balık malzemeleri hakkında bilgi almak istiyorum."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: "#25D366" }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp'tan Yaz
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title={meta.seoTitle} description={meta.seoDescription} />

      {/* ── Category Hero ────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ marginTop: "4rem" }}>
        {/* Background image */}
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

        <div
          className={cn(
            "relative z-10 container px-4 md:px-6",
            activeCategory ? "py-12 md:py-16" : "py-10 md:py-12 gradient-outdoor"
          )}
        >
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs mb-4">
            <Link href="/" className={cn(
              "font-medium transition-colors",
              activeCategory ? "text-white/60 hover:text-white/90" : "text-primary-foreground/60 hover:text-primary-foreground"
            )}>
              Ana Sayfa
            </Link>
            <ChevronRight className={cn("w-3 h-3", activeCategory ? "text-white/40" : "text-primary-foreground/40")} />
            <Link href="/urunler" className={cn(
              "font-medium transition-colors",
              activeCategory ? "text-white/60 hover:text-white/90" : "text-primary-foreground/60 hover:text-primary-foreground"
            )}>
              Ürünler
            </Link>
            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-white/40" />
                <span className="text-secondary font-semibold">{activeCategory.name}</span>
              </>
            )}
          </nav>

          {/* Title */}
          <motion.div
            key={categorySlug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className={cn(
              "font-serif font-bold tracking-tight leading-tight mb-3",
              activeCategory
                ? "text-3xl md:text-4xl text-white"
                : "text-3xl md:text-4xl text-primary-foreground"
            )}>
              {meta.heroTitle}
            </h1>
            <p className={cn(
              "text-sm md:text-base leading-relaxed max-w-xl",
              activeCategory ? "text-white/68" : "text-primary-foreground/68"
            )}>
              {meta.heroSubtitle}
            </p>

            {/* Category keywords */}
            {'keywords' in meta && meta.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {meta.keywords.map(kw => (
                  <span
                    key={kw}
                    className={cn(
                      "text-[0.7rem] font-medium px-3 py-1 rounded-full border",
                      activeCategory
                        ? "border-white/20 text-white/65 bg-white/8"
                        : "border-primary-foreground/20 text-primary-foreground/65 bg-primary-foreground/8"
                    )}
                  >
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
          {/* Filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(o => !o)}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-foreground border-r border-border shrink-0"
          >
            <Filter className="w-4 h-4 text-secondary" />
            Filtre
            {mobileFiltersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Horizontal scroll pills */}
          <div className="flex items-center gap-2 px-3 overflow-x-auto scrollbar-hide py-2.5">
            <Link href="/urunler">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                !categorySlug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
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
                    categorySlug === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}>
                    {'icon' in catMeta ? catMeta.icon : '📦'} {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-border bg-background px-4 py-5"
            >
              <SidebarContent />
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                {loading ? (
                  <span className="text-muted-foreground">Yükleniyor…</span>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">{products.length}</span>
                    <span className="text-muted-foreground">ürün</span>
                    {debouncedQ && (
                      <span className="text-muted-foreground">
                        — "<span className="text-foreground font-medium">{debouncedQ}</span>" için
                      </span>
                    )}
                    {debouncedQ && (
                      <button
                        onClick={() => { setSearchInput(""); updateParams({ q: undefined }); }}
                        className="ml-1 inline-flex items-center gap-0.5 text-secondary hover:text-primary text-xs font-medium"
                      >
                        <X className="w-3.5 h-3.5" /> Temizle
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* View toggle */}
              <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 gap-0">
                {(["grid", "list"] as ViewMode[]).map(v => (
                  <button
                    key={v}
                    onClick={() => updateParams({ view: v })}
                    aria-pressed={view === v}
                    aria-label={v === "grid" ? "Izgara görünümü" : "Liste görünümü"}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                      view === v
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

            {/* Product display */}
            {loading ? (
              <div className={cn(
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "flex flex-col gap-3"
              )}>
                {Array.from({ length: 6 }).map((_, i) =>
                  view === "grid"
                    ? <SkeletonCard key={i} />
                    : <div key={i} className="skeleton h-28 rounded-2xl" />
                )}
              </div>
            ) : pagedProducts.length === 0 ? (
              <EmptyState hasQuery={!!debouncedQ} onClear={clearAll} />
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {view === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {pagedProducts.map((p, i) => (
                        <ProductCard key={p.id} product={p} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {pagedProducts.map((p, i) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          index={i}
                          categoryName={categories.find(c => c.id === p.category_id)?.name}
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
                      onClick={() => updateParams({ page: safePage - 1 })}
                      aria-label="Önceki sayfa"
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => updateParams({ page: p })}
                        aria-current={p === safePage ? "page" : undefined}
                        className={cn(
                          "w-9 h-9 rounded-full text-sm font-medium transition-all",
                          p === safePage
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={safePage >= totalPages}
                      onClick={() => updateParams({ page: safePage + 1 })}
                      aria-label="Sonraki sayfa"
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </>
            )}

            {/* ── WhatsApp CTA strip ───────────────────── */}
            {!loading && products.length > 0 && (
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
                  <a
                    href={buildWhatsAppLink(
                      activeCategory
                        ? `Merhaba! ${activeCategory.name} kategorisinde aradığım ürünü bulamadım. Yardımcı olur musunuz?`
                        : "Merhaba! Aradığım ürünü bulamadım, yardımcı olur musunuz?"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: "#25D366", border: "1px solid #1aaa57", boxShadow: "0 4px 16px rgba(37,211,102,0.22)" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp'tan Yaz
                  </a>
                </div>
              </motion.div>
            )}

            {/* ── Category info section ────────────────── */}
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
                  <span
                    key={kw}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                  >
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
