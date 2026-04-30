import { Link, useLocation } from "wouter";
import { Trees, Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Anasayfa", href: "/" },
  { name: "Tüm Ürünler", href: "/urunler" },
  { name: "Hakkımızda", href: "/hakkimizda" },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "nav-scrolled py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center gap-2.5 group">
          <div className={cn(
            "p-1.5 rounded-xl transition-colors duration-300",
            isScrolled ? "bg-primary/10" : "bg-white/10"
          )}>
            <Trees className={cn(
              "w-6 h-6 transition-colors duration-300",
              isScrolled ? "text-primary" : "text-white"
            )} />
          </div>
          <span className={cn(
            "font-serif text-[1.1rem] font-bold tracking-tight transition-colors duration-300",
            isScrolled ? "text-foreground" : "text-white"
          )}>
            Sarıçam Aydoğan
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isScrolled
                        ? isActive
                          ? "text-primary bg-primary/8"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        : isActive
                          ? "text-white bg-white/15"
                          : "text-white/75 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className={cn(
                          "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                          isScrolled ? "bg-secondary" : "bg-white/70"
                        )}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <a
            href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-amber btn-cta !py-2.5 !px-5 !text-sm flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Bize Ulaşın
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className={cn(
            "relative z-50 md:hidden p-2 rounded-xl transition-colors",
            isMobileMenuOpen
              ? "bg-foreground/10 text-foreground"
              : isScrolled
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/15"
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
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-background z-40 flex flex-col"
            >
              {/* Top spacer */}
              <div className="h-20" />

              <nav className="flex-1 px-6 pt-8">
                <ul className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-xl text-lg font-serif font-bold transition-colors",
                          location === link.href
                            ? "text-primary bg-primary/8"
                            : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="p-6 pb-safe-or-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <a
                  href={buildWhatsAppLink("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="btn-cta-amber btn-cta w-full justify-center flex gap-2"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp'tan Ulaşın
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
