/* ─────────────────────────────────────────────────────────────────
   Category Metadata — SEO, content, and presentation data
   per category slug. Used by the Catalog page.
   ───────────────────────────────────────────────────────────────── */

export type CategoryMeta = {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  infoTitle: string;
  infoText: string;
  whatsappMessage: string;
  icon: string;
  accentColor: string;
  keywords: string[];
};

export const categoryMetas: CategoryMeta[] = [
  {
    slug: 'cadirlar',
    seoTitle: 'Kamp Çadırları — Dayanıklı 4 Mevsim Çadır',
    seoDescription: 'Adana Sarıçam ve Toros için uygun 4 mevsim kamp çadırları. 2 kişilik ve 3 kişilik opsiyonlar, yüksek su geçirmezlik değerleri. WhatsApp ile hızlı sipariş.',
    heroTitle: 'Kamp Çadırları',
    heroSubtitle: 'Her mevsim, her hava koşulunda güvenli barınma',
    infoTitle: 'Doğru Kamp Çadırını Nasıl Seçersiniz?',
    infoText: 'Kamp çadırı seçerken kapasite, ağırlık ve su geçirmezlik değerleri en önemli kriterlerdir. Adana ve Toros bölgesinde 3 mevsim çadırlar genel kullanım için idealdir; yüksek yaylalarda 4 mevsim modeller tercih edilmelidir. 4 mevsim çadırlar yoğun rüzgar ve kar yükünü de kaldırabilecek alüminyum pol sistemlerine sahiptir. Tek kişilik seyahatlerde hafif trekking çadırları ideal iken, aile kamplarında 3+ kişilik seçenekler daha konforlu bir deneyim sunar. Hangi çadırın size uygun olduğundan emin değilseniz WhatsApp\'tan danışabilirsiniz.',
    whatsappMessage: 'Merhaba! Kamp çadırı seçiminde yardım almak istiyorum. Kaç kişilik ve hangi mevsim için kullanacağımı belirteyim.',
    icon: '🏕️',
    accentColor: 'hsl(149 43% 17%)',
    keywords: ['kamp çadırı', 'trekking çadırı', '4 mevsim çadır', 'kamp malzemeleri', 'çadır fiyatı'],
  },
  {
    slug: 'olta-ve-makine',
    seoTitle: 'Balık Malzemeleri — Olta Kamışı & Makine',
    seoDescription: 'Sazan, yayın ve levrek avcıları için karbon olta kamışları, spin makineleri ve komple olta setleri. Adana ve Seyhan havzasına uygun balık malzemeleri.',
    heroTitle: 'Olta & Balık Malzemeleri',
    heroSubtitle: 'Adana ve çevresi için özenle seçilmiş olta ekipmanları',
    infoTitle: 'Adana\'da Balık Avı İçin Doğru Olta Seçimi',
    infoText: 'Seyhan ve Ceyhan nehirlerinde iç su avcılığı, baraj göllerinde sazan ve yayın avcılığı, akdeniz kıyılarında ise levrek ve çipura avcılığı farklı kamış-makine kombinasyonları gerektirir. Kıyı avcılığı için 3-4 metre atarlı kamışlar tercih edilirken, tatlı su jigging için 1.8-2.4 metre aksiyon kamışları kullanılır. Makine seçiminde dönme oranı ve güçlü fren sistemi önceliklidir. Yeni başlıyorsanız komple set seçenekleri hem ekonomik hem pratiktir. Hangi avı hedeflediğinizi söyleyin, en uygun kombinasyonu birlikte belirleyelim.',
    whatsappMessage: 'Merhaba! Olta ve balık malzemeleri konusunda yardım almak istiyorum. Hangi tür balık avı yaptığımı belirteyim.',
    icon: '🎣',
    accentColor: 'hsl(209 80% 32%)',
    keywords: ['olta kamışı', 'olta makinesi', 'balık malzemeleri', 'surf olta', 'jigging kamış'],
  },
  {
    slug: 'kamp-aksesuarlari',
    seoTitle: 'Kamp Ekipmanları — Ocak, Masa, Çanta',
    seoDescription: 'Kamp ocağı, katlanır masa, sırt çantası ve çaydanlık dahil tüm kamp ekipmanları. Doğada ev konforu için outdoor malzemeleri.',
    heroTitle: 'Kamp Ekipmanları',
    heroSubtitle: 'Doğada konfor için eksiksiz kamp aksesuarları',
    infoTitle: 'Zorunlu Kamp Ekipmanları Listesi',
    infoText: 'İyi bir kamp deneyimi için doğru kamp ekipmanları şarttır. Portatif kamp ocağı veya gaz beki, hafif bir kamp masası ve kamp sandalyesi ile doğada yemek keyfi bambaşka bir hal alır. Sırt çantası seçiminde hacim ve sırt uyumuna dikkat edilmeli; günübirlik geziler için 20-30L, hafta sonu kampları için 40-60L tercihleri idealdir. Ayrıca çayınızı dökmeyin diye vakumlu termos ve hafif kamp çaydanlığı da listenizde olsun. Hazır olduğunuzu düşünüyor musunuz? Eksiklerinizi belirlemek için bize danışın.',
    whatsappMessage: 'Merhaba! Kamp ekipmanları hakkında bilgi almak istiyorum. Hangi ürünleri aradığımı söyleyeyim.',
    icon: '🎒',
    accentColor: 'hsl(38 94% 45%)',
    keywords: ['kamp ekipmanları', 'kamp ocağı', 'kamp masası', 'sırt çantası', 'outdoor malzemeleri'],
  },
  {
    slug: 'aydinlatma',
    seoTitle: 'Kamp Aydınlatma — Fener, Kafa Lambası',
    seoDescription: 'Kamp geceleri ve gece avları için şarjlı kamp feneri, hareket sensörlü kafa lambası ve güneş paneli. IPX4 su dayanımlı aydınlatma ürünleri.',
    heroTitle: 'Aydınlatma Ekipmanları',
    heroSubtitle: 'Gece avlarında ve kamp gecelerinde güvenilir ışık',
    infoTitle: 'Kamp Aydınlatmasında Nelere Dikkat Edilmeli?',
    infoText: 'Kamp ve gece avı aydınlatmasında en önemli özellikler lümen değeri, pil ömrü ve su dayanımıdır. Çadır içi için 200-400 lümen 360° aydınlatma sunan kamp fenerleri yeterliyken, gece avı ve trekking için 200 lümen ve üzeri, odaklı ışık veren kafa lambaları tercih edilmelidir. Kırmızı ışık modu gece görüşünü korurken, hareket sensörü eller meşgulken büyük kolaylık sağlar. Uzun kamplar için güneş paneli ile şarj imkânı sunan modeller akıllı bir yatırımdır.',
    whatsappMessage: 'Merhaba! Kamp ve gece avı için aydınlatma ürünü arıyorum. Yardımcı olur musunuz?',
    icon: '🔦',
    accentColor: 'hsl(45 93% 47%)',
    keywords: ['kamp feneri', 'kafa lambası', 'şarjlı fener', 'kamp aydınlatma', 'gece avı lambası'],
  },
  {
    slug: 'termos-ve-sogutucu',
    seoTitle: 'Termos & Soğutucu — Kamp ve Balık İçin',
    seoDescription: 'Kamp termosu, soğutucu çanta ve tekne soğutucusu. Avlanan balıkları taze tutmak için ısı yalıtımlı soğutucu seçenekleri.',
    heroTitle: 'Termos & Soğutucu',
    heroSubtitle: 'Avlanan balıkları taze tutun, içeceklerinizi sıcak ya da soğuk!',
    infoTitle: 'Doğru Soğutucu ve Termos Nasıl Seçilir?',
    infoText: 'Kamp ve balık avında termos ve soğutucu seçimi çok önemlidir. Avladığınız balıkları taze tutmak için 20-30L yüksek yalıtımlı soğutucu idealdir; kaliteli modeller 72 saate kadar buzu koruyabilir. Günlük kamp kullanımı için 1-1.5L vakumlu termos ile hem çay hem de soğuk su taşımak pratiktir. Aile kamplarında ise 12L termal çanta yiyecek ve içecek saklama için yeterlidir. Tekne kullanıcıları için darbeye ve tuzlu suya dayanıklı soğutucu modelleri tercih edin.',
    whatsappMessage: 'Merhaba! Balık avı veya kamp için soğutucu veya termos arıyorum. Yardımcı olur musunuz?',
    icon: '🧊',
    accentColor: 'hsl(199 89% 35%)',
    keywords: ['kamp termosu', 'soğutucu çanta', 'tekne soğutucusu', 'balık taze saklama', 'termal çanta'],
  },
  {
    slug: 'olta-aksesuarlari',
    seoTitle: 'Olta Aksesuarları — Yem, İğne, Misina',
    seoDescription: 'Sahte yem seti, balık iğnesi, fluoro carbon misina ve olta takımı aksesuarları. Adana ve Akdeniz balıkçılığı için doğru yem ve iğne seçimi.',
    heroTitle: 'Olta Aksesuarları',
    heroSubtitle: 'Her avın ayrı takımı var — doğru aksesuar büyük fark yaratır',
    infoTitle: 'Hangi Olta Aksesuarı Size Uygun?',
    infoText: 'Olta aksesuarları av başarısını doğrudan etkileyen küçük ama kritik ekipmanlardır. Sahte yem seçiminde hedeflediğiniz balık türü belirleyicidir: sazan için mısır/hamur yemler, levrek ve çipura için jigging yemler, yayın için ağır suni yemler tercih edilir. Misina seçiminde fluoro carbon; görünmezliği ve aşınma direnciyle avantaj sağlar. İğne kalitesi ise avın tamamlanmasında hayati rol oynar — paslanmaz çelik iğneler tatlı ve tuzlu sularda uzun ömürlüdür.',
    whatsappMessage: 'Merhaba! Olta aksesuarları (yem, iğne, misina) için yardım istiyorum. Hangi tür av yaptığımı söyleyeyim.',
    icon: '🪝',
    accentColor: 'hsl(209 80% 32%)',
    keywords: ['olta aksesuarları', 'sahte yem', 'balık iğnesi', 'misina', 'olta takımı'],
  },
  {
    slug: 'outdoor-aksesuarlari',
    seoTitle: 'Outdoor Aksesuarları — Trekking & Survival',
    seoDescription: 'Trekking bıçağı, multi-tool, survival kit ve outdoor aksesuarları. Doğa yürüyüşü ve kamp için güvenlik ve pratiklik bir arada.',
    heroTitle: 'Outdoor & Trekking',
    heroSubtitle: 'Dağda, ormanda, kıyıda — her maceraya hazır ekipmanlar',
    infoTitle: 'Outdoor Macerası İçin Vazgeçilmez Ekipmanlar',
    infoText: 'Outdoor ve trekking aktiviteleri için doğru ekipman hem güvenliği hem de keyfi artırır. Kaliteli bir trekking bıçağı veya multi-tool, kamp ve doğa yürüyüşlerinde sayısız farklı işe yarar. Survival kit ise beklenmedik durumlara karşı temel bir güvencedir; içeriği iyi belirlenmiş setler hem hafif hem de kapsamlı olmalıdır. Uzun rotalar için hafif ancak dayanıklı malzeme tercih edin. Hangi aktivite için ekipman aradığınızı söyleyin, en uygun seçenekleri birlikte değerlendirelim.',
    whatsappMessage: 'Merhaba! Outdoor ve trekking için ekipman arıyorum. Yardımcı olur musunuz?',
    icon: '🧭',
    accentColor: 'hsl(149 43% 17%)',
    keywords: ['outdoor ekipmanları', 'trekking bıçağı', 'multi-tool', 'survival kit', 'doğa yürüyüşü'],
  },
  {
    slug: 'cakmak-ve-ates',
    seoTitle: 'Çakmak & Ateş Ekipmanları — Rüzgar Geçirmez',
    seoDescription: 'Rüzgar geçirmez çakmaklar, çakmaktaşları, magnezyum çubuk ve kamp ateşi tutuşturucular. Yağmurda ve nemde çalışan güvenli ateş ekipmanları.',
    heroTitle: 'Çakmak & Ateş Ekipmanları',
    heroSubtitle: 'Rüzgarda, yağmurda, nemde — her koşulda güvenli ateş',
    infoTitle: 'Doğru Ateş Ekipmanı Nasıl Seçilir?',
    infoText: 'Kamp ve outdoor maceralarında ateş hayati bir ihtiyaçtır — sıcaklık, yemek pişirme ve güvenlik için vazgeçilmezdir. Rüzgar geçirmez plazma çakmaklar her hava koşulunda güvenle çalışır; pille şarj edildikleri için yakıt taşıma derdi yoktur. Magnezyum çakmaktaşı (ferro rod) ise nemde bile binlerce kıvılcım üreten en güvenilir survival ekipmanıdır. Tutuşturucu fitil ve kamp ateşi başlatıcılar ıslak odunla bile ateş yakmanızı sağlar. Adana ve Toros\'ta kamp çantanızda mutlaka rüzgar geçirmez bir çakmak ve magnezyum çubuk bulundurun.',
    whatsappMessage: 'Merhaba! Çakmak ve ateş ekipmanları için yardım istiyorum.',
    icon: '🔥',
    accentColor: 'hsl(20 80% 45%)',
    keywords: ['çakmak', 'plazma çakmak', 'çakmaktaşı', 'magnezyum çubuk', 'kamp ateşi', 'tutuşturucu'],
  },
];

