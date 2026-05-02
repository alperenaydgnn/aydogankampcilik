import { Helmet } from "react-helmet-async";
import {
  ShieldCheck, RefreshCw, Package, AlertCircle, MessageCircle,
  CheckCircle2, XCircle, FileText,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schemas";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export default function StorePolicy() {
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const lastUpdated = "1 Mayıs 2026";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Mağaza Politikası — İade, Değişim, Garanti"
        description="Sarıçam Aydoğan mağaza politikası: iade ve değişim koşulları, garanti kapsamı ve müşteri memnuniyeti taahhüdümüz. Şeffaf ve güven veren süreç."
        url="/magaza-politikasi"
        keywords="iade politikası, değişim, garanti, mağaza politikası, müşteri memnuniyeti, Sarıçam Aydoğan"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "Mağaza Politikası", url: "/magaza-politikasi" },
          ])
        )}</script>
      </Helmet>

      <PageHero
        eyebrow="Güvenli Alışveriş"
        icon={ShieldCheck}
        title="Mağaza Politikamız"
        subtitle="Sizden bekleyebileceklerinizi açıkça yazıyoruz. Memnun kalmazsanız çözüm üretmek için ilk adımı biz atarız."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Mağaza Politikası" },
        ]}
      />

      {/* Promise pillars */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-5xl">
          <SectionHeading
            eyebrow="Sözümüz"
            title="Üç Temel Söz"
            subtitle="Her satış sonrasında da yanınızda oluruz; çünkü bizim için doğru ürün kadar uzun ömürlü güven de önemlidir."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: CheckCircle2, title: "Orijinal Ürün",  desc: "Sattığımız her ürün doğrudan üreticiden ya da yetkili distribütörden gelir. Faturalı satış." },
              { icon: RefreshCw,    title: "Kolay Değişim",  desc: "Beğenmediğiniz veya yanlış seçtiğiniz ürün için 14 gün içinde sorunsuz değişim." },
              { icon: ShieldCheck,  title: "Üretici Garantisi", desc: "Tüm ürünler marka garantisi kapsamındadır. Garanti süresince yanınızdayız." },
            ].map((item, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-7">
                <div className="w-12 h-12 bg-secondary/15 text-secondary rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy details */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 max-w-3xl">
          <div className="mb-8 p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground">
            <strong className="text-foreground">Son güncelleme:</strong> {lastUpdated}
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-h2:text-2xl prose-h3:text-xl">

            <h2>Cayma Hakkı (14 Gün)</h2>
            <p>
              Mesafeli Satış mevzuatı uyarınca, ürünü teslim aldığınız tarihten itibaren <strong>14 gün içinde</strong> hiçbir
              gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Bunun için yapmanız gereken tek şey
              WhatsApp veya e-posta ile bize ulaşmak.
            </p>

            <h3>Cayma için koşullar</h3>
            <ul>
              <li>Ürün <strong>kullanılmamış</strong> ve <strong>orijinal ambalajında</strong> olmalı.</li>
              <li>Etiketleri sökülmemiş, ürün üzerinde kullanım izi bulunmamalı.</li>
              <li>Hediye / promosyon ürünleri varsa onlar da iade edilmeli.</li>
              <li>Faturanın bir nüshası ürünle birlikte gönderilmeli.</li>
            </ul>

            <h2>Değişim</h2>
            <p>
              Ürünün bedeni, modeli veya rengini değiştirmek isterseniz değişim talebinizi WhatsApp'tan
              iletmeniz yeterli. Değişim için aynı 14 günlük süre ve cayma koşulları geçerlidir. Stoktaki uygun
              alternatifleri size hızla bildiririz.
            </p>

            <h3>Değişim Süreci</h3>
            <ol>
              <li>WhatsApp'tan değişim talebinizi ve nedenini iletin.</li>
              <li>Yeni ürün için stok teyidi alın.</li>
              <li>Eski ürünü anlaşmalı kargo ile bize gönderin.</li>
              <li>Yeni ürün size kargolanır; varsa fiyat farkı için bilgilendirilirsiniz.</li>
            </ol>

            <h2>Kargo Ücreti — Kim Karşılar?</h2>
            <ul>
              <li><strong>Üretim hatası veya hasarlı ürün:</strong> Kargo ücreti tamamen tarafımıza aittir.</li>
              <li><strong>Yanlış ürün gönderimi:</strong> Hata bizden kaynaklı ise iade ve yeni gönderim ücretsizdir.</li>
              <li><strong>Müşteri kaynaklı değişim/iade:</strong> Gidiş-dönüş kargo ücreti müşteriye aittir.</li>
              <li><strong>Mağazadan elden değişim:</strong> Tamamen ücretsizdir.</li>
            </ul>

            <h2>Hasarlı veya Eksik Ürün Durumu</h2>
            <p>
              Kargonuz elinize ulaştığında paketi kuryenin yanında açmanızı tavsiye ediyoruz. Hasar veya
              eksik bir durum varsa <strong>kuryeye tutanak tutturun</strong> ve fotoğrafla birlikte bize ulaşın.
              Bu sayede süreci en hızlı şekilde sizin lehinize çözebiliyoruz.
            </p>

            <h2>İade Kapsamı Dışındaki Ürünler</h2>
            <p>
              Yasal düzenlemeler ve hijyen gereği aşağıdaki ürünler iade kapsamında değildir:
            </p>
            <ul>
              <li>Ambalajı açılmış misina, ipek, jel-yem ve sarf malzemeleri.</li>
              <li>Hijyen amaçlı tek kullanımlık ürünler ve iç giyim niteliğindeki tekstil.</li>
              <li>Sipariş üzerine özel olarak getirtilen veya kişiselleştirilmiş ürünler.</li>
              <li>Üretici tarafından özel olarak güvenlikli paketlenmiş gaz / yakıt ürünleri.</li>
            </ul>

            <h2>Garanti Şartları</h2>
            <p>
              Ürün garantisi <strong>üretici firma tarafından sağlanır</strong> ve tüm ürünlerimiz Türkiye distribütörü
              veya üreticinin garanti kapsamındadır. Garanti süresi markaya ve ürün kategorisine göre değişir
              (genellikle 1–2 yıl). Garanti kapsamına aşağıdakiler <em>girmez</em>:
            </p>
            <ul>
              <li>Hatalı kullanımdan, düşürmeden veya fiziksel darbeden kaynaklanan arızalar,</li>
              <li>Üretici talimatlarına aykırı kullanımdan oluşan hasarlar,</li>
              <li>Doğal aşınma ve yıpranma (örneğin uzun süre kullanılan misina aşınması).</li>
            </ul>

            <h2>Müşteri Memnuniyeti Taahhüdümüz</h2>
            <p>
              Bir ürünü beğenmediyseniz, beklediğiniz performansı vermediyse veya teknik bir sorun yaşıyorsanız
              önce bize yazın. Mevzuat çerçevesinde ne yapabileceğimizi ve ek olarak nasıl yardımcı olabileceğimizi
              birlikte değerlendiririz. <strong>Bizim için satış, alışveriş bittiğinde değil; siz memnun kaldığınızda biter.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Quick decision matrix */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-5xl">
          <SectionHeading
            eyebrow="Hızlı Bakış"
            title="Hangi Ürün İade Edilebilir?"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3 className="font-serif text-lg font-bold text-emerald-900">Evet, İade Edilebilir</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-emerald-600">✓</span>Çadır, uyku tulumu (kullanılmamış, ambalajında)</li>
                <li className="flex gap-2"><span className="text-emerald-600">✓</span>Kamp ekipmanları (ocak, masa, sandalye)</li>
                <li className="flex gap-2"><span className="text-emerald-600">✓</span>Fenerler, kafa lambaları (kullanılmamış)</li>
                <li className="flex gap-2"><span className="text-emerald-600">✓</span>Olta kamışı ve makine (kullanılmamış)</li>
                <li className="flex gap-2"><span className="text-emerald-600">✓</span>Soğutucu ve termoslar (ambalajında)</li>
                <li className="flex gap-2"><span className="text-emerald-600">✓</span>Üretici hatalı her ürün</li>
              </ul>
            </div>

            <div className="bg-card border border-rose-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-rose-600" />
                <h3 className="font-serif text-lg font-bold text-rose-900">Hayır, İade Edilemez</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-rose-600">✗</span>Açılmış misina ve ipek makaraları</li>
                <li className="flex gap-2"><span className="text-rose-600">✗</span>Kullanılmış sahte yemler ve iğneler</li>
                <li className="flex gap-2"><span className="text-rose-600">✗</span>Açılmış gaz tüpleri ve yakıtlar</li>
                <li className="flex gap-2"><span className="text-rose-600">✗</span>Hijyen ürünleri (iç giyim niteliği)</li>
                <li className="flex gap-2"><span className="text-rose-600">✗</span>Özel sipariş / kişiye özel ürünler</li>
                <li className="flex gap-2"><span className="text-rose-600">✗</span>Etiketleri sökülmüş, kullanım izi olan ürünler</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Emin değilseniz iade veya değişim talebinizi göndermeden önce bize WhatsApp'tan sorabilirsiniz.
              Birçok özel durumu sizin lehinize çözecek esneklik gösteriyoruz.
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container px-4 max-w-3xl text-center">
          <Package className="w-12 h-12 mx-auto mb-5 text-secondary" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            İade veya Değişim Talebiniz mi Var?
          </h2>
          <p className="text-primary-foreground/75 text-base md:text-lg mb-7">
            WhatsApp'tan sipariş numaranızı ve nedenini yazmanız yeterli. Sürecin tamamını biz takip ediyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={buildWhatsAppLink("Merhaba, iade/değişim talebim hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp'tan Yaz
            </a>
            <a
              href="/sss"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors border border-white/20"
            >
              <FileText className="w-5 h-5" />
              SSS'yi Gör
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
