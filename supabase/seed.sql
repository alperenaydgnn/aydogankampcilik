-- =====================================================================
-- Seed data — Sarıçam Aydoğan Kamp & Balık
-- =====================================================================
-- Idempotent: re-running the seed keeps existing rows but upserts content.
-- Image URLs reference the Vite app's /mock/ directory (served statically
-- by the saricam-aydogan artifact). When deploying, replace with CDN /
-- Supabase Storage URLs.
-- =====================================================================

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
insert into public.categories (slug, name, description, image_url, sort_order) values
  ('cadirlar',             'Kamp Çadırları',           'Karadeniz rüzgarlarına dayanıklı, 4 mevsimlik kamp çadırları ve barınma ekipmanları.', '/mock/category-cadir.jpg',       1),
  ('olta-ve-makine',       'Olta & Balık Malzemeleri', 'Kıyıdan veya tekneden avlanmak için en kaliteli olta kamışları, balık makineleri ve balık malzemeleri.', '/mock/category-olta.jpg', 2),
  ('kamp-aksesuarlari',    'Kamp Ekipmanları',         'Kamp ocağı, kamp masası, sırt çantası ve daha fazlası — doğada ev konforu için kamp ekipmanları.', '/mock/category-aksesuar.jpg', 3),
  ('aydinlatma',           'Aydınlatma',               'Gece avları ve kamp geceleri için şarjlı fenerler, kafa lambaları ve kamp aydınlatma sistemleri.', '/mock/category-aydinlatma.jpg', 4),
  ('termos-ve-sogutucu',   'Termos & Soğutucu',        'Uzun kamp geceleri ve balık avı için içecekleri sıcak, yiyecekleri soğuk tutan premium termos ve soğutucu seçenekleri.', '/mock/product-5.jpg', 5),
  ('olta-aksesuarlari',    'Olta Aksesuarları',        'Sahte yem, iğne, misina, olta takımı ve balık avı aksesuarları — her türlü av için doğru ekipman.', '/mock/product-4.jpg', 6),
  ('outdoor-aksesuarlari', 'Outdoor & Trekking',       'Doğa yürüyüşü, trekking ve outdoor maceraları için kıyafet, çanta, bıçak ve survival ekipmanları.', '/mock/product-6.jpg', 7)
on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  image_url   = excluded.image_url,
  sort_order  = excluded.sort_order;

-- ---------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------
insert into public.tags (slug, name, color) values
  ('yeni',       'Yeni',         '#0EA5E9'),
  ('indirimli',  'İndirimli',    '#EF4444'),
  ('one-cikan',  'Öne Çıkan',    '#F59E0B'),
  ('sezonluk',   'Sezonluk',     '#22C55E'),
  ('cok-satan',  'Çok Satan',    '#A855F7')
on conflict (slug) do update set name = excluded.name, color = excluded.color;

-- ---------------------------------------------------------------------
-- products  (insert-only on conflict; updates re-run seeds safely)
-- ---------------------------------------------------------------------
with c as (select id, slug from public.categories)
insert into public.products
  (slug, name, category_id, description, short_description, specs, price, price_label, stock, is_new, featured, whatsapp_message)
