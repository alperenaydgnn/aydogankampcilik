import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { GitCompare, X, Plus, ArrowRight } from "lucide-react";
import { useCompare, COMPARE_MAX } from "@/lib/compare";
import { getProducts } from "@/lib/data";
import type { Product } from "@/lib/mockData";
import { SEO } from "@/lib/seo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildCompareShareMessage } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { BalanceScale } from "@/components/BrandIllustration";
import { BrandLoader } from "@/components/BrandLoader";

export default function Compare() {
  const { slugs, remove, clear } = useCompare();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 500 }).then(p => { setAllProducts(p); setLoading(false); });
  }, []);

  const items: Product[] = useMemo(
    () => slugs.map(s => allProducts.find(p => p.slug === s)).filter(Boolean) as Product[],
    [slugs, allProducts],
  );

  const allSpecKeys = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const it of items) {
      for (const k of Object.keys(it.specs || {})) {
        if (!seen.has(k)) { seen.add(k); order.push(k); }
      }
    }
    return order;
  }, [items]);

  const shareMessage = buildCompareShareMessage(items.map(p => ({
    name: p.name, slug: p.slug, price_label: p.price_label,
  })));

  return (
    <div className="min-h-screen bg-background pt-32 md:pt-40 pb-32">
      <SEO title="Ürün Karşılaştırma" description="Seçtiğiniz ürünleri yan yana karşılaştırın." url="/karsilastir" />
      <Helmet><meta name="robots" content="noindex" /></Helmet>

      <div className="container mx-auto px-6 max-w-6xl">
        <nav className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-foreground/55 mb-10">
          <Link href="/" className="hover:text-secondary">Ana Sayfa</Link>
          <span className="text-foreground/30">/</span>
          <Link href="/urunler" className="hover:text-secondary">Ürünler</Link>
          <span className="text-foreground/30">/</span>
          <span className="text-foreground/85">Karşılaştır</span>
        </nav>

        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="eyebrow inline-flex items-center gap-2">
              <GitCompare className="w-3 h-3 text-secondary" /> Karşılaştırma
            </span>
            <h1 className="editorial-heading text-4xl md:text-5xl lg:text-6xl">
              Yan yana <em className="italic text-secondary">karşılaştırın.</em>
            </h1>
            <p className="text-foreground/65 mt-4 font-light">
              Maksimum {COMPARE_MAX} ürünü teknik özellikleriyle inceleyin.
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clear}
                className="link-hairline hover:text-rose-700"
              >
                <X className="w-3.5 h-3.5" /> Tümünü Çıkar
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <BrandLoader />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            illustration={<BalanceScale size={170} />}
            eyebrow="Henüz Ürün Yok"
            title="Karşılaştırmak için"
            italicAccent="ürün ekleyin."
            description={`Katalog veya ürün sayfalarındaki "Karşılaştır" butonu ile en fazla ${COMPARE_MAX} ürün seçebilirsiniz.`}
            actions={(
              <Link href="/urunler" className="link-hairline justify-center hover:text-secondary">
                Kataloğa Git <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="w-[140px] md:w-[180px] text-left align-bottom py-4 border-b border-foreground/15">
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-foreground/45">Ürün</span>
                  </th>
                  {items.map(p => (
                    <th key={p.slug} className="align-top py-4 px-3 border-b border-foreground/15 text-left min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => remove(p.slug)}
                          aria-label={`${p.name} çıkar`}
                          className="absolute top-0 right-0 text-foreground/45 hover:text-rose-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <Link href={`/urun/${p.slug}`}>
                          <img src={p.images[0]} alt={p.name} className="w-full aspect-[4/5] object-cover mb-3" />
                          <h3 className="font-serif font-light text-base line-clamp-2 leading-snug hover:text-secondary transition-colors pr-6">
                            {p.name}
                          </h3>
                        </Link>
                      </div>
                    </th>
                  ))}
                  {items.length < COMPARE_MAX && (
                    <th className="align-top py-4 px-3 border-b border-foreground/15 min-w-[180px]">
                      <Link
                        href="/urunler"
                        className="flex flex-col items-center justify-center aspect-[4/5] border border-dashed border-foreground/25 text-foreground/45 hover:border-secondary hover:text-secondary transition-colors"
                      >
                        <Plus className="w-5 h-5 mb-2" />
                        <span className="text-[0.65rem] uppercase tracking-[0.18em]">Ürün Ekle</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <SpecRow label="Fiyat" items={items} render={p => (
                  <span className={cn("font-serif tracking-tight", p.price_numeric ? "text-primary text-lg" : "text-foreground/55 italic")}>
                    {p.price_label}
                  </span>
                )} />
                <SpecRow label="Stok" items={items} render={p => (
                  <span className={cn(
                    "text-xs uppercase tracking-[0.18em] font-semibold",
                    p.stock_status === "out_of_stock" ? "text-rose-700"
                      : p.stock_status === "low_stock" ? "text-amber-700"
                      : "text-emerald-700",
                  )}>
                    {p.stock_status === "out_of_stock" ? "Tükendi"
                      : p.stock_status === "low_stock" ? `Son${p.stock ? ` ${p.stock}` : ""}`
                      : "Stokta"}
                  </span>
                )} />
                {allSpecKeys.map(key => (
                  <SpecRow
                    key={key}
                    label={key}
                    items={items}
                    render={p => (
                      <span className="font-serif font-light text-foreground">
                        {p.specs?.[key] || <span className="text-foreground/30">—</span>}
                      </span>
                    )}
                  />
                ))}
              </tbody>
            </table>

            <div className="mt-12 pt-8 border-t border-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-foreground/65 font-light">
                Hangisinin sizin için uygun olduğunu öğrenin — WhatsApp'tan tavsiye alın.
              </p>
              <WhatsAppButton
                message={shareMessage}
                tracking={{
                  event: "compare_share",
                  source: "compare_page",
                  item_count: items.length,
                }}
                onClick={() => trackEvent({ event: "compare_share", source: "compare_page", item_count: items.length })}
                size="md"
                rounded="pill"
                label="WhatsApp'tan Tavsiye Al"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, items, render }: { label: string; items: Product[]; render: (p: Product) => React.ReactNode }) {
  return (
    <tr>
      <th className="text-left text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-foreground/55 py-4 pr-4 border-b border-foreground/10 align-top">
        {label}
      </th>
      {items.map(p => (
        <td key={p.slug} className="py-4 px-3 border-b border-foreground/10 align-top">
          {render(p)}
        </td>
      ))}
    </tr>
  );
}
