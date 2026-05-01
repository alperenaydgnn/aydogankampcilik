import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  MessageCircle, ArrowLeft, ShieldCheck, Truck, Store,
  RefreshCcw, ChevronDown, ChevronRight, Tag, Star,
  Sparkles, AlertTriangle, XCircle, Package,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { Product, Category, StockStatus } from "@/lib/mockData";
import { SEO } from "@/lib/seo";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductCard } from "@/components/ProductCard";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import NotFound from "./not-found";

/* ── FAQ data by category ────────────────────────────── */
type FAQ = { q: string; a: string };

const CATEGORY_FAQS: Record<string, FAQ[]> = {
  "c-1": [
    { q: "Çadır kurulumu zor mu?", a: "Çadırlarımızın büyük çoğunluğu tek kişinin 5-10 dakikada kurabileceği sisteme sahiptir. Ürün sayfasındaki teknik özelliklere bakarak kurulum tipi hakkında bilgi edinebilir, detaylar için WhatsApp'tan bize ulaşabilirsiniz." },
    { q: "Su geçirmezlik kolon değeri ne anlama geliyor?", a: "Su geçirmezlik (mm cinsinden kolon değeri) tentin ne kadar su basıncına dayanabileceğini gösterir. 1500mm hafif yağmur için yeterliyken, Karadeniz iklimine uygun çadırlar için 3000mm ve üzeri önerilir." },
    { q: "Kış koşullarında kullanılabilir mi?", a: "4 mevsim olarak etiketlenen çadırlarımız kar ve kuvvetli rüzgara karşı tasarlanmıştır. 3 mevsim modeller ise ilkbahar-yaz-sonbahar kullanımı için uygundur. Soğuk hava kullanımı için bize danışmanızı öneririz." },
  ],
  "c-2": [
    { q: "Olta kamışı bedeni nasıl seçilir?", a: "Kamış seçiminde av türü ve hedef balığın ağırlığı belirleyicidir. Kıyı avcılığı için spin kamışlar, tekne avcılığı için jigging kamışlar tercih edilir. Atar ağırlığı değeri, kullanacağınız yem veya kurşunun gram değeriyle eşleşmelidir." },
    { q: "Olta makinesi hangi misina ile kullanılmalı?", a: "Makine kapasitesi ürün özelliklerinde belirtilmiştir (örn. 0.30mm, 200m). Bu değerlere uygun misina ile en iyi performansı alırsınız. Misina seçimi konusunda WhatsApp'tan bilgi alabilirsiniz." },
  ],
  "c-3": [
    { q: "Kamp ocağı her türlü yakıt ile çalışıyor mu?", a: "Katı yakıtlı ocaklarımız odun, dal ve kömür ile çalışır. Gazlı ocaklar ise standart bütan/propan kartuşlarını kullanır. Ürün açıklamasında yakıt tipi belirtilmiştir." },
    { q: "Sırt çantaları hangi hacimde öneriliriz?", a: "Günübirlik yürüyüşler için 20-30L, hafta sonu kampları için 40-50L, uzun rotalar için 60L ve üzeri çantalar idealdir. Yük dağılımı için bel kemeri olan modeller önerilir." },
  ],
  "c-4": [
    { q: "Kafa lambasının pil ömrü ne kadar?", a: "Kullanılan modüle ve ışık moduna (düşük-orta-yüksek) göre değişir. Ürün özelliklerinde belirtilen süre, orta parlaklıkta ölçülen değerdir. Şarjlı modellerde USB ile kolayca şarj edebilirsiniz." },
    { q: "Su geçirmez mi?", a: "Aydınlatma ürünlerimizin büyük çoğunluğu IPX4 veya IPX6 su dayanım sınıfına sahiptir. IPX4 yağmur koruması, IPX6 ise kuvvetli su akışına karşı koruma sağlar." },
  ],
  "c-5": [
    { q: "Termos ne kadar süre sıcak tutar?", a: "Çift cidarlı vakum termoslarımız ortalama 18-24 saat sıcak, 48 saat soğuk tutar. Bu değerler standart test koşullarında ölçülmüş olup ortam sıcaklığına göre değişebilir." },
    { q: "Soğutucu içine ne kadar buz almalıyım?", a: "En iyi performans için soğutucunun yaklaşık 1/3'ü buz olmalıdır. Buz paketleri ile kuru buz birlikte kullanılabilir. Soğutucu doldurmadan önce birkaç saat soğukta bekletilmesi yalıtım süresini uzatır." },
  ],
  "c-6": [
    { q: "Sahte yem rengi avı etkiler mi?", a: "Evet. Berrak sularda doğal renkler (gümüş, yeşil-sarı), bulanık sularda canlı renkler (turuncu, kırmızı) daha etkilidir. Işık koşulları da önemlidir — gece avlarında fosforlu yemler tercih edilmelidir." },
    { q: "Misina hangi kalınlıkta alınmalı?", a: "Hedef balığın büyüklüğüne ve av ortamına göre seçilir. İnce misina (0.20-0.25mm) küçük balıklar için, kalın misina (0.35-0.40mm) büyük balıklar ve surf avcılığı için uygundur." },
  ],
  "c-7": [
    { q: "Bıçaklar kargo ile gönderilebilir mi?", a: "Yasal mevzuata uygun outdoor bıçakları kargo ile gönderilebilir. Gönderi için fatura ve sipariş bilgileri gereklidir. Detaylar için WhatsApp'tan bilgi alın." },
    { q: "Multi-tool seyahatte taşınabilir mi?", a: "Havayolu seyahatlerinde el bagajında multi-tool ve bıçaklı aletler yasaktır. Valiz bagajında taşınabilir. Kamp ve outdoor seyahatlerinde tüm multi-tool ürünlerimiz sorunsuz taşınabilir." },
  ],
};

