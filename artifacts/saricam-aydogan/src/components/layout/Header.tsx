import { Link, useLocation } from "wouter";
import { Menu, X, Instagram, ShoppingBag, Heart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/SearchOverlay";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n";

function IconButton({
  onClick, ariaLabel, onDark, badge, children,
}: { onClick: () => void; ariaLabel: string; onDark: boolean; badge?: number; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ease-out hover:scale-105",
        onDark
          ? "border-white/30 text-white/85 hover:text-white hover:border-white/70 hover:bg-white/10"
          : "border-foreground/15 text-foreground/70 hover:text-secondary hover:border-secondary/60 hover:bg-secondary/5"
      )}
    >
      {children}
      {badge && badge > 0 ? (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-white text-[0.6rem] font-bold flex items-center justify-center leading-none">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </button>
  );
}

function SearchButton({ onDark, onClick }: { onDark: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <IconButton onClick={onClick} ariaLabel={t("header.search")} onDark={onDark}>
      <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
    </IconButton>
  );
}

function WishlistButton({ onDark }: { onDark: boolean }) {
  const { count } = useWishlist();
  const [, setLocation] = useLocation();
  const t = useT();
  return (
    <IconButton
      onClick={() => { setLocation("/favoriler"); trackEvent({ event: "wishlist_open", source: "header", item_count: count }); }}
      ariaLabel={`${t("header.wishlist")} (${count})`}
      onDark={onDark}
      badge={count}
    >
      <Heart className={cn("w-[18px] h-[18px]", count > 0 && "fill-secondary text-secondary")} strokeWidth={1.75} />
    </IconButton>
  );
}

function CartButton({ onDark }: { onDark: boolean }) {
  const { count, open } = useCart();
  const [bump, setBump] = useState(0);
  const t = useT();
  useEffect(() => {
    if (count === 0) return;
    setBump(b => b + 1);
  }, [count]);
  return (
    <button
      onClick={() => { open(); trackEvent({ event: "cart_open", source: "header", item_count: count }); }}
      aria-label={`${t("header.cart")} (${count})`}
      className={cn(
        "relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ease-out hover:scale-105",
        onDark
          ? "border-white/30 text-white/85 hover:text-white hover:border-white/70 hover:bg-white/10"
          : "border-foreground/15 text-foreground/70 hover:text-secondary hover:border-secondary/60 hover:bg-secondary/5"
      )}
    >
      <motion.span
        key={bump}
        initial={{ scale: 1 }}
        animate={{ scale: bump > 0 ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.4 }}
        className="inline-flex"
      >
        <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
      </motion.span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-white text-[0.6rem] font-bold flex items-center justify-center leading-none"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

const navLinkDefs = [
  { key: "nav.home" as const, href: "/" },
  { key: "nav.products" as const, href: "/urunler" },
  { key: "nav.blog" as const, href: "/blog" },
  { key: "nav.map" as const, href: "/harita" },
  { key: "nav.about" as const, href: "/hakkimizda" },
  { key: "nav.contact" as const, href: "/iletisim" },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const buildWhatsAppLink = useBuildWhatsAppLink();
  const t = useT();
  const navLinks = navLinkDefs.map(l => ({ ...l, name: t(l.key) }));

  useEffect(() => {
    const onOpen = () => setSearchOpen(true);
    document.addEventListener("open-search", onOpen);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("open-search", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

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
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.slice(0, 4).map((link) => {
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
            Aydoğan Kampçılık<span className="italic text-secondary">.</span>
          </span>
        </Link>

        {/* Right — Desktop nav + CTA */}
        <div className="hidden lg:flex items-center justify-end gap-4">
          {navLinks.slice(4).map((link) => {
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
            href={buildWhatsAppLink(t("cta.contactWa"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-amber btn-cta !py-2 !px-5 !text-[0.7rem] !font-bold !uppercase !tracking-[0.18em]"
          >
            {t("header.cta")}
          </a>

          <LanguageSwitcher onDark={onDark} />

          <a
            href="https://www.instagram.com/aydogankamcilik/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("header.instagram")}
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

          <SearchButton onDark={onDark} onClick={() => setSearchOpen(true)} />
          <WishlistButton onDark={onDark} />
          <CartButton onDark={onDark} />
        </div>

        {/* Mobile right cluster — cart + menu toggle */}
        <div className="flex items-center gap-2 justify-self-end lg:hidden">
          <SearchButton onDark={onDark} onClick={() => setSearchOpen(true)} />
          <WishlistButton onDark={onDark} />
          <CartButton onDark={onDark} />
        <button
          className={cn(
            "relative z-50 p-2 -mr-2 transition-colors",
            onDark ? "text-white" : "text-foreground"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t("header.menu")}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-overlay"
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
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              id="mobile-menu-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={t("header.menu")}
              className="fixed inset-0 bg-background z-40 flex flex-col"
            >
              <div className="h-24" />
              <div className="px-8 pt-6">
                <LanguageSwitcher onDark={false} />
              </div>
              <nav className="flex-1 px-8 pt-6">
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
                  href={buildWhatsAppLink(t("cta.contactWa"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="btn-cta-amber btn-cta w-full justify-center"
                >
                  {t("mobile.whatsapp")}
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
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
