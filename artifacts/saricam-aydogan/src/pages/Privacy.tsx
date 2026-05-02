import { Helmet } from "react-helmet-async";
import { Shield, Mail } from "lucide-react";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema, SITE_EMAIL, SITE_NAME, SITE_ADDRESS } from "@/lib/schemas";
import { PageHero } from "@/components/PageHero";

export default function Privacy() {
  const lastUpdated = "1 Mayıs 2026";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="KVKK & Gizlilik Politikası"
        description="Sarıçam Aydoğan kişisel verilerin korunması ve gizlilik politikası. Verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi."
        url="/kvkk"
        keywords="KVKK, gizlilik politikası, kişisel veriler, Sarıçam Aydoğan KVKK"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "KVKK & Gizlilik", url: "/kvkk" },
          ])
        )}</script>
      </Helmet>

      <PageHero
        eyebrow="Yasal"
        icon={Shield}
        title="Gizlilik &"
        italicAccent="KVKK."
        subtitle="Verileriniz bize emanettir. Bu sayfada hangi bilgileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu sade bir dille açıklıyoruz."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "KVKK & Gizlilik" },
        ]}
      />

      <section className="section">
        <div className="container px-6 max-w-3xl">
          {/* Last updated — hairline */}
          <div className="mb-16 pb-6 border-b border-border/60 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-foreground/50">
            <span>Son güncelleme</span>
            <span className="text-foreground/80 font-medium">{lastUpdated}</span>
          </div>

          {/* Three-pillar summary — bare hairline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 mb-20">
            {[
              { num: "01", title: "Hangi Verileri", desc: "Yalnızca sipariş ve iletişim için gereken bilgiler." },
              { num: "02", title: "Nasıl Koruyoruz", desc: "Şifrelenmiş kanallar ve sınırlı erişim." },
              { num: "03", title: "Sizin Haklarınız", desc: "Görme, silme ve düzeltme hakkınız her zaman saklıdır." },
            ].map((item) => (
              <div key={item.num} className="border-t border-foreground/15 pt-6">
                <span className="font-serif font-light text-3xl text-secondary">{item.num}</span>
                <h3 className="font-serif font-light text-xl text-foreground mt-3 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-light prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-tight
            prose-p:text-foreground/65 prose-p:font-light prose-p:leading-relaxed
            prose-li:text-foreground/65 prose-li:font-light
            prose-strong:text-foreground prose-strong:font-medium
            prose-em:text-secondary prose-em:italic
            prose-a:text-secondary prose-a:no-underline hover:prose-a:underline">

            <h2>Veri sorumlusu.</h2>
            <p>
              <strong>{SITE_NAME}</strong> ({SITE_ADDRESS.street}, {SITE_ADDRESS.city}) olarak,
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla
              hareket ediyoruz. Bu sayfa, kişisel verilerinizi nasıl topladığımızı, kullandığımızı,
              koruduğumuzu ve haklarınızı açıklar.
            </p>

            <h2>Topladığımız bilgiler.</h2>
            <p>Sizden yalnızca aşağıdaki bilgileri, sadece gerektiği zaman topluyoruz:</p>
            <ul>
              <li><strong>İletişim bilgileri:</strong> Ad-soyad, telefon numarası, e-posta adresi.</li>
              <li><strong>Sipariş bilgileri:</strong> Teslimat adresi, sipariş içeriği, fatura bilgileri.</li>
              <li><strong>İletişim içerikleri:</strong> WhatsApp, e-posta veya telefon görüşmelerinde paylaştığınız mesajlar.</li>
              <li><strong>Site kullanım verileri:</strong> Çerezler aracılığıyla; ziyaret edilen sayfalar, cihaz tipi, anonim kullanım istatistikleri.</li>
            </ul>
            <p>
              Sitemizi yalnızca gezerken sizden hiçbir kişisel bilgi <em>almıyoruz</em>; verilerinizi siz
              bizimle iletişime geçtiğinizde paylaşıyorsunuz.
            </p>

            <h2>Bu verileri neden topluyoruz?</h2>
            <ul>
              <li>Siparişinizi hazırlamak ve adresinize ulaştırmak,</li>
              <li>Sorularınıza ve taleplerinize hızlı cevap verebilmek,</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek (fatura, vergi, garanti süreçleri),</li>
              <li>Sitemizin performansını ölçmek ve sizin için iyileştirmek.</li>
            </ul>

            <h2>Verilerinizi kimlerle paylaşıyoruz?</h2>
            <p>
              Verilerinizi <strong>satmıyoruz</strong> ve pazarlama amaçlı olarak üçüncü kişilerle paylaşmıyoruz.
              Yalnızca aşağıdaki durumlarda zorunlu olarak paylaşırız:
            </p>
            <ul>
              <li><strong>Kargo firmaları:</strong> Yalnızca teslimat için gerekli ad-soyad, adres ve telefon bilgisi.</li>
              <li><strong>Banka / ödeme servisleri:</strong> Ödeme işlemleri için ilgili kuruma yönlendirilen bilgiler.</li>
              <li><strong>Resmî kurumlar:</strong> Yasal zorunluluk halinde mahkemeler ve ilgili kamu kurumları.</li>
            </ul>

            <h2>Verileri ne kadar süreyle saklıyoruz?</h2>
            <p>
              Verilerinizi yalnızca işleme amacının gerektirdiği süre boyunca saklarız. Yasal saklama
              süreleri (örneğin fatura kayıtları için 10 yıl) sona erdiğinde verileriniz silinir veya
              anonim hale getirilir.
            </p>

            <h2>Çerezler.</h2>
            <p>
              Sitemizde site performansını ölçmek ve gezinme deneyiminizi iyileştirmek için temel
              çerezler kullanıyoruz. Reklam veya takip amaçlı üçüncü taraf çerezleri kullanmıyoruz.
              Çerezleri tarayıcı ayarlarınızdan dilediğiniz zaman silebilir veya engelleyebilirsiniz.
            </p>

            <h2>Veri güvenliği.</h2>
            <p>
              Kişisel verilerinizi yetkisiz erişime, kayba, değişikliğe veya ifşaya karşı korumak için
              gerekli teknik ve idari tedbirleri alıyoruz: şifreli iletişim kanalları (HTTPS), sınırlı
              kullanıcı erişimleri, düzenli güvenlik gözden geçirmeleri.
            </p>

            <h2>KVKK kapsamındaki haklarınız.</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>Yasal koşullar gerçekleştiğinde silinmesini veya yok edilmesini talep etme,</li>
              <li>İşlemenin zarara uğratması halinde zararın giderilmesini talep etme.</li>
            </ul>

            <h2>Bize nasıl ulaşırsınız?</h2>
            <p>
              KVKK kapsamındaki başvurularınız için bize <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> adresinden
              veya mağaza adresimize yazılı olarak başvurabilirsiniz. Talebiniz, yasal süreler içinde
              ücretsiz olarak yanıtlanır.
            </p>

            <h2>Politikadaki değişiklikler.</h2>
            <p>
              Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişikliklerde sayfanın üst kısmındaki
              "son güncelleme" tarihini değiştiririz. Sayfayı düzenli aralıklarla kontrol etmenizi öneririz.
            </p>
          </div>

          {/* Contact card — hairline */}
          <div className="mt-20 pt-10 border-t border-foreground/15 flex items-start gap-6">
            <Mail className="w-6 h-6 text-secondary shrink-0 mt-1" strokeWidth={1.4} />
            <div>
              <h3 className="font-serif font-light text-2xl mb-2 tracking-tight">KVKK Başvuru</h3>
              <p className="text-foreground/65 leading-relaxed font-light">
                Verilerinize ilişkin tüm talepler için:{" "}
                <a href={`mailto:${SITE_EMAIL}`} className="text-secondary border-b border-secondary/40 hover:border-secondary transition-colors">
                  {SITE_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