const GENERAL_FAQS: FAQ[] = [
  { q: "Nasıl sipariş verebilirim?", a: "Sipariş vermek için 'WhatsApp ile Sipariş' butonuna basın. WhatsApp'ta ürün bilgisi otomatik gelir, biz de size stok durumu ve fiyatı teyit ederek kargo veya mağaza teslimi seçeneklerini bildiririz." },
  { q: "Türkiye genelinde kargo yapıyor musunuz?", a: "Evet! Türkiye'nin tüm illerine MNG Kargo ve Aras Kargo ile gönderim yapıyoruz. Siparişiniz saat 14:00'a kadar verildiğinde aynı iş günü kargoya verilir. Kargo ücreti ürün ve konuma göre değişir." },
  { q: "Ürünlerin garantisi var mı?", a: "Tüm ürünlerimiz orijinal ve üretici garantisi kapsamındadır. Garanti belgesi ürünle birlikte kargoya eklenir. Arıza veya garanti durumlarında bize WhatsApp'tan ulaşabilirsiniz." },
  { q: "Mağazadan teslim alabilir miyim?", a: "Evet, Trabzon'daki mağazamızı ziyaret ederek ürünleri yerinde inceleyip satın alabilirsiniz. Mağaza adresimiz ve çalışma saatlerimiz için WhatsApp'tan bilgi alın." },
];

function getFaqs(categoryId: string): FAQ[] {
  const categoryFaqs = CATEGORY_FAQS[categoryId] || [];
  return [...categoryFaqs.slice(0, 2), ...GENERAL_FAQS];
}

/* ── Stock config ────────────────────────────────────── */
const stockConfig: Record<StockStatus, { label: string; color: string; icon: typeof AlertTriangle }> = {
  in_stock:    { label: "Stokta mevcut — hemen sipariş verebilirsiniz", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: ShieldCheck as typeof AlertTriangle },
  low_stock:   { label: "Son stoklar — hızlı hareket edin!", color: "text-amber-700 bg-amber-50 border-amber-200",    icon: AlertTriangle },
  out_of_stock:{ label: "Bu ürün şu an stokta bulunmuyor",               color: "text-red-600 bg-red-50 border-red-200",            icon: XCircle },
};

