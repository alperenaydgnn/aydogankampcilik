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

/** 30+ Türkiye kamp noktası — Karadeniz ağırlıklı, ancak ülke geneli */
export const campSpots: CampSpot[] = [
  // Doğu Karadeniz (Trabzon-Rize)
  { id: "uzungol", name: "Uzungöl", region: "Trabzon", kind: "göl", lat: 40.6189, lon: 40.2972, altitude: 1100, difficulty: "kolay", bestSeason: "Mayıs-Ekim", description: "Türkiye'nin en bilinen göl manzaralı kamp alanlarından. Pansiyon ve restoran yoğun.", features: ["göl manzarası", "restoran", "pansiyon"], recommendedGear: ["3-mevsim çadır", "yağmurluk"], fishing: true, parking: true, water: true },
  { id: "ayder", name: "Ayder Yaylası", region: "Rize", kind: "yayla", lat: 40.9472, lon: 41.0878, altitude: 1350, difficulty: "kolay", bestSeason: "Haziran-Eylül", description: "Kaplıcalarıyla ünlü yayla; aktif tatil için ideal.", features: ["kaplıca", "trekking"], recommendedGear: ["3-mevsim çadır", "yağmurluk", "katmanlı giyim"], parking: true, water: true },
  { id: "pokut", name: "Pokut Yaylası", region: "Rize / Çamlıhemşin", kind: "yayla", lat: 40.9047, lon: 41.0231, altitude: 2000, difficulty: "orta", bestSeason: "Haziran-Eylül", description: "Sis denizi manzaralı yayla; geceleri serin.", features: ["sis denizi", "yayla evleri"], recommendedGear: ["4-mevsim çadır", "+5°C tulum", "sıcak mat"], water: true },
  { id: "sal-yaylasi", name: "Sal Yaylası", region: "Rize / Çamlıhemşin", kind: "yayla", lat: 40.8917, lon: 41.0017, altitude: 2050, difficulty: "orta", bestSeason: "Haziran-Eylül", description: "Pokut'a komşu, daha sakin bir yayla.", features: ["sessiz", "manzara"], recommendedGear: ["4-mevsim çadır", "uyku tulumu", "su filtresi"] },
  { id: "huser", name: "Huser Yaylası", region: "Rize", kind: "yayla", lat: 40.9128, lon: 41.0319, altitude: 2150, difficulty: "orta", bestSeason: "Temmuz-Ağustos", description: "Yüksek rakımlı, geniş düzlükleri olan yayla.", features: ["geniş düzlük"], recommendedGear: ["4-mevsim çadır", "rüzgâr koruması"] },
  { id: "ovit-daglari", name: "Ovit Dağları", region: "Rize / İkizdere", kind: "yayla", lat: 40.6450, lon: 40.6822, altitude: 2640, difficulty: "zor", bestSeason: "Temmuz-Ağustos", description: "Yüksek rakım, zorlu kar kalıntıları olabilir.", features: ["kar dağı"], recommendedGear: ["4-mevsim çadır", "0°C tulum", "trekking botu"] },

  { id: "haldizen", name: "Haldizen Gölleri", region: "Trabzon / Çaykara", kind: "göl", lat: 40.5833, lon: 40.3500, altitude: 2300, difficulty: "orta", bestSeason: "Temmuz-Ağustos", description: "Buzul gölleri, vahşi kamp deneyimi.", features: ["buzul göl", "trekking"], recommendedGear: ["4-mevsim çadır", "trekking botu"], fishing: true },
  { id: "demirkapi", name: "Demirkapı Yaylası", region: "Trabzon / Çaykara", kind: "yayla", lat: 40.5961, lon: 40.4017, altitude: 2400, difficulty: "orta", bestSeason: "Haziran-Eylül", description: "Çift göl ile ünlü; vahşi kampçıların gözdesi.", features: ["göl", "yayla evi"], recommendedGear: ["4-mevsim çadır"], water: true },
  { id: "kadirga", name: "Kadırga Yaylası", region: "Trabzon / Maçka", kind: "yayla", lat: 40.6428, lon: 39.7117, altitude: 1800, difficulty: "kolay", bestSeason: "Haziran-Ağustos", description: "Geleneksel şenliği ile ünlü tarihi yayla.", features: ["geleneksel", "şenlik"], recommendedGear: ["3-mevsim çadır"], parking: true },
  { id: "hidirnebi", name: "Hıdırnebi Yaylası", region: "Trabzon / Akçaabat", kind: "yayla", lat: 40.7600, lon: 39.6042, altitude: 1700, difficulty: "kolay", bestSeason: "Haziran-Eylül", description: "Karadeniz manzaralı, ulaşımı kolay yayla.", features: ["deniz manzarası", "ulaşım kolay"], recommendedGear: ["3-mevsim çadır"], parking: true, water: true },
  { id: "sis-dagi", name: "Sis Dağı", region: "Giresun", kind: "yayla", lat: 40.6433, lon: 38.7350, altitude: 2200, difficulty: "orta", bestSeason: "Temmuz-Ağustos", description: "Doğu Karadeniz'in en yüksek yaylalarından, sisli atmosferi ile ünlü.", features: ["sis denizi"], recommendedGear: ["4-mevsim çadır"] },

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
