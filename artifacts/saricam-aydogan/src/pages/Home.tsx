import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight, Compass, Shield, Users, MapPin, MessageCircle,
  CheckCircle2, Truck, Star, Clock, ChevronRight, Phone,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { Product, Category } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/* ─── Counter hook ─────────────────────────────────────────── */
function useCounter(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ─── Stat item ────────────────────────────────────────────── */
function StatItem({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const { count, ref } = useCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center px-6"
    >
      <span className="font-serif text-4xl md:text-5xl font-bold text-primary leading-none" ref={ref}>
        {count}{suffix}
      </span>
      <span className="text-muted-foreground text-sm mt-2 font-medium">{label}</span>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, 260]);
  const heroScale = useTransform(scrollY, [0, 900], [1, 1.08]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedProducts(6), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const whatsappGeneral = buildWhatsAppLink(
    "Merhaba, kamp ve balık malzemeleri hakkında bilgi almak istiyorum."
  );
  const whatsappOrder = buildWhatsAppLink(
    "Merhaba! Ürünlerinizi inceledim, sipariş vermek istiyorum. Yardımcı olur musunuz?"
  );
  const whatsappLocation = buildWhatsAppLink(
    "Merhaba, mağazanıza gelmek istiyorum. Konum ve çalışma saatlerinizi paylaşır mısınız?"
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Kamp, Balık & Outdoor Malzemeleri — Trabzon"
        description="Trabzon'un güvenilir kamp malzemeleri, balık malzemeleri, av malzemeleri ve outdoor ekipmanları mağazası. Karadeniz'in zorlu doğasına uygun, kaliteli ve uygun fiyatlı ekipmanlar. WhatsApp ile hızlı sipariş."
      />

      {/* ════════════════════════════════════════
          § HERO
      ════════════════════════════════════════ */}
      <section
        aria-label="Ana Görsel"
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "100dvh", minHeight: 600 }}
      >
        {/* Parallax background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <div className="absolute inset-0 z-10" style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.62) 100%)"
          }} />
          <img
            src={`${base}/mock/hero.jpg`}
            alt="Doğada kamp alanı — Karadeniz kamp ve balık ekipmanları"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        {/* Content */}
        <div className="container relative z-20 px-4 md:px-6 text-center" style={{ marginTop: "5rem" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-secondary/75" />
            <span className="text-secondary font-bold tracking-[0.22em] uppercase text-[0.7rem]">
              Trabzon — Doğanın Kalbinde
            </span>
            <span className="h-px w-8 bg-secondary/75" />
          </motion.div>

          {/* H1 — SEO-optimised */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-bold text-white tracking-tight leading-[1.08] mb-6 hero-text-shadow"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.75rem)" }}
          >
            Kamp, Balık ve Outdoor<br />
            <span className="italic font-light" style={{ color: "hsl(38 94% 68%)" }}>
              Malzemeleri Mağazası
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="text-white/78 font-light leading-relaxed mb-10 mx-auto"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "38rem" }}
          >
            Ailenizle güvenli kamp geceleri, dostlarınızla bereketli avlar için
            kamp malzemeleri, balık malzemeleri, av malzemeleri ve outdoor ekipmanlarında
            Karadeniz'in en güvenilir adresi.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta btn-cta-amber flex items-center gap-2 !px-7 !py-3.5 text-[0.95rem]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp'tan Sipariş Ver
            </a>
            <Link
              href="/urunler"
              className="btn-ghost-white flex items-center gap-2 !px-7 !py-3.5 text-[0.95rem]"
            >
              Tüm Ürünleri İncele <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Quick category chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {[
              { label: "🏕️ Çadırlar", href: "/urunler/cadirlar" },
              { label: "🎣 Olta & Makine", href: "/urunler/olta-ve-makine" },
              { label: "🔦 Aydınlatma", href: "/urunler/aydinlatma" },
              { label: "🎒 Kamp Aksesuarları", href: "/urunler/kamp-aksesuarlari" },
            ].map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="text-[0.75rem] font-medium text-white/80 hover:text-white px-3.5 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-200"
              >
                {chip.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-[0.6rem] font-bold tracking-[0.25em] uppercase">Keşfet</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], transformOrigin: "top" }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          § STATS BAR
      ════════════════════════════════════════ */}
      <section className="bg-card border-y border-border py-10 md:py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-border">
            <StatItem value={15}  suffix="+"  label="Yıllık Tecrübe"        index={0} />
            <StatItem value={500} suffix="+"  label="Ürün Çeşidi"           index={1} />
            <StatItem value={3000} suffix="+" label="Memnun Müşteri"        index={2} />
            <StatItem value={4}   suffix=""   label="Uzman Kategori"        index={3} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § CATEGORIES
      ════════════════════════════════════════ */}
      <section className="section bg-background" aria-labelledby="categories-heading">
        <div className="container px-4 md:px-6">
          <SectionHeading
            eyebrow="Koleksiyonlar"
            title="Ürün Kategorilerimiz"
            subtitle="Kamp malzemeleri, balık malzemeleri ve outdoor ekipmanlarında dört uzman kategoride hizmetinizdeyiz."
            align="center"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.length === 0
              ? [1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />
                ))
              : categories.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} />
                ))
            }
          </div>

          {/* Category text links row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {[
              "Kamp Malzemeleri",
              "Balık Malzemeleri",
              "Av Malzemeleri",
              "Outdoor Ekipmanları",
              "Kamp Çadırı",
              "Olta Takımı",
              "Kafa Lambası",
            ].map((kw) => (
              <Link
                key={kw}
                href="/urunler"
                className="text-xs font-medium text-muted-foreground hover:text-primary px-3 py-1.5 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              >
                {kw}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § FEATURED PRODUCTS
      ════════════════════════════════════════ */}
      <section
        className="section"
        style={{ background: "hsl(38 22% 90%)" }}
        aria-labelledby="products-heading"
      >
        <div className="container px-4 md:px-6">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <SectionHeading
              eyebrow="Öne Çıkanlar"
              title="Popüler Ürünler"
              subtitle="Karadeniz'de defalarca test edilmiş, müşterilerimizin en çok tercih ettiği ürünler."
              className="mb-0"
            />
            <Link
              href="/urunler"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary transition-colors group"
            >
              Tüm Ürünleri Gör
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 skeleton rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mt-12"
          >
            <Link href="/urunler" className="btn-cta inline-flex items-center gap-2">
              Tüm Ürün Kataloğunu İncele <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § WHY US
      ════════════════════════════════════════ */}
      <section className="section gradient-outdoor text-primary-foreground relative overflow-hidden" aria-labelledby="why-us-heading">
        {/* Dot texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-secondary/80" />
              <span className="text-secondary font-bold tracking-[0.18em] text-[0.7rem] uppercase">Bizi Tercih Edin</span>
              <span className="h-px w-8 bg-secondary/80" />
            </div>
            <h2 id="why-us-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Neden Sarıçam Aydoğan?
            </h2>
            <p className="text-primary-foreground/65 text-base md:text-lg leading-relaxed">
              Raflarımızdaki her kamp ve balık malzemesini bizzat doğada test ettik.
              Güvendiğimiz ürünleri satıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Compass,
                title: "15 Yıllık Tecrübe",
                desc: "Kamp ve balıkçılık alanında yılların getirdiği derin deneyimle ihtiyacınıza en uygun outdoor ekipmanını birlikte buluyoruz.",
              },
              {
                icon: Shield,
                title: "Kalite Garantisi",
                desc: "Yalnızca güvenilir markaların kaliteli ürünlerini satıyoruz. Her kamp malzemesi ve balık malzemesi satış öncesi kontrol edilir.",
              },
              {
                icon: Users,
                title: "Kişisel Danışmanlık",
                desc: "Sizi bir müşteri değil, bir dost olarak karşılıyoruz. WhatsApp'tan 7/24 sorularınızı yanıtlıyoruz.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="glass-primary rounded-2xl p-7 flex flex-col gap-5 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/18 border border-secondary/22 flex items-center justify-center text-secondary shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-primary-foreground/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust bullets */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-14"
          >
            {[
              "Orijinal & Garantili Ürünler",
              "WhatsApp Hızlı Sipariş",
              "Uzman Tavsiyesi",
              "Aynı Gün Yanıt",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § STORE INTRO
      ════════════════════════════════════════ */}
      <section className="section bg-background" aria-labelledby="about-heading">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="eyebrow">Hikayemiz</span>
              <h2 id="about-heading" className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-5">
                Trabzon'dan Türkiye'ye<br />Doğanın Ekipmanı
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sarıçam Aydoğan, 15 yılı aşkın süredir Trabzon'da kamp malzemeleri,
                balık malzemeleri ve outdoor ekipmanları alanında hizmet vermektedir.
                Karadeniz'in eşsiz doğasında geçirdiğimiz deneyimler, her ürünümüzü
                bizzat test etmemizi sağlamıştır.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Kamp çadırından olta takımına, av malzemelerinden aydınlatma
                ekipmanlarına kadar geniş ürün yelpazemizle outdoor tutkunlarının
                yanındayız. Kaliteden ödün vermeden, uygun fiyatlarla sunduğumuz
                ürünler için mağazamızı ziyaret edin ya da WhatsApp'tan bize ulaşın.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/hakkimizda" className="btn-cta inline-flex items-center gap-2">
                  Hakkımızda <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={whatsappLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50 text-sm font-semibold transition-all duration-200"
                >
                  <MapPin className="w-4 h-4" /> Konumumuz
                </a>
              </div>
            </motion.div>

            {/* Right: Visual grid */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/5] img-zoom">
                  <img
                    src={`${base}/mock/category-cadir.jpg`}
                    alt="Kamp çadırı — kamp malzemeleri"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/3] img-zoom">
                    <img
                      src={`${base}/mock/category-olta.jpg`}
                      alt="Balık malzemeleri — olta takımı"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/3] img-zoom">
                    <img
                      src={`${base}/mock/category-aydinlatma.jpg`}
                      alt="Outdoor ekipmanları — kamp aydınlatma"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-4 -left-4 md:-left-8 glass rounded-2xl px-5 py-4 flex items-center gap-3 shadow-card-hover"
              >
                <div className="w-10 h-10 rounded-xl gradient-outdoor flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-serif font-bold text-foreground text-sm leading-none">15+ Yıl</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Sektörde Tecrübe</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § WHATSAPP QUICK ORDER
      ════════════════════════════════════════ */}
      <section
        className="section relative overflow-hidden"
        style={{ background: "hsl(38 22% 90%)" }}
        aria-labelledby="whatsapp-heading"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-card-border rounded-3xl overflow-hidden shadow-card-hover"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Left: Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#25D366]">Şu an aktif</span>
                </div>

                <h2 id="whatsapp-heading" className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                  WhatsApp ile<br />Hızlı Sipariş
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base">
                  Ürünü seçin, WhatsApp'tan mesaj gönderin — aynı gün yanıt alın.
                  Online ödeme yok, aracı yok. Doğrudan biz.
                </p>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  {[
                    { n: "1", text: "Katalogdan istediğiniz ürünü bulun" },
                    { n: "2", text: "WhatsApp'tan mesaj gönderin" },
                    { n: "3", text: "Fiyat ve bilgi alın, siparişi onaylayın" },
                  ].map((s) => (
                    <div key={s.n} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {s.n}
                      </span>
                      <p className="text-muted-foreground text-sm pt-1 leading-snug">{s.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappOrder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#25D366", border: "1px solid #1aaa57", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Şimdi Sipariş Ver
                  </a>
                  <a
                    href={`tel:+905551112233`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-foreground border border-border hover:border-primary/30 hover:bg-muted/50 text-sm transition-all duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    Ara
                  </a>
                </div>
              </div>

              {/* Right: Feature callouts */}
              <div
                className="relative p-8 md:p-12 flex flex-col justify-center gap-5"
                style={{ background: "hsl(149 43% 17%)" }}
              >
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: "hsl(38 94% 45%)", transform: "translate(30%, -30%)" }} />

                {[
                  { icon: Clock,      title: "Aynı Gün Yanıt",         desc: "Mesajınıza 1 saat içinde dönüyoruz." },
                  { icon: Truck,      title: "Kargo veya Teslim",      desc: "Trabzon içi teslimat, Türkiye geneli kargo." },
                  { icon: CheckCircle2, title: "Orijinal Ürün",        desc: "Tüm ürünler yetkili satıcıdan temin edilir." },
                  { icon: Star,       title: "3.000+ Memnun Müşteri",  desc: "15 yılda binlerce mutlu outdoor tutkununa ulaştık." },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 relative z-10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center shrink-0 text-secondary">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm leading-none mb-1">{f.title}</p>
                      <p className="text-white/55 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § TRUST BAR + CONTACT
      ════════════════════════════════════════ */}
      <section className="section-sm bg-background border-t border-border" aria-labelledby="trust-heading">
        <div className="container px-4 md:px-6">

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
          >
            {[
              { icon: Shield,       label: "Orijinal & Garantili",     sub: "Tüm ürünler orijinal" },
              { icon: Truck,        label: "Hızlı Teslimat",           sub: "Kargo ve elden teslim" },
              { icon: MessageCircle, label: "WhatsApp Destek",         sub: "7/24 mesaj yanıtı" },
              { icon: Star,         label: "Güvenilir Mağaza",         sub: "15+ yıllık hizmet" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-card-border rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover-lift"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                  <t.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm leading-none mb-1">{t.label}</p>
                  <p className="text-muted-foreground text-xs">{t.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact / final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-card-border rounded-3xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-7"
          >
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
                Mağazamıza Bekliyoruz
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                Trabzon merkez mağazamızda ürünleri yakından inceleyin. Çayımızı içerek
                bir sonraki kamp ya da balık avı maceranzı birlikte planlayalım.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  Atatürk Cad. No:123 Merkez, Trabzon
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  Pzt–Cmt 09:00–19:30
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={whatsappLocation}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta btn-cta-amber inline-flex items-center gap-2 !px-6 !py-3 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Konum Al
              </a>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-foreground border border-border hover:border-primary/30 hover:text-primary hover:bg-muted/50 transition-all duration-200"
              >
                İletişim Bilgileri <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
