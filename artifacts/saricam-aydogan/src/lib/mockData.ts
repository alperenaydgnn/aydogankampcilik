export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order?: number;
  active?: boolean;
  created_at: string;
};

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type Tag = {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  short_description?: string;
  specs: Record<string, string>;
  price_label: string;
  price_numeric?: number;
  old_price?: number | null;
  stock?: number;
  images: string[];
  featured: boolean;
  is_new?: boolean;
  active?: boolean;
  stock_status?: StockStatus;
  whatsapp_message?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: Tag[];
  created_at: string;
};

export type SiteSettings = Record<string, unknown> & {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  map_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_images?: string[];
  working_hours?: string;
  social?: { instagram?: string; facebook?: string; [k: string]: string | undefined };
};

/** Derive a UI-friendly stock status from a raw stock count. */
export function deriveStockStatus(stock: number | null | undefined): StockStatus {
  if (stock == null) return 'in_stock';
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 10) return 'low_stock';
  return 'in_stock';
}

/** Format a numeric TRY price as a label, or fall back to a manual label. */
export function formatPriceLabel(
  price: number | null | undefined,
  fallback?: string | null,
): string {
  if (fallback) return fallback;
  if (price == null) return 'Fiyat için sorunuz';
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `₺${Math.round(price)}`;
  }
}

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => `${baseUrl}${path}`;

/* ------------------------------------------------------------------ */
/*  Mock fallback data — used when VITE_SUPABASE_URL/KEY are not set  */
/* ------------------------------------------------------------------ */

