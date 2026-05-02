import { Helmet } from "react-helmet-async";
import { Link, useRoute, Redirect } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, ArrowRight, MessageCircle, Compass, CheckCircle2, BookOpen,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schemas";
import { categoryMetas } from "@/lib/categoryMeta";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

/* ─────────────────────────────────────────────────────────────────
   Per-category extended buying-guide content. Used to enrich
   the `/kategori/:slug` info pages without polluting the catalog.
   ───────────────────────────────────────────────────────────────── */

interface CategoryGuide {
  slug: string;
  whyItMatters: string;
  buyingTips: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const categoryGuides: Record<string, CategoryGuide> = {
  "cadirlar": {
    slug: "cadirlar",
    whyItMatters:
      "Karadeniz'in iklimi, ülkenin geri kalanından farklı bir tempoda hareket eder. Lodos rüzgarı, ani yağışlar ve dağ ayazı; çadır seçimini doğrudan etkileyen unsurlardır. Doğru bir çadır, sadece bir gecelik konfor değil; kötü hava koşullarında güvenlik anlamına gelir.",
    buyingTips: [
      { title: "Su Sütunu Değeri",  desc: "3000 mm ve üzeri su sütunu Karadeniz yağışlarında güvenli kabul edilir. 5000 mm'lik modeller uzun yağmurlarda da kuru tutar." },
      { title: "Kapasite",          desc: "Belirtilen kişi sayısının bir altını tercih edin. 4 kişilik çadır, 3 kişi için en konforlusudur — çanta ve ekipman için yer kalır." },
      { title: "Mevsim Sınıfı",     desc: "3 mevsim çadırlar bahar, yaz, güz; 4 mevsim çadırlar kış kampı ve yüksek rakım için uygundur." },
      { title: "Pol Malzemesi",     desc: "Alüminyum poller fiberglasa göre rüzgara çok daha dayanıklıdır. Uzun ömür için yatırıma değer." },
      { title: "Kurulum Hızı",      desc: "Pop-up modeller pratik ama dayanıksızdır. İlk kurulumda evde deneme yapın, kamp gecesi sürpriz yaşamayın." },
      { title: "Ağırlık & Hacim",   desc: "Trekking için 2 kg altı, araç kampı için ağırlık önemli değildir; alanı geniş seçin." },
    ],
    faqs: [
      { q: "Karadeniz'de hangi çadır türü daha uygun?", a: "3 mevsim, alüminyum poll ve en az 3000 mm su sütunlu modeller bölgemizde rahatlıkla kullanılabilir. Yüksek rakımda kamp planlıyorsanız 4 mevsim modelleri tercih edin." },
      { q: "Çadır ne kadar dayanır?",                    a: "Bakımına özen gösterilen kaliteli bir kamp çadırı 8-10 sezon rahatlıkla kullanılabilir. Kuru kaldırılması ve UV'ye uzun süre maruz bırakılmaması ömrünü ikiye katlar." },
      { q: "Tek kişilik çadır almak yeterli mi?",        a: "Solo seyahat ediyorsanız evet; ancak kamp eşyalarınızı içeride tutmak isterseniz 2 kişilik bir trekking çadırı daha pratik olur." },
    ],
  },
  "olta-ve-makine": {
    slug: "olta-ve-makine",
    whyItMatters:
      "Olta-makine ikilisi, balık avının altyapısıdır. Yanlış kombinasyon size hem doğru atışı hem de kavrama gücünü sağlamaz. Karadeniz'de levrek, lüfer, palamut, mezgit gibi farklı türler farklı setler ister.",
    buyingTips: [
      { title: "Aksiyon Türü",        desc: "Fast / Medium / Slow aksiyon kamışlar farklı tekniklere göre tasarlanır. Surf için fast, jigging için medium-fast yaygın tercihtir." },
      { title: "Kamış Boyu",          desc: "Kıyıdan surf için 3.5–4 m, kayıktan jigging için 1.8–2.1 m kamışlar idealdir." },
      { title: "Atış Ağırlığı (LB)",  desc: "Atacağınız kurşun ağırlığına uyumlu LB seçin. 50-100 g arası genel amaçlı kullanım için iyidir." },
      { title: "Makine Gear Oranı",   desc: "Yüksek gear (6.2:1 ve üzeri) hızlı sarım, düşük gear (4.8:1) yüksek tork sağlar. Hangi balığı hedeflediğinize göre seçin." },
      { title: "Tuzlu Suya Dayanım",  desc: "Salt-water sınıfı makineler tuza karşı korumalı yataklara sahiptir. Karadeniz için bu özellik şarttır." },
      { title: "Karbon vs Fiber",     desc: "Karbon kamışlar daha hassas, fiber kamışlar daha dayanıklıdır. Yeni başlayanlar için karışım kompozitler ideal." },
    ],
    faqs: [
      { q: "Yeni başlıyorum, hangi seti almalıyım?", a: "Komple bir surf seti (kamış + makine + ipek) başlangıç için hem ekonomik hem öğretici olur. WhatsApp'tan deneyim seviyenizi belirtin, en uygun seti birlikte seçelim." },
      { q: "Kamış kaç gram kurşun atar?",            a: "Etiketinde yazan LB veya gram aralığı, kamışın güvenle atabileceği yük sınırıdır. Bu sınırın altında kalın." },
      { q: "Makine bakımı nasıl yapılır?",            a: "Kullanım sonrası tuzlu suyu temiz suyla durulayın, ayda bir yağlama yapın. Yıllık tam bakım ömrünü 3 katına çıkarır." },
    ],
  },
  "kamp-aksesuarlari": {
    slug: "kamp-aksesuarlari",
    whyItMatters:
      "Çadır barınağınızı, olta avınızı verir; ancak konforu sağlayan kamp aksesuarlarıdır. Doğru ekipmanla doğada bir hafta geçirmek kadar bir hafta sonu da keyifli olabilir.",
    buyingTips: [
      { title: "Kamp Ocağı",          desc: "Gaz, benzin ve çoklu yakıt seçenekleri var. Türkiye'de bulunabilirlik için bütan-propan gaz pratiktir." },
      { title: "Sırt Çantası Hacmi",  desc: "Günlük 20-30L, hafta sonu 40-60L, çoklu gece kampları 65L+ ideal hacimlerdir. Sırt uyumu en az hacim kadar önemli." },
      { title: "Kamp Masası",         desc: "Alüminyum yüzey hafif ve dayanıklıdır. Katlanır rulo modeller minimum hacim kaplar." },
      { title: "Kamp Sandalyesi",     desc: "Dirsek desteği uzun oturmada büyük fark yaratır. Yük taşıma kapasitesini kontrol edin." },
      { title: "Termos Hacmi",        desc: "Solo gezilerde 0.5-1L, çift kişi 1-1.5L, aile 2L üzeri. Vakumlu çelik termoslar 12 saate kadar sıcak tutar." },
      { title: "Çakı / Multi-tool",   desc: "Paslanmaz çelik bıçak, lokal beslenme aletleri ve makas içerenler her ihtiyaca cevap verir." },
    ],
    faqs: [
      { q: "İlk kez kampa çıkıyorum, hangi aksesuarlar şart?", a: "Çadır, uyku tulumu ve mat dışında: kamp ocağı, fener, sırt çantası, çaydanlık, çatal-bıçak takımı ve termos minimum gerekenlerdir." },
      { q: "Kamp ocağı için hangi gaz yaygın?",                a: "Bütan-propan karışımı gaz tüpleri Türkiye'de yaygın bulunur. Soğukta propan oranı yüksek olanları tercih edin." },
      { q: "Aile kampında ne hacimde sırt çantası?",            a: "Genelde aile kampı araç ile yapılır; sırt çantası yerine duffel bag tarzı 70-90L taşıma çantaları daha pratiktir." },
    ],
  },
  "aydinlatma": {
    slug: "aydinlatma",
    whyItMatters:
      "Doğada gece, gündüze göre çok farklı bir dünyadır. Doğru aydınlatma; çadıra dönüş yolunu bulmaktan, gece avında balıkçılık yapmaya kadar her şeyi mümkün kılar.",
    buyingTips: [
      { title: "Lümen Değeri",        desc: "Çadır içi 200-400 lm, kamp alanı 500-800 lm, gece avı/trekking 200 lm+ odaklı ışık idealdir." },
      { title: "Pil Ömrü",            desc: "En az 8 saat kesintisiz aydınlatma sağlayan modeller seçin. USB-C şarj artık standart olmalı." },
      { title: "Kırmızı Işık Modu",   desc: "Gece görüşünüzü korur, balıkları ürkütmez ve yakındaki diğer kampçıları rahatsız etmez." },
      { title: "Su Dayanımı (IPX)",   desc: "IPX4 ve üzeri yağmurda dayanıklıdır. IPX7 modelleri kısa süre suya batırılabilir." },
      { title: "Ağırlık & Boyut",     desc: "Kafa lambası 100 g altı tercih edin. Uzun süre takıldığında ağırlık fark yaratır." },
      { title: "Beam Mesafesi",       desc: "Çadır içi 5-10 m, gece avı 50-100 m beam mesafesine sahip modeller idealdir." },
    ],
    faqs: [
      { q: "Kafa lambası mı, kamp feneri mi?", a: "İkisi de farklı işler için tasarlanmıştır. Kafa lambası eller serbest kalsın diye, kamp feneri masada veya çadırda 360° aydınlatma için kullanılır. İdeal olarak ikisi de bulunmalı." },
      { q: "Şarjlı mı, pilli mi tercih etmeliyim?", a: "Şarjlı modeller uzun vadede ekonomik ve çevreci. Yedek pil takmanız mümkün olmayan uzun trekkinglerde pilli modeller tercih edilebilir." },
      { q: "Gece avı için kaç lümen yeterli?", a: "Odaklı ışık veren 200 lm yeterlidir. 500 lm üzeri ışıklar avını ürkütebilir; gerekiyorsa kısık moda alın." },
    ],
  },
  "termos-ve-sogutucu": {
    slug: "termos-ve-sogutucu",
    whyItMatters:
      "Avladığınız balığı taze tutamazsanız, en iyi olta dahi anlamını yitirir. Yine sıcak çay olmadan kamp ortamı eksik kalır. Termos ve soğutucu küçük detaylar değildir; kamp keyfinin temel taşıdır.",
    buyingTips: [
      { title: "Yalıtım Süresi",      desc: "Soğutucularda 48-72 saat buz tutma süresi standardı tercih edin. Vakumlu termoslarda 12-24 saat sıcak tutma süresi yaygındır." },
      { title: "Hacim Seçimi",         desc: "Solo gezi 1L termos / 12L soğutucu, aile 2L termos / 25-40L soğutucu, balık avı 30L+ soğutucu yeterlidir." },
      { title: "Malzeme Kalitesi",     desc: "304 paslanmaz çelik termos iç kabı uzun ömürlüdür. Soğutucularda EPS yerine PU köpük yalıtım üstündür." },
      { title: "Drain Tıpa",           desc: "Soğutucuda boşaltma tıpası şart; eriyen suyu çıkarmak temizliği kolaylaştırır." },
      { title: "Kapatma Mekanizması",  desc: "Termoslarda press veya çevirmeli kapaklar her zaman pratiktir. Push-button kapaklar dökme riski azaltır." },
      { title: "Taşıma Kolaylığı",     desc: "30L üstü soğutucularda tekerlek veya teleskopik sap büyük fark yaratır." },
    ],
    faqs: [
      { q: "Buz ne kadar dayanır?",            a: "Kaliteli bir 30L soğutucuda kuru buz veya buz paketi 3 güne kadar dayanır. İçeriği önceden soğutmak süreyi uzatır." },
      { q: "Termos sıcak ve soğuk tutar mı?",  a: "Vakum yalıtımlı çelik termoslar her ikisini de tutar. Sıcak içecek için ayrı, soğuk için ayrı termos kullanmak hiç şart değil." },
      { q: "Tekne soğutucusu farklı mı?",       a: "Tekne kullanımı için darbeye ve tuzlu suya dayanıklı, taşıma sapları güçlü modeller daha uygun. Plastik kalitesi (rotomolded) önemli." },
    ],
  },
  "olta-aksesuarlari": {
    slug: "olta-aksesuarlari",
    whyItMatters:
      "Av başarısının %50'si doğru aksesuarda gizlidir. En iyi olta-makine takımı bile yanlış yem ve iğne ile beklenen sonucu vermez. Karadeniz'in farklı türlerine farklı aksesuar gerekir.",
    buyingTips: [
      { title: "Sahte Yem Türü",       desc: "Levrek için 8-12cm jig yem, lüfer için 5-8cm metal kaşık, palamut için canlı görünümlü swimbait verimlidir." },
      { title: "İğne Numarası",         desc: "Hedef balığa göre seçin: hamsi 14-16, mezgit 8-10, levrek 4-6, lüfer 2-4 numara iğne uygundur." },
      { title: "Misina Türü",           desc: "Mono ana ipek için 0.30-0.40 mm, fluoro carbon mahmuzlu uçlar (görünmez) için 0.20-0.30 mm yaygın." },
      { title: "Misina Çekme Kuvveti",  desc: "Atılacak yük + balık ağırlığının 1.5 katı çekme dayanımına sahip misina seçin." },
      { title: "Fırdöndü & Kanal Tela", desc: "Misinayı dolanmaktan korur, set ömrünü uzatır. Paslanmaz çelik modeller tuzlu suya uygundur." },
      { title: "İğne Malzemesi",        desc: "Karbon çelik iğneler keskindir ama paslanır. Nikel veya teflon kaplı modeller Karadeniz için ideal." },
    ],
    faqs: [
      { q: "Yeni başlayanlar için hangi yem seti?", a: "Karma bir başlangıç seti (silikon yemler + birkaç metal kaşık + canlı görünümlü swimbait) farklı denemelere imkan tanır." },
      { q: "Misina ne sıklıkta değişmeli?",          a: "Yoğun kullanımda her sezon başında, normal kullanımda yılda bir değişim önerilir. UV ve tuz misinanın direncini düşürür." },
      { q: "Fluoro carbon misina farkı nedir?",      a: "Suda neredeyse görünmezdir, aşınma direnci yüksektir ama mono ipeğe göre daha pahalıdır. Hassas balıklar için tercih edilir." },
    ],
  },
  "outdoor-aksesuarlari": {
    slug: "outdoor-aksesuarlari",
    whyItMatters:
      "Outdoor ekipmanları, beklenmediği anda gerekir. Bir yamaçta gerekli bir multi-tool, bir kamp gecesinde elinizi kuru tutan eldiven, bir yangın durumunda işe yarayan bir survival kit — bu detaylar maceraları unutulmaz veya tehlikeli yapar.",
    buyingTips: [
      { title: "Bıçak / Multi-tool",   desc: "Tek bıçak yerine 8-15 fonksiyonlu multi-tool seçimi daha pratik. Paslanmaz 420HC veya 440C çelik kaliteli." },
      { title: "Survival Kit",         desc: "Çakmaktaşı, ıslık, mini pusula, sargı bezi ve termal battaniye içeren kompakt setler temel ihtiyacı karşılar." },
      { title: "Pusula & GPS",         desc: "Akıllı telefon yetersiz kaldığında manyetik pusula şarj gerektirmez. Sıvı yastıklı modeller hassas okuma sağlar." },
      { title: "Yağmurluk & Termal",   desc: "Su geçirmez kalitesini değil; nefes alma kapasitesini de kontrol edin (örn: Gore-Tex)." },
      { title: "Eldiven & Şapka",      desc: "Karadeniz dağında ısı 5-10°C ani düşebilir. Termal eldiven ve fes hep çantanızda olsun." },
      { title: "Su Filtresi",          desc: "Uzun trekkinglerde mikro-filtreli su şişeleri / pipetleri ağır su taşımaktan kurtarır." },
    ],
    faqs: [
      { q: "Survival kit kullanmayı bilmiyorum, gerekli mi?", a: "Tabii ki gerekli. İçeriği basit; bir kez evde inceleyip her parçanın işlevini öğrenmek 30 dakika alır ve hayat kurtarır." },
      { q: "Multi-tool mu, ayrı bıçak mı?",                    a: "Multi-tool çok yönlüdür ama belirli işlerde tek başına bıçağın keskinliğine ulaşmaz. İdeal olarak ikisini bir arada bulundurun." },
      { q: "Trekking ayakkabısı outdoor aksesuar mı?",          a: "Bizim outdoor aksesuar kategorimizde küçük ekipmanlar yer alır. Ayakkabı ve giyim ürünleri için özel olarak danışmanızı öneririz." },
    ],
  },
};

export default function CategoryInfo() {
  const [, params] = useRoute<{ slug: string }>("/kategori/:slug");
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const slug = params?.slug ?? "";
  const meta = categoryMetas.find(m => m.slug === slug);
  const guide = categoryGuides[slug];

  if (!meta || !guide) {
    return <Redirect to="/urunler" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${meta.heroTitle} Rehberi — Doğru Seçim İpuçları`}
        description={`${meta.heroTitle} kategorisinde nelere dikkat etmeli? Karadeniz koşullarına uygun seçim ipuçları, sık sorulan sorular ve uzman tavsiyeleri.`}
        url={`/kategori/${slug}`}
        keywords={meta.keywords.join(", ")}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "Ürünler",   url: "/urunler" },
            { name: `${meta.heroTitle} — Alım Rehberi`, url: `/kategori/${slug}` },
          ])
        )}</script>
      </Helmet>

      <PageHero
        eyebrow="Alım Rehberi"
        icon={Compass}
        title={meta.heroTitle}
        subtitle={meta.heroSubtitle}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler",   href: "/urunler" },
          { label: `${meta.heroTitle} — Alım Rehberi` },
        ]}
      />

      {/* Why it matters */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-3xl">
          <SectionHeading
            eyebrow="Neden Önemli?"
            title={meta.infoTitle}
          />
          <div className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed">
            <p className="text-lg">{guide.whyItMatters}</p>
            <p>{meta.infoText}</p>
          </div>
        </div>
      </section>

      {/* Buying tips grid */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 max-w-6xl">
          <SectionHeading
            eyebrow="Doğru Seçim İçin"
            title="Nelere Dikkat Etmeli?"
            subtitle="Bir ürünü seçerken göz önünde tutulması gereken en kritik kriterleri bir araya getirdik."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guide.buyingTips.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <h3 className="font-serif text-base font-bold leading-tight">{tip.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-3xl">
          <SectionHeading
            eyebrow="Sık Sorulanlar"
            title="Bu Kategoride Merak Edilenler"
            align="center"
          />

          <div className="space-y-3">
            {guide.faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-serif text-base font-semibold mb-2 flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related categories + CTA */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CTA: Browse this category */}
            <Link
              href={`/urunler/${slug}`}
              className="lg:col-span-2 group bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 flex flex-col justify-between hover:bg-primary/90 transition-colors"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
                  Ürünlere Göz At
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  {meta.heroTitle} Ürünlerini Görün
                </h3>
                <p className="text-primary-foreground/75 mb-5 leading-relaxed">
                  Bu kategorideki tüm ürünleri inceleyin, fiyatları görün ve WhatsApp ile hızlı sipariş verin.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-secondary font-semibold group-hover:gap-3 transition-all">
                Tüm Ürünleri Gör
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* CTA: WhatsApp */}
            <a
              href={buildWhatsAppLink(meta.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-2xl p-8 hover:border-[#25D366]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[#25D366]/15 text-[#25D366] rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 leading-tight">
                  Yardım Lazım mı?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Hangi ürünün size uygun olduğunu birlikte belirleyelim.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[#25D366] font-semibold text-sm group-hover:gap-3 transition-all">
                WhatsApp'tan Sor
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          {/* Other categories */}
          <div className="mt-10">
            <h3 className="font-serif text-lg font-semibold mb-5 text-muted-foreground">Diğer kategoriler:</h3>
            <div className="flex flex-wrap gap-2">
              {categoryMetas
                .filter(m => m.slug !== slug)
                .map(m => (
                  <Link
                    key={m.slug}
                    href={`/kategori/${m.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-secondary/40 hover:bg-secondary/5 transition-colors"
                  >
                    <span>{m.icon}</span>
                    <span>{m.heroTitle}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
