import { Link } from "wouter";
import { Trees, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary-border/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Trees className="w-8 h-8 text-secondary" />
              <span className="font-serif text-xl font-bold tracking-tight">Sarıçam Aydoğan</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Karadeniz'in zorlu doğa koşullarına dayanıklı, uzun ömürlü kamp ve balıkçılık ekipmanları. Doğayla iç içe geçen yılların tecrübesiyle seçilmiş ürünler.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/urunler" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Kategoriler</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/urunler/cadirlar" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Çadırlar
                </Link>
              </li>
              <li>
                <Link href="/urunler/olta-ve-makine" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Olta & Makine
                </Link>
              </li>
              <li>
                <Link href="/urunler/kamp-aksesuarlari" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Kamp Aksesuarları
                </Link>
              </li>
              <li>
                <Link href="/urunler/aydinlatma" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Aydınlatma
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm">Atatürk Cad. No:123 Merkez / Trabzon</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-sm">+90 555 111 22 33</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-sm">bilgi@saricamaydogan.com</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-primary-foreground/5 rounded-lg border border-primary-foreground/10">
              <p className="text-sm font-medium mb-1">Çalışma Saatleri</p>
              <p className="text-xs text-primary-foreground/70">Pzt - Cmt: 09:00 - 19:30</p>
              <p className="text-xs text-primary-foreground/70">Pazar: Kapalı</p>
            </div>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Sarıçam Aydoğan Kamp ve Balık. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