export const allProductsMeta = {
  seoTitle: 'Tüm Kamp & Balık Malzemeleri',
  seoDescription: 'Kamp çadırı, olta kamışı, kamp feneri, termos ve outdoor ekipmanlarında geniş ürün yelpazesi. Adana Sarıçam\'dan Türkiye geneline kaliteli malzemeler.',
  heroTitle: 'Tüm Ürünler',
  heroSubtitle: 'Kamp, balık ve outdoor malzemelerinde geniş ürün yelpazemiz',
  infoTitle: 'Aydoğan Kampçılık\'ta Ne Bulabilirsiniz?',
  infoText: 'Adana Sarıçam\'ın köklü kamp ve balık malzemeleri mağazası Aydoğan Kampçılık\'ta kamp çadırı, uyku tulumu, kamp ekipmanları, olta kamışı, balık makinesi, kamp feneri, kafa lambası, termos ve soğutucu başta olmak üzere yüzlerce outdoor malzemesi bulabilirsiniz. Tüm ürünler Adana ve Toros\'un zorlu doğa koşullarında test edilmiş, güvenilir markaların ürünleridir. WhatsApp\'tan sipariş vermeniz yeterli.',
  whatsappMessage: 'Merhaba! Kamp ve balık malzemeleri hakkında bilgi almak istiyorum.',
};

export function getCategoryMeta(slug?: string): typeof allProductsMeta | CategoryMeta {
  if (!slug) return allProductsMeta;
  return categoryMetas.find(m => m.slug === slug) ?? allProductsMeta;
}
