export type EventKind = "sezon" | "yasak" | "festival" | "av" | "gözlem";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  kind: EventKind;
  startMonth: number; // 1-12
  startDay?: number;
  endMonth?: number;
  endDay?: number;
  region?: string;
  tags?: string[];
  recommendedProducts?: string[]; // category slugs
};

/**
 * Türkiye geneli (Adana / Akdeniz / Çukurova ağırlıklı) tekrarlayan yıllık etkinlikler.
 * Av yasakları için Tarım ve Orman Bakanlığı genel takvimine yakın değerlerdir;
 * resmi tebliğ önceliklidir.
 */
export const events: CalendarEvent[] = [
  // Av/Balık sezonları
  {
    id: "alabalik-sezonu-acilis",
    title: "İçsu Alabalık Sezonu Açılışı",
    description: "İçsularda alabalık avı sezonu genellikle Nisan başında açılır. Boy/kota kurallarına dikkat.",
    kind: "sezon",
    startMonth: 4, startDay: 1, endMonth: 10, endDay: 15,
    region: "Tüm Türkiye",
    tags: ["alabalık", "spinning", "fly"],
    recommendedProducts: ["balik-malzemeleri", "olta-takimi"],
  },
  {
    id: "lufer-sezonu",
    title: "Lüfer Sezonu",
    description: "Akdeniz ve Ege kıyılarında lüfer sezonu eylül sonuyla başlar, aralık ortasına kadar verimlidir.",
    kind: "sezon",
    startMonth: 9, startDay: 25, endMonth: 12, endDay: 15,
    region: "Akdeniz / Ege",
    tags: ["lüfer", "spinning"],
  },
  {
    id: "cipura-levrek-sezonu",
    title: "Çipura & Levrek Sezonu",
    description: "Akdeniz'de çipura ve levrek avı yıl boyunca mümkün; en verimli dönem ekim-şubat arası.",
    kind: "sezon",
    startMonth: 10, startDay: 1, endMonth: 2, endDay: 28,
    region: "Akdeniz",
    tags: ["çipura", "levrek", "spinning"],
  },
  {
    id: "av-yasagi-bahar",
    title: "Bahar Av Yasağı (Genel)",
    description: "Birçok kara av türünde 15 Şubat - 15 Ağustos arası genel yasak uygulanır.",
    kind: "yasak",
    startMonth: 2, startDay: 15, endMonth: 8, endDay: 15,
    tags: ["av yasağı"],
  },
  {
    id: "sazan-yayın-yasak-donemi",
    title: "Sazan & Yayın Yasak Dönemi",
    description: "İç sularda sazan ve yayın balığı için üreme dönemi yasağı genellikle nisan-haziran arası uygulanır.",
    kind: "yasak",
    startMonth: 4, startDay: 1, endMonth: 6, endDay: 15,
    region: "Tüm Türkiye",
    tags: ["sazan", "yayın"],
  },

  // Kamp/Yayla festivalleri
  {
    id: "pozanti-yaylasi-kampi",
    title: "Pozantı Yaylası Kamp Sezonu",
    description: "Adana'ya 70 km mesafedeki Pozantı yaylasında kamp sezonu haziran başı ile ekim arası açık.",
    kind: "festival",
    startMonth: 6, startDay: 1, endMonth: 10, endDay: 1,
    region: "Adana / Pozantı",
    tags: ["kamp", "yayla", "toros"],
    recommendedProducts: ["kamp-cadirlari", "uyku-tulumlari"],
  },
  {
    id: "tufanbeyli-yayla-soleni",
    title: "Tufanbeyli Yayla Şenliği",
    description: "Adana'nın kuzeyindeki Tufanbeyli'de temmuz ayında düzenlenen geleneksel yayla şenliği.",
    kind: "festival",
    startMonth: 7, startDay: 20, endMonth: 7, endDay: 21,
    region: "Adana / Tufanbeyli",
    tags: ["yayla", "kültür"],
  },
  {
    id: "adana-portakal-cicegi-festivali",
    title: "Adana Portakal Çiçeği Karnavalı",
    description: "Her yıl nisan ayında Adana'da düzenlenen rengarenk portakal çiçeği ve kültür festivali.",
    kind: "festival",
    startMonth: 4, startDay: 15, endMonth: 4, endDay: 25,
    region: "Adana",
    tags: ["festival", "kültür"],
  },
  {
    id: "aladaglar-kamp-outdoor",
    title: "Aladağlar Outdoor & Trekking Sezonu",
    description: "Adana'ya 120 km mesafedeki Aladağlar'da outdoor, kaya tırmanışı ve kamp sezonu temmuz-eylül arası.",
    kind: "festival",
    startMonth: 7, startDay: 1, endMonth: 9, endDay: 30,
    region: "Adana / Aladağlar",
    tags: ["trekking", "kamp", "outdoor"],
    recommendedProducts: ["kamp-cadirlari", "outdoor-aksesuarlari"],
  },

  // Outdoor sezonları
  {
    id: "yayla-sezonu-acilis",
    title: "Toros Yayla Sezonu Açılışı",
    description: "Toros yaylalarına çıkış genelde mayıs sonu - haziran başında başlar; mevsim hava şartlarına bağlı.",
    kind: "sezon",
    startMonth: 5, startDay: 25, endMonth: 9, endDay: 30,
    region: "Adana / Toros",
    tags: ["yayla", "kamp"],
    recommendedProducts: ["kamp-cadirlari", "uyku-tulumlari"],
  },
  {
    id: "kis-kampi-sezonu",
    title: "Kış Kampı Sezonu",
    description: "Aralık-Mart arası uygun lokasyonlarda kar kampı için ideal dönem; 4 mevsim ekipman şart.",
    kind: "sezon",
    startMonth: 12, startDay: 1, endMonth: 3, endDay: 31,
    tags: ["kış kampı", "kar"],
    recommendedProducts: ["kamp-cadirlari", "uyku-tulumlari"],
  },

  // Doğa gözlemleri
  {
    id: "toros-bahar-ciceklenmesi",
    title: "Toros Bahar Çiçeklenmesi",
    description: "Toros eteklerinde nisan-mayıs aylarında nergis, gelincik ve kır çiçekleri patlama yapar.",
    kind: "gözlem",
    startMonth: 4, startDay: 10, endMonth: 5, endDay: 20,
    region: "Adana / Toros",
    tags: ["bitki", "fotoğraf", "doğa"],
  },
  {
    id: "seyhan-baraj-golu-gozlem",
    title: "Seyhan Barajı Göç Sezonu",
    description: "Seyhan Barajı çevresinde sonbahar aylarında kuş göçü ve doğa fotoğrafçılığı için ideal dönem.",
    kind: "gözlem",
    startMonth: 9, startDay: 15, endMonth: 11, endDay: 15,
    region: "Adana / Seyhan",
    tags: ["kuş", "fotoğraf", "doğa"],
  },
];

export function getEventsForMonth(month: number): CalendarEvent[] {
  return events.filter((e) => isMonthInRange(month, e.startMonth, e.endMonth ?? e.startMonth));
}

export function getCurrentMonthEvents(): CalendarEvent[] {
  return getEventsForMonth(new Date().getMonth() + 1);
}

function isMonthInRange(m: number, start: number, end: number): boolean {
  if (start <= end) return m >= start && m <= end;
  // wraps year (e.g. sep -> april)
  return m >= start || m <= end;
}
