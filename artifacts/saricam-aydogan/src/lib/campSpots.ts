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

/** 30+ Türkiye kamp noktası — Adana / Toros / Akdeniz ağırlıklı, ülke geneli */
export const campSpots: CampSpot[] = [
  // Adana / Toros Bölgesi
  { id: "karanlık-kanyon", name: "Karanlık Kanyon", region: "Adana / Anamur", kind: "dere", lat: 36.3050, lon: 32.8500, altitude: 200, difficulty: "orta", bestSeason: "Nisan-Ekim", description: "Görkemli kanyon içinde vahşi kamp; dere soğuğu ve gölgeli atmosfer eşsiz.", features: ["kanyon", "soğuk dere", "sarp duvarlar"], recommendedGear: ["3-mevsim çadır", "su geçirmez bot", "trekking sopası"], water: true },
  { id: "pozanti-toros", name: "Pozantı Yaylası", region: "Adana / Pozantı", kind: "yayla", lat: 37.4244, lon: 34.8853, altitude: 1200, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Torosların eteklerinde, Adana'ya yakın serin yayla; araç kampı için ideal.", features: ["serin iklim", "araç kampı", "orman"], recommendedGear: ["3-mevsim çadır", "hafif uyku tulumu"], parking: true, water: true },
  { id: "seyhan-baraji", name: "Seyhan Barajı Kıyısı", region: "Adana", kind: "göl", lat: 37.1017, lon: 35.3017, altitude: 80, difficulty: "kolay", bestSeason: "Mart-Kasım", description: "Adana merkeze yakın, balık tutmak ve kamp yapmak için sakin bir rezervuar kıyısı.", features: ["göl manzarası", "balıkçılık"], recommendedGear: ["yaz çadırı", "balık ekipmanı"], fishing: true, parking: true, water: true },
  { id: "tufanbeyli", name: "Tufanbeyli Yayla", region: "Adana / Tufanbeyli", kind: "yayla", lat: 38.2706, lon: 36.8256, altitude: 1500, difficulty: "kolay", bestSeason: "Haziran-Eylül", description: "Adana'nın kuzeyinde, serin ve sakin yayla ortamı; şehir kalabalığından uzak.", features: ["sessiz", "serin yayla"], recommendedGear: ["3-mevsim çadır", "+5°C tulum"], parking: true, water: true },
  { id: "kozan-orman", name: "Kozan Orman Kampı", region: "Adana / Kozan", kind: "orman", lat: 37.4500, lon: 35.8000, altitude: 650, difficulty: "kolay", bestSeason: "Nisan-Kasım", description: "Sık çam ormanı içinde, gölgeli ve serin aile kamp alanı.", features: ["orman gölgesi", "aile uygun"], recommendedGear: ["3-mevsim çadır", "kamp masası"], parking: true, water: true },
  { id: "catalan-baraji", name: "Çatalan Barajı", region: "Adana / Ceyhan", kind: "göl", lat: 37.0833, lon: 35.9167, altitude: 70, difficulty: "kolay", bestSeason: "Mart-Kasım", description: "Sazan ve yayın avcılığı için popüler; geniş kıyıda kamp kurulabilir.", features: ["balıkçılık", "geniş alan"], recommendedGear: ["yaz çadırı", "olta takımı"], fishing: true, parking: true },
  { id: "aladaglar-camp", name: "Aladağlar Vadisi", region: "Adana / Niğde", kind: "yayla", lat: 37.8000, lon: 35.2500, altitude: 1900, difficulty: "zor", bestSeason: "Haziran-Eylül", description: "Türkiye'nin en görkemli dağ silsilelerinden; uzun rota kamp yerleri.", features: ["yüksek rakım", "dağ tırmanışı"], recommendedGear: ["4-mevsim çadır", "0°C tulum", "trekking botu"] },
  { id: "cukurova-delta", name: "Çukurova Deltası", region: "Adana / Karataş", kind: "sahil", lat: 36.5500, lon: 35.3833, altitude: 2, difficulty: "kolay", bestSeason: "Nisan-Ekim", description: "Delta kıyısında, kuş gözlemi ve balık tutma imkânıyla sahil kampı.", features: ["sahil", "kuş gözlemi", "balıkçılık"], recommendedGear: ["yaz çadırı", "böcek önleyici"], fishing: true, parking: true },

  { id: "boraboy-golu", name: "Boraboy Gölü", region: "Amasya", kind: "göl", lat: 40.8978, lon: 35.4392, altitude: 1100, difficulty: "kolay", bestSeason: "Mayıs-Eylül", description: "Sakin, az bilinen orman içi göl.", features: ["orman", "göl"], recommendedGear: ["3-mevsim çadır"], fishing: true, water: true, parking: true },
  { id: "abant", name: "Abant Gölü", region: "Bolu", kind: "göl", lat: 40.6086, lon: 31.2783, altitude: 1320, difficulty: "kolay", bestSeason: "Tüm yıl", description: "Tabiat parkı, çevresi turlanabilir.", features: ["tabiat parkı"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },
  { id: "yedigoller", name: "Yedigöller", region: "Bolu", kind: "orman", lat: 41.0833, lon: 31.7333, altitude: 750, difficulty: "kolay", bestSeason: "Sonbahar", description: "Sonbahar renkleri ile ünlü milli park.", features: ["milli park", "sonbahar"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "uludag", name: "Uludağ Sarıalan", region: "Bursa", kind: "orman", lat: 40.0917, lon: 29.1333, altitude: 1640, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Resmi kamp alanı, milli park.", features: ["milli park", "resmi alan"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },

  { id: "olympos", name: "Olympos", region: "Antalya", kind: "sahil", lat: 36.3939, lon: 30.4817, altitude: 5, difficulty: "kolay", bestSeason: "Mart-Kasım", description: "Antik kent ve sahil kombinasyonu.", features: ["sahil", "antik kent"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "cirali", name: "Çıralı", region: "Antalya", kind: "sahil", lat: 36.4133, lon: 30.4783, altitude: 5, difficulty: "kolay", bestSeason: "Nisan-Ekim", description: "Sakin sahil, narenciye bahçeleri.", features: ["sahil", "narenciye"], recommendedGear: ["yaz çadırı"], parking: true, water: true },
  { id: "kabak-koyu", name: "Kabak Koyu", region: "Muğla / Fethiye", kind: "sahil", lat: 36.4878, lon: 29.1314, altitude: 200, difficulty: "orta", bestSeason: "Mayıs-Ekim", description: "Patika ile ulaşılan koy; alternatif kampçı yoğunluğu.", features: ["doğa", "manzara"], recommendedGear: ["3-mevsim çadır", "trekking botu"] },
  { id: "saklikent", name: "Saklıkent Kanyonu", region: "Muğla", kind: "dere", lat: 36.4933, lon: 29.3517, altitude: 350, difficulty: "kolay", bestSeason: "Yaz", description: "Kanyon girişi yakını kampa uygun.", features: ["kanyon", "soğuk dere"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },

  { id: "kaz-daglari", name: "Kaz Dağları", region: "Çanakkale / Balıkesir", kind: "orman", lat: 39.7083, lon: 26.8500, altitude: 1280, difficulty: "orta", bestSeason: "Mayıs-Ekim", description: "Oksijen oranı yüksek milli park.", features: ["milli park", "oksijen"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "ayvalık-cunda", name: "Ayvalık Cunda", region: "Balıkesir", kind: "sahil", lat: 39.3367, lon: 26.6483, altitude: 5, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Adalar ve sahil; balıkçılık idealdir.", features: ["sahil", "ada"], recommendedGear: ["yaz çadırı"], fishing: true, parking: true },

  { id: "kackar-asagi-kamp", name: "Kaçkar Aşağı Kamp", region: "Rize / Çamlıhemşin", kind: "dere", lat: 40.8364, lon: 41.0667, altitude: 1900, difficulty: "zor", bestSeason: "Temmuz-Ağustos", description: "Kaçkar zirvesi tırmanışına çıkış kampı.", features: ["zirve tırmanışı"], recommendedGear: ["4-mevsim çadır", "0°C tulum", "trekking sopa"] },
  { id: "kackar-yukari-kamp", name: "Kaçkar Yukarı Kamp (Dilberdüzü)", region: "Rize / Çamlıhemşin", kind: "yayla", lat: 40.8278, lon: 41.0769, altitude: 2820, difficulty: "zor", bestSeason: "Temmuz-Ağustos", description: "Kaçkar zirvesi öncesi son kamp noktası.", features: ["yüksek rakım"], recommendedGear: ["4-mevsim çadır", "-5°C tulum", "kar baltası"] },

  { id: "salda-golu", name: "Salda Gölü", region: "Burdur", kind: "göl", lat: 37.5500, lon: 29.6833, altitude: 1140, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Beyaz kumlu, turkuaz göl.", features: ["plaj", "manzara"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "egirdir-golu", name: "Eğirdir Gölü", region: "Isparta", kind: "göl", lat: 37.8500, lon: 30.8333, altitude: 920, difficulty: "kolay", bestSeason: "Nisan-Ekim", description: "Geniş alan, çeşitli kıyı kamp seçenekleri.", features: ["geniş kıyı"], recommendedGear: ["3-mevsim çadır"], fishing: true, parking: true, water: true },

  { id: "ihlara-vadisi", name: "Ihlara Vadisi", region: "Aksaray", kind: "dere", lat: 38.2517, lon: 34.3083, altitude: 1100, difficulty: "kolay", bestSeason: "Nisan-Ekim", description: "Dere kenarı; kayadan oyma kiliseler.", features: ["dere", "tarihi"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "nemrut-krater", name: "Nemrut Krater Gölü", region: "Bitlis", kind: "göl", lat: 38.6500, lon: 42.2333, altitude: 2247, difficulty: "orta", bestSeason: "Haziran-Eylül", description: "Krater içindeki göl; eşsiz manzara.", features: ["krater", "yüksek rakım"], recommendedGear: ["4-mevsim çadır"], fishing: true },
  { id: "borcka-karagol", name: "Borçka Karagöl", region: "Artvin", kind: "göl", lat: 41.4533, lon: 41.7383, altitude: 1500, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Heyelan gölü; orman içinde gizli cennet.", features: ["orman", "göl"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "savsat-karagol", name: "Şavşat Karagöl", region: "Artvin", kind: "göl", lat: 41.2333, lon: 42.3667, altitude: 1610, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Milli park içinde sakin göl.", features: ["milli park"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "cehennem-deresi", name: "Cehennem Deresi Kanyonu", region: "Artvin / Yusufeli", kind: "dere", lat: 40.8167, lon: 41.5500, altitude: 600, difficulty: "orta", bestSeason: "Mayıs-Ekim", description: "Rafting ve dere kenarı kamp.", features: ["rafting", "dere"], recommendedGear: ["3-mevsim çadır"] },
];

export function getCampSpotsByRegion(region: string): CampSpot[] {
  if (region === "Hepsi") return campSpots;
  return campSpots.filter((s) => s.region.includes(region));
}

export function getRegions(): string[] {
  const set = new Set<string>();
  campSpots.forEach((s) => {
    const top = s.region.split("/")[0].trim();
    set.add(top);
  });
  return ["Hepsi", ...Array.from(set).sort()];
}
