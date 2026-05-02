import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/lib/seo";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/schemas";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { Product, Category } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { BlurImage } from "@/components/BlurImage";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/useSiteSettings";

/* ─── Main component (Meridian editorial) ─────────────────── */
export default function Home() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedProducts(6), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const base       = import.meta.env.BASE_URL.replace(/\/$/, "");
  const settings   = useSiteSettings();
  const buildWA    = useBuildWhatsAppLink();
  const whatsappGeneral  = buildWA("Merhaba, kamp ve balık malzemeleri hakkında bilgi almak istiyorum.");
  const whatsappLocation = buildWA("Merhaba, mağazanıza gelmek istiyorum. Konum ve çalışma saatlerinizi paylaşır mısınız?");

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Kamp, Balık & Outdoor Malzemeleri — Trabzon"
        description="Trabzon'un güvenilir kamp malzemeleri, balık malzemeleri, av malzemeleri ve outdoor ekipmanları mağazası. Karadeniz'in zorlu doğasına uygun, kaliteli ve uygun fiyatlı ekipmanlar. WhatsApp ile hızlı sipariş."
        url="/"
        keywords="kamp malzemeleri, balık malzemeleri, olta ekipmanları, kamp çadırı, balıkçı malzemeleri, outdoor ekipmanları, kamp ekipmanları, Trabzon, Karadeniz"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildLocalBusinessSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(buildOrganizationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(buildWebSiteSchema())}</script>
      </Helmet>

      {/* ════════════════════════════════════════
          § HERO — Full-bleed cinematic
      ════════════════════════════════════════ */}
      <section
        aria-label="Ana Görsel"
        className="relative flex items-end overflow-hidden bg-primary"
        style={{ height: "100dvh", minHeight: 640 }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <BlurImage
            src={`${base}/mock/hero.jpg`}
            alt="Karadeniz kamp ve balık doğası"
            wrapperClassName="absolute inset-0"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            fadeMs={650}
          />
          {/* Cinematic gradient — darker bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/35 to-primary" />
        </div>

        {/* Content — anchored bottom-left, editorial */}
        <div className="container relative z-10 px-6 md:px-10 pb-24 md:pb-32 w-full">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-10 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-secondary"
            >
              <span className="w-8 h-px bg-secondary" />
              Trabzon — Doğanın Kalbinde
            </motion.span>

            {/* H1 — Fraunces light + italic accent */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif font-light text-white leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
            >
              Karadeniz'in vahşi doğasına.<br />
              <em className="italic font-light text-white/75">Hazır mıyız.</em>
            </motion.h1>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <a
                href={whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-amber btn-cta !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
              >
                WhatsApp'tan Sipariş
              </a>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white border-b border-white/40 pb-1.5 hover:border-white transition-all"
              >
                Tüm Ürünleri Keşfet
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom-right scroll cue */}
        <motion.div
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-white/55 hidden md:flex flex-col items-end gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em]">Keşfet</span>
          <motion.div
            className="w-px h-12 bg-white/40"
            animate={{ scaleY: [1, 0.3, 1], transformOrigin: "top" }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          § INTRO STATEMENT — Editorial brand line
      ════════════════════════════════════════ */}
      <section className="bg-background section-sm">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
            <div className="md:col-span-3">
              <span className="eyebrow">/ 01 — Felsefe</span>
            </div>
            <div className="md:col-span-9">
              <p className="font-serif font-light text-2xl md:text-4xl lg:text-5xl text-primary leading-[1.15] tracking-tight">
                Sarıçam Aydoğan, Karadeniz'in hırçın doğasında <em className="italic text-secondary">test edilmiş</em> ekipmanları sizinle buluşturuyor.
                Yağmurda su almayan, soğukta sıcak tutan, rüzgarda savrulmayan ürünler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § CATEGORIES — Editorial 4-up
      ════════════════════════════════════════ */}
      <section className="section bg-background" aria-labelledby="categories-heading">
        <div className="container mx-auto px-6 md:px-10">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <span className="eyebrow">/ 02 — Koleksiyonlar</span>
              <h2 id="categories-heading" className="editorial-heading text-4xl md:text-6xl">
                Doğanın her köşesi için <em className="italic text-secondary">ekipman.</em>
              </h2>
            </div>
            <Link href="/urunler" className="link-hairline self-start md:self-end">
              Tüm Kategoriler <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {categories.length === 0
              ? [1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[3/4] skeleton" />
                ))
              : categories.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § FEATURED PRODUCTS — Editorial grid
      ════════════════════════════════════════ */}
      <section
        className="section"
        style={{ background: "hsl(38 25% 91%)" }}
        aria-labelledby="products-heading"
      >
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <span className="eyebrow">/ 03 — Öne Çıkanlar</span>
              <h2 id="products-heading" className="editorial-heading text-4xl md:text-6xl">
                Karadeniz'de denenmiş, <em className="italic text-secondary">tercih edilen.</em>
              </h2>
            </div>
            <Link href="/urunler" className="link-hairline self-start md:self-end">
              Tüm Ürünler <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-20">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-20">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          § BRAND STORY — Split editorial
      ════════════════════════════════════════ */}
      <section className="section bg-background" aria-labelledby="story-heading">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 relative"
            >
              <div className="aspect-[5/6] overflow-hidden bg-foreground/5">
                <BlurImage
                  src={`${base}/mock/hero.jpg`}
                  alt="Karadeniz doğası"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-background pl-4 pt-4 md:pl-8 md:pt-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif font-light text-5xl md:text-7xl text-primary tracking-tight">15</span>
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-foreground/60 leading-tight">
                    Yıllık<br />Tecrübe
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <span className="eyebrow">/ 04 — Hikayemiz</span>
              <h2 id="story-heading" className="editorial-heading text-4xl md:text-5xl mb-8">
                Trabzon'dan Türkiye'ye <em className="italic text-secondary">doğanın ekipmanı.</em>
              </h2>
              <div className="space-y-5 text-foreground/65 leading-relaxed font-light">
                <p>
                  Sarıçam Aydoğan, Trabzon'da kamp malzemeleri, balık malzemeleri ve
                  outdoor ekipmanları alanında hizmet vermektedir. Karadeniz'in eşsiz
                  doğasında geçirdiğimiz deneyimler, her ürünümüzü bizzat test etmemizi
                  sağlamıştır.
                </p>
                <p>
                  Kamp çadırından olta takımına, av malzemelerinden aydınlatma
                  ekipmanlarına kadar geniş ürün yelpazemizle outdoor tutkunlarının
                  yanındayız.
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-5 items-start">
                <Link href="/hakkimizda" className="btn-cta-amber btn-cta !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]">
                  Hakkımızda
                </Link>
                <a
                  href={whatsappLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hairline"
                >
                  Mağazaya Gel <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § VALUES STRIP — Three-up editorial
      ════════════════════════════════════════ */}
      <section className="section-sm bg-background border-t border-foreground/10">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
            {[
              { num: "01", title: "Tecrübe", desc: "Karadeniz'de yılların getirdiği derin deneyim, doğru ekipman tavsiyeleri." },
              { num: "02", title: "Garanti",  desc: "Yalnızca güvenilir markaların kaliteli ürünleri. Satış öncesi kontrol." },
              { num: "03", title: "Danışman", desc: "Müşteri değil dost olarak. WhatsApp'tan 7/24 sorularınızı yanıtlıyoruz." },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="px-0 md:px-10 py-10 md:py-12 first:pl-0 last:pr-0"
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-secondary">{v.num}</span>
                <h3 className="font-serif font-light text-2xl md:text-3xl text-primary tracking-tight mt-4 mb-4">
                  {v.title}<span className="italic text-secondary">.</span>
                </h3>
                <p className="text-foreground/60 text-sm font-light leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § FINAL CTA — Cinematic full-bleed
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img
            src={`${base}/mock/hero.jpg`}
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 to-primary" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-10 py-24 md:py-40">
          <div className="max-w-5xl">
            <span className="inline-flex items-center gap-3 mb-10 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-secondary">
              <span className="w-8 h-px bg-secondary" />
              Sıradaki Macera
            </span>
            <h2 className="font-serif font-light text-white leading-[1.05] tracking-tight text-4xl md:text-6xl lg:text-7xl">
              Doğa sizi çağırıyor.<br />
              <em className="italic text-white/70">Hazırlayalım.</em>
            </h2>
            <p className="mt-8 text-white/65 text-base md:text-lg font-light max-w-2xl leading-relaxed">
              {settings.hero_subtitle ||
                "Ailenizle güvenli kamp geceleri, dostlarınızla bereketli avlar. WhatsApp'tan tek mesaj uzaktayız."}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <a
                href={whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-amber btn-cta !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
              >
                WhatsApp'tan Yazın
              </a>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white border-b border-white/40 pb-1.5 hover:border-white transition-all"
              >
                İletişim Bilgileri
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
