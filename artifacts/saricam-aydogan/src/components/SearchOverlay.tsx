import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Tag } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data";
import type { Category, Product } from "@/lib/mockData";
import {
  buildDoc, smartSearch, suggestCategories,
  type SearchableDoc, type SmartSearchResult, type CategorySuggestion,
} from "@/lib/search";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Props { open: boolean; onClose: () => void; }

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchableDoc[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    Promise.all([getProducts({ limit: 500 }), getCategories()]).then(([prods, cats]) => {
      setCategories(cats);
      const catNameById = new Map(cats.map(c => [c.id, c.name]));
      setDocs(prods.map(p => buildDoc(p, catNameById.get(p.category_id))));
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) document.dispatchEvent(new CustomEvent("open-search"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const results: SmartSearchResult[] = useMemo(
    () => query.trim() ? smartSearch(query, docs, { limit: 8 }) : [],
    [query, docs],
  );
  const fuzzyHit = results.some(r => r.fuzzy);
  const catSugs: CategorySuggestion[] = useMemo(
    () => query.trim() ? suggestCategories(query, results, categories) : [],
    [query, results, categories],
  );

  const featured: Product[] = useMemo(
    () => !query.trim() ? docs.filter(d => d.product.featured).slice(0, 6).map(d => d.product) : [],
    [query, docs],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    trackEvent({ event: "search_inquiry", source: "search_overlay", search_query: q });
    onClose();
    window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/urunler?q=${encodeURIComponent(q)}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-[81] bg-background border-b border-foreground/15 max-h-[90vh] overflow-y-auto"
            role="dialog" aria-modal="true" aria-label="Akıllı arama"
          >
            <div className="container mx-auto px-6 md:px-10 py-6 md:py-8 max-w-4xl">
              <form onSubmit={onSubmit} className="relative flex items-center gap-3 border-b-2 border-foreground/85 pb-4">
                <Search className="w-5 h-5 text-foreground/60 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Çadır, olta, fener, marka..."
                  className="flex-1 bg-transparent outline-none font-serif font-light text-2xl md:text-3xl placeholder:text-foreground/30 placeholder:italic"
                  aria-label="Arama"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Aramayı kapat"
                  className="p-2 text-foreground/55 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              <div className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/45 mt-3">
                ESC ile kapat · Enter ile katalogda ara
              </div>

              {/* No query → featured suggestions */}
              {!query.trim() && (
                <div className="mt-8">
                  <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-foreground/55 mb-4 inline-flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-secondary" /> Popüler Aramalar
                  </div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["çadır", "olta kamışı", "uyku tulumu", "kafa lambası", "termos", "sırt çantası"].map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 text-xs uppercase tracking-[0.16em] font-semibold border border-foreground/20 hover:border-secondary hover:text-secondary transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  {featured.length > 0 && (
                    <>
                      <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-foreground/55 mb-4">
                        Öne Çıkan Ürünler
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {featured.map(p => (
                          <Link key={p.slug} href={`/urun/${p.slug}`} onClick={onClose}>
                            <div className="flex items-center gap-3 p-2 hover:bg-foreground/5 transition-colors">
                              <img src={p.images[0]} alt="" className="w-12 h-14 object-cover" />
                              <div className="min-w-0">
                                <p className="text-sm font-serif font-light line-clamp-2 leading-snug">{p.name}</p>
                                <p className="text-xs text-secondary mt-0.5">{p.price_label}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* With query */}
              {query.trim() && (
                <div className="mt-6 space-y-6">
                  {fuzzyHit && (
                    <div className="text-xs text-amber-700 font-light italic border border-amber-700/20 bg-amber-50 px-3 py-2">
                      Yazım toleransıyla yakın eşleşmeler gösteriliyor.
                    </div>
                  )}

                  {catSugs.length > 0 && (
                    <div>
                      <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-foreground/55 mb-3 inline-flex items-center gap-2">
                        <Tag className="w-3 h-3 text-secondary" /> Kategori Önerileri
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {catSugs.map(s => (
                          <Link
                            key={s.category.id}
                            href={`/urunler/${s.category.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-[0.16em] font-semibold border border-secondary/40 text-secondary hover:bg-secondary hover:text-white transition-colors"
                          >
                            {s.category.name}
                            {s.matchCount > 0 && (
                              <span className="text-[0.6rem] text-foreground/45 group-hover:text-white">
                                {s.matchCount}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.length > 0 ? (
                    <div>
                      <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-foreground/55 mb-3">
                        Ürünler ({results.length})
                      </div>
                      <ul className="divide-y divide-foreground/10 border-t border-foreground/10">
                        {results.map(({ product: p }) => (
                          <li key={p.slug}>
                            <Link href={`/urun/${p.slug}`} onClick={onClose}>
                              <div className="flex items-center gap-4 py-3 hover:bg-foreground/5 transition-colors px-2 group">
                                <img src={p.images[0]} alt="" className="w-14 h-16 object-cover shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-serif font-light text-base line-clamp-1 group-hover:text-secondary transition-colors">
                                    {p.name}
                                  </p>
                                  <p className="text-xs text-foreground/55 line-clamp-1 mt-0.5">
                                    {p.price_label}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 text-center">
                        <button
                          onClick={onSubmit as unknown as () => void}
                          className="link-hairline justify-center hover:text-secondary"
                        >
                          Tüm sonuçları katalogda gör
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-foreground/10">
                      <p className="font-serif font-light text-xl text-foreground/65">
                        "<em className="italic text-secondary">{query}</em>" için sonuç bulunamadı.
                      </p>
                      <p className="text-xs text-foreground/45 mt-2">
                        Eşanlamlı bir kelime deneyin (ör. "tente" → "çadır") veya WhatsApp'tan sorun.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const _stub = cn;
