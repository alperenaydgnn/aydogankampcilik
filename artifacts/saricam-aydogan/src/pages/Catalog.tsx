import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation, useSearch } from "wouter";
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, getProducts } from "@/lib/data";
import { Category, Product } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const PAGE_SIZE = 9;

type ViewMode = "grid" | "list";

function readParams(searchString: string) {
  const sp = new URLSearchParams(searchString);
  const view = (sp.get("view") === "list" ? "list" : "grid") as ViewMode;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const q = sp.get("q") || "";
  return { view, page, q };
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/urun/${product.slug}`}
        className="group flex gap-4 sm:gap-6 bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <div className="w-32 sm:w-48 shrink-0 bg-muted">
          <AspectRatio ratio={1}>
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </AspectRatio>
        </div>
        <div className="flex-1 py-4 pr-4 sm:py-5 sm:pr-6 flex flex-col justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <h3 className="font-serif font-semibold text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          <div className="flex items-end justify-between pt-2 border-t border-border/50">
            <span className="font-medium text-base sm:text-lg text-primary">{product.price_label}</span>
            <span className="text-sm font-medium text-secondary uppercase tracking-wider">İncele</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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
  const view: ViewMode = initial.view;
  const page: number = initial.page;
  const debouncedQ: string = initial.q;

  // Sync local input when URL q changes (e.g. via filter clear)
  useEffect(() => {
    setSearchInput(initial.q);
  }, [initial.q]);

  // Debounce input -> URL update
  useEffect(() => {
    if (searchInput === debouncedQ) return;
    const timer = setTimeout(() => {
      updateParams({ q: searchInput || undefined, page: 1 });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ categorySlug, search: debouncedQ }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [categorySlug, debouncedQ]);

  const basePath = categorySlug ? `/urunler/${categorySlug}` : "/urunler";

  function updateParams(patch: { q?: string | undefined; view?: ViewMode; page?: number }) {
    const sp = new URLSearchParams(searchString);
    if ("q" in patch) {
      if (patch.q) sp.set("q", patch.q);
      else sp.delete("q");
    }
    if (patch.view) {
      if (patch.view === "grid") sp.delete("view");
      else sp.set("view", patch.view);
    }
    if (patch.page !== undefined) {
      if (patch.page <= 1) sp.delete("page");
      else sp.set("page", String(patch.page));
    }
    const qs = sp.toString();
    setLocation(qs ? `${basePath}?${qs}` : basePath);
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = products.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const pageTitle = activeCategory ? activeCategory.name : "Tüm Ürünler";
  const pageDesc = activeCategory
    ? activeCategory.description
    : "Karadeniz'in zorlu şartlarına uygun en iyi kamp ve balıkçılık ekipmanları.";

  return (
    <div className="min-h-screen pt-24 pb-24 flex flex-col bg-background">
      <SEO title={pageTitle} description={pageDesc} />

      <div className="bg-primary text-primary-foreground py-12 md:py-20 mb-12">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{pageTitle}</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">{pageDesc}</p>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Ürün ara..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 bg-card border-border/50"
                />
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-secondary" />
                  Kategoriler
                </h3>
                <div className="flex flex-col gap-2">
                  <Link href="/urunler">
                    <Button
                      variant={!categorySlug ? "default" : "ghost"}
                      className={`justify-start w-full ${
                        !categorySlug
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted"
                      }`}
                    >
                      Tüm Ürünler
                    </Button>
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/urunler/${cat.slug}`}>
                      <Button
                        variant={categorySlug === cat.slug ? "default" : "ghost"}
                        className={`justify-start w-full ${
                          categorySlug === cat.slug
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-muted"
                        }`}
                      >
                        {cat.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm font-medium">
                {loading ? "Yükleniyor..." : <>{products.length} ürün bulundu</>}
              </p>

              <div className="inline-flex items-center rounded-full border border-border bg-card p-1">
                <button
                  type="button"
                  onClick={() => updateParams({ view: "grid" })}
                  aria-pressed={view === "grid"}
                  aria-label="Izgara görünümü"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Izgara</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateParams({ view: "list" })}
                  aria-pressed={view === "list"}
                  aria-label="Liste görünümü"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    view === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Liste</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : pagedProducts.length > 0 ? (
              <>
                {view === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {pagedProducts.map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                      {pagedProducts.map((product, idx) => (
                        <ProductRow key={product.id} product={product} index={idx} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {totalPages > 1 && (
                  <nav
                    aria-label="Sayfalama"
                    className="flex items-center justify-center gap-2 mt-12"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage <= 1}
                      onClick={() => updateParams({ page: safePage - 1 })}
                      aria-label="Önceki sayfa"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === safePage ? "default" : "outline"}
                        size="sm"
                        className={
                          p === safePage
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 min-w-9"
                            : "min-w-9"
                        }
                        onClick={() => updateParams({ page: p })}
                        aria-current={p === safePage ? "page" : undefined}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage >= totalPages}
                      onClick={() => updateParams({ page: safePage + 1 })}
                      aria-label="Sonraki sayfa"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-card border border-border/50 rounded-3xl">
                <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-serif font-semibold mb-2">Ürün Bulunamadı</h3>
                <p className="text-muted-foreground mb-6">
                  Aradığınız kriterlere uygun ürün bulamadık.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchInput("");
                    setLocation("/urunler");
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
