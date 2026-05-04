import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/lib/seo";
import { buildLocalBusinessSchema } from "@/lib/schemas";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { PageHero } from "@/components/PageHero";
import { BlurImage } from "@/components/BlurImage";

export default function About() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const settings = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Hakkımızda — Adana Sarıçam Kamp & Balık Malzemeleri Mağazası"
        description="Aydoğan Kampçılık, 1995'ten beri Adana Sarıçam'da kamp malzemeleri, balık malzemeleri ve outdoor ekipmanları satışı yapan güvenilir mağazanızdır. Toros tecrübesi, kişisel danışmanlık."
        url="/hakkimizda"
        keywords="Aydoğan Kampçılık, Adana kamp malzemeleri, Sarıçam balık malzemeleri, kamp mağazası Adana, outdoor ekipmanları Adana"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildLocalBusinessSchema())}</script>
      </Helmet>

      <PageHero
        eyebrow="Hakkımızda"
        title="Doğaya duyulan saygı,"
        italicAccent="yılların tecrübesi."
        subtitle="1995'ten beri Toros eteklerinde denediğimiz, güvendiğimiz ekipmanları sizlerle buluşturuyoruz."
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Hakkımızda" }]}
      />

      {/* Story — single-column editorial */}
      <section className="section bg-background">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="eyebrow">/ 01 — Hikayemiz</span>
            </div>
            <div className="md:col-span-9 max-w-3xl space-y-8">
              <p className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-primary leading-[1.15] tracking-tight">
                Her şey babamızın hafta sonu balık tutkusuyla <em className="italic text-secondary">başladı.</em>
              </p>
              <p className="text-foreground/65 text-lg leading-relaxed font-light">
                O zamanlar kaliteli malzeme bulmak zordu, iyi bir olta veya rüzgara
                dayanan bir çadır için aylarca beklediğimiz olurdu. Aydoğan Kampçılık
                olarak hikayemiz, bu eksikliği kendi tecrübemizle doldurma kararı
                almamızla şekillendi.
              </p>
              <p className="text-foreground/65 text-base leading-relaxed font-light">
                Küçük bir dükkanda başladığımız bu serüven, bugün doğa tutkunlarının
                buluşma noktası haline geldi. Bizim için burası sadece bir mağaza
                değil; av anılarının anlatıldığı, kamp rotalarının paylaşıldığı bir
                dost meclisi.
              </p>
              <p className="text-foreground/65 text-base leading-relaxed font-light">
                Raflarımıza koyduğumuz her ürünü önce biz test ederiz. Yağmurda su
                alıyor mu? Soğukta sıcak tutuyor mu? Rüzgarda savruluyor mu? Çünkü
                biliyoruz ki doğada şakaya yer yoktur ve doğru ekipman hayat kurtarır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial split image */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="container mx-auto px-6 md:px-10">
          <div className="aspect-[16/8] overflow-hidden bg-foreground/5">
            <BlurImage
              src={`${baseUrl}/mock/hero.jpg`}
              alt="Adana Sarıçam doğası"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Values — editorial three-up */}
      <section className="section-sm bg-background border-t border-foreground/10">
        <div className="container mx-auto px-6 md:px-10">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <span className="eyebrow">/ 02 — Değerlerimiz</span>
            <h2 className="editorial-heading text-4xl md:text-5xl">
              Üç temel ilke<em className="italic text-secondary">.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
            {[
              { num: "01", title: "Dürüstlük", desc: "İhtiyacınız olmayan veya işinize yaramayacak hiçbir ürünü size tavsiye etmeyiz. Güven, her şeyden önemlidir." },
              { num: "02", title: "Aile Ortamı", desc: "Kapımızdan giren herkes bir müşteri değil, doğayı bizim kadar seven bir dosttur." },
              { num: "03", title: "Yerel Tecrübe", desc: "Toros'un sert rüzgarını da, yaz sıcağını da iyi biliriz. Tavsiyelerimiz yaşanmışlıklardan gelir." },
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="py-12 md:py-14 first:pl-0 last:pr-0 md:px-10"
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-secondary">{val.num}</span>
                <h3 className="font-serif font-light text-3xl md:text-4xl text-primary tracking-tight mt-4 mb-5">
                  {val.title}<span className="italic text-secondary">.</span>
                </h3>
                <p className="text-foreground/60 text-base font-light leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact band — Meridian dark */}
      <section className="section bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img src={`${baseUrl}/mock/hero.jpg`} alt="" aria-hidden className="w-full h-full object-cover" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-5">
              <span className="inline-flex items-center gap-3 mb-8 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-secondary">
                <span className="w-8 h-px bg-secondary" />
                Bize Ulaşın
              </span>
              <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                Mağazamıza uğrayıp <em className="italic text-white/70">çayımızı içebilirsiniz.</em>
              </h2>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
              <div>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white/45">Adres</span>
                <p className="mt-4 font-light text-white/85 leading-relaxed">
                  {settings.address ?? "Sarıçam Mah. Atatürk Cd. No:18, Sarıçam / Adana"}
                </p>
              </div>
              <div>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white/45">Çalışma Saatleri</span>
                <p className="mt-4 font-light text-white/85 leading-relaxed">
                  {settings.working_hours ?? "Pzt–Cmt 09:00–19:00"}
                </p>
              </div>
              <div>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white/45">Telefon & WhatsApp</span>
                <p className="mt-4 font-light text-white/85 leading-relaxed">
                  {settings.phone ?? "+90 507 644 23 50"}
                </p>
              </div>
              <div>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white/45">E-posta</span>
                <p className="mt-4 font-light text-white/85 leading-relaxed">
                  {settings.email ?? "info@aydogankampcilik.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
