import { useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Compass, Shield, Users, MapPin, MessageCircle } from "lucide-react";
import { SEO } from "@/lib/seo";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { Product, Category } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 280]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.08]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedProducts(6), getCategories()]).then(([featuredData, categoriesData]) => {
      setProducts(featuredData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="flex flex-col min-h-screen">
      <SEO />

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative h-[90dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
          <div className="gradient-hero-overlay absolute inset-0 z-10" />
          <img
            src={`${baseUrl}/mock/hero.jpg`}
            alt="Doğada kamp"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container relative z-20 px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center justify-center gap-3 mb-5"
            >
              <span className="h-px w-10 bg-secondary/80" />
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">
                Doğanın Kalbinde
              </span>
              <span className="h-px w-10 bg-secondary/80" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-bold text-white mb-6 tracking-tight hero-text-shadow leading-[1.1]">
              Karadeniz'in Güvenilir<br />
              <span className="italic font-light text-secondary/90">Kamp & Balık</span> Rehberi
            </h1>

            <p className="text-base md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Ailenizle geçireceğiniz güvenli kamp geceleri ve dostlarınızla yapacağınız bereketli avlar için ihtiyacınız olan her şey.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/urunler" className="btn-cta btn-cta-amber text-base md:text-lg !px-8 !py-4 flex items-center gap-2">
                Ürünleri İncele <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => window.open(buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum."), "_blank")}
                className="btn-ghost-white text-base md:text-lg !px-8 !py-4"
              >
                Bize Ulaşın
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 text-white/60 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span className="text-[0.65rem] font-bold tracking-[0.22em] uppercase">Keşfet</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
            animate={{ scaleY: [1, 0.45, 1], transformOrigin: "top" }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ──────────────────── CATEGORIES ──────────────────── */}
      <section className="section bg-background">
        <div className="container px-4">
          <SectionHeading
            eyebrow="Koleksiyonlar"
            title="Kategoriler"
            subtitle="Doğada ihtiyacınız olan her şey için özenle seçilmiş ürün gruplarımız."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category, idx) => (
              <CategoryCard key={category.id} category={category} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FEATURED PRODUCTS ──────────────────── */}
      <section className="section" style={{ background: "hsl(38 25% 91%)" }}>
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeading
              eyebrow="Öne Çıkanlar"
              title="Popüler Ürünler"
              subtitle="Karadeniz şartlarında denenmiş, müşterilerimizin en çok tercih ettiği ürünler."
            />
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors mb-[3.5rem] md:mb-12 whitespace-nowrap group"
            >
              Tümünü Gör
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 skeleton rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────── WHY US ──────────────────── */}
      <section className="section gradient-outdoor text-primary-foreground relative overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />

        <div className="container px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-secondary font-bold tracking-[0.16em] text-xs uppercase mb-4">
              <span className="h-px w-8 bg-secondary" />
              Bizi Tercih Edin
              <span className="h-px w-8 bg-secondary" />
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Neden Sarıçam Aydoğan?
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              Biz sadece ürün satmıyoruz; deneyimlerimizi paylaşıyoruz. Raflarımızdaki her ürünü doğada test ettik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: "Tecrübe",
                desc: "Yılların getirdiği kamp ve balıkçılık tecrübesiyle, ihtiyacınıza en uygun ekipmanı seçmenize yardımcı oluyoruz.",
              },
              {
                icon: Shield,
                title: "Güven",
                desc: "Sadece güvendiğimiz, kendimizin de kullandığı kaliteli markaları satıyoruz. Satış sonrası desteğimizle yanınızdayız.",
              },
              {
                icon: Users,
                title: "Samimiyet",
                desc: "Bir müşteri değil, doğa tutkunu bir dost olarak sizi mağazamızda ağırlamaktan mutluluk duyarız.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="glass-primary rounded-2xl p-8 flex flex-col items-center text-center hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/25 flex items-center justify-center text-secondary mb-6">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-primary-foreground/65 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA CARD ──────────────────── */}
      <section className="section bg-background">
        <div className="container px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-card-border rounded-3xl shadow-card-hover p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Decorative ring */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-2 border-secondary/10 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-primary/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl gradient-outdoor flex items-center justify-center mx-auto mb-6 shadow-md">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Mağazamıza Bekliyoruz
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                İhtiyacınız olan ürünleri yakından görmek, çayımızı içmek ve bir sonraki maceranızı planlamak için sizi bekliyoruz.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => window.open(buildWhatsAppLink("Merhaba, mağazanıza gelmek istiyorum. Konum alabilir miyim?"), "_blank")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-[#1aaa57] shadow-lg shadow-[#25D366]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp'tan Konum İste
                </button>
                <Link href="/hakkimizda" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-foreground border border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200">
                  İletişim Bilgileri
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
