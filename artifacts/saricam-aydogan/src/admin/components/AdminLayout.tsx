import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Trees, Package, Tag, LogOut, Menu, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "@/admin/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Ürünler", href: "/admin/urunler", icon: Package },
  { label: "Kategoriler", href: "/admin/kategoriler", icon: Tag },
  { label: "Anasayfa Görselleri", href: "/admin/anasayfa", icon: ImageIcon },
];

function NavLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const [location] = useLocation();
  const active = location === href || location.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {label}
    </Link>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:z-auto"
        )}
      >
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <Trees className="w-7 h-7 text-primary" />
          <div className="min-w-0">
            <p className="font-serif font-bold text-sm leading-tight truncate">Aydoğan Kampçılık</p>
            <p className="text-xs text-muted-foreground">Admin Paneli</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <Trees className="w-4 h-4" />
              Siteyi Görüntüle
            </Button>
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-background border-b border-border sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-1 rounded-lg hover:bg-muted"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-primary" />
            <span className="font-serif font-bold text-sm">Admin Paneli</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
