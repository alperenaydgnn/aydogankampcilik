import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, MessageCircle, Navigation, Store, Send,
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

  // OpenStreetMap embed centered on store coordinates
  const mapBbox = `${SITE_GEO.lng - 0.012},${SITE_GEO.lat - 0.006},${SITE_GEO.lng + 0.012},${SITE_GEO.lat + 0.006}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${SITE_GEO.lat},${SITE_GEO.lng}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${SITE_GEO.lat},${SITE_GEO.lng}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="İletişim — Trabzon Kamp & Balık Mağazası"
        description="Sarıçam Aydoğan'a Trabzon merkezde mağaza adresimizden, telefondan veya WhatsApp üzerinden ulaşabilirsiniz. Çalışma saatleri, harita ve yol tarifi."
        url="/iletisim"
        keywords="Sarıçam Aydoğan iletişim, Trabzon kamp mağazası adres, balık malzemeleri Trabzon telefon, WhatsApp sipariş"
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
        title="Bize Ulaşın"
        subtitle="Mağazamıza uğrayın, çayımızı için ya da WhatsApp üzerinden hızlıca yazın. Doğru ürünü bulmanızda size yardımcı olalım."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />

      {/* Quick contact tiles */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp",
                value: phone,
                cta: "WhatsApp'tan yaz",
                href: buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum."),
                color: "bg-[#25D366]",
                external: true,
                ariaLabel: `WhatsApp üzerinden ${phone} numarasına yaz`,
              },
              {
                icon: Phone,
                title: "Telefon",
                value: phone,
                cta: "Hemen ara",
                href: phoneHref,
                color: "bg-secondary",
                external: false,
                ariaLabel: `${phone} numarasını ara`,
              },
              {
                icon: Mail,
                title: "E-posta",
                value: email,
                cta: "Mail gönder",
                href: `mailto:${email}`,
                color: "bg-primary",
                external: false,
                ariaLabel: `${email} adresine e-posta gönder`,
              },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                aria-label={item.ariaLabel}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:border-secondary/40 transition-all duration-300"
              >
                <div className={`inline-flex w-12 h-12 ${item.color} rounded-xl items-center justify-center mb-5 text-white`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 break-all">{item.value}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary group-hover:gap-2.5 transition-all">
                  {item.cta}
                  <Send className="w-3.5 h-3.5" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Map + store info */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4">
          <SectionHeading
            eyebrow="Mağazamız"
            title="Trabzon'da Bizi Ziyaret Edin"
            subtitle="Mağazamızda ürünleri inceleyebilir, yıllarca dayanacak doğru ekipman seçimi için danışabilirsiniz."
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* Map */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border shadow-sm bg-card">
              <iframe
                title="Sarıçam Aydoğan Mağaza Konumu — Trabzon"
                src={mapSrc}
                className="w-full h-[400px] lg:h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Info panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Adres</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Çalışma Saatleri</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{hours}</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">
                      Resmî tatillerde mağaza kapalıdır. WhatsApp'tan yazabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Mağazada Ne Yapabilirsiniz?</h4>
                    <ul className="text-muted-foreground text-sm leading-relaxed space-y-1 list-disc list-inside">
                      <li>Ürünleri elden inceleyin</li>
                      <li>Av ve kamp planınız için danışın</li>
                      <li>Karadeniz'e özgü tavsiyeler alın</li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Google Haritalar üzerinden ${address} adresine yol tarifi al`}
                className="btn-cta-amber btn-cta w-full justify-center inline-flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Yol Tarifi Al
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Hızlı Yardım mı Lazım?
            </h2>
            <p className="text-primary-foreground/75 text-base md:text-lg mb-7 max-w-2xl mx-auto">
              Bir ürün hakkında soru, stok durumu veya kargo bilgisi için en pratik yol WhatsApp.
              Genellikle dakikalar içinde dönüş yapıyoruz.
            </p>
            <a
              href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp'tan Yaz
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
