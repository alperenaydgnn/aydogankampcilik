export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  specs: Record<string, string>;
  price_label: string;
  images: string[];
  featured: boolean;
  whatsapp_message?: string;
  created_at: string;
};

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => `${baseUrl}${path}`;

export const mockCategories: Category[] = [
  {
    id: 'c-1',
    name: 'Çadırlar',
    slug: 'cadirlar',
    description: 'Karadeniz rüzgarlarına dayanıklı, 4 mevsimlik kamp çadırları.',
    image_url: asset('/mock/category-cadir.jpg'),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-2',
    name: 'Olta & Makine',
    slug: 'olta-ve-makine',
    description: 'Kıyıdan veya tekneden avlanmak için en kaliteli olta setleri.',
    image_url: asset('/mock/category-olta.jpg'),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-3',
    name: 'Kamp Aksesuarları',
    slug: 'kamp-aksesuarlari',
    description: 'Doğada ev konforu arayanlar için kamp masaları ve soğutucular.',
    image_url: asset('/mock/category-aksesuar.jpg'),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c-4',
    name: 'Aydınlatma',
    slug: 'aydinlatma',
    description: 'Gece avları ve kamp geceleri için güçlü fenerler ve kafa lambaları.',
    image_url: asset('/mock/category-aydinlatma.jpg'),
    created_at: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Alpinist Pro 4 Mevsim Kamp Çadırı',
    slug: 'alpinist-pro-4-mevsim-kamp-cadiri',
    category_id: 'c-1',
    description: 'Yoğun yağış ve şiddetli rüzgara karşı ekstra güçlendirilmiş alüminyum poller. Kaçkar Dağları\'nda defalarca test edilmiş, su geçirmez 3000mm kolon direncine sahip profesyonel çadır.',
    specs: {
      'Kapasite': '3 Kişilik',
      'Ağırlık': '3.2 kg',
      'Su Geçirmezlik': '3000mm',
      'Pol Malzemesi': '7001 Alüminyum',
    },
    price_label: '₺4.250',
    images: [asset('/mock/product-1.jpg'), asset('/mock/category-cadir.jpg')],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-2',
    name: 'Kuzey Yıldızı Uyku Tulumu',
    slug: 'kuzey-yildizi-uyku-tulumu',
    category_id: 'c-1',
    description: 'Eksi derecelerde bile sıcacık bir uyku sunan, hafif ve kompakt uyku tulumu. Sentetik dolgusu sayesinde nemli havalarda bile yalıtım özelliğini korur.',
    specs: {
      'Konfor Derecesi': '-5°C',
      'Ekstrem Derece': '-15°C',
      'Ağırlık': '1.4 kg',
      'Dolgu': 'Hollowfibre',
    },
    price_label: '₺1.850',
    images: [asset('/mock/product-1.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-3',
    name: 'Fırtına Karbon Spin Olta Kamışı 270cm',
    slug: 'firtina-karbon-spin-olta-kamisi-270cm',
    category_id: 'c-2',
    description: 'Levrek ve lüfer avcıları için özel olarak tasarlanmış, at-çek avlarında yorulmadan saatlerce kullanabileceğiniz yüksek modüllü karbon kamış.',
    specs: {
      'Boy': '270 cm',
      'Atar': '15-40 gr',
      'Ağırlık': '165 gr',
      'Parça Sayısı': '2',
    },
    price_label: '₺2.100',
    images: [asset('/mock/product-3.jpg')],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-4',
    name: 'Karadeniz Surf Olta Makinesi 6000',
    slug: 'karadeniz-surf-olta-makinesi-6000',
    category_id: 'c-2',
    description: 'Tuzlu suya ekstra dayanıklı paslanmaz çelik bilyalar. Kıyıdan uzak atışlar için tasarlanmış sığ kafa yapısı ve güçlü kalama sistemi.',
    specs: {
      'Bilya Sayısı': '5+1',
      'Devir': '4.6:1',
      'Kalama Gücü': '12 kg',
      'Ağırlık': '420 gr',
    },
    price_label: 'Fiyat için sorunuz',
    images: [asset('/mock/product-3.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-5',
    name: 'Derin Su Sahte Yem Seti (5 Parça)',
    slug: 'derin-su-sahte-yem-seti',
    category_id: 'c-2',
    description: 'Gece avlarında yüksek verim sağlayan fosforlu gövdeye sahip, su içinde gerçekçi aksiyon gösteren 5 farklı renkte sahte yem seti.',
    specs: {
      'Boy': '11 cm',
      'Ağırlık': '15 gr',
      'Aksiyon': 'Dalan (Sinking)',
      'İğne': 'VMC Paslanmaz',
    },
    price_label: '₺450',
    images: [asset('/mock/product-4.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-6',
    name: 'Odun Ateşi Portatif Kamp Ocağı',
    slug: 'odun-atesi-portatif-kamp-ocagi',
    category_id: 'c-3',
    description: 'Küçük dallar ve kozalaklarla çayınızı anında demleyin. Katlanabilir çelik gövdesi ile çantada hiç yer kaplamaz.',
    specs: {
      'Malzeme': 'Paslanmaz Çelik',
      'Kurulu Boyut': '15x15x20 cm',
      'Katlı Boyut': '15x15x2 cm',
      'Ağırlık': '450 gr',
    },
    price_label: '₺380',
    images: [asset('/mock/product-2.jpg')],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-7',
    name: 'Buzul 30L Kamp Termosu',
    slug: 'buzul-30l-kamp-termosu',
    category_id: 'c-3',
    description: '3 gün boyunca buzları çözülmeden muhafaza eden, zorlu doğa koşullarına dayanıklı ekstra yalıtımlı poliüretan gövde.',
    specs: {
      'Kapasite': '30 Litre',
      'Yalıtım Süresi': '72 Saat',
      'Dış Malzeme': 'Yüksek Yoğunluklu PE',
      'Boş Ağırlık': '3.5 kg',
    },
    price_label: '₺1.950',
    images: [asset('/mock/product-5.jpg')],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-8',
    name: 'Zirve Katlanır Kamp Masası',
    slug: 'zirve-katlanir-kamp-masasi',
    category_id: 'c-3',
    description: 'Alüminyum iskeleti ve kumaş tablası sayesinde sadece 1 kg ağırlığında. İki kişilik kamp yemekleri için ideal çözüm.',
    specs: {
      'Taşıma Kapasitesi': '25 kg',
      'Yüzey Malzemesi': '600D Oxford Kumaş',
      'Kurulu Boyut': '56x42x40 cm',
      'Ağırlık': '1.1 kg',
    },
    price_label: '₺650',
    images: [asset('/mock/category-aksesuar.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-9',
    name: 'Gölge Şarjlı Kamp Feneri',
    slug: 'golge-sarjli-kamp-feneri',
    category_id: 'c-4',
    description: 'Hem şarj edilebilir hem de powerbank olarak kullanılabilir. Çadır içini 360 derece aydınlatan sıcak sarı ışık modu ile kamp gecelerinize eşlik eder.',
    specs: {
      'Işık Gücü': '400 Lümen',
      'Pil Kapasitesi': '5000 mAh',
      'Çalışma Süresi': 'Sürekli 12 Saat',
      'Su Dayanımı': 'IPX4',
    },
    price_label: '₺850',
    images: [asset('/mock/category-aydinlatma.jpg')],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-10',
    name: 'Avcı Pro Kafa Lambası',
    slug: 'avci-pro-kafa-lambasi',
    category_id: 'c-4',
    description: 'Gece avları ve doğa yürüyüşleri için hareket sensörlü aç/kapa özelliği. Kırmızı ışık modu ile gece görüşünüzü bozmaz.',
    specs: {
      'Işık Gücü': '250 Lümen',
      'Mesafe': '100 Metre',
      'Ağırlık': '75 gr',
      'Modlar': 'Beyaz / Kırmızı / Çakar',
    },
    price_label: '₺550',
    images: [asset('/mock/category-aydinlatma.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-11',
    name: 'Orman Gezgini 45L Sırt Çantası',
    slug: 'orman-gezgini-45l-sirt-cantasi',
    category_id: 'c-3',
    description: 'Günübirlik veya hafta sonu yürüyüşleri için ideal. Sırtı terletmeyen air-mesh teknolojisi ve entegre yağmurluk.',
    specs: {
      'Hacim': '45 Litre',
      'Kumaş': 'Su İtici Naylon',
      'Sırt Sistemi': 'Ergonomik Air-Mesh',
      'Ekstra': 'Dahili Yağmurluk',
    },
    price_label: '₺1.450',
    images: [asset('/mock/product-6.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-12',
    name: 'Aygaz Kamp Çaydanlığı',
    slug: 'aygaz-kamp-caydanligi',
    category_id: 'c-3',
    description: 'Sertleştirilmiş alüminyumdan üretilmiş, doğada çay keyfinden vazgeçemeyenler için ultra hafif demlik. Hızlı ısınır, yakıt tasarrufu sağlar.',
    specs: {
      'Kapasite': '1.2 Litre',
      'Malzeme': 'Sert Eloksallı Alüminyum',
      'Ağırlık': '210 gr',
      'Sap': 'Isıya Dayanıklı Silikon Kaplama',
    },
    price_label: '₺420',
    images: [asset('/mock/product-2.jpg')],
    featured: false,
    created_at: new Date().toISOString(),
  }
];
