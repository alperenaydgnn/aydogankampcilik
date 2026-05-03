import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, MessageCircle, Navigation, Store,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import {
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
  SITE_GEO,
  SITE_PHONE_HUMAN,
  SITE_EMAIL,
  SITE_ADDRESS_FULL,
  SITE_HOURS_HUMAN,
} from "@/lib/schemas";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export default function Contact() {
  const settings = useSiteSettings();
  const buildWhatsAppLink = useBuildWhatsAppLink();

  const phone = settings.phone || SITE_PHONE_HUMAN;
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const email = settings.email || SITE_EMAIL;
  const address = settings.address || SITE_ADDRESS_FULL;
  const hours = settings.working_hours || SITE_HOURS_HUMAN;

  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d398.1262334465161!2d35.42229806811702!3d37.033411068169094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1528930c59682bf9%3A0xb0bef0c68035282!2sAydo%C4%9Fan%20Kamp%20Ve%20Bal%C4%B1k%20Malzemeleri!5e0!3m2!1str!2str!4v1777825568723!5m2!1str!2str";
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${SITE_GEO.lat},${SITE_GEO.lng}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="İletişim — Adana Sarıçam Kamp & Balık Mağazası"
        description="Aydoğan Kampçılık'a Adana Sarıçam'daki mağaza adresimizden, telefondan veya WhatsApp üzerinden ulaşabilirsiniz. Çalışma saatleri, harita ve yol tarifi."
        url="/iletisim"
        keywords="Aydoğan Kampçılık iletişim, Adana kamp mağazası adres, balık malzemeleri Adana telefon, WhatsApp sipariş"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildLocalBusinessSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(
          buildBreadcrumbSchema([
            { name: "Ana Sayfa", url: "/" },
            { name: "İletişim", url: "/iletisim" },
          ])
        )}</script>
      </Helmet>

      <PageHero
        eyebrow="İletişim"
        icon={Phone}
        title="Bize"
        italicAccent="ulaşın."
        subtitle="Mağazamıza uğrayın, çayımızı için ya da WhatsApp üzerinden hızlıca yazın. Doğru ürünü bulmanızda size yardımcı olalım."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />

      {/* Quick contact tiles — three editorial channels */}
      <section className="section">
        <div className="container px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                num: "01",
                label: "WhatsApp",
                value: phone,
                cta: "WhatsApp'tan Yaz",
                href: buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum."),
                external: true,
                ariaLabel: `WhatsApp üzerinden ${phone} numarasına yaz`,
              },
              {
                num: "02",
                label: "Telefon",
                value: phone,
                cta: "Hemen Ara",
                href: phoneHref,
                external: false,
                ariaLabel: `${phone} numarasını ara`,
              },
              {
                num: "03",
                label: "E-posta",
                value: email,
                cta: "Mail Gönder",
                href: `mailto:${email}`,
                external: false,
                ariaLabel: `${email} adresine e-posta gönder`,
              },
            ].map((item, idx) => (
              <motion.a
                key={item.num}
                href={item.href}
                aria-label={item.ariaLabel}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                className="group block border-t border-foreground/15 pt-8 hover:border-secondary/60 transition-colors"
              >
                <span className="font-serif font-light text-5xl text-secondary leading-none">{item.num}</span>
                <h3 className="font-serif font-light text-2xl mt-5 mb-3 tracking-tight text-foreground">
                  {item.label}
                </h3>
                <p className="text-foreground/55 text-sm font-light mb-8 break-all">{item.value}</p>
                <span className="link-hairline text-foreground group-hover:text-secondary">
                  {item.cta}
                  <span className="text-base">→</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Map + store info */}
      <section className="section bg-muted/30">
        <div className="container px-6">
          <SectionHeading
            eyebrow="Mağazamız"
            title="Adana Sarıçam'da bizi"
            italicAccent="ziyaret edin."
            subtitle="Mağazamızda ürünleri inceleyebilir, yıllarca dayanacak doğru ekipman seçimi için danışabilirsiniz."
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
            {/* Map */}
            <div className="lg:col-span-3 overflow-hidden border border-foreground/15">
              <iframe
                title="Aydoğan Kampçılık Mağaza Konumu — Adana"
                src={mapSrc}
                className="w-full h-[420px] lg:h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Info panel */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-8">
              <div className="space-y-10">
                <div className="border-t border-foreground/15 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-4 h-4 text-secondary" strokeWidth={1.4} />
                    <span className="eyebrow !mb-0">Adres</span>
                  </div>
                  <p className="font-serif font-light text-xl md:text-2xl text-foreground tracking-tight leading-snug">{address}</p>
                </div>

                <div className="border-t border-foreground/15 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-4 h-4 text-secondary" strokeWidth={1.4} />
                    <span className="eyebrow !mb-0">Çalışma Saatleri</span>
                  </div>
                  <p className="font-serif font-light text-xl md:text-2xl text-foreground tracking-tight leading-snug">{hours}</p>
                  <p className="text-foreground/55 text-sm mt-3 font-light">
                    Resmî tatillerde mağaza kapalıdır. WhatsApp'tan yazabilirsiniz.
                  </p>
                </div>

                <div className="border-t border-foreground/15 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="w-4 h-4 text-secondary" strokeWidth={1.4} />
                    <span className="eyebrow !mb-0">Mağazada Ne Yapabilirsiniz</span>
                  </div>
                  <ul className="space-y-2 font-serif font-light text-lg text-foreground/80 leading-snug">
                    <li>— Ürünleri elden inceleyin</li>
                    <li>— Av ve kamp planınız için danışın</li>
                    <li>— Adana ve Toros'a özgü tavsiyeler alın</li>
                  </ul>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Google Haritalar üzerinden ${address} adresine yol tarifi al`}
                className="link-hairline self-start hover:text-secondary"
              >
                <Navigation className="w-3.5 h-3.5" />
                Yol Tarifi Al
                <span className="text-base">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Dark editorial band */}
      <section className="section-sm bg-[#111111] text-white">
        <div className="container px-6 max-w-4xl text-center">
          <span className="eyebrow justify-center text-secondary">Hızlı Yardım</span>
          <h2 className="editorial-heading text-4xl md:text-5xl lg:text-6xl text-white mb-8">
            Bir mesaj uzaktayız.
            <br />
            <em className="italic font-light text-white/70">Dakikalar içinde dönüyoruz.</em>
          </h2>
          <p className="text-white/55 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
            Bir ürün hakkında soru, stok durumu veya kargo bilgisi için en pratik yol WhatsApp.
          </p>
          <a
            href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="link-hairline text-white border-white/40 hover:text-secondary"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp'tan Yaz
            <span className="text-base">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