values
  ('alpinist-pro-4-mevsim-kamp-cadiri',
   'Alpinist Pro 4 Mevsim Kamp Çadırı',
   (select id from c where slug='cadirlar'),
   'Yoğun yağış ve şiddetli rüzgara karşı ekstra güçlendirilmiş alüminyum poller. Kaçkar Dağları''nda defalarca test edilmiş, su geçirmez 3000mm kolon direncine sahip profesyonel çadır.',
   '4 mevsim profesyonel kamp çadırı.',
   '{"Kapasite":"3 Kişilik","Ağırlık":"3.2 kg","Su Geçirmezlik":"3000mm","Pol Malzemesi":"7001 Alüminyum"}'::jsonb,
   4250, '₺4.250', 25, false, true,
   'Alpinist Pro 4 Mevsim Kamp Çadırı hakkında bilgi almak istiyorum.'),

  ('kuzey-yildizi-uyku-tulumu',
   'Kuzey Yıldızı Uyku Tulumu (-15°C)',
   (select id from c where slug='cadirlar'),
   'Eksi derecelerde bile sıcacık bir uyku sunan, hafif ve kompakt uyku tulumu. Sentetik dolgusu sayesinde nemli Karadeniz havasında bile yalıtım özelliğini korur.',
   '-15°C ekstrem uyku tulumu.',
   '{"Konfor Derecesi":"-5°C","Ekstrem Derece":"-15°C","Ağırlık":"1.4 kg","Dolgu":"Hollowfibre Sentetik"}'::jsonb,
   1850, '₺1.850', 30, false, false,
   'Kuzey Yıldızı Uyku Tulumu için bilgi almak istiyorum.'),

  ('trailblazer-2-kisilik-trekking-cadiri',
   'Trailblazer 2 Kişilik Trekking Çadırı',
   (select id from c where slug='cadirlar'),
   'Tek çubuklu kurulum sistemi sayesinde tek kişi tarafından 5 dakikada kurulabilen hafif ve kompakt trekking çadırı.',
   'Hafif tek çubuklu trekking çadırı.',
   '{"Kapasite":"2 Kişilik","Ağırlık":"2.1 kg","Su Geçirmezlik":"2000mm","Kurulum":"Tek Çubuklu"}'::jsonb,
   2900, '₺2.900', 5, true, false,
   'Trailblazer 2 Kişilik Çadır için bilgi almak istiyorum.'),

  ('firtina-karbon-spin-olta-kamisi-270cm',
   'Fırtına Karbon Spin Olta Kamışı 270cm',
   (select id from c where slug='olta-ve-makine'),
   'Levrek ve lüfer avcıları için özel olarak tasarlanmış, at-çek avlarında yorulmadan saatlerce kullanabileceğiniz yüksek modüllü karbon kamış.',
   'Levrek/lüfer için yüksek modül karbon kamış.',
   '{"Boy":"270 cm","Atar":"15-40 gr","Ağırlık":"165 gr","Parça Sayısı":"2"}'::jsonb,
   2100, '₺2.100', 20, false, true,
   'Fırtına Karbon Olta Kamışı için bilgi almak istiyorum.'),

  ('karadeniz-surf-olta-makinesi-6000',
   'Karadeniz Surf Olta Makinesi 6000',
   (select id from c where slug='olta-ve-makine'),
   'Tuzlu suya ekstra dayanıklı paslanmaz çelik bilyalar. Kıyıdan uzak atışlar için tasarlanmış sığ kafa yapısı ve güçlü kalama sistemi.',
   'Surf casting için tuzlu su olta makinesi.',
   '{"Bilya Sayısı":"5+1","Devir":"4.6:1","Kalama Gücü":"12 kg","Ağırlık":"420 gr"}'::jsonb,
   null, 'Fiyat için sorunuz', 4, false, false,
   'Karadeniz Surf Makinesi 6000 için fiyat almak istiyorum.'),

  ('levrek-pro-jigging-olta-seti',
   'Levrek Pro Jigging Olta Seti (Komple)',
   (select id from c where slug='olta-ve-makine'),
   'Kamış + makine + misina kombinasyonu olarak hazır paket. Karadeniz levrek avcılığı için optimize edilmiş, hemen kullanıma hazır komple olta seti.',
   'Komple jigging olta seti.',
   '{"Kamış":"210cm Carbon Jigging","Makine":"3000 Spinning","Misina":"0.30mm 150m","Atar":"10-30 gr"}'::jsonb,
   1750, '₺1.750', 18, true, true,
   'Levrek Pro Jigging Seti için bilgi almak istiyorum.'),

  ('odun-atesi-portatif-kamp-ocagi',
   'Odun Ateşi Portatif Kamp Ocağı',
   (select id from c where slug='kamp-aksesuarlari'),
   'Küçük dallar ve kozalaklarla çayınızı anında demleyin. Katlanabilir çelik gövdesi ile çantada hiç yer kaplamaz.',
   'Katlanabilir odunlu kamp ocağı.',
   '{"Malzeme":"Paslanmaz Çelik","Kurulu Boyut":"15x15x20 cm","Katlı Boyut":"15x15x2 cm","Ağırlık":"450 gr"}'::jsonb,
   380, '₺380', 50, false, true,
   'Portatif Kamp Ocağı için bilgi almak istiyorum.'),

  ('zirve-katlanir-kamp-masasi',
   'Zirve Katlanır Kamp Masası',
   (select id from c where slug='kamp-aksesuarlari'),
   'Alüminyum iskeleti ve kumaş tablası sayesinde sadece 1 kg ağırlığında. İki kişilik kamp yemekleri için ideal kompakt çözüm.',
   'Hafif katlanır kamp masası.',
   '{"Taşıma Kapasitesi":"25 kg","Yüzey Malzemesi":"600D Oxford Kumaş","Kurulu Boyut":"56x42x40 cm","Ağırlık":"1.1 kg"}'::jsonb,
   650, '₺650', 22, false, false,
   'Katlanır Kamp Masası için bilgi almak istiyorum.'),

  ('orman-gezgini-45l-sirt-cantasi',
   'Orman Gezgini 45L Sırt Çantası',
   (select id from c where slug='kamp-aksesuarlari'),
   'Günübirlik veya hafta sonu yürüyüşleri için ideal. Sırtı terletmeyen air-mesh teknolojisi ve entegre yağmurluk.',
   '45L outdoor sırt çantası.',
   '{"Hacim":"45 Litre","Kumaş":"Su İtici Naylon","Sırt Sistemi":"Ergonomik Air-Mesh","Ekstra":"Dahili Yağmurluk"}'::jsonb,
   1450, '₺1.450', 7, false, false,
   'Orman Gezgini Sırt Çantası için bilgi almak istiyorum.'),

  ('golge-sarjli-kamp-feneri',
   'Gölge Şarjlı Kamp Feneri',
   (select id from c where slug='aydinlatma'),
   'Hem şarj edilebilir hem de powerbank olarak kullanılabilir. Çadır içini 360 derece aydınlatan sıcak sarı ışık modu ile kamp gecelerinize eşlik eder.',
   '400 lümen şarjlı kamp feneri.',
   '{"Işık Gücü":"400 Lümen","Pil Kapasitesi":"5000 mAh","Çalışma Süresi":"12 Saat (Sürekli)","Su Dayanımı":"IPX4"}'::jsonb,
   850, '₺850', 35, false, true,
   'Şarjlı Kamp Feneri için bilgi almak istiyorum.'),

  ('avci-pro-kafa-lambasi',
   'Avcı Pro Kafa Lambası',
   (select id from c where slug='aydinlatma'),
   'Gece avları ve doğa yürüyüşleri için hareket sensörlü aç/kapa özelliği. Kırmızı ışık modu ile gece görüşünüzü bozmaz.',
   '250 lümen avcı kafa lambası.',
   '{"Işık Gücü":"250 Lümen","Mesafe":"100 Metre","Ağırlık":"75 gr","Modlar":"Beyaz / Kırmızı / Çakar"}'::jsonb,
   550, '₺550', 40, false, false,
   'Avcı Pro Kafa Lambası için bilgi almak istiyorum.'),

  ('buzul-30l-kamp-termosu',
   'Buzul 30L Tekne & Kamp Soğutucusu',
   (select id from c where slug='termos-ve-sogutucu'),
   '3 gün boyunca buzları çözülmeden muhafaza eden, zorlu doğa koşullarına dayanıklı ekstra yalıtımlı poliüretan gövde.',
   '72 saat yalıtımlı kamp soğutucusu.',
   '{"Kapasite":"30 Litre","Yalıtım Süresi":"72 Saat","Dış Malzeme":"Yüksek Yoğunluklu PE","Boş Ağırlık":"3.5 kg"}'::jsonb,
   1950, '₺1.950', 12, false, true,
   'Buzul 30L Soğutucu için bilgi almak istiyorum.'),

  ('titan-vakumlu-kamp-termosu-1l',
   'Titan Vakumlu Kamp Termosu 1L',
   (select id from c where slug='termos-ve-sogutucu'),
   'Çift cidarlı vakum yalıtımı ile 24 saat sıcak, 48 saat soğuk içecek muhafazası. Paslanmaz çelik iç gövde.',
   '1L paslanmaz çelik vakum termos.',
   '{"Kapasite":"1 Litre","Sıcak Tutma":"24 Saat","Soğuk Tutma":"48 Saat","Malzeme":"304 Paslanmaz Çelik"}'::jsonb,
   680, '₺680', 28, false, false,
   'Titan Vakumlu Termos için bilgi almak istiyorum.'),

  ('derin-su-sahte-yem-seti',
   'Derin Su Sahte Yem Seti (5 Parça)',
   (select id from c where slug='olta-aksesuarlari'),
   'Gece avlarında yüksek verim sağlayan fosforlu gövdeye sahip, su içinde gerçekçi aksiyon gösteren 5 farklı renkte sahte yem seti.',
   '5 parça gece avı sahte yem seti.',
   '{"Boy":"11 cm","Ağırlık":"15 gr","Aksiyon":"Dalan (Sinking)","İğne":"VMC Paslanmaz"}'::jsonb,
   450, '₺450', 60, false, false,
   'Sahte Yem Seti için bilgi almak istiyorum.'),

  ('summit-trekking-bicagi-g10-sapli',
   'Summit Trekking Bıçağı — G10 Saplı',
   (select id from c where slug='outdoor-aksesuarlari'),
   'Full-tang çelik gövde ve su geçirmez G10 kompozit sap. Kamp, balık temizleme ve survival kullanıma uygun çok amaçlı trekking bıçağı.',
   'Full-tang G10 saplı outdoor bıçak.',
   '{"Çelik":"440C Paslanmaz","Sap":"G10 Kompozit","Toplam Uzunluk":"22 cm","Ağırlık":"180 gr"}'::jsonb,
   750, '₺750', 14, true, true,
   'Summit Trekking Bıçağı için bilgi almak istiyorum.'),

  ('survival-kit-acil-durum-seti',
   'Survival Kit — Acil Durum Seti 12 Parça',
   (select id from c where slug='outdoor-aksesuarlari'),
   'Dağ, orman ve kıyı maceralarında hayatta kalma ve ilk yardım için 12 zorunlu eleman. Su geçirmez çanta içinde organize.',
   '12 parça survival/ilk yardım seti.',
   '{"İçerik":"12 Parça","Paket":"Su Geçirmez Poşet","Boyut":"15x10x5 cm","Ağırlık":"320 gr"}'::jsonb,
   380, '₺380', 0, false, false,
   'Survival Kit hakkında bilgi almak istiyorum.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------
-- Strategy: clear & re-insert to keep idempotent.
delete from public.product_images
 where product_id in (select id from public.products where slug in (
   'alpinist-pro-4-mevsim-kamp-cadiri','kuzey-yildizi-uyku-tulumu','trailblazer-2-kisilik-trekking-cadiri',
   'firtina-karbon-spin-olta-kamisi-270cm','karadeniz-surf-olta-makinesi-6000','levrek-pro-jigging-olta-seti',
   'odun-atesi-portatif-kamp-ocagi','zirve-katlanir-kamp-masasi','orman-gezgini-45l-sirt-cantasi',
   'golge-sarjli-kamp-feneri','avci-pro-kafa-lambasi','buzul-30l-kamp-termosu','titan-vakumlu-kamp-termosu-1l',
   'derin-su-sahte-yem-seti','summit-trekking-bicagi-g10-sapli','survival-kit-acil-durum-seti'));

insert into public.product_images (product_id, url, sort_order, is_primary, alt_text)
select p.id, x.url, x.sort_order, x.is_primary, p.name
from public.products p
join (values
  ('alpinist-pro-4-mevsim-kamp-cadiri',     '/mock/product-1.jpg',         0, true),
  ('alpinist-pro-4-mevsim-kamp-cadiri',     '/mock/category-cadir.jpg',    1, false),
  ('kuzey-yildizi-uyku-tulumu',             '/mock/product-1.jpg',         0, true),
  ('trailblazer-2-kisilik-trekking-cadiri', '/mock/category-cadir.jpg',    0, true),
  ('firtina-karbon-spin-olta-kamisi-270cm', '/mock/product-3.jpg',         0, true),
  ('karadeniz-surf-olta-makinesi-6000',     '/mock/product-3.jpg',         0, true),
  ('levrek-pro-jigging-olta-seti',          '/mock/category-olta.jpg',     0, true),
  ('odun-atesi-portatif-kamp-ocagi',        '/mock/product-2.jpg',         0, true),
  ('zirve-katlanir-kamp-masasi',            '/mock/category-aksesuar.jpg', 0, true),
  ('orman-gezgini-45l-sirt-cantasi',        '/mock/product-6.jpg',         0, true),
  ('golge-sarjli-kamp-feneri',              '/mock/category-aydinlatma.jpg', 0, true),
  ('avci-pro-kafa-lambasi',                 '/mock/category-aydinlatma.jpg', 0, true),
  ('buzul-30l-kamp-termosu',                '/mock/product-5.jpg',         0, true),
  ('titan-vakumlu-kamp-termosu-1l',         '/mock/product-5.jpg',         0, true),
  ('derin-su-sahte-yem-seti',               '/mock/product-4.jpg',         0, true),
  ('summit-trekking-bicagi-g10-sapli',      '/mock/product-6.jpg',         0, true),
  ('survival-kit-acil-durum-seti',          '/mock/product-6.jpg',         0, true)
) as x(product_slug, url, sort_order, is_primary)
on (p.slug = x.product_slug);

-- ---------------------------------------------------------------------
-- product_tags
-- ---------------------------------------------------------------------
delete from public.product_tags
 where product_id in (select id from public.products);

insert into public.product_tags (product_id, tag_id)
select p.id, t.id from public.products p
join public.tags t on t.slug = 'one-cikan'
where p.featured = true;

insert into public.product_tags (product_id, tag_id)
select p.id, t.id from public.products p
join public.tags t on t.slug = 'yeni'
where p.is_new = true
on conflict do nothing;

insert into public.product_tags (product_id, tag_id)
select p.id, t.id from public.products p
join public.tags t on t.slug = 'cok-satan'
where p.slug in ('odun-atesi-portatif-kamp-ocagi','golge-sarjli-kamp-feneri','firtina-karbon-spin-olta-kamisi-270cm')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- site_settings — key/value bag for site-wide configuration
-- ---------------------------------------------------------------------
insert into public.site_settings (key, value, description) values
  ('phone',           '"+90 555 123 4567"'::jsonb,                         'Mağaza iletişim telefonu'),
  ('whatsapp',        '"+905551234567"'::jsonb,                            'WhatsApp numarası (uluslararası format, + ile)'),
  ('email',           '"info@saricamaydogan.com"'::jsonb,                  'İletişim e-postası'),
  ('address',         '"Cumhuriyet Mah. Sahil Cd. No:42, Trabzon"'::jsonb, 'Mağaza adresi'),
  ('map_url',         '"https://maps.app.goo.gl/saricam-aydogan"'::jsonb,  'Google Maps konumu'),
  ('hero_title',      '"Karadeniz''in Doğasına Hazır Ol"'::jsonb,          'Anasayfa hero başlığı'),
  ('hero_subtitle',   '"Trabzon''un kalbinde 25 yıllık tecrübeyle kamp ve balıkçı malzemeleri."'::jsonb, 'Anasayfa hero alt başlığı'),
  ('working_hours',   '"Pzt–Cmt 09:00–19:00"'::jsonb,                      'Çalışma saatleri'),
  ('social',          '{"instagram":"https://instagram.com/saricamaydogan","facebook":"https://facebook.com/saricamaydogan"}'::jsonb, 'Sosyal medya URL''leri')
on conflict (key) do update set
  value       = excluded.value,
  description = excluded.description;
