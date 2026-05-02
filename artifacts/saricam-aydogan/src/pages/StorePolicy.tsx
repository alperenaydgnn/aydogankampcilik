import { Helmet } from "react-helmet-async";
import {
  ShieldCheck, RefreshCw, MessageCircle, CheckCircle2, XCircle,
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
        title="Mağaza"
        italicAccent="politikamız."
        subtitle="Sizden bekleyebileceklerinizi açıkça yazıyoruz. Memnun kalmazsanız çözüm üretmek için ilk adımı biz atarız."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Mağaza Politikası" },
        ]}
      />

      {/* Promise pillars — three-column editorial */}
      <section className="section">
        <div className="container px-6 max-w-6xl">
          <SectionHeading
            eyebrow="Sözümüz"
            title="Üç temel"
            italicAccent="söz."
            subtitle="Her satış sonrasında da yanınızda oluruz; çünkü bizim için doğru ürün kadar uzun ömürlü güven de önemlidir."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { num: "01", title: "Orijinal Ürün",  desc: "Sattığımız her ürün doğrudan üreticiden ya da yetkili distribütörden gelir. Faturalı satış." },
              { num: "02", title: "Kolay Değişim",  desc: "Beğenmediğiniz veya yanlış seçtiğiniz ürün için 14 gün içinde sorunsuz değişim." },
              { num: "03", title: "Üretici Garantisi", desc: "Tüm ürünler marka garantisi kapsamındadır. Garanti süresince yanınızdayız." },
            ].map((item) => (
              <div key={item.num} className="border-t border-foreground/15 pt-8">
                <span className="font-serif font-light text-5xl text-secondary leading-none">{item.num}</span>
                <h3 className="font-serif font-light text-2xl mt-5 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-foreground/60 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy details — editorial prose */}
      <section className="section bg-muted/30">
        <div className="container px-6 max-w-3xl">
          <div className="mb-16 pb-6 border-b border-foreground/15 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-foreground/50">
            <span>Son güncelleme</span>
            <span className="text-foreground/80 font-medium">{lastUpdated}</span>
          </div>

          <div className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-light prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-tight
            prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-light
            prose-p:text-foreground/65 prose-p:font-light prose-p:leading-relaxed
            prose-li:text-foreground/65 prose-li:font-light
            prose-strong:text-foreground prose-strong:font-medium
            prose-em:text-secondary prose-em:italic">

            <h2>Cayma hakkı <em className="italic text-secondary">— 14 gün.</em></h2>
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

            <h2>Değişim.</h2>
            <p>
              Ürünün bedeni, modeli veya rengini değiştirmek isterseniz değişim talebinizi WhatsApp'tan
              iletmeniz yeterli. Değişim için aynı 14 günlük süre ve cayma koşulları geçerlidir. Stoktaki uygun
              alternatifleri size hızla bildiririz.
            </p>

            <h3>Değişim süreci</h3>
            <ol>
              <li>WhatsApp'tan değişim talebinizi ve nedenini iletin.</li>
              <li>Yeni ürün için stok teyidi alın.</li>
              <li>Eski ürünü anlaşmalı kargo ile bize gönderin.</li>
              <li>Yeni ürün size kargolanır; varsa fiyat farkı için bilgilendirilirsiniz.</li>
            </ol>

            <h2>Kargo ücreti — kim karşılar?</h2>
            <ul>
              <li><strong>Üretim hatası veya hasarlı ürün:</strong> Kargo ücreti tamamen tarafımıza aittir.</li>
              <li><strong>Yanlış ürün gönderimi:</strong> Hata bizden kaynaklı ise iade ve yeni gönderim ücretsizdir.</li>
              <li><strong>Müşteri kaynaklı değişim/iade:</strong> Gidiş-dönüş kargo ücreti müşteriye aittir.</li>
              <li><strong>Mağazadan elden değişim:</strong> Tamamen ücretsizdir.</li>
            </ul>

            <h2>Hasarlı veya eksik ürün durumu.</h2>
            <p>
              Kargonuz elinize ulaştığında paketi kuryenin yanında açmanızı tavsiye ediyoruz. Hasar veya
              eksik bir durum varsa <strong>kuryeye tutanak tutturun</strong> ve fotoğrafla birlikte bize ulaşın.
              Bu sayede süreci en hızlı şekilde sizin lehinize çözebiliyoruz.
            </p>

            <h2>İade kapsamı dışındaki ürünler.</h2>
            <p>
              Yasal düzenlemeler ve hijyen gereği aşağıdaki ürünler iade kapsamında değildir:
            </p>
            <ul>
              <li>Ambalajı açılmış misina, ipek, jel-yem ve sarf malzemeleri.</li>
              <li>Hijyen amaçlı tek kullanımlık ürünler ve iç giyim niteliğindeki tekstil.</li>
              <li>Sipariş üzerine özel olarak getirtilen veya kişiselleştirilmiş ürünler.</li>
              <li>Üretici tarafından özel olarak güvenlikli paketlenmiş gaz / yakıt ürünleri.</li>
            </ul>

            <h2>Garanti şartları.</h2>
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

            <h2>Müşteri memnuniyeti taahhüdümüz.</h2>
            <p>
              Bir ürünü beğenmediyseniz, beklediğiniz performansı vermediyse veya teknik bir sorun yaşıyorsanız
              önce bize yazın. Mevzuat çerçevesinde ne yapabileceğimizi ve ek olarak nasıl yardımcı olabileceğimizi
              birlikte değerlendiririz. <strong>Bizim için satış, alışveriş bittiğinde değil; siz memnun kaldığınızda biter.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Quick decision matrix — minimal hairline two-column */}
      <section className="section">
        <div className="container px-6 max-w-6xl">
          <SectionHeading
            eyebrow="Hızlı Bakış"
            title="Hangi ürün"
            italicAccent="iade edilebilir?"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div className="border-t-2 border-emerald-700/60 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" strokeWidth={1.4} />
                <span className="eyebrow !mb-0 text-emerald-800">Evet, iade edilebilir</span>
              </div>
              <ul className="space-y-3 text-foreground/65 font-light leading-relaxed">
                <li className="flex gap-3"><span className="text-emerald-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Çadır, uyku tulumu (kullanılmamış, ambalajında)</li>
                <li className="flex gap-3"><span className="text-emerald-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Kamp ekipmanları (ocak, masa, sandalye)</li>
                <li className="flex gap-3"><span className="text-emerald-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Fenerler, kafa lambaları (kullanılmamış)</li>
                <li className="flex gap-3"><span className="text-emerald-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Olta kamışı ve makine (kullanılmamış)</li>
                <li className="flex gap-3"><span className="text-emerald-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Soğutucu ve termoslar (ambalajında)</li>
                <li className="flex gap-3"><span className="text-emerald-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Üretici hatalı her ürün</li>
              </ul>
            </div>

            <div className="border-t-2 border-rose-700/60 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-5 h-5 text-rose-700" strokeWidth={1.4} />
                <span className="eyebrow !mb-0 text-rose-800">Hayır, iade edilemez</span>
              </div>
              <ul className="space-y-3 text-foreground/65 font-light leading-relaxed">
                <li className="flex gap-3"><span className="text-rose-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Açılmış misina ve ipek makaraları</li>
                <li className="flex gap-3"><span className="text-rose-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Kullanılmış sahte yemler ve iğneler</li>
                <li className="flex gap-3"><span className="text-rose-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Açılmış gaz tüpleri ve yakıtlar</li>
                <li className="flex gap-3"><span className="text-rose-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Hijyen ürünleri (iç giyim niteliği)</li>
                <li className="flex gap-3"><span className="text-rose-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Özel sipariş / kişiye özel ürünler</li>
                <li className="flex gap-3"><span className="text-rose-700 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />Etiketleri sökülmüş, kullanım izi olan ürünler</li>
              </ul>
            </div>
          </div>

          <p className="mt-12 text-foreground/55 text-xs md:text-sm uppercase tracking-[0.18em] text-center font-medium">
            Emin değilseniz WhatsApp'tan sorabilirsiniz · Birçok özel durumu sizin lehinize çözüyoruz
          </p>
        </div>
      </section>

      {/* CTA — Dark editorial band */}
      <section className="section-sm bg-[#111111] text-white">
        <div className="container px-6 max-w-4xl text-center">
          <span className="eyebrow justify-center text-secondary">İade veya Değişim</span>
          <h2 className="editorial-heading text-4xl md:text-5xl lg:text-6xl text-white mb-8">
            Süreci tamamen biz.
            <br />
            <em className="italic font-light text-white/70">Takip ederiz.</em>
          </h2>
          <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
            WhatsApp'tan sipariş numaranızı ve nedenini yazmanız yeterli.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={buildWhatsAppLink("Merhaba, iade/değişim talebim hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hairline text-white border-white/40 hover:text-secondary"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp'tan Yaz
              <span className="text-base">→</span>
            </a>
            <a
              href="/sss"
              className="link-hairline text-white/60 border-white/20 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              SSS'yi Gör
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
