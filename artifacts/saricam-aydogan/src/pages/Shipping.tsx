import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Truck, Package, Clock, MapPin, CreditCard, ShieldCheck,
  MessageCircle, AlertCircle, CheckCircle2,
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
        title="Teslimat & Sipariş"
        subtitle="Siparişiniz kargoya hazırlanırken ne yapıyoruz, ne kadar sürede ulaşıyor ve ödemeyi nasıl alıyoruz — hepsi tek sayfada, açık ve net."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Teslimat & Sipariş" },
        ]}
      />

      {/* Process steps */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <SectionHeading
            eyebrow="Adım Adım"
            title="Sipariş Süreci"
            subtitle="Sipariş anından kapınıza kadar olan yolculuğu dört basit adımda anlatalım."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { icon: MessageCircle, step: "1", title: "Sipariş", desc: "WhatsApp'tan ürünü iletin veya mağazamıza uğrayın. Stok ve fiyat teyidini hemen veriyoruz." },
              { icon: CreditCard,    step: "2", title: "Ödeme",   desc: "Havale/EFT, kredi kartı veya kapıda ödeme — size en uygun seçeneği birlikte belirliyoruz." },
              { icon: Package,       step: "3", title: "Hazırlık", desc: "Ödeme onaylandıktan sonra ürün özenle paketlenir ve aynı gün kargoya verilir." },
              { icon: Truck,         step: "4", title: "Teslimat", desc: "Anlaşmalı kargo firmamız ile 1–3 iş günü içinde adresinize ulaşır. Takip numarası size iletilir." },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-secondary text-white rounded-full flex items-center justify-center font-serif font-bold text-sm shadow-md">
                  {s.step}
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery times */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 max-w-5xl">
          <SectionHeading
            eyebrow="Süreler"
            title="Teslimat Süreleri"
            subtitle="Hafta içi 16:00'dan önce verilen siparişler aynı gün, sonrası bir sonraki iş günü kargoya teslim edilir."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { area: "Trabzon Şehir İçi",          time: "Aynı gün — 1 iş günü", note: "Mağazadan elden veya motokurye seçeneği mevcut." },
              { area: "Karadeniz Bölgesi & Komşu İller", time: "1 – 2 iş günü",     note: "Anlaşmalı kargo firmaları ile hızlı teslimat." },
              { area: "Türkiye Geneli",             time: "1 – 3 iş günü",       note: "Doğu illeri ve adalar için 1 iş günü ek süre olabilir." },
            ].map((row, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <h3 className="font-serif font-bold text-lg leading-tight">{row.area}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3 text-foreground">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="font-semibold">{row.time}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{row.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Yoğun sezonlarda (yaz başlangıcı, av sezonu) ve resmî tatillerde teslimat süreleri 1–2 gün uzayabilir.
              Kargolar hafta sonu çıkışı yapılmaz.
            </span>
          </div>
        </div>
      </section>

      {/* Shipping fees & special handling */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-7">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Kargo Ücretleri</h3>
              <ul className="space-y-2.5 text-muted-foreground text-sm leading-relaxed">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Mağazadan elden teslim alımda kargo <strong className="text-foreground">ücretsizdir.</strong></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Standart kargo ücreti ürünün hacim ve ağırlığına göre değişir; sipariş anında tarafınıza bildirilir.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Çadır gibi büyük ebatlı ürünlerde özel kargo ücretlendirmesi geçerlidir.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Sipariş tutarınıza göre uygun kampanyaları sizinle paylaşıyoruz.</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-7">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Özel Paketleme</h3>
              <ul className="space-y-2.5 text-muted-foreground text-sm leading-relaxed">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Hassas elektronik ürünler köpük ve hava yastıklı zarflarla korunur.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Cam, ısıtıcı ve sıvı ürünler ekstra koruma sargısıyla gönderilir.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Olta kamışları kırılmaz tüpler içinde sevk edilir.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />Her sipariş kargoya verilmeden önce tarafımızca kontrol edilir.</li>
              </ul>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-7">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold mb-3">Ödeme Seçenekleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Havale/EFT:</strong> Sipariş onayı sonrası IBAN paylaşılır.</p>
                  <p><strong className="text-foreground">Kredi Kartı:</strong> Mağazada veya güvenli ödeme linkiyle.</p>
                  <p><strong className="text-foreground">Kapıda Ödeme:</strong> Belirli ürünlerde ve illerde mevcut.</p>
                  <p><strong className="text-foreground">Mağazadan Nakit:</strong> Elden teslim alımda nakit kabul edilir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Sipariş vermeye hazır mısınız?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-7">
            WhatsApp'tan istediğiniz ürünü yazmanız yeterli. Stok teyidi, kargo ücreti ve teslimat süresini hemen bildirelim.
          </p>
          <a
            href={buildWhatsAppLink("Merhaba, sipariş vermek istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp'tan Sipariş Ver
          </a>
        </div>
      </section>
    </div>
  );
}
