import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { SEO } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFAQSchema } from "@/lib/schemas";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Sipariş ve Ödeme",
    items: [
      {
        q: "Nasıl sipariş verebilirim?",
        a: "Sitemizdeki ürün sayfasında \"WhatsApp'tan Sipariş Ver\" butonuna tıklayarak doğrudan bizimle iletişime geçebilirsiniz. Ürün adı, fiyatı ve stok durumu otomatik olarak mesajınızla birlikte gönderilir. Mağazamıza uğrayarak da sipariş verebilirsiniz.",
      },
      {
        q: "Ödeme seçenekleri nelerdir?",
        a: "Mağazamızda nakit ve kredi kartı ile ödeme kabul ediyoruz. WhatsApp üzerinden verdiğiniz siparişler için havale/EFT ya da kapıda ödeme seçeneklerini değerlendirebiliriz. Ödeme detaylarını sipariş onayı sırasında birlikte belirliyoruz.",
      },
      {
        q: "Sitede neden fiyat görünmüyor?",
        a: "Fiyatlarımız döviz kurları ve sezona göre değişebildiği için en güncel ve net fiyatı WhatsApp'tan paylaşmayı tercih ediyoruz. Bu sayede sürpriz farklar yaşamazsınız.",
      },
      {
        q: "Stok durumu güncel mi?",
        a: "Sitemizdeki stok bilgileri günlük olarak güncellenir. Yine de WhatsApp'ta sipariş öncesi stok teyidi almanızı öneririz, bazı popüler ürünler hızlı tükenebiliyor.",
      },
    ],
  },
  {
    title: "Kargo ve Teslimat",
    items: [
      {
        q: "Türkiye'nin her yerine kargo yapıyor musunuz?",
        a: "Evet. Anlaşmalı kargo firmalarımızla Türkiye'nin tüm illerine gönderim yapıyoruz. Hassas ve büyük ebatlı ürünlerde uygun firmayı sipariş sırasında birlikte belirliyoruz.",
      },
      {
        q: "Siparişim ne kadar sürede elime ulaşır?",
        a: "Ödemesi onaylanan siparişler aynı gün veya en geç ertesi iş günü kargoya verilir. Şehir içi 1, diğer iller 1–3 iş günü içinde teslim edilir. Detaylı bilgi için Teslimat sayfamızı inceleyin.",
      },
      {
        q: "Kargo ücretini kim karşılıyor?",
        a: "Kargo ücreti ürünün hacmine, ağırlığına ve gönderildiği şehre göre değişir. Sipariş sırasında size net tutarı bildiriyoruz. Mağazadan teslim alımda kargo ücreti yoktur.",
      },
      {
        q: "Trabzon içinde aynı gün teslim mümkün mü?",
        a: "Trabzon şehir merkezindeyseniz mağazadan elden teslim alabilir veya aynı gün motokurye ile gönderim için bizimle WhatsApp'tan iletişime geçebilirsiniz.",
      },
    ],
  },
  {
    title: "Ürünler ve Garanti",
    items: [
      {
        q: "Ürünleriniz orijinal mi?",
        a: "Tüm ürünlerimiz orijinaldir; doğrudan üretici veya yetkili distribütörlerden tedarik edilir. Faturalı satış yapıyoruz ve marka garantisi geçerlidir.",
      },
      {
        q: "Hangi marka için ne kadar garanti veriyorsunuz?",
        a: "Garanti süresi markaya ve ürün kategorisine göre değişir; çoğu elektronikli üründe 2 yıl üretici garantisi vardır. Çadır, sırt çantası ve kamp ekipmanlarında üretici hatasına karşı koruma sağlanır. Detaylar ürün sayfasında belirtilir.",
      },
      {
        q: "Hangi ürünü almam gerektiğine emin değilim, yardımcı olur musunuz?",
        a: "Tabii. WhatsApp'tan ne için kullanacağınızı anlatmanız yeterli. Karadeniz koşullarına uygun, bütçenize ve kullanım amacınıza en yakın ürünü birlikte belirleriz.",
      },
    ],
  },
  {
    title: "İade ve Değişim",
    items: [
      {
        q: "Ürünü iade edebilir miyim?",
        a: "Mesafeli satış mevzuatı kapsamındaki cayma hakkınız saklıdır. Kullanılmamış, ambalajı bozulmamış ürünleri teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Detaylar Mağaza Politikası sayfamızda yer alır.",
      },
      {
        q: "Beden veya model değişimi yapıyor musunuz?",
        a: "Evet. Kullanılmamış ve etiketleri sökülmemiş ürünlerde 14 gün içinde değişim yapıyoruz. Mağazadan elden değişim ücretsizdir; kargolu değişimde gidiş-dönüş kargo ücreti müşteriye aittir (üretim hatası hariç).",
      },
      {
        q: "Hijyen ürünlerinde iade var mı?",
        a: "Hijyen gereği iç çamaşırı niteliğindeki ürünler, ambalajı açılmış olta misinası gibi tek kullanımlık ürünler ve özel olarak sipariş üzerine getirtilmiş ürünler iade kapsamında değildir.",
      },
    ],
  },
  {
    title: "Mağaza Hakkında",
    items: [
      {
        q: "Mağazanız nerede?",
        a: "Mağazamız Trabzon merkezde, Cumhuriyet Mahallesi'nde yer alıyor. Yol tarifi için İletişim sayfamızdaki haritayı kullanabilirsiniz.",
      },
      {
        q: "Çalışma saatleriniz nedir?",
        a: "Pazartesi'den Cumartesi'ye 09:00 – 19:00 arası açığız. Pazar günleri ve resmî tatillerde mağaza kapalıdır; ancak WhatsApp mesajlarınıza dönüş yapabiliriz.",
      },
      {
        q: "Kaç yıldır faaliyettesiniz?",
        a: "1995'ten bu yana Trabzon'da kamp ve balık malzemeleri satışı yapıyoruz. Tecrübemiz, hem ürün seçimimize hem de tavsiyelerimize yansır.",
      },
    ],
  },
];

