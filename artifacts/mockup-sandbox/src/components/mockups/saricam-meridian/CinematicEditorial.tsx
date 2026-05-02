import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, Instagram, Phone, MapPin } from 'lucide-react';

export function CinematicEditorial() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] font-['Plus_Jakarta_Sans'] antialiased selection:bg-[#d97706] selection:text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#f5f0e8]/90 backdrop-blur-md py-4 border-b border-[#e8e2d4]' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex-1">
            <span className={`font-['Fraunces'] text-xl tracking-tight font-medium ${scrolled ? 'text-[#1a1a1a]' : 'text-white'}`}>
              Sarıçam Aydoğan
            </span>
          </div>
          
          <div className={`hidden md:flex items-center justify-center gap-10 text-xs tracking-[0.15em] uppercase font-semibold ${scrolled ? 'text-[#1a1a1a]' : 'text-white/90'}`}>
            <a href="#" className="hover:text-[#d97706] transition-colors">Mağaza</a>
            <a href="#" className="hover:text-[#d97706] transition-colors">Kategoriler</a>
            <a href="#" className="hover:text-[#d97706] transition-colors">Hikayemiz</a>
            <a href="#" className="hover:text-[#d97706] transition-colors">İletişim</a>
          </div>

          <div className="flex-1 flex justify-end">
            <a 
              href="#" 
              className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase font-bold transition-all duration-300 ${
                scrolled 
                  ? 'bg-[#1a3d2b] text-white hover:bg-[#132c1f]' 
                  : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
              }`}
            >
              Koleksiyonu Gör
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[100dvh] w-full flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/saricam/hero.jpg" 
            alt="Karadeniz Ormanları" 
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-[slowZoom_20s_ease-out_forwards]"
          />
          <div className="absolute inset-0 bg-[#1a3d2b]/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center mt-20">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs tracking-[0.15em] uppercase font-medium">
            <span className="text-[#d97706]">★</span> 1985'ten beri Trabzon
          </div>
          
          <h1 className="font-['Fraunces'] text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] tracking-[-0.03em] font-light text-white mb-10 drop-shadow-sm">
            <span className="block mb-2">Karadeniz'in vahşi doğasına.</span>
            <span className="block italic text-white/90 text-4xl md:text-6xl lg:text-[6rem]">Hazır mıyız.</span>
          </h1>

          <p className="text-white/80 text-sm md:text-base tracking-[0.05em] font-light max-w-lg mb-12">
            Trabzon'un kalbinde, doğanın tam ortasında. Premium kamp ekipmanları ve profesyonel balıkçı donanımları.
          </p>

          <a 
            href="#categories" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#d97706] text-white text-sm tracking-[0.1em] uppercase font-bold hover:bg-[#b46205] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(217,119,6,0.3)]"
          >
            Mağazayı Keşfet
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white">Keşfet</span>
          <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white animate-[scrollDown_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <section id="categories" className="py-32 md:py-48 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32 max-w-2xl">
          <h2 className="font-['Fraunces'] text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-tight text-[#1a3d2b]">
            Doğada bir gece.<br/>
            Yıllarca anı.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
          {[
            { title: "Kamp Çadırları", img: "category-cadir.jpg", span: false },
            { title: "Olta & Balık Malzemeleri", img: "category-olta.jpg", span: false },
            { title: "Kamp Ekipmanları", img: "category-aksesuar.jpg", span: false },
            { title: "Aydınlatma", img: "category-aydinlatma.jpg", span: false }
          ].map((cat, i) => (
            <div key={i} className={`group cursor-pointer ${cat.span ? 'md:col-span-2' : ''}`}>
              <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-[#e8e2d4]">
                <img 
                  src={`/__mockup/images/saricam/${cat.img}`} 
                  alt={cat.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <h3 className="font-['Fraunces'] text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] flex items-center justify-between">
                {cat.title}
                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#d97706]" />
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-[#e8e2d4]/50 border-y border-[#e8e2d4]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <h2 className="font-['Fraunces'] text-4xl md:text-5xl font-light tracking-[-0.02em] text-[#1a3d2b]">
              Öne Çıkanlar.
            </h2>
            <a href="#" className="text-xs tracking-[0.1em] uppercase font-bold text-[#1a1a1a] border-b border-[#1a1a1a] pb-1 hover:text-[#d97706] hover:border-[#d97706] transition-colors inline-block">
              Tüm Ürünleri Gör
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[
              { name: "Alpinist Pro 4 Mevsim Kamp Çadırı", price: "₺4.250", img: "product-1.jpg" },
              { name: "Kuzey Yıldızı Uyku Tulumu (-15°C)", price: "₺1.850", img: "product-2.jpg" },
              { name: "Trailblazer Trekking Çadırı", price: "₺2.900", img: "product-3.jpg" },
              { name: "Premium Olta Takımı", price: "₺3.400", img: "product-4.jpg" },
              { name: "Termos & Soğutucu Set", price: "₺1.200", img: "product-5.jpg" },
              { name: "Survival Bıçak Seti", price: "₺850", img: "product-6.jpg" }
            ].map((prod, i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] mb-5 overflow-hidden bg-white border border-[#e8e2d4] relative">
                  <img 
                    src={`/__mockup/images/saricam/${prod.img}`} 
                    alt={prod.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                  
                  {/* Subtle Add to Cart overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center">
                    <button className="bg-[#1a3d2b] text-white text-xs tracking-wider uppercase font-semibold px-6 py-3 rounded-full hover:bg-[#132c1f] w-full flex items-center justify-center gap-2 shadow-lg">
                      <ShoppingBag className="w-4 h-4" /> Detay
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#1a1a1a]">{prod.name}</h4>
                  <p className="font-['Fraunces'] text-lg text-[#1a3d2b]">{prod.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Split */}
      <section className="py-0 flex flex-col lg:flex-row min-h-[80vh]">
        <div className="w-full lg:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center bg-[#1a3d2b] text-[#f5f0e8]">
          <h2 className="font-['Fraunces'] text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.02em] mb-10 leading-tight">
            Bir nesil önce <br/><span className="italic text-white/80">başladı.</span>
          </h2>
          <p className="text-[#f5f0e8]/70 text-base md:text-lg font-light leading-relaxed mb-12 max-w-md">
            1985'ten bu yana Trabzon'da, Karadeniz'in hırçın doğasına meydan okuyanlara yol arkadaşlığı yapıyoruz. Ahşabın sıcaklığını, çeliğin soğukluğunu ve ateşin huzurunu bilenler için, sadece en iyisini sunuyoruz. 
          </p>
          <div>
            <a href="#" className="inline-flex items-center gap-3 text-xs tracking-[0.1em] uppercase font-bold text-[#d97706] hover:text-white transition-colors border-b border-[#d97706] hover:border-white pb-1">
              Hikayemizi Okuyun <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full">
          <img 
            src="/__mockup/images/saricam/hero.jpg" 
            alt="Brand Story" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[50%] contrast-125"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-[#f5f0e8] py-20 px-6 md:px-12 border-t border-[#333]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <h3 className="font-['Fraunces'] text-2xl font-light tracking-tight mb-6">Sarıçam Aydoğan</h3>
            <p className="text-[#f5f0e8]/50 text-sm max-w-xs mb-8">
              Premium outdoor, kamp ve balıkçılık ekipmanları. Trabzon, Türkiye.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-[#f5f0e8]/20 flex items-center justify-center text-[#f5f0e8]/60 hover:text-white hover:border-[#d97706] hover:bg-[#d97706]/10 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-bold text-[#f5f0e8]/40 mb-6">İletişim</h4>
            <ul className="space-y-4 text-sm text-[#f5f0e8]/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 opacity-50" />
                <span>Cumhuriyet Mah. Sahil Cd. No:42<br/>Trabzon, Türkiye</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 opacity-50" />
                <span>+90 532 123 4567</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-bold text-[#f5f0e8]/40 mb-6">Keşfet</h4>
            <ul className="space-y-3 text-sm text-[#f5f0e8]/70">
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Kamp Çadırları</a></li>
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Olta & Balık Malzemeleri</a></li>
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Kamp Ekipmanları</a></li>
              <li><a href="#" className="hover:text-[#d97706] transition-colors">Aydınlatma</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-[#f5f0e8]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#f5f0e8]/40">
          <p>© {new Date().getFullYear()} Sarıçam Aydoğan. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#f5f0e8] transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-[#f5f0e8] transition-colors">Şartlar ve Koşullar</a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
    </div>
  );
}
