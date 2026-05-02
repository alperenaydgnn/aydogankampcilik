import React from 'react';
import { ArrowRight, Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

export function MagazineAsymmetric() {
  return (
    <div 
      className="min-h-screen w-full text-[#1a1a1a] selection:bg-[#d97706] selection:text-white"
      style={{ backgroundColor: '#f5f0e8', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 md:px-12 py-6 flex justify-between items-center pointer-events-none">
        <div className="text-sm font-['Fraunces'] tracking-wider uppercase font-medium pointer-events-auto">
          Sarıçam Aydoğan
        </div>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium pointer-events-auto">
          <a href="#" className="hover:text-[#d97706] transition-colors">Mağaza</a>
          <a href="#" className="hover:text-[#d97706] transition-colors">Kategoriler</a>
          <a href="#" className="hover:text-[#d97706] transition-colors">Hikayemiz</a>
          <a href="#" className="hover:text-[#d97706] transition-colors">İletişim</a>
        </div>
        <div className="pointer-events-auto">
          <button className="bg-[#d97706] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#b46204] transition-all duration-300 shadow-[0_4px_20px_rgba(217,119,6,0.3)]">
            Koleksiyonu Gör
          </button>
        </div>
      </nav>

      {/* Hero Section - Split Magazine Layout */}
      <header className="relative w-full h-[100dvh] flex flex-col md:flex-row pt-20 md:pt-0">
        {/* Left Side: Editorial Typography */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 bg-[#f5f0e8]">
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 -rotate-180 text-[10px] tracking-[0.3em] text-black/40 uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
            Issue 04 · İlkbahar 2026
          </div>
          
          <div className="space-y-8 max-w-lg relative">
            <h1 className="font-['Fraunces'] text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tighter font-light text-[#1a3d2b]">
              Karadeniz'in<br />vahşi doğasına.<br />Hazır mıyız.
            </h1>
            <p className="text-sm md:text-base text-[#1a1a1a]/70 leading-relaxed max-w-sm">
              Trabzon'un kalbinden, sisli sabahların ve kamp ateşlerinin hikayesi. 1985'ten beri vahşi doğa için en iyi ekipmanlar.
            </p>
            <div className="pt-4">
              <button className="group flex items-center gap-4 bg-[#1a1a1a] text-[#f5f0e8] px-8 py-4 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#d97706] transition-colors duration-500">
                Mağazayı Keşfet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Full Bleed Photo */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-full relative overflow-hidden bg-[#1a3d2b]">
          <img 
            src="/__mockup/images/saricam/hero.jpg" 
            alt="Camping in the forest" 
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        </div>
      </header>

      {/* Featured Banner */}
      <div className="w-full bg-[#1a3d2b] py-8 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-4xl md:text-6xl font-['Fraunces'] text-white/10 uppercase tracking-wider mx-8">
                Doğada Bir Gece
              </span>
              <span className="text-[#d97706] text-4xl">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asymmetric Categories Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto relative">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-black/50 font-bold">Kategoriler</h2>
          <div className="h-px bg-black/10 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {/* Double Width Item */}
          <div className="col-span-1 md:col-span-8 group cursor-pointer">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#e8e2d4] mb-6">
              <img src="/__mockup/images/saricam/category-cadir.jpg" alt="Kamp Çadırları" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute top-4 left-4 text-[#f5f0e8] text-sm font-serif">01</div>
            </div>
            <h3 className="font-['Fraunces'] text-3xl text-[#1a3d2b]">Kamp Çadırları</h3>
            <p className="text-sm text-black/60 mt-2 max-w-md">Dört mevsim koruma sağlayan profesyonel barınaklar.</p>
          </div>

          <div className="col-span-1 md:col-span-4 group cursor-pointer md:mt-24">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#e8e2d4] mb-6">
              <img src="/__mockup/images/saricam/category-olta.jpg" alt="Olta & Balık Malzemeleri" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 text-[#f5f0e8] text-sm font-serif">02</div>
            </div>
            <h3 className="font-['Fraunces'] text-2xl text-[#1a3d2b]">Olta & Balık</h3>
            <p className="text-sm text-black/60 mt-2">Karadeniz sularına özel donanımlar.</p>
          </div>

          <div className="col-span-1 md:col-span-5 group cursor-pointer mt-12 md:-mt-12">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#e8e2d4] mb-6">
              <img src="/__mockup/images/saricam/category-aksesuar.jpg" alt="Kamp Ekipmanları" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 text-[#f5f0e8] text-sm font-serif">03</div>
            </div>
            <h3 className="font-['Fraunces'] text-2xl text-[#1a3d2b]">Ekipmanlar</h3>
          </div>

          <div className="col-span-1 md:col-span-7 group cursor-pointer mt-12 md:mt-24">
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#e8e2d4] mb-6">
              <img src="/__mockup/images/saricam/category-aydinlatma.jpg" alt="Aydınlatma" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 text-[#f5f0e8] text-sm font-serif">04</div>
            </div>
            <h3 className="font-['Fraunces'] text-2xl text-[#1a3d2b]">Aydınlatma</h3>
          </div>
        </div>
      </section>

      {/* Brand Story / Split Quote */}
      <section className="py-24 px-6 md:px-12 bg-[#1a3d2b] text-[#f5f0e8] relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        ></div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="relative">
            <span className="absolute -top-24 -left-12 text-[#d97706] text-[12rem] font-['Fraunces'] leading-none opacity-40">"</span>
            <h2 className="font-['Fraunces'] text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-light relative z-10">
              Bir nesil önce<br />başladı.
            </h2>
            <div className="mt-8 text-[#e8e2d4]/80 text-sm md:text-base leading-relaxed max-w-md space-y-4">
              <p>Trabzon'un yağmurlu tepelerinden, hırçın Karadeniz'in kıyılarına kadar her macerada yanınızdayız.</p>
              <p>1985'ten bu yana, sadece bir dükkan değil, doğaya saygı duyan bir ailenin mirasnı taşıyoruz.</p>
            </div>
          </div>
          <div className="relative aspect-[3/4] max-w-sm ml-auto">
            <img src="/__mockup/images/saricam/category-aksesuar.jpg" alt="Brand story" className="w-full h-full object-cover sepia-[0.3]" />
          </div>
        </div>
      </section>

      {/* Magazine Grid Products */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto bg-[#f5f0e8]">
        <div className="flex items-center justify-between mb-20 border-b border-black/10 pb-8">
          <h2 className="text-4xl md:text-5xl font-['Fraunces'] font-light text-[#1a3d2b] tracking-tight">Koleksiyon</h2>
          <a href="#" className="text-xs uppercase tracking-[0.2em] font-medium border-b border-[#1a1a1a] pb-1 hover:text-[#d97706] hover:border-[#d97706] transition-colors">
            Tümünü Gör
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[
            { img: "product-1.jpg", title: "Alpinist Pro 4 Mevsim Kamp Çadırı", price: "₺4.250" },
            { img: "product-2.jpg", title: "Kuzey Yıldızı Uyku Tulumu (-15°C)", price: "₺1.850" },
            { img: "product-3.jpg", title: "Trailblazer Trekking Çadırı", price: "₺2.900" },
            { img: "product-4.jpg", title: "Premium Olta Takımı", price: "₺3.400" },
            { img: "product-5.jpg", title: "Termos & Soğutucu Set", price: "₺1.200" },
            { img: "product-6.jpg", title: "Survival Bıçak Seti", price: "₺850" }
          ].map((prod, idx) => (
            <div key={idx} className="group relative flex flex-col">
              <div className="text-[10px] text-black/40 font-serif mb-3 border-b border-black/10 pb-2">NO. 0{idx + 1}</div>
              <div className="relative aspect-[4/5] bg-[#e8e2d4] overflow-hidden mb-6">
                <img src={`/__mockup/images/saricam/${prod.img}`} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-['Fraunces'] text-xl text-[#1a3d2b] leading-snug">{prod.title}</h3>
                <span className="text-[#d97706] font-medium">{prod.price}</span>
              </div>
              <a href="#" className="mt-4 text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-[#1a3d2b] transition-colors inline-flex items-center gap-2">
                Detayları İncele
                <span className="block w-4 h-[1px] bg-current"></span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-[#f5f0e8] py-20 px-6 md:px-12 border-t-[8px] border-[#1a3d2b]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-['Fraunces'] text-3xl mb-6 font-light">Sarıçam Aydoğan</h2>
            <p className="text-white/50 text-sm max-w-sm leading-relaxed">
              Trabzon, Türkiye · 1985'ten beri.<br />
              Karadeniz'in vahşi doğasına açılan kapınız.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-6">İletişim</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-center gap-3"><Phone size={14} className="text-[#d97706]"/> 0532 123 4567</li>
              <li className="flex items-center gap-3"><Mail size={14} className="text-[#d97706]"/> info@saricam.com</li>
              <li className="flex items-center gap-3"><MapPin size={14} className="text-[#d97706]"/> Trabzon, Merkez</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-6">Sosyal Medya</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d97706] hover:border-[#d97706] transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d97706] hover:border-[#d97706] transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Sarıçam Aydoğan. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
