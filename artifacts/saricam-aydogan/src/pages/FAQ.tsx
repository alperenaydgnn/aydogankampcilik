import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
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
  italicAccent?: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Sipariş ve",
    italicAccent: "ödeme.",
    items: [
      {
        q: "Nasıl sipariş verebilirim?",
        a: 'Sitemizdeki ürün sayfasında "WhatsApp\'tan Sipariş Ver" butonuna tıklayarak doğrudan bizimle iletişime geçebilirsiniz. Ürün adı, fiyatı ve stok durumu otomatik olarak mesajınızla birlikte gönderilir. Mağazamıza uğrayarak da sipariş verebilirsiniz.',
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
    title: "Kargo ve",
    italicAccent: "teslimat.",
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
        q: "Adana'da aynı gün teslim mümkün mü?",
        a: "Adana şehir merkezindeyseniz mağazadan elden teslim alabilir veya bizimle WhatsApp'tan iletişime geçebilirsiniz.",
      },
    ],
  },
  {
    title: "Ürünler ve",
    italicAccent: "garanti.",
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
        a: "Tabii. WhatsApp'tan ne için kullanacağınızı anlatmanız yeterli. Adana ve Toros koşullarına uygun, bütçenize ve kullanım amacınıza en yakın ürünü birlikte belirleriz.",
      },
    ],
  },
  {
    title: "İade ve",
    italicAccent: "değişim.",
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
    title: "Mağaza",
    italicAccent: "hakkında.",
    items: [
      {
        q: "Mağazanız nerede?",
        a: "Mağazamız Adana Sarıçam ilçesinde yer alıyor. Yol tarifi için İletişim sayfamızdaki haritayı kullanabilirsiniz.",
      },
      {
        q: "Çalışma saatleriniz nedir?",
        a: "Haftanın her günü 09:00 – 20:00 arası açığız.",
      },
      {
        q: "Kaç yıldır faaliyettesiniz?",
        a: "1995'ten bu yana Adana Sarıçam'da kamp ve balık malzemeleri satışı yapıyoruz. Tecrübemiz, hem ürün seçimimize hem de tavsiyelerimize yansır.",
      },
    ],
  },
];

export default function FAQ() {
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const [open, setOpen] = useState<string | null>("0-0");

  const allFaqs = faqSections.flatMap((s) =>
    s.items.map((i) => ({ question: i.q, answer: i.a })),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sık Sorulan Sorular — Sipariş, Kargo, Ödeme"
        description="Aydoğan Kampçılık'a en çok sorulan sorular: sipariş, kargo, ödeme, iade, garanti ve mağaza ile ilgili tüm cevaplar tek sayfada."
        url="/sss"
        keywords="sık sorulan sorular, kamp malzemeleri sipariş, kargo, iade, ödeme, Aydoğan Kampçılık SSS"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(buildFAQSchema(allFaqs))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbSchema([
              { name: "Ana Sayfa", url: "/" },
              { name: "Sık Sorulan Sorular", url: "/sss" },
            ]),
          )}
        </script>
      </Helmet>

      <PageHero
        eyebrow="Yardım Merkezi"
        icon={HelpCircle}
        title="Sık sorulan"
        italicAccent="sorular."
        subtitle="Sipariş, kargo, ödeme ve iade hakkında en çok merak edilen konuları sizin için derledik. Aradığınızı bulamazsanız WhatsApp'tan yazmanız yeterli."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Sık Sorulan Sorular" },
        ]}
      />

      <section className="section">
        <div className="container px-6 max-w-4xl">
          {faqSections.map((section, sIdx) => (
            <div key={sIdx} className={cn(sIdx > 0 && "mt-24 md:mt-32")}>
              <SectionHeading
                title={section.title}
                italicAccent={section.italicAccent}
              />

              <div className="border-t border-border/60">
                {section.items.map((item, iIdx) => {
                  const id = `${sIdx}-${iIdx}`;
                  const isOpen = open === id;
                  return (
                    <div key={id} className="border-b border-border/60">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left group"
                      >
                        <h3 className="font-serif font-light text-lg md:text-xl text-foreground tracking-tight pr-4">
                          {item.q}
                        </h3>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-foreground/40 shrink-0 transition-transform duration-300 group-hover:text-secondary",
                            isOpen && "rotate-180 text-secondary",
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="pb-7 md:pb-8 -mt-1 text-foreground/65 leading-relaxed font-light max-w-3xl">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — Dark editorial band */}
      <section className="section-sm bg-[#111111] text-white">
        <div className="container px-6 max-w-4xl text-center">
          <span className="eyebrow justify-center text-secondary">
            Hâlâ sorunuz mu var
          </span>
          <h2 className="editorial-heading text-4xl md:text-5xl lg:text-6xl text-white mb-8">
            Cevabınızı bulamadınız mı.
            <br />
            <em className="italic font-light text-white/70">Yazın yeter.</em>
          </h2>
          <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
            WhatsApp'tan ulaşın. Sorunuzu kişisel olarak ve mümkün olduğunca
            hızlı yanıtlıyoruz.
          </p>
          <a
            href={buildWhatsAppLink(
              "Merhaba, sitede cevabını bulamadığım bir sorum var.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="link-hairline text-white border-white/40 hover:text-secondary"
          >
            WhatsApp'tan Sor
            <span className="text-base">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
