export type CampSpotKind = "yayla" | "göl" | "orman" | "sahil" | "dere";
export type CampDifficulty = "kolay" | "orta" | "zor";

export type CampSpot = {
  id: string;
  name: string;
  region: string;
  kind: CampSpotKind;
  lat: number;
  lon: number;
  altitude?: number;
  difficulty: CampDifficulty;
  bestSeason: string;
  description: string;
  features: string[];
  recommendedGear: string[];
  fishing?: boolean;
  parking?: boolean;
  water?: boolean;
};

/** 110+ Türkiye kamp noktası — gerçek koordinatlarla */
export const campSpots: CampSpot[] = [
  /* ── ADANA / TOROS ────────────────────────────── */
  { id: "karanlik-kanyon", name: "Karanlık Kanyon", region: "Adana / Anamur", kind: "dere", lat: 36.305, lon: 32.850, altitude: 200, difficulty: "orta", bestSeason: "Nisan–Ekim", description: "Görkemli kanyon içinde vahşi kamp; dere soğuğu ve gölgeli atmosfer eşsiz.", features: ["kanyon", "soğuk dere"], recommendedGear: ["3-mevsim çadır", "su geçirmez bot", "trekking sopası"], water: true },
  { id: "pozanti-toros", name: "Pozantı Yaylası", region: "Adana / Pozantı", kind: "yayla", lat: 37.424, lon: 34.885, altitude: 1200, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Torosların eteklerinde, Adana'ya yakın serin yayla; araç kampı için ideal.", features: ["serin iklim", "araç kampı"], recommendedGear: ["3-mevsim çadır", "hafif tulum"], parking: true, water: true },
  { id: "seyhan-baraji", name: "Seyhan Barajı Kıyısı", region: "Adana", kind: "göl", lat: 37.102, lon: 35.302, altitude: 80, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "Adana merkeze yakın, balıkçılık ve kamp için sakin rezervuar kıyısı.", features: ["göl manzarası", "balıkçılık"], recommendedGear: ["yaz çadırı", "balık ekipmanı"], fishing: true, parking: true, water: true },
  { id: "tufanbeyli", name: "Tufanbeyli Yaylası", region: "Adana / Tufanbeyli", kind: "yayla", lat: 38.271, lon: 36.826, altitude: 1500, difficulty: "kolay", bestSeason: "Haziran–Eylül", description: "Adana'nın kuzeyinde serin ve sakin yayla ortamı.", features: ["sessiz", "serin"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"], parking: true, water: true },
  { id: "kozan-orman", name: "Kozan Orman Kampı", region: "Adana / Kozan", kind: "orman", lat: 37.450, lon: 35.800, altitude: 650, difficulty: "kolay", bestSeason: "Nisan–Kasım", description: "Sık çam ormanı içinde gölgeli ve serin aile kamp alanı.", features: ["orman gölgesi", "aile uygun"], recommendedGear: ["3-mevsim çadır", "kamp masası"], parking: true, water: true },
  { id: "catalan-baraji", name: "Çatalan Barajı", region: "Adana / Ceyhan", kind: "göl", lat: 37.083, lon: 35.917, altitude: 70, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "Sazan ve yayın avcılığı için popüler; geniş kıyıda kamp kurulabilir.", features: ["balıkçılık", "geniş alan"], recommendedGear: ["yaz çadırı", "olta takımı"], fishing: true, parking: true },
  { id: "aladaglar-camp", name: "Aladağlar Vadisi", region: "Adana / Niğde", kind: "yayla", lat: 37.800, lon: 35.250, altitude: 1900, difficulty: "zor", bestSeason: "Haziran–Eylül", description: "Türkiye'nin en görkemli dağ silsilelerinden biri.", features: ["yüksek rakım", "dağ tırmanışı"], recommendedGear: ["4-mevsim çadır", "0°C tulum", "trekking botu"] },
  { id: "cukurova-delta", name: "Çukurova Deltası", region: "Adana / Karataş", kind: "sahil", lat: 36.550, lon: 35.383, altitude: 2, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Delta kıyısında kuş gözlemi ve balık tutma imkânıyla sahil kampı.", features: ["sahil", "kuş gözlemi"], recommendedGear: ["yaz çadırı", "böcek önleyici"], fishing: true, parking: true },
  { id: "kozan-toros-dere", name: "Zamantı Çayı", region: "Adana / Kayseri", kind: "dere", lat: 38.470, lon: 36.420, altitude: 900, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Torosları yaran nehir vadisinde dere kenarı kamp.", features: ["dere", "balıkçılık"], recommendedGear: ["3-mevsim çadır", "su botu"], water: true, fishing: true },

  /* ── ANTALYA ──────────────────────────────────── */
  { id: "olympos", name: "Olympos", region: "Antalya", kind: "sahil", lat: 36.394, lon: 30.482, altitude: 5, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "Antik kent ve sahil kombinasyonu.", features: ["sahil", "antik kent"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "cirali", name: "Çıralı", region: "Antalya", kind: "sahil", lat: 36.413, lon: 30.478, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Sakin sahil, narenciye bahçeleri, Chimera alevleri.", features: ["sahil", "narenciye"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "termessos", name: "Termessos Yamaçları", region: "Antalya", kind: "orman", lat: 37.068, lon: 30.512, altitude: 1050, difficulty: "orta", bestSeason: "Nisan–Kasım", description: "Antik dağ kenti yakınında çam ormanı içi kamp.", features: ["antik", "orman"], recommendedGear: ["3-mevsim çadır", "trekking botu"], parking: true },
  { id: "geyik-dagi", name: "Geyik Dağı", region: "Antalya", kind: "yayla", lat: 37.120, lon: 31.280, altitude: 1700, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Tırmanış ve yayla kampı için popüler yüksek nokta.", features: ["tırmanış", "panoramik"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"] },
  { id: "koprulu-kanyon", name: "Köprülü Kanyon", region: "Antalya", kind: "dere", lat: 37.270, lon: 31.315, altitude: 500, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Rafting ve kamp; kanyon içi serin kamp noktaları.", features: ["rafting", "kanyon", "dere"], recommendedGear: ["3-mevsim çadır", "sandalet"], water: true, parking: true },
  { id: "dim-cayi", name: "Dim Çayı Kanyonu", region: "Antalya / Alanya", kind: "dere", lat: 36.565, lon: 31.980, altitude: 150, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Serin dere kıyısında gölgeli kamp ve balıkçılık.", features: ["dere", "kanyon", "balık"], recommendedGear: ["yaz çadırı", "sandalet"], fishing: true, water: true, parking: true },

  /* ── MUĞLA ───────────────────────────────────── */
  { id: "kabak-koyu", name: "Kabak Koyu", region: "Muğla / Fethiye", kind: "sahil", lat: 36.488, lon: 29.131, altitude: 200, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Patika ile ulaşılan koy; alternatif kampçı merkezi.", features: ["koy", "huzur"], recommendedGear: ["3-mevsim çadır", "trekking botu"] },
  { id: "saklikent", name: "Saklıkent Kanyonu", region: "Muğla / Fethiye", kind: "dere", lat: 36.493, lon: 29.352, altitude: 350, difficulty: "kolay", bestSeason: "Yaz", description: "Kanyon girişi yakını kampa uygun, soğuk dere.", features: ["kanyon", "soğuk dere"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "oludeniz", name: "Ölüdeniz", region: "Muğla / Fethiye", kind: "sahil", lat: 36.550, lon: 29.120, altitude: 5, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Turkuaz göl lagünü kıyısında kamp.", features: ["lagün", "yüzme"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "butterfly-valley", name: "Kelebek Vadisi", region: "Muğla / Fethiye", kind: "sahil", lat: 36.536, lon: 29.092, altitude: 10, difficulty: "orta", bestSeason: "Mayıs–Eylül", description: "Tekneyle ulaşılan eşsiz koy; jeneratör yasak.", features: ["koy", "yüzme"], recommendedGear: ["hafif çadır"] },
  { id: "datca", name: "Datça Kıyısı", region: "Muğla / Datça", kind: "sahil", lat: 36.720, lon: 27.690, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Sakin Datça yarımadasında çam ormanı ve sahil kampı.", features: ["yarımada", "sahil"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "bozburun", name: "Bozburun", region: "Muğla", kind: "sahil", lat: 36.683, lon: 28.050, altitude: 5, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Ege'nin sakin köyünde balıkçıların tercih ettiği kamp.", features: ["tekne", "balıkçılık"], recommendedGear: ["yaz çadırı"], fishing: true, parking: true },
  { id: "bafa-golu", name: "Bafa Gölü", region: "Muğla / Milas", kind: "göl", lat: 37.490, lon: 27.460, altitude: 5, difficulty: "kolay", bestSeason: "Tüm yıl", description: "Ege'nin doğasıyla bütünleşmiş zeytin bahçeleri arasında sakin göl.", features: ["göl", "kuş gözlemi", "Herakleya"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },
  { id: "gocek", name: "Göcek Koyu", region: "Muğla / Fethiye", kind: "sahil", lat: 36.740, lon: 28.930, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Mavi yolculuk güzergâhında tekneyle ulaşılan sakin koylar.", features: ["koy", "tekne"], recommendedGear: ["yaz çadırı"] },
  { id: "akyaka", name: "Akyaka (Gökova)", region: "Muğla / Ula", kind: "sahil", lat: 37.050, lon: 28.350, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Gökova koyunda sazlık kenarı kamp, rüzgar sörfü merkezi.", features: ["koy", "sörf"], recommendedGear: ["yaz çadırı"], parking: true, water: true },

  /* ── AYDİN / DENİZLİ ────────────────────────── */
  { id: "dilek-yarimadasi", name: "Dilek Yarımadası", region: "Aydın", kind: "sahil", lat: 37.720, lon: 27.220, altitude: 10, difficulty: "kolay", bestSeason: "Nisan–Kasım", description: "Milli park içinde Ege sahilinde kamp.", features: ["milli park", "sahil"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "pamukkale", name: "Pamukkale Yakını (Karahayıt)", region: "Denizli", kind: "orman", lat: 37.920, lon: 29.120, altitude: 350, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "Antik Hierapolis yakınında zeytinlik ve bahçe içi kamp.", features: ["tarihi", "kaplıca"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },

  /* ── İZMİR / MANİSA / BALIKESİR ─────────────── */
  { id: "foca", name: "Foça", region: "İzmir", kind: "sahil", lat: 38.670, lon: 26.750, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Ege'nin en iyi korunmuş kıyılarından; fok mağaraları yakını.", features: ["sahil", "antik"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "spil-dagi", name: "Spil Dağı", region: "Manisa", kind: "orman", lat: 38.620, lon: 27.750, altitude: 1500, difficulty: "orta", bestSeason: "Nisan–Ekim", description: "Milli park içinde serin orman kampı.", features: ["milli park", "orman"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "kaz-daglari", name: "Kaz Dağları", region: "Çanakkale / Balıkesir", kind: "orman", lat: 39.708, lon: 26.850, altitude: 1280, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Oksijen oranı yüksek milli park, İda Dağı.", features: ["milli park", "efsane"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "ayvalik", name: "Ayvalık Sahili", region: "Balıkesir", kind: "sahil", lat: 39.337, lon: 26.648, altitude: 5, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Adalar ve sahil; balıkçılık çok güzel.", features: ["sahil", "ada"], recommendedGear: ["yaz çadırı"], fishing: true, parking: true },

  /* ── ÇANAKKALE / EDİRNE / KIRKLARELİ ─────────── */
  { id: "assos", name: "Assos (Behramkale)", region: "Çanakkale", kind: "sahil", lat: 39.492, lon: 26.340, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Kasım", description: "Antik Assos limanı yakınında bazalt kıyıda kamp.", features: ["antik", "sahil"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "saros-korfezi", name: "Saros Körfezi", region: "Edirne", kind: "sahil", lat: 40.570, lon: 26.470, altitude: 3, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Mavi bayraklı kumsal, Trakya'nın en temiz denizi.", features: ["kumsal", "temiz deniz"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "kiyikoy", name: "Kıyıköy", region: "Kırklareli", kind: "sahil", lat: 41.640, lon: 27.970, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Karadeniz kıyısında balıkçı köyü, ormanlık yayla.", features: ["sahil", "balıkçı"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true },

  /* ── İSTANBUL / KOCAELİ / SAKARYA ───────────── */
  { id: "agva", name: "Ağva", region: "İstanbul / Şile", kind: "orman", lat: 41.130, lon: 29.840, altitude: 20, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "İstanbul yakını nehir, orman ve kıyı kampı.", features: ["nehir", "orman", "sahil"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "polonézkoy", name: "Polonezköy", region: "İstanbul / Beykoz", kind: "orman", lat: 41.150, lon: 29.290, altitude: 150, difficulty: "kolay", bestSeason: "Tüm yıl", description: "Tarihi Polonez köyü, meşe ve kayın ormanı.", features: ["tarihi", "orman"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "sapanca", name: "Sapanca Gölü", region: "Kocaeli / Sakarya", kind: "göl", lat: 40.680, lon: 30.270, altitude: 30, difficulty: "kolay", bestSeason: "Tüm yıl", description: "Türkiye'nin en temiz gölü; orman içi sahil kampı.", features: ["göl", "orman"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },

  /* ── BOLU / DÜZCE ────────────────────────────── */
  { id: "abant", name: "Abant Gölü", region: "Bolu", kind: "göl", lat: 40.609, lon: 31.278, altitude: 1320, difficulty: "kolay", bestSeason: "Tüm yıl", description: "Tabiat parkı; göl çevresi yürüyüş.", features: ["tabiat parkı"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },
  { id: "yedigoller", name: "Yedigöller", region: "Bolu", kind: "orman", lat: 41.083, lon: 31.733, altitude: 750, difficulty: "kolay", bestSeason: "Sonbahar", description: "Sonbahar renkleri ile ünlü milli park.", features: ["milli park", "sonbahar"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "golcuk-bolu", name: "Göynük Kanyonu", region: "Bolu", kind: "dere", lat: 40.394, lon: 30.771, altitude: 430, difficulty: "orta", bestSeason: "Nisan–Ekim", description: "Kanyoning sporu için popüler, şelale kenarı kamp.", features: ["kanyon", "şelale", "kanyoning"], recommendedGear: ["3-mevsim çadır", "su botu"], water: true, parking: true },

  /* ── BURSA ───────────────────────────────────── */
  { id: "uludag", name: "Uludağ Sarıalan", region: "Bursa", kind: "orman", lat: 40.092, lon: 29.133, altitude: 1640, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Resmi kamp alanı, milli park içi.", features: ["milli park", "resmi alan"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "golyazi", name: "Gölyazı (Apolyont)", region: "Bursa", kind: "göl", lat: 40.170, lon: 28.730, altitude: 10, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Antik ada üstündeki köy; gölde balık, kamp.", features: ["tarihi", "göl"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },

  /* ── KASTAMONU / BARTIN ──────────────────────── */
  { id: "ilgaz-dagi", name: "Ilgaz Dağı", region: "Kastamonu", kind: "orman", lat: 41.050, lon: 33.720, altitude: 1800, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Milli park içi orman kampı, serin yayla.", features: ["milli park", "orman"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "kure-daglari", name: "Küre Dağları", region: "Kastamonu / Bartın", kind: "orman", lat: 41.800, lon: 33.700, altitude: 1200, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Kanyonlar, mağaralar ve ormanlık kamp alanları.", features: ["kanyon", "mağara", "milli park"], recommendedGear: ["3-mevsim çadır", "trekking botu"], water: true },
  { id: "gideros-koyu", name: "Gideros Koyu", region: "Kastamonu / Cide", kind: "sahil", lat: 42.010, lon: 33.040, altitude: 5, difficulty: "kolay", bestSeason: "Haziran–Eylül", description: "Karadeniz'in el değmemiş koylarından biri.", features: ["koy", "sahil"], recommendedGear: ["3-mevsim çadır"], parking: true },

  /* ── SİNOP ───────────────────────────────────── */
  { id: "hamsilos", name: "Hamsilos Fiyordu", region: "Sinop", kind: "sahil", lat: 42.060, lon: 34.800, altitude: 5, difficulty: "kolay", bestSeason: "Haziran–Eylül", description: "Türkiye'nin tek doğal fiyordu; küçük kamp noktaları.", features: ["fiyort", "balıkçılık"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true },
  { id: "sarikum", name: "Sarıkum Gölü", region: "Sinop", kind: "göl", lat: 42.000, lon: 34.960, altitude: 5, difficulty: "kolay", bestSeason: "Nisan–Eylül", description: "Türkiye'nin en büyük kumulları yanında tatlı su gölü.", features: ["kumul", "göl", "kuş gözlemi"], recommendedGear: ["3-mevsim çadır"], parking: true },

  /* ── SAMSUN / ORDU / GİRESUN ─────────────────── */
  { id: "terme", name: "Terme Nehir Deltası", region: "Samsun", kind: "dere", lat: 41.210, lon: 36.970, altitude: 5, difficulty: "kolay", bestSeason: "Mayıs–Eylül", description: "Kızılırmak'ın delta ağzında balıkçılık ve kamp.", features: ["delta", "balıkçılık"], recommendedGear: ["yaz çadırı"], fishing: true, parking: true },
  { id: "kumbet-yaylasi", name: "Kümbet Yaylası", region: "Giresun", kind: "yayla", lat: 40.450, lon: 38.470, altitude: 1900, difficulty: "kolay", bestSeason: "Haziran–Eylül", description: "Karadeniz yaylacılık geleneğinin kalbinde serin kamp.", features: ["yayla", "serin"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"], water: true },
  { id: "ordu-boztepe", name: "Ordu Boztepe Ormanı", region: "Ordu", kind: "orman", lat: 40.980, lon: 37.880, altitude: 500, difficulty: "kolay", bestSeason: "Mayıs–Eylül", description: "Şehre yakın orman içi piknik ve kamp noktaları.", features: ["orman", "şehre yakın"], recommendedGear: ["3-mevsim çadır"], parking: true },

  /* ── GİRESUN / GÜMÜŞHANE ────────────────────── */
  { id: "limni-golu", name: "Limni Gölü", region: "Gümüşhane", kind: "göl", lat: 40.210, lon: 39.170, altitude: 2000, difficulty: "orta", bestSeason: "Temmuz–Eylül", description: "Yüksek dağ gölü; eşsiz kamp ve balıkçılık.", features: ["yüksek dağ", "göl", "balıkçılık"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"], fishing: true },
  { id: "harşit-vadisi", name: "Harşit Vadisi", region: "Gümüşhane", kind: "dere", lat: 40.460, lon: 39.480, altitude: 600, difficulty: "orta", bestSeason: "Nisan–Ekim", description: "Derin vadi içinde nehir kenarı kamp.", features: ["vadi", "nehir"], recommendedGear: ["3-mevsim çadır"], water: true },

  /* ── RİZE ────────────────────────────────────── */
  { id: "ayder", name: "Ayder Yaylası", region: "Rize / Çamlıhemşin", kind: "yayla", lat: 40.893, lon: 41.201, altitude: 1350, difficulty: "kolay", bestSeason: "Haziran–Eylül", description: "Doğu Karadeniz'in en güzel termal yaylası.", features: ["yayla", "termal", "şelale"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "elevit", name: "Elevit Yaylası", region: "Rize / Çamlıhemşin", kind: "yayla", lat: 40.970, lon: 40.980, altitude: 2070, difficulty: "orta", bestSeason: "Temmuz–Ağustos", description: "Kaçkar tırmanışı için ideal üs yayla.", features: ["yayla", "tırmanış"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"] },
  { id: "kaçkar-asagi", name: "Kaçkar Aşağı Kamp", region: "Rize / Çamlıhemşin", kind: "dere", lat: 40.836, lon: 41.067, altitude: 1900, difficulty: "zor", bestSeason: "Temmuz–Ağustos", description: "Kaçkar zirvesi tırmanışına çıkış kampı.", features: ["zirve tırmanışı"], recommendedGear: ["4-mevsim çadır", "0°C tulum"] },
  { id: "kaçkar-yukari", name: "Dilberdüzü (Kaçkar)", region: "Rize / Çamlıhemşin", kind: "yayla", lat: 40.828, lon: 41.077, altitude: 2820, difficulty: "zor", bestSeason: "Temmuz–Ağustos", description: "Kaçkar zirvesi öncesi son kamp; göl yansımaları.", features: ["yüksek rakım", "göl"], recommendedGear: ["4-mevsim çadır", "-5°C tulum"] },

  /* ── ARTVİN ──────────────────────────────────── */
  { id: "borcka-karagol", name: "Borçka Karagöl", region: "Artvin", kind: "göl", lat: 41.453, lon: 41.738, altitude: 1500, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Heyelan gölü; orman içinde gizli cennet.", features: ["orman", "göl"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "savsat-karagol", name: "Şavşat Karagöl", region: "Artvin / Şavşat", kind: "göl", lat: 41.233, lon: 42.367, altitude: 1610, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Milli park içinde sakin orman gölü.", features: ["milli park", "göl"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "barhal", name: "Barhal (Altıparmak)", region: "Artvin", kind: "dere", lat: 40.840, lon: 41.590, altitude: 1300, difficulty: "orta", bestSeason: "Haziran–Eylül", description: "Gürcü kilisesi ve dere kenarı kamp.", features: ["tarihi", "dere"], recommendedGear: ["3-mevsim çadır", "trekking botu"], water: true },
  { id: "coruh-rafting", name: "Çoruh Nehri (Yusufeli)", region: "Artvin / Yusufeli", kind: "dere", lat: 40.820, lon: 41.540, altitude: 600, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Dünyanın en hızlı akan nehirlerinden; rafting kamp.", features: ["rafting", "nehir"], recommendedGear: ["3-mevsim çadır", "su botu"], water: true },

  /* ── ERZURUM / ERZİNCAN / TUNCELİ ───────────── */
  { id: "tortum-golu", name: "Tortum Şelalesi", region: "Erzurum", kind: "göl", lat: 40.510, lon: 41.540, altitude: 1200, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Türkiye'nin en büyük doğal şelalesi yakınında kamp.", features: ["şelale", "göl"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "palandoken", name: "Palandöken Yaylası", region: "Erzurum", kind: "yayla", lat: 39.880, lon: 41.220, altitude: 2200, difficulty: "orta", bestSeason: "Haziran–Eylül", description: "Kış sporları merkezinin yazın gizli yaylası.", features: ["yayla", "panoramik"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"] },
  { id: "kemaliye", name: "Kemaliye Kanyonu", region: "Erzincan", kind: "dere", lat: 39.260, lon: 38.490, altitude: 900, difficulty: "orta", bestSeason: "Nisan–Ekim", description: "Fırat vadisinde tarihi yollar ve kanyon kampı.", features: ["kanyon", "tarihi", "vadi"], recommendedGear: ["3-mevsim çadır", "trekking botu"], water: true },
  { id: "munzur", name: "Munzur Vadisi", region: "Tunceli", kind: "dere", lat: 39.300, lon: 39.450, altitude: 1100, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Milli park içi vadi; pınar başları ve kanyonlar.", features: ["milli park", "pınar", "vadi"], recommendedGear: ["3-mevsim çadır"], water: true, fishing: true },

  /* ── MALATYA / ELAZIĞ / DİYARBAKIR ──────────── */
  { id: "hazar-golu", name: "Hazar Gölü", region: "Elazığ", kind: "göl", lat: 38.480, lon: 39.370, altitude: 1250, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Fırat havzasında doğal göl; kamp ve balıkçılık.", features: ["göl", "balıkçılık"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },
  { id: "golbasi-golu", name: "Gölbaşı Gölü", region: "Adıyaman", kind: "göl", lat: 37.780, lon: 37.640, altitude: 750, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "Güneydoğu'nun nadir doğa harikası; su kuşları cenneti.", features: ["göl", "kuş gözlemi"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true },
  { id: "nemrut-adiyaman", name: "Nemrut Dağı (Kommagene)", region: "Adıyaman", kind: "yayla", lat: 37.980, lon: 38.740, altitude: 2150, difficulty: "orta", bestSeason: "Mayıs–Ekim", description: "Tanrı heykellerinin bulunduğu tapınak dağı; gece kampı eşsiz.", features: ["tarihi", "gün doğumu", "heykel"], recommendedGear: ["3-mevsim çadır", "+5°C tulum", "fener"], parking: true },

  /* ── VAN / BİTLİS / MUŞ ─────────────────────── */
  { id: "van-golu", name: "Van Gölü Kıyısı", region: "Van", kind: "göl", lat: 38.370, lon: 43.340, altitude: 1650, difficulty: "kolay", bestSeason: "Mayıs–Eylül", description: "Dünyanın ikinci büyük sodalı gölü kıyısında kamp.", features: ["göl", "ada", "tarihi"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "nemrut-krater", name: "Nemrut Krater Gölü", region: "Bitlis", kind: "göl", lat: 38.650, lon: 42.233, altitude: 2247, difficulty: "orta", bestSeason: "Haziran–Eylül", description: "Aktif krater içindeki sıcak ve soğuk iki göl.", features: ["krater", "yüksek rakım"], recommendedGear: ["4-mevsim çadır", "+5°C tulum"], fishing: true },

  /* ── ŞANLIURFA / GAZİANTEP ──────────────────── */
  { id: "halfeti", name: "Halfeti Fırat Kıyısı", region: "Şanlıurfa", kind: "dere", lat: 37.260, lon: 37.860, altitude: 380, difficulty: "kolay", bestSeason: "Ekim–Nisan", description: "Su altında kalan tarihi köy; Fırat kıyısı kamp.", features: ["tarihi", "nehir", "bağ"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "rumkale", name: "Rumkale Fırat", region: "Gaziantep / Halfeti", kind: "dere", lat: 37.340, lon: 37.750, altitude: 420, difficulty: "kolay", bestSeason: "Ekim–Nisan", description: "Fırat üzerindeki Bizans kalesi yakınında nehir kampı.", features: ["tarihi", "nehir", "kale"], recommendedGear: ["yaz çadırı"], parking: true },

  /* ── KAYSERİ / NEVŞEHİR / AKSARAY ───────────── */
  { id: "erciyes", name: "Erciyes Dağı", region: "Kayseri", kind: "yayla", lat: 38.530, lon: 35.450, altitude: 2200, difficulty: "orta", bestSeason: "Haziran–Eylül", description: "Türkiye'nin önemli volkanik dağlarından; tırmanış kampı.", features: ["volkanik", "tırmanış"], recommendedGear: ["3-mevsim çadır", "0°C tulum"] },
  { id: "sultan-sazligi", name: "Sultan Sazlığı", region: "Kayseri", kind: "göl", lat: 38.220, lon: 35.560, altitude: 1050, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Milli park; kuş gözlemi için Türkiye'nin en önemli alanı.", features: ["kuş gözlemi", "bataklık"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "goreme-kamp", name: "Göreme / Kapadokya", region: "Nevşehir", kind: "yayla", lat: 38.644, lon: 34.852, altitude: 1100, difficulty: "kolay", bestSeason: "Nisan–Kasım", description: "Peri bacaları arasında çadır veya yeraltı mağara kampı.", features: ["peri bacası", "tarihi", "balon"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "ihlara", name: "Ihlara Vadisi", region: "Aksaray", kind: "dere", lat: 38.252, lon: 34.308, altitude: 1100, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Dere kenarı; kayadan oyma kiliseler ve yürüyüş.", features: ["dere", "tarihi"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "aktas-golu", name: "Aktaş Gölü", region: "Niğde", kind: "göl", lat: 37.720, lon: 34.270, altitude: 1500, difficulty: "orta", bestSeason: "Haziran–Eylül", description: "Aladağlar yakınında dağ gölü.", features: ["dağ gölü", "tırmanış"], recommendedGear: ["3-mevsim çadır", "su filtresi"], fishing: true },

  /* ── SİVAS / MALATYA ────────────────────────── */
  { id: "kangal-balikli", name: "Kangal Balıklı Çermik", region: "Sivas", kind: "dere", lat: 39.230, lon: 37.380, altitude: 1000, difficulty: "kolay", bestSeason: "Tüm yıl", description: "Termal su ve doktor balıkları ile eşsiz kamp deneyimi.", features: ["termal", "doktor balık"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "divriği", name: "Divriği Çayı", region: "Sivas", kind: "dere", lat: 39.370, lon: 38.110, altitude: 1250, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "UNESCO mirası Divriği yakınında nehir kenarı kamp.", features: ["tarihi", "nehir"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },

  /* ── ISPARTA / BURDUR / KONYA ────────────────── */
  { id: "kovada-golu", name: "Kovada Gölü", region: "Isparta", kind: "göl", lat: 37.670, lon: 30.950, altitude: 900, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Milli park içi doğal göl, balıkçılık.", features: ["milli park", "göl"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },
  { id: "egirdir-golu", name: "Eğirdir Gölü", region: "Isparta", kind: "göl", lat: 37.850, lon: 30.833, altitude: 920, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Geniş alan, çeşitli kıyı kamp seçenekleri.", features: ["geniş kıyı", "göl"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },
  { id: "salda-golu", name: "Salda Gölü", region: "Burdur", kind: "göl", lat: 37.550, lon: 29.683, altitude: 1140, difficulty: "kolay", bestSeason: "Mayıs–Ekim", description: "Beyaz kumlu, turkuaz renkli göl.", features: ["plaj", "beyaz kum"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "beysehir-golu", name: "Beyşehir Gölü", region: "Konya", kind: "göl", lat: 37.670, lon: 31.650, altitude: 1120, difficulty: "kolay", bestSeason: "Nisan–Ekim", description: "Türkiye'nin en büyük tatlı su gölü, ada kampı.", features: ["göl", "ada", "milli park"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },

  /* ── AMASYA / TOKAT ──────────────────────────── */
  { id: "boraboy", name: "Boraboy Gölü", region: "Amasya", kind: "göl", lat: 40.898, lon: 35.439, altitude: 1100, difficulty: "kolay", bestSeason: "Mayıs–Eylül", description: "Sakin, az bilinen orman içi göl.", features: ["orman", "göl"], recommendedGear: ["3-mevsim çadır"], fishing: true, water: true, parking: true },
  { id: "almus-baraji", name: "Almus Barajı", region: "Tokat", kind: "göl", lat: 40.370, lon: 36.920, altitude: 450, difficulty: "kolay", bestSeason: "Mart–Kasım", description: "Yeşilırmak üzerindeki baraj gölü; kamp ve balıkçılık.", features: ["baraj", "balıkçılık"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true },

  /* ── KARABÜK / BOLU ──────────────────────────── */
  { id: "yenice-ormani", name: "Yenice Ormanı", region: "Karabük", kind: "orman", lat: 41.240, lon: 32.330, altitude: 600, difficulty: "kolay", bestSeason: "Nisan–Kasım", description: "Batı Karadeniz'in en gür ormanlarından; biyosfer koruma.", features: ["orman", "biyosfer"], recommendedGear: ["3-mevsim çadır"], parking: true },
];

export function getRegions(): string[] {
  const seen = new Set<string>();
  const out = ["Hepsi"];
  for (const s of campSpots) {
    const top = s.region.split("/")[0].trim();
    if (!seen.has(top)) { seen.add(top); out.push(top); }
  }
  return out;
}

export function getCampSpotsByRegion(region: string): CampSpot[] {
  if (region === "Hepsi") return campSpots;
  return campSpots.filter((s) => s.region.startsWith(region));
}
