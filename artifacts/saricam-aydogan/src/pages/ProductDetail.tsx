import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ChevronDown, ChevronRight, Sparkles, Star,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { Product, Category, StockStatus } from "@/lib/mockData";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_URL, SITE_NAME, SITE_PHONE } from "@/lib/schemas";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton, OutOfStockButton } from "@/components/WhatsAppButton";
import { buildProductMessage, buildStockNotifyMessage } from "@/lib/whatsapp";
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

/* ── Stock config — editorial hairline ───────────────── */
const stockConfig: Record<StockStatus, { label: string; tone: string; dot: string }> = {
  in_stock:    { label: "Stokta mevcut",        tone: "text-emerald-700", dot: "bg-emerald-600" },
  low_stock:   { label: "Son stoklar",          tone: "text-amber-700",   dot: "bg-amber-500" },
  out_of_stock:{ label: "Şu an stokta yok",      tone: "text-rose-700",    dot: "bg-rose-500" },
};

/* ── FAQ accordion — editorial hairline ──────────────── */
function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-foreground/15">
      {items.map((item, i) => (
        <div key={i} className="border-b border-foreground/15">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-6 py-6 text-left group"
            aria-expanded={open === i}
          >
            <span className="font-serif font-light text-lg md:text-xl text-foreground tracking-tight">{item.q}</span>
            <ChevronDown className={cn("w-4 h-4 text-foreground/40 shrink-0 transition-all duration-300 group-hover:text-secondary", open === i && "rotate-180 text-secondary")} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-7 -mt-1 text-foreground/65 leading-relaxed font-light max-w-3xl">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Local section heading — editorial split ───────── */
function ProductSectionHeading({
  eyebrow,
  title,
  italicAccent,
  children,
}: {
  eyebrow?: string;
  title: string;
  italicAccent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-12 md:mb-16 flex-wrap">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl">
          {title}
          {italicAccent && (
            <>
              {" "}
              <em className="italic font-light text-secondary">{italicAccent}</em>
            </>
          )}
        </h2>
      </div>
      {children}
    </div>
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
      <div className="min-h-screen bg-background pt-32 md:pt-40">
        <div className="container px-6 max-w-6xl py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-3">
              <div className="skeleton" style={{ aspectRatio: "4/5" }} />
              <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="skeleton w-20 h-20" />)}
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="skeleton h-3 rounded-full w-24" />
              <div className="skeleton h-10 rounded-sm w-4/5" />
              <div className="skeleton h-10 rounded-sm w-3/5" />
              <div className="skeleton h-5 rounded-full w-28 mt-2" />
              <div className="space-y-2 mt-4">
                <div className="skeleton h-3.5 rounded-full w-full" />
                <div className="skeleton h-3.5 rounded-full w-full" />
                <div className="skeleton h-3.5 rounded-full w-3/4" />
              </div>
              <div className="skeleton h-14 rounded-full w-full mt-4" />
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
  const productUrl = `${SITE_URL}/urun/${product.slug}`;

  const waMessage = buildProductMessage(product, category);

  /* ── JSON-LD schemas ──────────────────────────────── */
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Ana Sayfa",  url: "/" },
    { name: "Ürünler",    url: "/urunler" },
    { name: category.name, url: `/urunler/${category.slug}` },
    { name: product.name,  url: `/urun/${product.slug}` },
  ]);

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
        "@id": `${SITE_URL}/#business`,
        name: SITE_NAME,
        telephone: SITE_PHONE,
        url: SITE_URL,
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
    <div className="min-h-screen bg-background pb-24">
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-foreground/15 px-5 py-3"
          >
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground/65 uppercase tracking-wide line-clamp-1">{product.name}</p>
                <p className={cn("font-serif font-light text-xl tracking-tight", product.price_numeric ? "text-primary" : "text-foreground/55 italic")}>
                  {product.price_label}
                </p>
              </div>
              {!isOOS ? (
                <WhatsAppButton
                  message={waMessage}
                  tracking={{
                    event: "product_order",
                    source: "product_detail_sticky",
                    product_id: product.id,
                    product_name: product.name,
                    product_slug: product.slug,
                    category_id: product.category_id,
                    category_name: category.name,
                    price_numeric: product.price_numeric ?? undefined,
                  }}
                  size="sm"
                  rounded="pill"
                  label="Sipariş Ver"
                  className="shrink-0"
                />
              ) : (
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-rose-700 px-4 py-2 border border-rose-700/30">
                  Tükendi
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────── */}
      <div className="pt-32 md:pt-40">
        <div className="container px-6 max-w-6xl">

          {/* Breadcrumb — editorial */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-foreground/55 pb-12 flex-wrap">
            <Link href="/" className="hover:text-secondary transition-colors">Ana Sayfa</Link>
            <span className="text-foreground/30">/</span>
            <Link href="/urunler" className="hover:text-secondary transition-colors">Ürünler</Link>
            <span className="text-foreground/30">/</span>
            <Link href={`/urunler/${category.slug}`} className="hover:text-secondary transition-colors">
              {category.name}
            </Link>
            <span className="text-foreground/30">/</span>
            <span className="text-foreground/85 line-clamp-1">{product.name}</span>
          </nav>

          {/* ── Hero grid ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20 items-start">

            {/* Gallery — sticky on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32"
            >
              <ImageGallery images={product.images} alt={product.name} />
            </motion.div>

            {/* Info column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="flex flex-col gap-8"
            >
              {/* Top eyebrow + flags */}
              <div className="flex items-center gap-4 flex-wrap text-[0.7rem] uppercase tracking-[0.22em] font-semibold">
                <Link
                  href={`/urunler/${category.slug}`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
                {product.is_new && (
                  <span className="inline-flex items-center gap-1.5 text-foreground/65">
                    <Sparkles className="w-3 h-3" /> Yeni
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1.5 text-foreground/65">
                    <Star className="w-3 h-3" /> Öne Çıkan
                  </span>
                )}
              </div>

              {/* Title — Fraunces light editorial */}
              <h1 className="font-serif font-light tracking-tight leading-[1.05] text-foreground text-4xl md:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              {/* Price — editorial */}
              <div className="border-t border-foreground/15 pt-6 flex items-baseline justify-between gap-4 flex-wrap">
                <span className={cn(
                  "font-serif font-light tracking-tight",
                  product.price_numeric ? "text-4xl md:text-5xl text-primary" : "text-2xl text-foreground/55 italic"
                )}>
                  {product.price_label}
                </span>
                {/* Stock indicator — hairline */}
                <div className={cn("flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] font-semibold", stock.tone)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", stock.dot, stockStatus === "in_stock" && "animate-pulse")} />
                  {stock.label}
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg">
                {product.description}
              </p>

              {/* WhatsApp CTA — bare editorial */}
              <div ref={mainCTARef} className="space-y-4">
                {!isOOS ? (
                  <>
                    <WhatsAppButton
                      message={waMessage}
                      tracking={{
                        event: "product_order",
                        source: "product_detail_main",
                        product_id: product.id,
                        product_name: product.name,
                        product_slug: product.slug,
                        category_id: product.category_id,
                        category_name: category.name,
                        price_numeric: product.price_numeric ?? undefined,
                      }}
                      size="lg"
                      fullWidth
                    />
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/55 leading-relaxed text-center">
                      WhatsApp üzerinden stok teyidi alın · Güvenle sipariş verin
                    </p>
                  </>
                ) : (
                  <>
                    <OutOfStockButton size="lg" fullWidth />
                    <WhatsAppButton
                      message={buildStockNotifyMessage(product.name)}
                      tracking={{
                        event: "product_inquiry",
                        source: "product_detail_main",
                        product_id: product.id,
                        product_name: product.name,
                        product_slug: product.slug,
                        category_id: product.category_id,
                        category_name: category.name,
                      }}
                      size="md"
                      variant="outline"
                      fullWidth
                      label="Stok gelince haber ver"
                    />
                  </>
                )}
              </div>

              {/* Trust pillars — minimal hairline grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-foreground/15 pt-6">
                {[
                  { title: "Orijinal Ürün",   sub: "Üretici garantili" },
                  { title: "Aynı Gün Kargo",  sub: "Saat 14:00'a kadar" },
                  { title: "Mağazadan Teslim",sub: "Trabzon merkez" },
                  { title: "7 Gün İade",       sub: "Hasar/arıza için" },
                ].map((p) => (
                  <div key={p.title} className="flex flex-col">
                    <p className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-foreground/55 mt-1 font-light">{p.sub}</p>
                  </div>
                ))}
              </div>

              {/* Specs — editorial table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="border-t border-foreground/15 pt-8">
                  <span className="eyebrow">Teknik Özellikler</span>
                  <dl className="mt-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[2fr_3fr] gap-6 py-3 border-b border-foreground/10"
                      >
                        <dt className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground/65">{key}</dt>
                        <dd className="font-serif font-light text-foreground tracking-tight">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Full-width sections ─────────────────────── */}
          <div className="mt-32 md:mt-40 space-y-32 md:space-y-40">

            {/* Store / Shipping / Return — editorial three-up */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <ProductSectionHeading
                eyebrow="Söz Veriyoruz"
                title="Satın aldıktan"
                italicAccent="sonra da."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                {[
                  {
                    num: "01",
                    title: "Hızlı Kargo",
                    items: [
                      "Saat 14:00'a kadar verilen siparişler aynı gün kargoya verilir.",
                      "MNG ve Aras Kargo ile Türkiye geneline teslimat.",
                      "Kargo ücreti sipariş tutarına ve konuma göre belirlenir.",
                    ],
                  },
                  {
                    num: "02",
                    title: "Mağazadan Teslim",
                    items: [
                      "Trabzon'daki mağazamızdan ürünü bizzat teslim alabilirsiniz.",
                      "Ziyaret öncesi WhatsApp'tan randevu almanızı öneririz.",
                      "Bazı ürünlerin demo modelleri mağazada incelenebilir.",
                    ],
                  },
                  {
                    num: "03",
                    title: "Garanti & İade",
                    items: [
                      "Tüm ürünler orijinal üretici garantisi kapsamındadır.",
                      "Hasar/arıza durumunda 7 gün içinde iade/değişim.",
                      "Garanti belgesi ve fatura kargo ile birlikte gönderilir.",
                    ],
                  },
                ].map((item) => (
                  <div key={item.num} className="border-t border-foreground/15 pt-6">
                    <span className="font-serif font-light text-4xl text-secondary leading-none">{item.num}</span>
                    <h3 className="font-serif font-light text-2xl mt-4 mb-5 tracking-tight text-foreground">{item.title}</h3>
                    <ul className="space-y-3">
                      {item.items.map(it => (
                        <li key={it} className="flex gap-3 text-sm text-foreground/65 leading-relaxed font-light">
                          <span className="w-1 h-1 rounded-full bg-foreground/40 mt-2 shrink-0" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* FAQ — editorial */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <ProductSectionHeading
                eyebrow="Bilgi"
                title="Sık sorulan"
                italicAccent="sorular."
              />
              <FAQAccordion items={faqs} />
            </motion.section>

            {/* Related products */}
            {related.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
              >
                <ProductSectionHeading
                  eyebrow={category.name}
                  title="Benzer"
                  italicAccent="ürünler."
                >
                  <Link
                    href={`/urunler/${category.slug}`}
                    className="link-hairline hidden sm:inline-flex hover:text-secondary"
                  >
                    Tümünü Gör
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </ProductSectionHeading>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {related.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
                <div className="mt-12 sm:hidden">
                  <Link
                    href={`/urunler/${category.slug}`}
                    className="link-hairline justify-center w-full hover:text-secondary"
                  >
                    Tüm {category.name} Ürünleri
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>

      {/* ── Final CTA — Dark editorial band ─────────── */}
      <section className="section-sm bg-[#111111] text-white mt-32 md:mt-40">
        <div className="container px-6 max-w-4xl text-center">
          <span className="eyebrow justify-center text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            Şu an aktifiz
          </span>
          <h2 className="editorial-heading text-white text-4xl md:text-5xl lg:text-6xl mb-8">
            {isOOS ? "Bu ürün tükendi." : "Sipariş etmek ister misiniz."}
            <br />
            <em className="italic font-light text-white/70">
              {isOOS ? "Alternatif önerelim." : "Aynı gün kargoda."}
            </em>
          </h2>
          <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
            {isOOS
              ? "WhatsApp'tan yazın — ihtiyacınıza en uygun alternatifi bulalım."
              : "WhatsApp üzerinden stok teyidi alın, aynı gün kargo ile kapınıza gelsin."}
          </p>
          <WhatsAppButton
            message={isOOS
              ? `Merhaba! 👋\n\n"*${product.name}*" tükenmiş — bu ürüne alternatif önerebilir misiniz?`
              : waMessage}
            tracking={{
              event: isOOS ? "product_inquiry" : "product_order",
              source: "product_detail_cta_strip",
              product_id: product.id,
              product_name: product.name,
              product_slug: product.slug,
              category_id: product.category_id,
              category_name: category.name,
              price_numeric: product.price_numeric ?? undefined,
            }}
            size="lg"
            rounded="pill"
            label={isOOS ? "Alternatif Sorun" : "WhatsApp'tan Sipariş Ver"}
          />
        </div>
      </section>
    </div>
  );
}
