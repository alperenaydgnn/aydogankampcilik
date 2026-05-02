import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Truck, Package, MapPin, CreditCard, ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schemas";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export default function Shipping() {
  const buildWhatsAppLink = useBuildWhatsAppLink();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Teslimat & Sipariş Bilgileri"
        description="Sarıçam Aydoğan kargo, teslimat ve sipariş bilgileri. Türkiye geneli kargo süreleri, ödeme seçenekleri ve hassas ürünlerde özel paketleme detayları."
        url="/teslimat"
        keywords="kamp malzemeleri kargo, balık malzemeleri teslimat, Türkiye geneli kargo, kapıda ödeme, Trabzon Sarıçam Aydoğan"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "Teslimat & Sipariş", url: "/teslimat" },
          ])
        )}</script>
      </Helmet>

      <PageHero
        eyebrow="Sipariş Süreci"
        icon={Truck}
        title="Teslimat &"
        italicAccent="sipariş."
        subtitle="Siparişiniz kargoya hazırlanırken ne yapıyoruz, ne kadar sürede ulaşıyor ve ödemeyi nasıl alıyoruz — hepsi tek sayfada, açık ve net."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Teslimat & Sipariş" },
        ]}
      />

      {/* Process steps — editorial numbered */}
      <section className="section">
        <div className="container px-6">
          <SectionHeading
            eyebrow="Adım Adım"
            title="Sipariş"
            italicAccent="süreci."
            subtitle="Sipariş anından kapınıza kadar olan yolculuğu dört basit adımda anlatalım."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 max-w-6xl mx-auto">
            {[
              { step: "01", title: "Sipariş",   desc: "WhatsApp'tan ürünü iletin veya mağazamıza uğrayın. Stok ve fiyat teyidini hemen veriyoruz." },
              { step: "02", title: "Ödeme",     desc: "Havale/EFT, kredi kartı veya kapıda ödeme — size en uygun seçeneği birlikte belirliyoruz." },
              { step: "03", title: "Hazırlık",  desc: "Ödeme onaylandıktan sonra ürün özenle paketlenir ve aynı gün kargoya verilir." },
              { step: "04", title: "Teslimat",  desc: "Anlaşmalı kargo firmamız ile 1–3 iş günü içinde adresinize ulaşır. Takip numarası size iletilir." },
            ].map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                className="border-t border-foreground/15 pt-8"
              >
                <span className="font-serif font-light text-5xl text-secondary leading-none">{s.step}</span>
                <h3 className="font-serif font-light text-2xl mt-5 mb-3 tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed font-light">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery times — editorial table */}
      <section className="section bg-muted/30">
        <div className="container px-6 max-w-6xl">
          <SectionHeading
            eyebrow="Süreler"
            title="Teslimat"
            italicAccent="süreleri."
            subtitle="Hafta içi 16:00'dan önce verilen siparişler aynı gün, sonrası bir sonraki iş günü kargoya teslim edilir."
            align="center"
          />

          <div className="border-t border-foreground/15">
            {[
              { area: "Trabzon Şehir İçi",                     time: "Aynı gün — 1 iş günü", note: "Mağazadan elden veya motokurye seçeneği mevcut." },
              { area: "Karadeniz Bölgesi & Komşu İller",       time: "1 – 2 iş günü",          note: "Anlaşmalı kargo firmaları ile hızlı teslimat." },
              { area: "Türkiye Geneli",                        time: "1 – 3 iş günü",          note: "Doğu illeri ve adalar için 1 iş günü ek süre olabilir." },
            ].map((row) => (
              <div
                key={row.area}
                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_3fr] gap-4 md:gap-10 py-8 border-b border-foreground/15 items-baseline"
              >
                <div className="flex items-baseline gap-3">
                  <MapPin className="w-4 h-4 text-secondary shrink-0" strokeWidth={1.4} />
                  <h3 className="font-serif font-light text-xl md:text-2xl text-foreground tracking-tight">{row.area}</h3>
                </div>
                <div className="font-serif italic font-light text-secondary text-lg md:text-xl">{row.time}</div>
                <p className="text-foreground/60 text-sm leading-relaxed font-light">{row.note}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-foreground/55 text-xs md:text-sm uppercase tracking-[0.18em] text-center font-medium">
            Yoğun sezonlarda teslimat süreleri 1–2 gün uzayabilir · Kargolar hafta sonu çıkışı yapılmaz
          </p>
        </div>
      </section>

      {/* Shipping fees & special handling — two-up editorial */}
      <section className="section">
        <div className="container px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div className="border-t border-foreground/15 pt-8">
              <CreditCard className="w-6 h-6 text-secondary mb-6" strokeWidth={1.4} />
              <h3 className="font-serif font-light text-3xl md:text-4xl mb-6 tracking-tight">
                Kargo <em className="italic text-secondary">ücretleri.</em>
              </h3>
              <ul className="space-y-4 text-foreground/65 font-light leading-relaxed">
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Mağazadan elden teslim alımda kargo <strong className="text-foreground font-medium">ücretsizdir.</strong></li>
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Standart kargo ücreti ürünün hacim ve ağırlığına göre değişir; sipariş anında tarafınıza bildirilir.</li>
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Çadır gibi büyük ebatlı ürünlerde özel kargo ücretlendirmesi geçerlidir.</li>
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Sipariş tutarınıza göre uygun kampanyaları sizinle paylaşıyoruz.</li>
              </ul>
            </div>

            <div className="border-t border-foreground/15 pt-8">
              <ShieldCheck className="w-6 h-6 text-secondary mb-6" strokeWidth={1.4} />
              <h3 className="font-serif font-light text-3xl md:text-4xl mb-6 tracking-tight">
                Özel <em className="italic text-secondary">paketleme.</em>
              </h3>
              <ul className="space-y-4 text-foreground/65 font-light leading-relaxed">
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Hassas elektronik ürünler köpük ve hava yastıklı zarflarla korunur.</li>
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Cam, ısıtıcı ve sıvı ürünler ekstra koruma sargısıyla gönderilir.</li>
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Olta kamışları kırılmaz tüpler içinde sevk edilir.</li>
                <li className="flex gap-3"><span className="text-secondary mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Her sipariş kargoya verilmeden önce tarafımızca kontrol edilir.</li>
              </ul>
            </div>
          </div>

          {/* Payment methods — editorial single-row */}
          <div className="mt-20 pt-10 border-t border-foreground/15">
            <div className="flex items-center gap-3 mb-8">
              <Package className="w-5 h-5 text-secondary" strokeWidth={1.4} />
              <span className="eyebrow !mb-0">Ödeme Seçenekleri</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
              {[
                { title: "Havale / EFT",        desc: "Sipariş onayı sonrası IBAN paylaşılır." },
                { title: "Kredi Kartı",         desc: "Mağazada veya güvenli ödeme linkiyle." },
                { title: "Kapıda Ödeme",        desc: "Belirli ürünlerde ve illerde mevcut." },
                { title: "Mağazadan Nakit",     desc: "Elden teslim alımda nakit kabul edilir." },
              ].map((m) => (
                <div key={m.title}>
                  <h4 className="font-serif font-light text-xl mb-2 tracking-tight text-foreground">{m.title}</h4>
                  <p className="text-foreground/60 text-sm font-light leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Dark editorial band */}
      <section className="section-sm bg-[#111111] text-white">
        <div className="container px-6 max-w-4xl text-center">
          <span className="eyebrow justify-center text-secondary">Sipariş vermeye hazır mısınız</span>
          <h2 className="editorial-heading text-4xl md:text-5xl lg:text-6xl text-white mb-8">
            Bir mesaj uzaktayız.
            <br />
            <em className="italic font-light text-white/70">Yazın yeter.</em>
          </h2>
          <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
            WhatsApp'tan istediğiniz ürünü yazmanız yeterli. Stok teyidi, kargo ücreti ve teslimat süresini hemen bildirelim.
          </p>
          <a
            href={buildWhatsAppLink("Merhaba, sipariş vermek istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="link-hairline text-white border-white/40 hover:text-secondary"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp'tan Sipariş Ver
            <span className="text-base">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
