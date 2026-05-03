import { Link } from "wouter";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useT } from "@/lib/i18n";
import {
  SITE_PHONE_HUMAN,
  SITE_EMAIL,
  SITE_ADDRESS_FULL,
  SITE_HOURS_HUMAN,
} from "@/lib/schemas";

export function Footer() {
  const settings = useSiteSettings();
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const t = useT();
  const phone = settings.phone ?? SITE_PHONE_HUMAN;
  const phoneHref = `tel:${(phone ?? "").replace(/\s+/g, "")}`;
  const email = settings.email ?? SITE_EMAIL;
  const address = settings.address ?? SITE_ADDRESS_FULL;
  const hours = settings.working_hours ?? SITE_HOURS_HUMAN;
  const instagram = settings.social?.instagram;
  const facebook = settings.social?.facebook;

  return (
    <footer className="footer-surface text-white">
      {/* Top oversized brand statement */}
      <div className="container mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-16">
        <div className="max-w-5xl">
          <span className="inline-flex items-center gap-2.5 mb-8 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-secondary">
            <span className="w-6 h-px bg-secondary" />
            Sarıçam Aydoğan
          </span>
          <h2 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            {t("footer.brandLine")}<br />
            <em className="italic text-white/70">{t("footer.brandLineEm")}</em>
          </h2>
          <a
            href={buildWhatsAppLink(t("cta.contactWa"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-amber btn-cta mt-12 !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]"
          >
            {t("footer.cta")}
          </a>
        </div>
      </div>

      {/* Hairline */}
      <div className="container mx-auto px-6 md:px-10">
        <div className="h-px bg-white/12" />
      </div>

      {/* Columns */}
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14">

          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/45 mb-6">{t("footer.col.discover")}</h3>
            <ul className="space-y-3.5">
              {[
                { name: t("nav.home"), href: "/" },
                { name: t("nav.products"), href: "/urunler" },
                { name: t("nav.about"), href: "/hakkimizda" },
                { name: t("nav.contact"), href: "/iletisim" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-secondary text-sm font-light transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/45 mb-6">{t("footer.col.categories")}</h3>
            <ul className="space-y-3.5">
              {[
                { name: t("cat.tents"), href: "/urunler/cadirlar" },
                { name: t("cat.fishing"), href: "/urunler/olta-ve-makine" },
                { name: t("cat.camp"), href: "/urunler/kamp-aksesuarlari" },
                { name: t("cat.lighting"), href: "/urunler/aydinlatma" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-secondary text-sm font-light transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/45 mb-6">{t("footer.col.corporate")}</h3>
            <ul className="space-y-3.5">
              {[
                { name: t("footer.faq"), href: "/sss" },
                { name: t("footer.shipping"), href: "/teslimat" },
                { name: t("footer.policy"), href: "/magaza-politikasi" },
                { name: t("footer.privacy"), href: "/kvkk" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-secondary text-sm font-light transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/45 mb-6">{t("footer.col.contact")}</h3>
            <ul className="space-y-4 text-sm font-light">
              <li className="text-white/70 leading-relaxed">{address}</li>
              <li>
                <a href={phoneHref} className="text-white/70 hover:text-secondary transition-colors">{phone}</a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="text-white/70 hover:text-secondary transition-colors">{email}</a>
              </li>
              <li className="text-white/55 italic">{hours}</li>
            </ul>

            <div className="flex items-center gap-5 mt-8">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-secondary text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-colors">
                  Instagram
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-secondary text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-colors">
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline + copyright */}
      <div className="container mx-auto px-6 md:px-10">
        <div className="h-px bg-white/12" />
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-white/35">
          <p>© {new Date().getFullYear()} Sarıçam Aydoğan</p>
          <p className="italic normal-case tracking-normal text-white/40 font-serif text-sm">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
