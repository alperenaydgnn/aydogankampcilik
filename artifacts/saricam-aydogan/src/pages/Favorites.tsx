import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Heart, X, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { getProducts } from "@/lib/data";
import type { Product } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/lib/seo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildWishlistShareMessage } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export default function Favorites() {
  const { items, count, clear, remove } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 500 }).then(p => { setAllProducts(p); setLoading(false); });
  }, []);

  const liveItems: Product[] = useMemo(
    () => items.map(i => allProducts.find(p => p.slug === i.slug)).filter(Boolean) as Product[],
    [items, allProducts],
  );

  const shareMessage = buildWishlistShareMessage(items.map(i => ({
    name: i.name, slug: i.slug, price_label: i.price_label,
  })));

  return (
    <div className="min-h-screen bg-background pt-32 md:pt-40 pb-32">
      <SEO title="İstek Listem" description="Favori ürünlerinizi tek tıkla WhatsApp ile paylaşın." url="/favoriler" />
      <Helmet><meta name="robots" content="noindex" /></Helmet>

      <div className="container mx-auto px-6 max-w-6xl">
        <nav className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-foreground/55 mb-10">
          <Link href="/" className="hover:text-secondary">Ana Sayfa</Link>
          <span className="text-foreground/30">/</span>
          <span className="text-foreground/85">Favoriler</span>
        </nav>

        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="eyebrow inline-flex items-center gap-2">
              <Heart className="w-3 h-3 text-secondary fill-secondary" /> İstek Listem
            </span>
            <h1 className="editorial-heading text-4xl md:text-5xl lg:text-6xl">
              Favori <em className="italic text-secondary">ürünleriniz.</em>
            </h1>
            <p className="text-foreground/65 mt-4 font-light">
              {count > 0 ? `Listenizde ${count} ürün var.` : "İstek listenize henüz ürün eklemediniz."}
            </p>
          </div>
          {count > 0 && (
            <div className="flex items-center gap-3">
              <button onClick={clear} className="link-hairline hover:text-rose-700">
                <X className="w-3.5 h-3.5" /> Tümünü Sil
              </button>
              <WhatsAppButton
                message={shareMessage}
                tracking={{ event: "wishlist_share", source: "favorites_page", item_count: items.length }}
                onClick={() => trackEvent({ event: "wishlist_share", source: "favorites_page", item_count: items.length })}
                size="md"
                rounded="pill"
                label="WhatsApp ile Paylaş"
              />
            </div>
          )}
        </div>

        {loading && count > 0 ? (
          <div className="text-center text-foreground/55 py-20 italic font-serif">Yükleniyor…</div>
        ) : count === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 border-y border-foreground/15"
          >
            <Heart className="w-10 h-10 text-foreground/20 mx-auto mb-6" strokeWidth={1.4} />
            <h2 className="editorial-heading text-3xl md:text-4xl mb-6">
              Henüz <em className="italic text-secondary">favori yok.</em>
            </h2>
            <p className="text-foreground/60 max-w-md mx-auto mb-10 font-light">
              Ürün kartlarındaki kalp simgesiyle istediğiniz ürünleri kaydedin, daha sonra tek tıkla WhatsApp'tan paylaşın.
            </p>
            <Link href="/urunler" className="link-hairline justify-center hover:text-secondary">
              Kataloğa Git <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Show stale entries (removed from catalog) */}
            {liveItems.length < items.length && (
              <p className="text-xs text-amber-700 italic mb-6">
                Bazı ürünler artık satışta değil ve listenizden gizlendi.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {liveItems.map((p, i) => (
                <div key={p.id} className="relative group">
                  <button
                    onClick={() => remove(p.slug)}
                    aria-label={`${p.name} listeden çıkar`}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 border border-foreground/15 flex items-center justify-center text-foreground/55 hover:text-rose-700 hover:border-rose-700/40 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <ProductCard product={p} index={i} compact />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
