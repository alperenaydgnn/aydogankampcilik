import { useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Compass, Shield, Users, MapPin } from "lucide-react";
import { SEO } from "@/lib/seo";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { Product, Category } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedProducts(6),
      getCategories()
    ]).then(([featuredData, categoriesData]) => {
      setProducts(featuredData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <div className="flex flex-col min-h-screen">
      <SEO />

      {/* Hero Section */}
      <section className="relative h-[90dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, scale }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src={`${baseUrl}/mock/hero.jpg`}
            alt="Kamp alanı" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container relative z-20 px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-secondary font-medium tracking-widest uppercase mb-4 block">
              Doğanın Kalbinde
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              Karadeniz'in Güvenilir<br/>Kamp & Balık Rehberi
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light drop-shadow">
              Ailenizle geçireceğiniz güvenli kamp geceleri ve dostlarınızla yapacağınız bereketli avlar için ihtiyacınız olan her şey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/urunler">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-secondary hover:bg-secondary/90 text-white border-0 shadow-xl shadow-secondary/20">
                  Ürünleri İncele
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md"
                onClick={() => window.open(buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum."), "_blank")}
              >
                Bize Ulaşın
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/70 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="text-sm font-medium tracking-wider uppercase">Keşfet</span>
          <motion.div 
            className="w-[1px] h-12 bg-gradient-to-b from-white/70 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], transformOrigin: "top" }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <SectionHeading 
            title="Kategoriler" 
            subtitle="Doğada ihtiyacınız olan her şey için özenle seçilmiş ürün gruplarımız."
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <CategoryCard key={category.id} category={category} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeading 
              title="Öne Çıkanlar" 
              subtitle="Karadeniz şartlarında denenmiş, müşterilerimizin en çok tercih ettiği ürünler."
            />
            <Link href="/urunler" className="inline-flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors pb-6">
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values / Why Us */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Neden Sarıçam Aydoğan?</h2>
            <p className="text-primary-foreground/80 text-lg">
              Biz sadece ürün satmıyoruz; deneyimlerimizi paylaşıyoruz. Raflarımızdaki her ürünü doğada test ettik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Compass,
                title: "Tecrübe",
                desc: "Yılların getirdiği kamp ve balıkçılık tecrübesiyle, ihtiyacınıza en uygun ekipmanı seçmenize yardımcı oluyoruz."
              },
              {
                icon: Shield,
                title: "Güven",
                desc: "Sadece güvendiğimiz, kendimizin de kullandığı kaliteli markaları satıyoruz. Satış sonrası desteğimizle yanınızdayız."
              },
              {
                icon: Users,
                title: "Samimiyet",
                desc: "Bir müşteri değil, doğa tutkunu bir dost olarak sizi mağazamızda ağırlamaktan mutluluk duyarız."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white mb-6 rotate-3 hover:rotate-0 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-2xl text-center"
          >
            <MapPin className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mağazamıza Bekliyoruz
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              İhtiyacınız olan ürünleri yakından görmek, çayımızı içmek ve bir sonraki maceranızı planlamak için sizi bekliyoruz.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/20 transition-all hover:-translate-y-1"
                onClick={() => window.open(buildWhatsAppLink("Merhaba, mağazanıza gelmek istiyorum. Konum alabilir miyim?"), "_blank")}
              >
                WhatsApp'tan Konum İste
              </Button>
              <Link href="/hakkimizda">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full">
                  İletişim Bilgileri
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
