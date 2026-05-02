import { Link } from "wouter";
import { Trees, MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, Clock } from "lucide-react";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function Footer() {
  const settings = useSiteSettings();
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const phone = settings.phone ?? "+90 555 111 22 33";
  const phoneHref = `tel:${(phone ?? "").replace(/\s+/g, "")}`;
  const email = settings.email ?? "bilgi@saricamaydogan.com";
  const address = settings.address ?? "Atatürk Cad. No:123 Merkez / Trabzon";
  const hours = settings.working_hours ?? "Pzt – Cmt: 09:00 – 19:30";
  const instagram = settings.social?.instagram;
  const facebook = settings.social?.facebook;

  return (
    <footer className="footer-surface text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-white/8 group-hover:bg-secondary/20 transition-colors">
                <Trees className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">Sarıçam Aydoğan</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Karadeniz'in zorlu doğa koşullarına dayanıklı, uzun ömürlü kamp ve balıkçılık ekipmanları. Yılların tecrübesiyle özenle seçilmiş ürünler.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={buildWhatsAppLink("Merhaba, yardım almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold mb-5 text-primary-foreground/90">Hızlı Bağlantılar</h3>
            <ul className="space-y-2.5">
              {[
                { name: "Anasayfa", href: "/" },
                { name: "Tüm Ürünler", href: "/urunler" },
                { name: "Hakkımızda", href: "/hakkimizda" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-primary-foreground/55 hover:text-secondary text-sm transition-colors duration-150 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold mb-5 text-primary-foreground/90">Kategoriler</h3>
            <ul className="space-y-2.5">
              {[
                { name: "Çadırlar", href: "/urunler/cadirlar" },
                { name: "Olta & Makine", href: "/urunler/olta-ve-makine" },
                { name: "Kamp Aksesuarları", href: "/urunler/kamp-aksesuarlari" },
                { name: "Aydınlatma", href: "/urunler/aydinlatma" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-primary-foreground/55 hover:text-secondary text-sm transition-colors duration-150 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold mb-5 text-primary-foreground/90">İletişim</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/60 text-sm leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href={phoneHref} className="text-primary-foreground/60 text-sm hover:text-secondary transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href={`mailto:${email}`} className="text-primary-foreground/60 text-sm hover:text-secondary transition-colors">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-secondary shrink-0" />
                <div>
                  <p className="text-primary-foreground/60 text-sm">{hours}</p>
                </div>
              </li>
            </ul>

            <a
              href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-sm font-semibold transition-all duration-200 border border-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp'tan Yaz
            </a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/35 text-xs">
            © {new Date().getFullYear()} Sarıçam Aydoğan Kamp ve Balık Malzemeleri. Tüm hakları saklıdır.
          </p>
          <p className="text-primary-foreground/25 text-xs">
            Trabzon — Doğanın Kalbinde
          </p>
        </div>
      </div>
    </footer>
  );
}