export const mockCategories: Category[] = [
  {
    id: 'c-1',
    name: 'Kamp Çadırları',
    slug: 'cadirlar',
    description: 'Toros ve Akdeniz koşullarına uygun, 4 mevsimlik kamp çadırları ve barınma ekipmanları.',
    image_url: asset('/mock/category-cadir.jpg'),
    active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-2',
    name: 'Olta & Balık Malzemeleri',
    slug: 'olta-ve-makine',
    description: 'Kıyıdan veya tekneden avlanmak için en kaliteli olta kamışları, balık makineleri ve balık malzemeleri.',
    image_url: asset('/mock/category-olta.jpg'),
    active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-3',
    name: 'Kamp Ekipmanları',
    slug: 'kamp-aksesuarlari',
    description: 'Kamp ocağı, kamp masası, sırt çantası ve daha fazlası — doğada ev konforu için kamp ekipmanları.',
    image_url: asset('/mock/category-aksesuar.jpg'),
    active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-4',
    name: 'Aydınlatma',
    slug: 'aydinlatma',
    description: 'Gece avları ve kamp geceleri için şarjlı fenerler, kafa lambaları ve kamp aydınlatma sistemleri.',
    image_url: asset('/mock/category-aydinlatma.jpg'),
    active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-5',
    name: 'Termos & Soğutucu',
    slug: 'termos-ve-sogutucu',
    description: 'Uzun kamp geceleri ve balık avı için içecekleri sıcak, yiyecekleri soğuk tutan premium termos ve soğutucu seçenekleri.',
    image_url: asset('/mock/product-5.jpg'),
    active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-6',
    name: 'Olta Aksesuarları',
    slug: 'olta-aksesuarlari',
    description: 'Sahte yem, iğne, misina, olta takımı ve balık avı aksesuarları — her türlü av için doğru ekipman.',
    image_url: asset('/mock/product-4.jpg'),
    active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-7',
    name: 'Outdoor & Trekking',
    slug: 'outdoor-aksesuarlari',
    description: 'Doğa yürüyüşü, trekking ve outdoor maceraları için kıyafet, çanta, bıçak ve survival ekipmanları.',
    image_url: asset('/mock/product-6.jpg'),
    active: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-8',
    name: 'Çakmak & Ateş Ekipmanları',
    slug: 'cakmak-ve-ates',
    description: 'Rüzgar geçirmez çakmaklar, çakmaktaşları, fitil ve kamp ateşi tutuşturma ekipmanları — her koşulda güvenli ateş.',
    image_url: asset('/mock/product-2.jpg'),
    active: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Alpinist Pro 4 Mevsim Kamp Çadırı',
    slug: 'alpinist-pro-4-mevsim-kamp-cadiri',
    category_id: 'c-1',
    description: 'Yoğun yağış ve şiddetli rüzgara karşı ekstra güçlendirilmiş alüminyum poller. Toros Dağları\'nda defalarca test edilmiş, su geçirmez 3000mm kolon direncine sahip profesyonel çadır.',
    specs: { 'Marka': 'Alpinist', 'Kapasite': '3 Kişilik', 'Ağırlık': '3.2 kg', 'Su Geçirmezlik': '3000mm', 'Mevsim': '4 Mevsim', 'Pol Malzemesi': '7001 Alüminyum' },
    price_label: '₺4.250', price_numeric: 4250, stock: 25,
    images: [asset('/mock/product-1.jpg'), asset('/mock/category-cadir.jpg')],
    featured: true, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Alpinist Pro 4 Mevsim Kamp Çadırı hakkında bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-2',
    name: 'Kuzey Yıldızı Uyku Tulumu (-15°C)',
    slug: 'kuzey-yildizi-uyku-tulumu',
    category_id: 'c-1',
    description: 'Eksi derecelerde bile sıcacık bir uyku sunan, hafif ve kompakt uyku tulumu. Sentetik dolgusu sayesinde nem ve soğukta bile yalıtım özelliğini korur.',
    specs: { 'Marka': 'Kuzey', 'Konfor Derecesi': '-5°C', 'Ekstrem Derece': '-15°C', 'Ağırlık': '1.4 kg', 'Mevsim': 'Kış', 'Dolgu': 'Hollowfibre Sentetik' },
    price_label: '₺1.850', price_numeric: 1850, stock: 30,
    images: [asset('/mock/product-1.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Kuzey Yıldızı Uyku Tulumu için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-13',
    name: 'Trailblazer 2 Kişilik Trekking Çadırı',
    slug: 'trailblazer-2-kisilik-trekking-cadiri',
    category_id: 'c-1',
    description: 'Tek çubuklu kurulum sistemi sayesinde tek kişi tarafından 5 dakikada kurulabilen hafif ve kompakt trekking çadırı.',
    specs: { 'Marka': 'Trailblazer', 'Kapasite': '2 Kişilik', 'Ağırlık': '2.1 kg', 'Su Geçirmezlik': '2000mm', 'Mevsim': '3 Mevsim', 'Kurulum': 'Tek Çubuklu' },
    price_label: '₺2.900', price_numeric: 2900, stock: 5,
    images: [asset('/mock/category-cadir.jpg')],
    featured: false, is_new: true, active: true, stock_status: 'low_stock',
    whatsapp_message: 'Trailblazer 2 Kişilik Çadır için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-14',
    name: 'Kamp Paspas Seti — Eva Köpük 3\'lü',
    slug: 'kamp-paspas-seti-eva-kopuk',
    category_id: 'c-1',
    description: 'Zemin soğukluğunu ve nem transferini önleyen 3 cm kalınlığında Eva köpük zemin paspası. Rulo yapılarak çantaya bağlanır.',
    specs: { 'Marka': 'Aydoğan', 'Boyut': '185x58 cm', 'Kalınlık': '3 cm', 'Malzeme': 'Eva Köpük', 'Paket': '3 Adet' },
    price_label: '₺480', price_numeric: 480, stock: 40,
    images: [asset('/mock/product-1.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Eva köpük paspas seti için bilgi istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-3',
    name: 'Fırtına Karbon Spin Olta Kamışı 270cm',
    slug: 'firtina-karbon-spin-olta-kamisi-270cm',
    category_id: 'c-2',
    description: 'Levrek ve lüfer avcıları için özel olarak tasarlanmış, at-çek avlarında yorulmadan saatlerce kullanabileceğiniz yüksek modüllü karbon kamış.',
    specs: { 'Marka': 'Fırtına', 'Boy': '270 cm', 'Atar': '15-40 gr', 'Ağırlık': '165 gr', 'Parça Sayısı': '2' },
    price_label: '₺2.100', price_numeric: 2100, stock: 20,
    images: [asset('/mock/product-3.jpg')],
    featured: true, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Fırtına Karbon Olta Kamışı için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-4',
    name: 'Seyhan Surf Olta Makinesi 6000',
    slug: 'seyhan-surf-olta-makinesi-6000',
    category_id: 'c-2',
    description: 'Tuzlu suya ekstra dayanıklı paslanmaz çelik bilyalar. Kıyıdan uzak atışlar için tasarlanmış sığ kafa yapısı ve güçlü kalama sistemi.',
    specs: { 'Marka': 'Seyhan', 'Bilya Sayısı': '5+1', 'Devir': '4.6:1', 'Kalama Gücü': '12 kg', 'Ağırlık': '420 gr' },
    price_label: 'Fiyat için sorunuz', stock: 4,
    images: [asset('/mock/product-3.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'low_stock',
    whatsapp_message: 'Seyhan Surf Makinesi 6000 için fiyat almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-15',
    name: 'Levrek Pro Jigging Olta Seti (Komple)',
    slug: 'levrek-pro-jigging-olta-seti',
    category_id: 'c-2',
    description: 'Kamış + makine + misina kombinasyonu olarak hazır paket. Adana ve Akdeniz levrek avcılığı için optimize edilmiş, hemen kullanıma hazır komple olta seti.',
    specs: { 'Marka': 'Levrek Pro', 'Kamış': '210cm Carbon Jigging', 'Makine': '3000 Spinning', 'Misina': '0.30mm 150m', 'Atar': '10-30 gr' },
    price_label: '₺1.750', price_numeric: 1750, stock: 18,
    images: [asset('/mock/category-olta.jpg')],
    featured: true, is_new: true, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Levrek Pro Jigging Seti için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-6',
    name: 'Odun Ateşi Portatif Kamp Ocağı',
    slug: 'odun-atesi-portatif-kamp-ocagi',
    category_id: 'c-3',
    description: 'Küçük dallar ve kozalaklarla çayınızı anında demleyin. Katlanabilir çelik gövdesi ile çantada hiç yer kaplamaz.',
    specs: { 'Marka': 'Aydoğan', 'Malzeme': 'Paslanmaz Çelik', 'Kurulu Boyut': '15x15x20 cm', 'Katlı Boyut': '15x15x2 cm', 'Ağırlık': '450 gr' },
    price_label: '₺380', price_numeric: 380, stock: 50,
    images: [asset('/mock/product-2.jpg')],
    featured: true, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Portatif Kamp Ocağı için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-8',
    name: 'Zirve Katlanır Kamp Masası',
    slug: 'zirve-katlanir-kamp-masasi',
    category_id: 'c-3',
    description: 'Alüminyum iskeleti ve kumaş tablası sayesinde sadece 1 kg ağırlığında. İki kişilik kamp yemekleri için ideal kompakt çözüm.',
    specs: { 'Marka': 'Zirve', 'Taşıma Kapasitesi': '25 kg', 'Yüzey Malzemesi': '600D Oxford Kumaş', 'Kurulu Boyut': '56x42x40 cm', 'Ağırlık': '1.1 kg' },
    price_label: '₺650', price_numeric: 650, stock: 22,
    images: [asset('/mock/category-aksesuar.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Katlanır Kamp Masası için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-11',
    name: 'Orman Gezgini 45L Sırt Çantası',
    slug: 'orman-gezgini-45l-sirt-cantasi',
    category_id: 'c-3',
    description: 'Günübirlik veya hafta sonu yürüyüşleri için ideal. Sırtı terletmeyen air-mesh teknolojisi ve entegre yağmurluk.',
    specs: { 'Marka': 'Orman Gezgini', 'Hacim': '45 Litre', 'Ağırlık': '1.2 kg', 'Su Geçirmezlik': '1500mm', 'Mevsim': '3 Mevsim', 'Kumaş': 'Su İtici Naylon', 'Sırt Sistemi': 'Ergonomik Air-Mesh' },
    price_label: '₺1.450', price_numeric: 1450, stock: 7,
    images: [asset('/mock/product-6.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'low_stock',
    whatsapp_message: 'Orman Gezgini Sırt Çantası için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-9',
    name: 'Gölge Şarjlı Kamp Feneri',
    slug: 'golge-sarjli-kamp-feneri',
    category_id: 'c-4',
    description: 'Hem şarj edilebilir hem de powerbank olarak kullanılabilir. Çadır içini 360 derece aydınlatan sıcak sarı ışık modu ile kamp gecelerinize eşlik eder.',
    specs: { 'Marka': 'Gölge', 'Işık Gücü': '400 Lümen', 'Pil Kapasitesi': '5000 mAh', 'Ağırlık': '320 gr', 'Çalışma Süresi': '12 Saat (Sürekli)', 'Su Dayanımı': 'IPX4' },
    price_label: '₺850', price_numeric: 850, stock: 35,
    images: [asset('/mock/category-aydinlatma.jpg')],
    featured: true, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Şarjlı Kamp Feneri için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-10',
    name: 'Avcı Pro Kafa Lambası',
    slug: 'avci-pro-kafa-lambasi',
    category_id: 'c-4',
    description: 'Gece avları ve doğa yürüyüşleri için hareket sensörlü aç/kapa özelliği. Kırmızı ışık modu ile gece görüşünüzü bozmaz.',
    specs: { 'Marka': 'Avcı Pro', 'Işık Gücü': '250 Lümen', 'Mesafe': '100 Metre', 'Ağırlık': '75 gr', 'Su Dayanımı': 'IPX4', 'Modlar': 'Beyaz / Kırmızı / Çakar' },
    price_label: '₺550', price_numeric: 550, stock: 40,
    images: [asset('/mock/category-aydinlatma.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Avcı Pro Kafa Lambası için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-7',
    name: 'Buzul 30L Tekne & Kamp Soğutucusu',
    slug: 'buzul-30l-kamp-termosu',
    category_id: 'c-5',
    description: '3 gün boyunca buzları çözülmeden muhafaza eden, zorlu doğa koşullarına dayanıklı ekstra yalıtımlı poliüretan gövde.',
    specs: { 'Marka': 'Buzul', 'Kapasite': '30 Litre', 'Yalıtım Süresi': '72 Saat', 'Dış Malzeme': 'Yüksek Yoğunluklu PE', 'Ağırlık': '3.5 kg' },
    price_label: '₺1.950', price_numeric: 1950, stock: 12,
    images: [asset('/mock/product-5.jpg')],
    featured: true, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Buzul 30L Soğutucu için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-18',
    name: 'Titan Vakumlu Kamp Termosu 1L',
    slug: 'titan-vakumlu-kamp-termosu-1l',
    category_id: 'c-5',
    description: 'Çift cidarlı vakum yalıtımı ile 24 saat sıcak, 48 saat soğuk içecek muhafazası. Paslanmaz çelik iç gövde.',
    specs: { 'Marka': 'Titan', 'Kapasite': '1 Litre', 'Sıcak Tutma': '24 Saat', 'Soğuk Tutma': '48 Saat', 'Ağırlık': '550 gr', 'Malzeme': '304 Paslanmaz Çelik' },
    price_label: '₺680', price_numeric: 680, stock: 28,
    images: [asset('/mock/product-5.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Titan Vakumlu Termos için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-5',
    name: 'Derin Su Sahte Yem Seti (5 Parça)',
    slug: 'derin-su-sahte-yem-seti',
    category_id: 'c-6',
    description: 'Gece avlarında yüksek verim sağlayan fosforlu gövdeye sahip, su içinde gerçekçi aksiyon gösteren 5 farklı renkte sahte yem seti.',
    specs: { 'Marka': 'Derin Su', 'Boy': '11 cm', 'Ağırlık': '15 gr', 'Aksiyon': 'Dalan (Sinking)', 'İğne': 'VMC Paslanmaz' },
    price_label: '₺450', price_numeric: 450, stock: 60,
    images: [asset('/mock/product-4.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Sahte Yem Seti için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-23',
    name: 'Summit Trekking Bıçağı — G10 Saplı',
    slug: 'summit-trekking-bicagi-g10-sapli',
    category_id: 'c-7',
    description: 'Full-tang çelik gövde ve su geçirmez G10 kompozit sap. Kamp, balık temizleme ve survival kullanıma uygun çok amaçlı trekking bıçağı.',
    specs: { 'Marka': 'Summit', 'Çelik': '440C Paslanmaz', 'Sap': 'G10 Kompozit', 'Toplam Uzunluk': '22 cm', 'Ağırlık': '180 gr' },
    price_label: '₺750', price_numeric: 750, stock: 14,
    images: [asset('/mock/product-6.jpg')],
    featured: true, is_new: true, active: true, stock_status: 'in_stock',
    whatsapp_message: 'Summit Trekking Bıçağı için bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-25',
    name: 'Survival Kit — Acil Durum Seti 12 Parça',
    slug: 'survival-kit-acil-durum-seti',
    category_id: 'c-7',
    description: 'Dağ, orman ve kıyı maceralarında hayatta kalma ve ilk yardım için 12 zorunlu eleman. Su geçirmez çanta içinde organize.',
    specs: { 'Marka': 'Survival', 'İçerik': '12 Parça', 'Paket': 'Su Geçirmez Poşet', 'Boyut': '15x10x5 cm', 'Ağırlık': '320 gr' },
    price_label: '₺380', price_numeric: 380, stock: 0,
    images: [asset('/mock/product-6.jpg')],
    featured: false, is_new: false, active: true, stock_status: 'out_of_stock',
    whatsapp_message: 'Survival Kit hakkında bilgi almak istiyorum.',
    created_at: new Date().toISOString(),
  },
];

export const mockSiteSettings: SiteSettings = {
  phone: '+90 507 644 23 50',
  whatsapp: '+905076442350',
  email: 'info@aydogankampcilik.com',
  address: 'Sarıçam Mah. Atatürk Cd. No:18, Sarıçam / Adana',
  map_url: 'https://maps.app.goo.gl/saricam-aydogan',
  hero_title: "Torosların Eteklerinden Doğaya Hazır Ol",
  hero_subtitle: "Adana Sarıçam'da 25 yıllık tecrübeyle kamp ve balıkçı malzemeleri.",
  hero_images: [
    asset('/mock/hero.jpg'),
    asset('/mock/category-cadir.jpg'),
    asset('/mock/category-olta.jpg'),
    asset('/mock/category-aydinlatma.jpg'),
    asset('/mock/category-aksesuar.jpg'),
    asset('/mock/product-5.jpg'),
  ],
  working_hours: 'Pzt–Cmt 09:00–19:00',
  social: {
    instagram: 'https://instagram.com/aydogankampcilik',
    facebook: 'https://facebook.com/aydogankampcilik',
  },
};