export default function FAQ() {
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const [open, setOpen] = useState<string | null>("0-0");

  const allFaqs = faqSections.flatMap(s => s.items.map(i => ({ question: i.q, answer: i.a })));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sık Sorulan Sorular — Sipariş, Kargo, Ödeme"
        description="Sarıçam Aydoğan'a en çok sorulan sorular: sipariş, kargo, ödeme, iade, garanti ve mağaza ile ilgili tüm cevaplar tek sayfada."
        url="/sss"
        keywords="sık sorulan sorular, kamp malzemeleri sipariş, kargo, iade, ödeme, Sarıçam Aydoğan SSS"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildFAQSchema(allFaqs))}</script>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "Sık Sorulan Sorular", url: "/sss" },
          ])
        )}</script>
      </Helmet>

      <PageHero
        eyebrow="Yardım Merkezi"
        icon={HelpCircle}
        title="Sık Sorulan Sorular"
        subtitle="Sipariş, kargo, ödeme ve iade hakkında en çok merak edilen konuları sizin için derledik. Aradığınızı bulamazsanız WhatsApp'tan yazmanız yeterli."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Sık Sorulan Sorular" },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-4xl">
          {faqSections.map((section, sIdx) => (
            <div key={sIdx} className={cn("mb-10", sIdx === 0 && "mt-0")}>
              <SectionHeading title={section.title} />

              <div className="space-y-3">
                {section.items.map((item, iIdx) => {
                  const id = `${sIdx}-${iIdx}`;
                  const isOpen = open === id;
                  return (
                    <div
                      key={id}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-secondary/30 transition-colors"
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                      >
                        <h3 className="font-serif text-base md:text-lg font-semibold text-foreground">
                          {item.q}
                        </h3>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300",
                            isOpen && "rotate-180 text-secondary"
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 md:px-6 pb-5 md:pb-6 -mt-1 text-muted-foreground leading-relaxed">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-16 bg-muted/40 border border-border rounded-2xl p-8 md:p-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Cevabınızı bulamadınız mı?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              WhatsApp'tan yazmanız yeterli. Sorunuzu kişisel olarak ve mümkün olduğunca hızlı yanıtlıyoruz.
            </p>
            <a
              href={buildWhatsAppLink("Merhaba, sitede cevabını bulamadığım bir sorum var.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp'tan Sor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
