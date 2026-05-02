import { Helmet } from "react-helmet-async";
import { Shield, Lock, Database, UserCheck, Mail } from "lucide-react";
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
        title="KVKK & Gizlilik Politikası"
        subtitle="Verileriniz bize emanettir. Bu sayfada hangi bilgileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu sade bir dille açıklıyoruz."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "KVKK & Gizlilik" },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-3xl">
          <div className="mb-10 p-4 bg-muted/50 border border-border rounded-xl text-sm text-muted-foreground">
            <strong className="text-foreground">Son güncelleme:</strong> {lastUpdated}
          </div>

          {/* Quick summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Database, title: "Hangi Verileri?", desc: "Yalnızca sipariş ve iletişim için gereken bilgiler." },
              { icon: Lock, title: "Nasıl Koruyoruz?", desc: "Şifrelenmiş kanallar ve sınırlı erişim." },
              { icon: UserCheck, title: "Sizin Haklarınız", desc: "Görme, silme ve düzeltme hakkınız her zaman saklıdır." },
            ].map((item, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-h2:text-2xl prose-h3:text-xl">

            <h2>1. Veri Sorumlusu</h2>
            <p>
              <strong>{SITE_NAME}</strong> ({SITE_ADDRESS.street}, {SITE_ADDRESS.city}) olarak,
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla
              hareket ediyoruz. Bu sayfa, kişisel verilerinizi nasıl topladığımızı, kullandığımızı,
              koruduğumuzu ve haklarınızı açıklar.
            </p>

            <h2>2. Topladığımız Bilgiler</h2>
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

            <h2>3. Bu Verileri Neden Topluyoruz?</h2>
            <ul>
              <li>Siparişinizi hazırlamak ve adresinize ulaştırmak,</li>
              <li>Sorularınıza ve taleplerinize hızlı cevap verebilmek,</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek (fatura, vergi, garanti süreçleri),</li>
              <li>Sitemizin performansını ölçmek ve sizin için iyileştirmek.</li>
            </ul>

            <h2>4. Verilerinizi Kimlerle Paylaşıyoruz?</h2>
            <p>
              Verilerinizi <strong>satmıyoruz</strong> ve pazarlama amaçlı olarak üçüncü kişilerle paylaşmıyoruz.
              Yalnızca aşağıdaki durumlarda zorunlu olarak paylaşırız:
            </p>
            <ul>
              <li><strong>Kargo firmaları:</strong> Yalnızca teslimat için gerekli ad-soyad, adres ve telefon bilgisi.</li>
              <li><strong>Banka / ödeme servisleri:</strong> Ödeme işlemleri için ilgili kuruma yönlendirilen bilgiler.</li>
              <li><strong>Resmî kurumlar:</strong> Yasal zorunluluk halinde mahkemeler ve ilgili kamu kurumları.</li>
            </ul>

            <h2>5. Verileri Ne Kadar Süreyle Saklıyoruz?</h2>
            <p>
              Verilerinizi yalnızca işleme amacının gerektirdiği süre boyunca saklarız. Yasal saklama
              süreleri (örneğin fatura kayıtları için 10 yıl) sona erdiğinde verileriniz silinir veya
              anonim hale getirilir.
            </p>

            <h2>6. Çerezler (Cookies)</h2>
            <p>
              Sitemizde site performansını ölçmek ve gezinme deneyiminizi iyileştirmek için temel
              çerezler kullanıyoruz. Reklam veya takip amaçlı üçüncü taraf çerezleri kullanmıyoruz.
              Çerezleri tarayıcı ayarlarınızdan dilediğiniz zaman silebilir veya engelleyebilirsiniz.
            </p>

            <h2>7. Veri Güvenliği</h2>
            <p>
              Kişisel verilerinizi yetkisiz erişime, kayba, değişikliğe veya ifşaya karşı korumak için
              gerekli teknik ve idari tedbirleri alıyoruz: şifreli iletişim kanalları (HTTPS), sınırlı
              kullanıcı erişimleri, düzenli güvenlik gözden geçirmeleri.
            </p>

            <h2>8. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>Yasal koşullar gerçekleştiğinde silinmesini veya yok edilmesini talep etme,</li>
              <li>İşlemenin zarara uğratması halinde zararın giderilmesini talep etme.</li>
            </ul>

            <h2>9. Bize Nasıl Ulaşırsınız?</h2>
            <p>
              KVKK kapsamındaki başvurularınız için bize <a href={`mailto:${SITE_EMAIL}`} className="text-secondary font-semibold">{SITE_EMAIL}</a> adresinden
              veya mağaza adresimize yazılı olarak başvurabilirsiniz. Talebiniz, yasal süreler içinde
              ücretsiz olarak yanıtlanır.
            </p>

            <h2>10. Politikadaki Değişiklikler</h2>
            <p>
              Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişikliklerde sayfanın üst kısmındaki
              "son güncelleme" tarihini değiştiririz. Sayfayı düzenli aralıklarla kontrol etmenizi öneririz.
            </p>
          </div>

          {/* Contact card */}
          <div className="mt-12 bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold mb-1">KVKK Başvuru</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Verilerinize ilişkin tüm talepler için: <a href={`mailto:${SITE_EMAIL}`} className="text-secondary font-semibold">{SITE_EMAIL}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
