import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, getProducts } from "@/lib/data";
import { Category, Product } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SEO } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Catalog() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const categorySlug = params.kategori;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ 
      categorySlug, 
      search: debouncedSearch 
    }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [categorySlug, debouncedSearch]);

  const activeCategory = categories.find(c => c.slug === categorySlug);
  const pageTitle = activeCategory ? activeCategory.name : "Tüm Ürünler";
  const pageDesc = activeCategory ? activeCategory.description : "Karadeniz'in zorlu şartlarına uygun en iyi kamp ve balıkçılık ekipmanları.";

  return (
    <div className="min-h-screen pt-24 pb-24 flex flex-col bg-background">
      <SEO title={pageTitle} description={pageDesc} />

      {/* Header Area */}
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
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Ürün ara..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card border-border/50"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-secondary" />
                  Kategoriler
                </h3>
                <div className="flex flex-col gap-2">
                  <Link href="/urunler">
                    <Button 
                      variant={!categorySlug ? "default" : "ghost"} 
                      className={`justify-start w-full ${!categorySlug ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                    >
                      Tüm Ürünler
                    </Button>
                  </Link>
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/urunler/${cat.slug}`}>
                      <Button 
                        variant={categorySlug === cat.slug ? "default" : "ghost"} 
                        className={`justify-start w-full ${categorySlug === cat.slug ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                      >
                        {cat.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground text-sm font-medium">
                {loading ? "Yükleniyor..." : <>{products.length} ürün bulundu</>}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {products.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-24 bg-card border border-border/50 rounded-3xl">
                <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-serif font-semibold mb-2">Ürün Bulunamadı</h3>
                <p className="text-muted-foreground mb-6">Aradığınız kriterlere uygun ürün bulamadık.</p>
                <Button variant="outline" onClick={() => { setSearch(""); setLocation("/urunler"); }}>
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
