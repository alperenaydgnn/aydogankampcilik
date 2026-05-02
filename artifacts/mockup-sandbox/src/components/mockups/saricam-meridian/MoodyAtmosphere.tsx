import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, Instagram, MapPin, Phone } from 'lucide-react';

const CATEGORIES = [
  { name: 'Kamp Çadırları', image: '/__mockup/images/saricam/category-cadir.jpg' },
  { name: 'Olta & Balık Malzemeleri', image: '/__mockup/images/saricam/category-olta.jpg' },
  { name: 'Kamp Ekipmanları', image: '/__mockup/images/saricam/category-aksesuar.jpg' },
  { name: 'Aydınlatma', image: '/__mockup/images/saricam/category-aydinlatma.jpg' },
];

const PRODUCTS = [
  { name: 'Alpinist Pro 4 Mevsim Kamp Çadırı', price: '₺4.250', image: '/__mockup/images/saricam/product-1.jpg' },
  { name: 'Kuzey Yıldızı Uyku Tulumu (-15°C)', price: '₺1.850', image: '/__mockup/images/saricam/product-2.jpg' },
  { name: 'Trailblazer Trekking Çadırı', price: '₺2.900', image: '/__mockup/images/saricam/product-3.jpg' },
  { name: 'Premium Olta Takımı', price: '₺3.400', image: '/__mockup/images/saricam/product-4.jpg' },
  { name: 'Termos & Soğutucu Set', price: '₺1.200', image: '/__mockup/images/saricam/product-5.jpg' },
  { name: 'Survival Bıçak Seti', price: '₺850', image: '/__mockup/images/saricam/product-6.jpg' },
];