/* ── FAQ accordion ───────────────────────────────────── */
function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-card border border-card-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-semibold text-sm text-foreground leading-snug">{item.q}</span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200", open === i && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Section heading ─────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground tracking-tight mb-6">
      {children}
    </h2>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{ product: Product; category: Category } | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const mainCTARef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug).then(res => {
      setData(res);
      setLoading(false);
      if (res) {
        getRelatedProducts(res.product, 3).then(setRelated);
      }
    });
  }, [slug]);

  /* Sticky CTA visibility */
  useEffect(() => {
    const el = mainCTARef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyCTA(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [data]);

  /* ── Loading state ─────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: "5rem" }}>
        <div className="container px-4 max-w-6xl py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-3">
              <div className="skeleton rounded-2xl" style={{ aspectRatio: "4/3" }} />
              <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="skeleton w-20 h-20 rounded-xl" />)}
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="skeleton h-4 rounded-full w-24" />
              <div className="skeleton h-8 rounded-full w-4/5" />
              <div className="skeleton h-8 rounded-full w-3/5" />
              <div className="skeleton h-5 rounded-full w-28 mt-2" />
              <div className="space-y-2 mt-4">
                <div className="skeleton h-3.5 rounded-full w-full" />
                <div className="skeleton h-3.5 rounded-full w-full" />
                <div className="skeleton h-3.5 rounded-full w-3/4" />
              </div>
              <div className="skeleton h-14 rounded-xl w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <NotFound />;

  const { product, category } = data;
  const stockStatus = product.stock_status ?? "in_stock";
  const stock = stockConfig[stockStatus];
  const isOOS = stockStatus === "out_of_stock";
  const faqs = getFaqs(product.category_id);
  const siteUrl = "https://saricamaydogan.com";
  const productUrl = `${siteUrl}/urun/${product.slug}`;

  const waMessage = [
    `Merhaba! Aşağıdaki ürün hakkında bilgi almak istiyorum:`,
    ``,
    `🛒 ${product.name}`,
    `📂 Kategori: ${category.name}`,
    `💰 Fiyat: ${product.price_label}`,
    `🔗 ${productUrl}`,
    ``,
    product.whatsapp_message || `Stok durumu ve kargo seçenekleri hakkında bilgi alabilir miyim?`,
  ].join("\n");

  /* ── JSON-LD schemas ──────────────────────────────── */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    category: category.name,
    brand: { "@type": "Brand", name: "Sarıçam Aydoğan" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "TRY",
      ...(product.price_numeric ? { price: product.price_numeric } : {}),
      availability: `https://schema.org/${
        stockStatus === "in_stock" ? "InStock"
        : stockStatus === "low_stock" ? "LimitedAvailability"
        : "OutOfStock"
      }`,
      seller: {
        "@type": "Organization",
        name: "Sarıçam Aydoğan Kamp & Balık Malzemeleri",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background" style={{ paddingBottom: "5rem" }}>
      {/* Meta */}
      <SEO
        title={product.name}
        description={product.description}
        image={product.images[0]}
        url={`/urun/${product.slug}`}
      />
      <Helmet>
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={String(product.price_numeric ?? "")} />
        <meta property="product:price:currency" content="TRY" />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ── Sticky mobile CTA ──────────────────────── */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-xl"
          >
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground line-clamp-1">{product.name}</p>
                <p className={cn("text-sm font-bold", product.price_numeric ? "text-primary" : "text-muted-foreground")}>
                  {product.price_label}
                </p>
              </div>
              {!isOOS ? (
                <a
                  href={buildWhatsAppLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Sipariş Ver
                </a>
              ) : (
                <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-4 py-2.5 rounded-full">
                  Tükendi
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────── */}
      <div style={{ paddingTop: "5rem" }}>
        <div className="container px-4 md:px-6 max-w-6xl">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground pt-6 pb-8 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors font-medium">Ana Sayfa</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/urunler" className="hover:text-primary transition-colors font-medium">Ürünler</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/urunler/${category.slug}`} className="hover:text-primary transition-colors font-medium">
              {category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-semibold line-clamp-1">{product.name}</span>
          </nav>

          {/* ── Hero grid ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-start">

            {/* Gallery — sticky on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-24"
            >
              <ImageGallery images={product.images} alt={product.name} />
            </motion.div>

            {/* Info column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="flex flex-col gap-6"
            >
              {/* Top badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/urunler/${category.slug}`}
                  className="inline-flex items-center gap-1.5 badge-category text-white"
                >
                  {category.name}
                </Link>
                {product.is_new && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold">
                    <Sparkles className="w-3 h-3" /> Yeni Ürün
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    <Star className="w-3 h-3 fill-primary" /> Öne Çıkan
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Price + stock */}
              <div className="bg-card border border-card-border rounded-2xl p-5 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className={cn(
                    "font-bold",
                    product.price_numeric ? "text-3xl text-primary" : "text-lg text-muted-foreground italic"
                  )}>
                    {product.price_label}
                  </span>
                  {!product.price_numeric && (
                    <span className="text-sm text-muted-foreground">Fiyat için WhatsApp'tan sorunuz</span>
                  )}
                </div>

                {/* Stock status */}
                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium", stock.color)}>
                  {stockStatus === "in_stock" && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                  {stockStatus === "low_stock" && <AlertTriangle className="w-4 h-4 shrink-0" />}
                  {stockStatus === "out_of_stock" && <XCircle className="w-4 h-4 shrink-0" />}
                  {stock.label}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-[0.95rem]">
                {product.description}
              </p>

              {/* WhatsApp CTA */}
              <div ref={mainCTARef} className="rounded-2xl border border-card-border bg-card p-5 space-y-3">
                {!isOOS ? (
                  <>
                    <a
                      href={buildWhatsAppLink(waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-200 hover:opacity-92 hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #25D366 0%, #1aaa57 100%)",
                        boxShadow: "0 6px 20px rgba(37,211,102,0.28)"
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp ile Sipariş Ver
                    </a>
                    <p className="text-center text-xs text-muted-foreground leading-relaxed">
                      Online ödeme almıyoruz — WhatsApp üzerinden stok teyidi alın,<br className="hidden sm:inline" /> güvenle sipariş verin.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-base text-muted-foreground bg-muted cursor-not-allowed">
                      <Package className="w-5 h-5" />
                      Şu an stokta yok
                    </div>
                    <a
                      href={buildWhatsAppLink(`Merhaba! "${product.name}" ürünü ne zaman stoka giriyor? Stok girince haber verebilir misiniz?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:border-primary/30 hover:bg-muted/50 transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      Stok gelince haber ver
                    </a>
                  </>
                )}
              </div>

              {/* Trust pillars */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, title: "Orijinal Ürün", sub: "Üretici garantili", color: "text-emerald-600 bg-emerald-50" },
                  { icon: Truck,       title: "Aynı Gün Kargo", sub: "Saat 14:00'a kadar",color: "text-blue-600 bg-blue-50" },
                  { icon: Store,       title: "Mağazadan Teslim", sub: "Trabzon merkez",  color: "text-amber-600 bg-amber-50" },
                  { icon: RefreshCcw,  title: "7 Gün İade",      sub: "Hasar/arıza için", color: "text-purple-600 bg-purple-50" },
                ].map(({ icon: Icon, title, sub, color }) => (
                  <div key={title} className="flex items-center gap-3 bg-card border border-card-border rounded-xl p-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground leading-tight">{title}</p>
                      <p className="text-[0.65rem] text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specs */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div>
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-secondary" />
                    Teknik Özellikler
                  </h3>
                  <div className="border border-card-border rounded-2xl overflow-hidden bg-card">
                    <table className="w-full text-sm text-left">
                      <tbody>
                        {Object.entries(product.specs).map(([key, value], idx) => (
                          <tr key={key} className={cn("border-b border-border/50 last:border-0", idx % 2 === 0 ? "bg-muted/25" : "bg-card")}>
                            <th className="px-4 py-3 font-semibold text-foreground w-2/5 border-r border-border/40 text-xs uppercase tracking-wide">
                              {key}
                            </th>
                            <td className="px-4 py-3 text-muted-foreground font-medium">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Link href={`/urunler/${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground transition-all"
                >
                  <Tag className="w-3 h-3" /> {category.name}
                </Link>
                {product.is_new && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    <Sparkles className="w-3 h-3" /> Yeni Ürün
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    <Star className="w-3 h-3" /> Öne Çıkan
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Full-width sections ─────────────────────── */}
          <div className="mt-16 md:mt-20 space-y-16">

            {/* Store / Shipping / Return notes */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Truck,
                    title: "Hızlı Kargo",
                    color: "from-blue-50 to-blue-100/50 border-blue-200",
                    iconColor: "text-blue-600 bg-blue-100",
                    items: [
                      "Saat 14:00'a kadar verilen siparişler aynı gün kargoya verilir.",
                      "MNG Kargo ve Aras Kargo ile Türkiye geneline teslimat.",
                      "Kargo ücreti sipariş tutarına ve konuma göre belirlenir.",
                    ],
                  },
                  {
                    icon: Store,
                    title: "Mağazadan Teslim",
                    color: "from-amber-50 to-amber-100/50 border-amber-200",
                    iconColor: "text-amber-600 bg-amber-100",
                    items: [
                      "Trabzon'daki mağazamızdan ürünü bizzat teslim alabilirsiniz.",
                      "Ziyaret öncesi WhatsApp'tan randevu almanızı öneririz.",
                      "Bazı ürünlerin demo modelleri mağazada incelenebilir.",
                    ],
                  },
                  {
                    icon: ShieldCheck,
                    title: "Garanti & İade",
                    color: "from-emerald-50 to-emerald-100/50 border-emerald-200",
                    iconColor: "text-emerald-600 bg-emerald-100",
                    items: [
                      "Tüm ürünler orijinal üretici garantisi kapsamındadır.",
                      "Teslim anında hasar/arıza durumunda 7 gün içinde iade/değişim.",
                      "Garanti belgesi ve fatura kargo ile birlikte gönderilir.",
                    ],
                  },
                ].map(({ icon: Icon, title, color, iconColor, items }) => (
                  <div key={title} className={cn("rounded-2xl border bg-gradient-to-br p-5", color)}>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", iconColor)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-foreground mb-3">{title}</h3>
                    <ul className="space-y-2">
                      {items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* FAQ */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading>Sık Sorulan Sorular</SectionHeading>
              <FAQAccordion items={faqs} />
            </motion.section>

            {/* Related products */}
            {related.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <SectionHeading>{category.name} — Benzer Ürünler</SectionHeading>
                  <Link
                    href={`/urunler/${category.slug}`}
                    className="hidden sm:flex items-center gap-1 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                  >
                    Tümünü gör <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
                <div className="mt-5 sm:hidden">
                  <Link
                    href={`/urunler/${category.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary/30 hover:bg-muted/50 transition-all"
                  >
                    Tüm {category.name} Ürünleri <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.section>
            )}

            {/* Final CTA */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden"
            >
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 md:p-10"
                style={{ background: "hsl(149 43% 17%)" }}
              >
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Şu an aktifiz</span>
                  </div>
                  <p className="font-serif font-bold text-white text-xl md:text-2xl mb-1">
                    {isOOS ? "Bu ürün tükendi, başka ne arıyorsunuz?" : "Bu ürünü sipariş etmek ister misiniz?"}
                  </p>
                  <p className="text-white/55 text-sm">
                    {isOOS
                      ? "WhatsApp'tan yazın — ihtiyacınıza en uygun alternatifi bulalım."
                      : "WhatsApp üzerinden stok teyidi alın, aynı gün kargo ile kapınıza gelsin."}
                  </p>
                </div>
                <a
                  href={buildWhatsAppLink(isOOS
                    ? `Merhaba! "${product.name}" tükenmiş, bu ürüne alternatif önerebilir misiniz?`
                    : waMessage
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    background: "#25D366",
                    boxShadow: "0 6px 20px rgba(37,211,102,0.30)"
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  {isOOS ? "Alternatif Sorun" : "WhatsApp'tan Sipariş Ver"}
                </a>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
}
