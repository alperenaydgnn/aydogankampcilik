import { Link, useLocation } from "wouter";
import { Menu, X, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Anasayfa", href: "/" },
  { name: "Ürünler", href: "/urunler" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "İletişim", href: "/iletisim" },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const buildWhatsAppLink = useBuildWhatsAppLink();

  // Most pages besides Home have a dark hero, so default to dark-overlay header.
  // Home overrides via scroll only.
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setIsMobileMenuOpen(false);
  const onDark = !isScrolled; // header sits over dark hero on every page when not scrolled

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "nav-scrolled py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-3 items-center gap-4">

        {/* Left — Mobile Menu Toggle on small, Nav on desktop */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.slice(0, 2).map((link) => {
            const isActive = location === link.href || (link.href === "/urunler" && location.startsWith("/urunler"));
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive ? "true" : "false"}
                className={cn(
                  "nav-underline relative text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors duration-200",
                  onDark
                    ? isActive ? "text-white" : "text-white/65 hover:text-white"
                    : isActive ? "text-primary" : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Center — Logo */}
        <Link
          href="/"
          className={cn(
            "relative z-50 flex items-center justify-self-start lg:justify-self-center text-center",
          )}
        >
          <span
            className={cn(
              "font-serif font-light text-xl md:text-[1.35rem] tracking-tight transition-colors duration-300 whitespace-nowrap",
              onDark ? "text-white" : "text-primary"
            )}
          >
            Sarıçam Aydoğan<span className="italic text-secondary">.</span>
          </span>
        </Link>

        {/* Right — Desktop nav + CTA */}
        <div className="hidden lg:flex items-center justify-end gap-7">
          {navLinks.slice(2).map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive ? "true" : "false"}
                className={cn(
                  "nav-underline relative text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors duration-200",
                  onDark
                    ? isActive ? "text-white" : "text-white/65 hover:text-white"
                    : isActive ? "text-primary" : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            );
          })}

          <a
            href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-amber btn-cta !py-2 !px-5 !text-[0.7rem] !font-bold !uppercase !tracking-[0.18em]"
          >
            Bize Ulaşın
          </a>

          <a
            href="https://www.instagram.com/aydogankamcilik/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram'da takip edin"
            className={cn(
              "inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ease-out",
              "hover:scale-105 hover:-rotate-3",
              onDark
                ? "border-white/30 text-white/85 hover:text-white hover:border-white/70 hover:bg-white/10"
                : "border-foreground/15 text-foreground/70 hover:text-secondary hover:border-secondary/60 hover:bg-secondary/5"
            )}
          >
            <Instagram className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            "relative z-50 lg:hidden p-2 -mr-2 transition-colors justify-self-end",
            onDark ? "text-white" : "text-foreground"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menü"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-background z-40 flex flex-col"
            >
              <div className="h-24" />
              <nav className="flex-1 px-8 pt-12">
                <ul className="space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className={cn(
                          "block py-4 font-serif font-light text-3xl md:text-4xl tracking-tight transition-colors border-b border-foreground/10",
                          location === link.href
                            ? "text-primary"
                            : "text-foreground/60 hover:text-primary"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="p-8 pb-safe-or-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <a
                  href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="btn-cta-amber btn-cta w-full justify-center"
                >
                  WhatsApp'tan Ulaşın
                </a>

                <a
                  href="https://www.instagram.com/aydogankamcilik/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="mt-4 inline-flex items-center justify-center gap-2.5 w-full py-3 rounded-full border border-foreground/15 text-foreground/70 hover:text-secondary hover:border-secondary/60 hover:bg-secondary/5 transition-all duration-300 text-[0.7rem] font-bold uppercase tracking-[0.22em]"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.75} />
                  Instagram
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
