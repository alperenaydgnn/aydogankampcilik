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
import { getProducts, getCategories } from "@/lib/data";
import { Product, Category } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { ComboBanner } from "@/components/ComboBanner";
import { CategoryCard } from "@/components/CategoryCard";
import { BlurImage } from "@/components/BlurImage";
import { HeroSlider } from "@/components/HeroSlider";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { mockSiteSettings } from "@/lib/mockData";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useT } from "@/lib/i18n";

/* ─── Main component (Meridian editorial) ─────────────────── */
export default function Home() {
  const t = useT();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts({ limit: 24 }), getCategories()]).then(
      ([p, c]) => {
        setProducts(p);
        setCategories(c);
        setLoading(false);
      },
    );
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const settings = useSiteSettings();
  const buildWA = useBuildWhatsAppLink();
  const whatsappGeneral = buildWA(
    "Merhaba, kamp ve balık malzemeleri hakkında bilgi almak istiyorum.",
  );
  const whatsappLocation = buildWA(
    "Merhaba, mağazanıza gelmek istiyorum. Konum ve çalışma saatlerinizi paylaşır mısınız?",
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Kamp, Balık & Outdoor Malzemeleri — Adana Sarıçam"
        description="Adana Sarıçam'ın güvenilir kamp malzemeleri, balık malzemeleri ve outdoor ekipmanları mağazası. Toros'un zorlu doğasına uygun, kaliteli ve uygun fiyatlı ekipmanlar. WhatsApp ile hızlı sipariş."
        url="/"
        keywords="kamp malzemeleri, balık malzemeleri, olta ekipmanları, kamp çadırı, balıkçı malzemeleri, outdoor ekipmanları, Adana, Sarıçam, Toros"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(buildLocalBusinessSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildOrganizationSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildWebSiteSchema())}
        </script>
      </Helmet>

      {/* ════════════════════════════════════════
          § HERO — Full-bleed cinematic slider
      ════════════════════════════════════════ */}
      <section
        aria-label="Ana Görsel"
        className="relative flex items-end overflow-hidden bg-primary"
        style={{ height: "100dvh", minHeight: 640 }}
      >
        {/* Background slider — 6 images, 4s auto-slide left */}
        <div className="absolute inset-0 z-0">
          <HeroSlider
            images={
              Array.isArray(settings.hero_images) &&
              settings.hero_images.length > 0
                ? settings.hero_images
                : (mockSiteSettings.hero_images ?? [`${base}/mock/hero.jpg`])
            }
            intervalMs={4000}
          />
          {/* Cinematic gradient — darker bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/35 to-primary pointer-events-none" />
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
              {t("home.hero.badge")}
            </motion.span>

            {/* H1 — Fraunces light + italic accent */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif font-light text-white leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
            >
              {t("footer.brandLine")}
              <br />
              <em className="italic font-light text-white/75">{t("footer.brandLineEm")}</em>
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
                {t("home.hero.ctaWhatsApp")}
              </a>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white border-b border-white/40 pb-1.5 hover:border-white transition-all"
              >
                {t("home.hero.ctaCatalog")}
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
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em]">
            Keşfet
          </span>
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
              <span className="eyebrow">{t("home.section.philosophy")}</span>
            </div>
            <div className="md:col-span-9">
              <p className="font-serif font-light text-2xl md:text-4xl lg:text-5xl text-primary leading-[1.15] tracking-tight">
                {t("home.philosophy.body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § CATEGORIES — Editorial 4-up
      ════════════════════════════════════════ */}
      <section
        className="section bg-background"
        aria-labelledby="categories-heading"
      >
        <div className="container mx-auto px-6 md:px-10">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <span className="eyebrow">{t("home.section.collections")}</span>
              <h2
                id="categories-heading"
                className="editorial-heading text-4xl md:text-6xl"
              >
                {t("home.collections.title")}{" "}
                <em className="italic text-secondary">{t("home.collections.titleItalic")}</em>
              </h2>
            </div>
            <Link
              href="/urunler"
              className="link-hairline self-start md:self-end"
            >
              {t("home.collections.cta")} <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {categories.length === 0
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-[3/4] skeleton" />
                ))
              : categories
                  .slice(0, 8)
                  .map((cat, i) => (
                    <CategoryCard key={cat.id} category={cat} index={i} />
                  ))}
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
              <span className="eyebrow">{t("home.section.featured")}</span>
              <h2
                id="products-heading"
                className="editorial-heading text-4xl md:text-6xl"
              >
                {t("home.featured.title")}{" "}
                <em className="italic text-secondary">{t("home.featured.titleItalic")}</em>
              </h2>
            </div>
            <Link
              href="/urunler"
              className="link-hairline self-start md:self-end"
            >
              {t("home.featured.cta")} <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} compact />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          § COMBO BUNDLES — Sales upsell
      ════════════════════════════════════════ */}
      <ComboBanner />

      {/* ════════════════════════════════════════
          § BRAND STORY — Split editorial
      ════════════════════════════════════════ */}
      <section
        className="section bg-background"
        aria-labelledby="story-heading"
      >
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
                  alt="Adana Sarıçam doğası"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-background pl-4 pt-4 md:pl-8 md:pt-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif font-light text-5xl md:text-7xl text-primary tracking-tight">
                    {t("home.story.experienceNum")}
                  </span>
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-foreground/60 leading-tight whitespace-pre-line">
                    {t("home.story.experience")}
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
              <span className="eyebrow">{t("home.section.story")}</span>
              <h2
                id="story-heading"
                className="editorial-heading text-4xl md:text-5xl mb-8"
              >
                {t("home.story.title")}{" "}
                <em className="italic text-secondary">{t("home.story.titleItalic")}</em>
              </h2>
              <div className="space-y-5 text-foreground/65 leading-relaxed font-light">
                <p>
                  {t("home.story.body1")}
                </p>
                <p>
                  {t("home.story.body2")}
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-5 items-start">
                <Link
                  href="/hakkimizda"
                  className="btn-cta-amber btn-cta !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
                >
                  {t("home.story.ctaAbout")}
                </Link>
                <a
                  href={whatsappLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hairline"
                >
                  {t("home.story.ctaStore")} <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          § WEATHER WIDGET
      ════════════════════════════════════════ */}
      <section className="section-md bg-background border-t border-foreground/10">
        <WeatherWidget />
      </section>

      {/* ════════════════════════════════════════
          § VALUES STRIP — Three-up editorial
      ════════════════════════════════════════ */}
      <section className="section-sm bg-background border-t border-foreground/10">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
            {[
              {
                num: "01",
                title: t("home.value1.title"),
                desc: t("home.value1.desc"),
              },
              {
                num: "02",
                title: t("home.value2.title"),
                desc: t("home.value2.desc"),
              },
              {
                num: "03",
                title: t("home.value3.title"),
                desc: t("home.value3.desc"),
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="px-0 md:px-10 py-10 md:py-12 first:pl-0 last:pr-0"
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-secondary">
                  {v.num}
                </span>
                <h3 className="font-serif font-light text-2xl md:text-3xl text-primary tracking-tight mt-4 mb-4">
                  {v.title}
                  <span className="italic text-secondary">.</span>
                </h3>
                <p className="text-foreground/60 text-sm font-light leading-relaxed">
                  {v.desc}
                </p>
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
              {t("home.final.badge")}
            </span>
            <h2 className="font-serif font-light text-white leading-[1.05] tracking-tight text-4xl md:text-6xl lg:text-7xl">
              {t("home.final.title")}
              <br />
              <em className="italic text-white/70">{t("home.final.titleItalic")}</em>
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
                {t("home.final.ctaWhatsApp")}
              </a>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white border-b border-white/40 pb-1.5 hover:border-white transition-all"
              >
                {t("home.final.ctaContact")}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
