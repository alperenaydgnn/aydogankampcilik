import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, MessageCircle, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import { trackEvent } from "@/lib/analytics";

/**
 * Mobile-only sticky bottom navigation: 4 large tap targets — Home,
 * Products, Cart (with badge), WhatsApp. Safe-area aware. Hidden on
 * md+ and on admin routes. Does NOT render in PDP-style modal flows.
 */
export function MobileBottomNav() {
  const [location] = useLocation();
  const { count, open: openCart } = useCart();
  const { whatsapp } = useSiteSettings();

  if (location.startsWith("/admin")) return null;

  const isHome = location === "/";
  const isCatalog = location === "/urunler" || location.startsWith("/urunler/");
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`
    : "/iletisim";

  return (
    <nav
      aria-label="Hızlı gezinti"
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-[55]",
        "bg-background/95 backdrop-blur-xl border-t border-foreground/10",
        "pb-[env(safe-area-inset-bottom,0px)]",
      )}
    >
      <ul className="grid grid-cols-4 h-16">
        <NavItem
          to="/"
          active={isHome}
          icon={<Home className="w-5 h-5" strokeWidth={1.6} />}
          label="Ana Sayfa"
          onTap={() => haptics.light()}
        />
        <NavItem
          to="/urunler"
          active={isCatalog}
          icon={<LayoutGrid className="w-5 h-5" strokeWidth={1.6} />}
          label="Ürünler"
          onTap={() => haptics.light()}
        />
        <li className="relative">
          <button
            type="button"
            onClick={() => { haptics.tap(); openCart(); trackEvent({ event: "cart_open", source: "bottom_nav" }); }}
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-0.5",
              "text-foreground/55 hover:text-foreground transition-colors",
              count > 0 && "text-foreground",
            )}
          >
            <span className="relative">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.6} />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-[9px] font-bold text-secondary-foreground flex items-center justify-center"
                >
                  {count > 9 ? "9+" : count}
                </motion.span>
              )}
            </span>
            <span className="text-[0.62rem] font-semibold tracking-wide uppercase">Sepet</span>
          </button>
        </li>
        <li>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              haptics.tap();
              trackEvent({ event: "whatsapp_click", source: "bottom_nav" });
            }}
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-0.5",
              "text-secondary hover:text-secondary/85 transition-colors",
            )}
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.8} />
            <span className="text-[0.62rem] font-semibold tracking-wide uppercase">WhatsApp</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function NavItem({
  to, active, icon, label, onTap,
}: {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onTap?: () => void;
}) {
  return (
    <li className="relative">
      <Link
        href={to}
        onClick={onTap}
        className={cn(
          "w-full h-full flex flex-col items-center justify-center gap-0.5",
          "transition-colors",
          active ? "text-foreground" : "text-foreground/55 hover:text-foreground",
        )}
      >
        {icon}
        <span className="text-[0.62rem] font-semibold tracking-wide uppercase">{label}</span>
        {active && (
          <motion.span
            layoutId="bottom-nav-active"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-secondary rounded-b"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
      </Link>
    </li>
  );
}
