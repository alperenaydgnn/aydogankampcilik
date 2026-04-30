import { Link, useLocation } from "wouter";
import { Trees, Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Tüm Ürünler", href: "/urunler" },
    { name: "Hakkımızda", href: "/hakkimizda" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50 relative group">
          <Trees className={`w-8 h-8 transition-colors ${isScrolled ? 'text-primary' : 'text-primary md:text-primary-foreground'}`} />
          <span className={`font-serif text-xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-foreground' : 'text-foreground md:text-primary-foreground'}`}>
            Sarıçam Aydoğan
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="relative group overflow-hidden block">
                  <span className={`text-sm font-medium transition-colors ${
                    location === link.href 
                      ? (isScrolled ? 'text-primary' : 'text-primary md:text-primary-foreground/90')
                      : (isScrolled ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground md:text-primary-foreground/70 md:hover:text-primary-foreground')
                  }`}>
                    {link.name}
                  </span>
                  {location === link.href && (
                    <motion.div 
                      layoutId="underline"
                      className={`absolute bottom-0 left-0 h-[2px] w-full ${isScrolled ? 'bg-primary' : 'bg-primary md:bg-primary-foreground'}`} 
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <Button 
            className="rounded-full gap-2 font-medium bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105"
            onClick={() => window.open(buildWhatsAppLink('Merhaba, ürünleriniz hakkında bilgi almak istiyorum.'), '_blank')}
          >
            <Phone className="w-4 h-4" />
            <span>Bize Ulaşın</span>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden z-50 relative p-2 -mr-2 ${isScrolled || isMobileMenuOpen ? 'text-foreground' : 'text-foreground'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background z-40 pt-24 px-6 flex flex-col h-[100dvh]"
            >
              <ul className="flex flex-col gap-6 text-2xl font-serif">
                {navLinks.map((link) => (
                  <motion.li 
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={location === link.href ? "text-primary" : "text-muted-foreground"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-auto pb-12">
                <Button 
                  className="w-full rounded-full gap-2 py-6 text-lg bg-[#25D366] hover:bg-[#20bd5a] text-white"
                  onClick={() => {
                    window.open(buildWhatsAppLink('Merhaba, ürünleriniz hakkında bilgi almak istiyorum.'), '_blank');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <span>WhatsApp'tan Ulaşın</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
