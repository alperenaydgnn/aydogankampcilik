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
 * Türkiye Karadeniz odaklı, tekrarlayan yıllık etkinlikler.
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
    description: "Karadeniz ve Boğaz'da lüfer sezonu eylül sonuyla başlar, aralık ortasına kadar verimli.",
    kind: "sezon",
    startMonth: 9, startDay: 25, endMonth: 12, endDay: 15,
    region: "Karadeniz / İstanbul",
    tags: ["lüfer", "spinning"],
  },
  {
    id: "hamsi-sezonu",
    title: "Hamsi Sezonu",
    description: "Hamsi avı genellikle 1 Eylül'de açılır, nisana kadar devam eder. Boy ve dönem kotası geçerlidir.",
    kind: "sezon",
    startMonth: 9, startDay: 1, endMonth: 4, endDay: 15,
    region: "Karadeniz",
    tags: ["hamsi"],
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
    id: "kalkanin-yasak-donemi",
    title: "Kalkan Yasak Dönemi",
    description: "Karadeniz'de kalkan avı 1 Mayıs - 30 Haziran arası yasaktır.",
    kind: "yasak",
    startMonth: 5, startDay: 1, endMonth: 6, endDay: 30,
    region: "Karadeniz",
    tags: ["kalkan"],
  },

  // Kamp/Yayla festivalleri
  {
    id: "ayder-yayla-festivali",
    title: "Ayder Kar Festivali",
    description: "Ayder Yaylası'nda her yıl mart başında düzenlenen kar ve kış aktiviteleri festivali.",
    kind: "festival",
    startMonth: 3, startDay: 5, endMonth: 3, endDay: 8,
    region: "Rize / Ayder",
    tags: ["festival", "kış"],
  },
  {
    id: "kadirga-yayla-soleni",
    title: "Kadırga Yayla Şöleni",
    description: "Trabzon'un en eski yayla şenliklerinden; temmuz son haftası.",
    kind: "festival",
    startMonth: 7, startDay: 25, endMonth: 7, endDay: 26,
    region: "Trabzon",
    tags: ["yayla", "kültür"],
  },
  {
    id: "hidirnebi-soleni",
    title: "Hıdırnebi Yayla Şenliği",
    description: "Akçaabat'ın Hıdırnebi yaylasında temmuz ortasında düzenlenen geleneksel şenlik.",
    kind: "festival",
    startMonth: 7, startDay: 18, endMonth: 7, endDay: 19,
    region: "Trabzon / Akçaabat",
    tags: ["yayla", "kültür"],
  },
  {
    id: "uzungol-festivali",
    title: "Uzungöl Doğa ve Kültür Festivali",
    description: "Çaykara Uzungöl'de ağustos ortasında doğa, müzik ve trekking etkinlikleri.",
    kind: "festival",
    startMonth: 8, startDay: 12, endMonth: 8, endDay: 14,
    region: "Trabzon / Çaykara",
    tags: ["doğa", "trekking"],
  },

  // Outdoor sezonları
  {
    id: "yayla-sezonu-acilis",
    title: "Yayla Sezonu Açılışı",
    description: "Karadeniz yaylalarına çıkış genelde mayıs sonu - haziran başında başlar; mevsim hava şartlarına bağlı.",
    kind: "sezon",
    startMonth: 5, startDay: 25, endMonth: 9, endDay: 30,
    region: "Doğu Karadeniz",
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
    id: "rododendron-aciliis",
    title: "Rododendron (Komar) Çiçeklenmesi",
    description: "Doğu Karadeniz yaylalarında rododendronlar haziran ortasında patlama yapar.",
    kind: "gözlem",
    startMonth: 6, startDay: 10, endMonth: 7, endDay: 15,
    region: "Doğu Karadeniz",
    tags: ["bitki", "fotoğraf"],
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
