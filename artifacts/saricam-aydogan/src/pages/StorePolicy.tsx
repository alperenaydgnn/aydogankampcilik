import { Helmet } from "react-helmet-async";
import {
  ShieldCheck, MessageCircle, AlertCircle, HelpCircle,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schemas";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export default function StorePolicy() {
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const lastUpdated = "10 Ağustos 2026";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Mağaza Politikası — Satış ve Hizmet Koşulları"
        description="Aydoğan Kampçılık mağaza politikası: ürün teslimatı, orijinal ürün güvencesi ve müşteri hizmetleri şartları."
        url="/magaza-politikasi"
        keywords="mağaza politikası, satış koşulları, Aydoğan Kampçılık"
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
        eyebrow="Şeffaf Bilgilendirme"
        icon={ShieldCheck}
        title="Mağaza"
        italicAccent="politikamız."
        subtitle="Sipariş ve satış süreçlerimize dair tüm bilgileri açıkça sunuyoruz."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Mağaza Politikası" },
        ]}
      />

      {/* Promise pillars — three-column editorial */}
      <section className="section">
        <div className="container px-6 max-w-6xl">
          <SectionHeading
            eyebrow="Hizmet Anlayışımız"
            title="Üç temel"
            italicAccent="ilke."
            subtitle="Sizlere doğru ürünü sunmak ve şeffaf bir alışveriş süreci sağlamak bizim için önemlidir."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { num: "01", title: "Orijinal Ürün",  desc: "Sattığımız her ürün %100 orijinaldir, doğrudan üreticiden ya da yetkili distribütörden temin edilir." },
              { num: "02", title: "Mağazadan Teslim",  desc: "Ürünlerimizi dilerseniz Adana Sarıçam'daki mağazamızdan bizzat inceleyip teslim alabilirsiniz." },
              { num: "03", title: "Müşteri Desteği", desc: "Ürün detayları ve merak ettiğiniz her konuda WhatsApp hattımız üzerinden destek sağlıyoruz." },
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

            <h2>İade ve değişim politikası.</h2>
            <p>
              Mağazamızda ve çevrimiçi satışlarımızda satılan ürünlerde <strong>iade veya değişim imkanı bulunmamaktadır.</strong>
              Sipariş oluşturmadan önce ürün açıklamalarını, ölçülerini ve teknik detaylarını dikkatle incelemenizi rica ederiz.
            </p>

            <h2>Garanti koşulları.</h2>
            <p>
              Satışını yaptığımız ürünlerde mağazamız veya üretici tarafından <strong>garanti hizmeti verilmemektedir.</strong> Tüm ürünler kargolanmadan veya mağazadan teslim edilmeden önce kalite ve fiziki durum açısından kontrol edilmektedir.
            </p>

            <h2>Kargo ve teslimat.</h2>
            <p>
              Saat 14:00'a kadar verilen siparişler aynı gün kargoya verilir. Kargonuz teslim edildiğinde paketi kurye yanında açıp fiziki kontrol etmenizi önemle tavsiye ederiz.
            </p>

            <h2>Müşteri danışmanlığı.</h2>
            <p>
              Sipariş öncesi ürünler hakkında bilgi almak, beden veya model uyumluluğunu sormak için WhatsApp hattımız üzerinden bizimle dilediğiniz zaman iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Quick notice block */}
      <section className="section">
        <div className="container px-6 max-w-4xl">
          <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-4" />
            <h3 className="font-serif text-2xl mb-2 text-foreground">Önemli Hatırlatma</h3>
            <p className="text-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
              Sipariş vermeden önce aklınıza takılan her türlü teknik detay, beden veya kullanım sorusu için WhatsApp danışma hattımız üzerinden bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — Dark editorial band */}
      <section className="section-sm bg-[#111111] text-white">
        <div className="container px-6 max-w-4xl text-center">
          <span className="eyebrow justify-center text-secondary">Destek ve İletişim</span>
          <h2 className="editorial-heading text-4xl md:text-5xl lg:text-6xl text-white mb-8">
            Sorularınız için
            <br />
            <em className="italic font-light text-white/70">bizimle iletişime geçin.</em>
          </h2>
          <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
            WhatsApp hattımızdan ürün detayları hakkında bilgi alabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={buildWhatsAppLink("Merhaba, ürün detayları hakkında bilgi almak istiyorum.")}
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
              <HelpCircle className="w-3.5 h-3.5" />
              SSS'yi Gör
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