export function MoodyAtmosphere() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a3d2b] text-[#f5f0e8] font-['Plus_Jakarta_Sans'] selection:bg-[#d97706] selection:text-white">
      <style>{`
        .meridian-title {
          font-family: 'Fraunces', serif;
          letter-spacing: -0.04em;
          line-height: 0.95;
          font-weight: 300;
        }
        .glow-text {
          text-shadow: 0 0 40px rgba(245, 240, 232, 0.15);
        }
        .amber-glow {
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.15);
        }
        .image-overlay {
          background: linear-gradient(to top, #1a3d2b 0%, transparent 50%, rgba(26, 61, 43, 0.6) 100%);
        }
        .nav-blur {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .btn-amber {
          background-color: #d97706;
          color: #f5f0e8;
          transition: all 0.3s ease;
        }
        .btn-amber:hover {
          background-color: #f5f0e8;
          color: #1a3d2b;
        }
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
        .lantern-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #d97706;
          box-shadow: 0 0 8px 2px rgba(217, 119, 6, 0.5);
        }
      `}</style>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
          scrolled ? 'nav-blur bg-[#1a3d2b]/80 border-white/5 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="lantern-dot hidden md:block mr-2" />
            <span className="meridian-title text-xl tracking-tight text-[#f5f0e8]">Sarıçam Aydoğan</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-[13px] uppercase tracking-[0.1em] font-medium text-[#e8e2d4]/80">
            <a href="#" className="hover:text-[#d97706] transition-colors">Mağaza</a>
            <a href="#" className="hover:text-[#d97706] transition-colors">Kategoriler</a>
            <a href="#" className="hover:text-[#d97706] transition-colors">Hikayemiz</a>
            <a href="#" className="hover:text-[#d97706] transition-colors">İletişim</a>
          </nav>

          <button className="btn-amber rounded-full px-6 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
            Koleksiyonu Gör
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[100svh] w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/saricam/hero.jpg" 
            alt="Karadeniz Ormanı" 
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.6) contrast(1.1)' }}
          />
          <div className="absolute inset-0 image-overlay opacity-90" />
          {/* Extra dark gradient at the bottom to blend into next section */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#1a3d2b] to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-20">
          <p className="text-[#d97706] text-xs uppercase tracking-[0.2em] font-semibold mb-8 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#d97706]/50"></span>
            Trabzon • 1985'ten beri
            <span className="w-8 h-[1px] bg-[#d97706]/50"></span>
          </p>
          
          <h1 className="meridian-title text-6xl md:text-8xl lg:text-[110px] text-[#f5f0e8] mb-6 glow-text">
            Sarıçam ormanlarına.<br />
            <span className="text-[#e8e2d4]/70">Olta ışığına.</span>
          </h1>
          
          <p className="max-w-md mx-auto text-[#e8e2d4]/80 text-sm md:text-base leading-relaxed mb-12 font-light">
            Gecenin en karanlığında bile doğayla bir olmak. Karadeniz'in acımasız ama büyüleyici atmosferine uyum sağlayan ekipmanlar.
          </p>
          
          <button className="btn-amber rounded-full px-8 py-4 text-sm uppercase tracking-[0.1em] font-medium flex items-center gap-3">
            Mağazayı Keşfet
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center -mt-4 relative z-20">
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#d97706] to-transparent opacity-50"></div>
      </div>

      {/* Categories Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        <div className="flex items-center justify-between mb-16">
          <h2 className="meridian-title text-4xl md:text-5xl">Gerekli Olanlar.</h2>
          <a href="#" className="text-[#d97706] text-sm uppercase tracking-widest font-semibold hover:text-[#f5f0e8] transition-colors">Tümü</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <a href="#" key={i} className="group block relative aspect-[3/4] overflow-hidden rounded-sm hover-lift bg-[#1a1a1a]">
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
                style={{ filter: 'grayscale(0.3) contrast(1.2)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d2b]/90 via-[#1a3d2b]/20 to-transparent"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end border border-white/0 group-hover:border-[#d97706]/30 transition-colors duration-500">
                <h3 className="meridian-title text-2xl text-[#f5f0e8] mb-2">{cat.name}</h3>
                <div className="w-0 h-[1px] bg-[#d97706] group-hover:w-12 transition-all duration-500"></div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-white/5">
        <div className="text-center mb-20">
          <div className="lantern-dot mx-auto mb-6" />
          <h2 className="meridian-title text-4xl md:text-6xl mb-6">Seçkin Ekipmanlar.</h2>
          <p className="text-[#e8e2d4]/60 text-sm max-w-xl mx-auto uppercase tracking-widest">Profesyonellerin tercihi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {PRODUCTS.map((product, i) => (
            <div key={i} className="group relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-[#112a1d] mb-6 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-[#d97706]/40 transition-all duration-500 z-10 pointer-events-none"></div>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <h4 className="font-serif text-[#f5f0e8] text-lg mb-2 group-hover:text-[#d97706] transition-colors">{product.name}</h4>
                <div className="flex items-center justify-center gap-4 w-full">
                  <span className="text-[#e8e2d4]/50 text-[11px] uppercase tracking-widest">Fiyat</span>
                  <span className="text-[#d97706] font-serif text-xl">{product.price}</span>
                </div>
                <button className="mt-4 text-[11px] uppercase tracking-widest text-[#e8e2d4]/40 hover:text-[#f5f0e8] border-b border-[#e8e2d4]/20 hover:border-[#f5f0e8] pb-1 transition-all">
                  Detayları Gör
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Split */}
      <section className="py-24 bg-[#142f21]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-[3/4] rounded-sm overflow-hidden order-2 md:order-1">
            <img 
              src="/__mockup/images/saricam/hero.jpg" 
              alt="Brand Story"
              className="w-full h-full object-cover"
              style={{ filter: 'sepia(0.3) hue-rotate(180deg) saturate(0.5) brightness(0.7)' }}
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-[#d97706]/20"></div>
          </div>
          
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <div className="lantern-dot mb-8" />
            <h2 className="meridian-title text-4xl md:text-6xl mb-8 leading-[1.1]">
              Bir nesil önce<br />başladı.
            </h2>
            <div className="space-y-6 text-[#e8e2d4]/70 font-light text-sm md:text-base leading-relaxed max-w-lg">
              <p>
                Karadeniz'in hırçın dalgaları ve sisli çam ormanları arasında, doğaya meydan okumak değil, onunla uyum içinde yaşamak için yola çıktık.
              </p>
              <p>
                1985'ten bu yana, Trabzon'daki küçük dükkanımızda başlayan bu serüven, bugün en zorlu şartlara dayanan premium ekipmanlarla yüzlerce kampçı ve balıkçının hikayesine ortak oluyor. Biz sadece malzeme değil, güven sunuyoruz.
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <button className="btn-amber rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.1em] font-medium">
                Hikayemizi Oku
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] pt-24 pb-12 border-t border-[#1a3d2b]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="text-center md:text-left">
              <h2 className="meridian-title text-3xl text-[#f5f0e8] mb-2">Sarıçam Aydoğan</h2>
              <p className="text-[#e8e2d4]/50 text-xs uppercase tracking-widest">Kamp & Balık Ekipmanları</p>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#e8e2d4]/60 hover:text-[#d97706] hover:border-[#d97706] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#e8e2d4]/60 hover:text-[#d97706] hover:border-[#d97706] transition-colors">
                <MapPin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#e8e2d4]/60 hover:text-[#d97706] hover:border-[#d97706] transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-white/5 mb-8"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-[#e8e2d4]/40 uppercase tracking-widest gap-4">
            <p>Trabzon, Türkiye · 1985'ten beri</p>
            <p>WhatsApp: 0532 555 0000</p>
            <p>© 2024 Tüm Hakları Saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
