/**
 * OpenWeatherMap integration — current weather + 5-day/3-hour forecast aggregated to daily.
 * API key: VITE_OPENWEATHERMAP_API_KEY (must be VITE_ prefixed for Vite browser access)
 */

const API_KEY = (import.meta.env.VITE_OPENWEATHERMAP_API_KEY as string | undefined) || "8e07742d24b505fd5c76bcee2b76760d";
const BASE = "https://api.openweathermap.org/data/2.5";

function buildMockSnapshot(location: string, lat = 37.0167, lon = 35.4500): WeatherSnapshot {
  return {
    location,
    country: "TR",
    lat,
    lon,
    current: {
      tempC: 24,
      feelsLikeC: 25,
      code: 800,
      description: "Açık (Demo)",
      windKph: 10,
      humidity: 50,
      icon: "☀️",
      emoji: "☀️",
    },
    daily: Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        date: d.toISOString().slice(0, 10),
        minC: 16 + Math.sin(i) * 2,
        maxC: 26 + Math.cos(i) * 3,
        code: 800,
        description: "Açık",
        icon: "☀️",
        emoji: "☀️",
        precipMm: 0,
        windKph: 12,
      };
    }),
  };
}

export type WeatherSnapshot = {
  location: string;
  country: string;
  lat: number;
  lon: number;
  current: {
    tempC: number;
    feelsLikeC: number;
    code: number;
    description: string;
    windKph: number;
    humidity: number;
    icon: string;
    emoji: string;
  };
  daily: Array<{
    date: string;       // yyyy-mm-dd
    minC: number;
    maxC: number;
    code: number;
    description: string;
    icon: string;
    emoji: string;
    precipMm: number;
    windKph: number;
  }>;
};

/* ── OWM condition code → Turkish label + emoji ────────────── */
function owmLabel(id: number): { tr: string; emoji: string } {
  if (id >= 200 && id < 300) return { tr: "Gök gürültülü fırtına", emoji: "⛈️" };
  if (id >= 300 && id < 400) return { tr: "Çisenti", emoji: "🌦️" };
  if (id >= 500 && id < 510) {
    if (id === 500) return { tr: "Hafif yağmur", emoji: "🌧️" };
    if (id === 501) return { tr: "Yağmur", emoji: "🌧️" };
    return { tr: "Şiddetli yağmur", emoji: "🌧️" };
  }
  if (id >= 510 && id < 600) return { tr: "Sağanak", emoji: "⛈️" };
  if (id >= 600 && id < 700) {
    if (id === 600 || id === 620) return { tr: "Hafif kar", emoji: "🌨️" };
    if (id === 602 || id === 622) return { tr: "Yoğun kar", emoji: "❄️" };
    return { tr: "Kar", emoji: "❄️" };
  }
  if (id === 701) return { tr: "Sisli", emoji: "🌫️" };
  if (id >= 700 && id < 800) return { tr: "Görüş kısıtlı", emoji: "🌫️" };
  if (id === 800) return { tr: "Açık", emoji: "☀️" };
  if (id === 801) return { tr: "Az bulutlu", emoji: "🌤️" };
  if (id === 802) return { tr: "Parçalı bulutlu", emoji: "⛅" };
  if (id >= 803) return { tr: "Bulutlu", emoji: "☁️" };
  return { tr: "Bilinmiyor", emoji: "🌡️" };
}

/* ── OWM icon code → emoji (fallback if no emoji from id) ── */
function owmIconEmoji(icon: string): string {
  const map: Record<string, string> = {
    "01d": "☀️", "01n": "🌙",
    "02d": "🌤️", "02n": "🌤️",
    "03d": "⛅", "03n": "⛅",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️",
  };
  return map[icon] ?? "🌡️";
}

/* ── Fetch current + forecast by city name ─────────────────── */
export async function fetchWeatherByCity(city: string): Promise<WeatherSnapshot> {
  try {
    if (!API_KEY) throw new Error("OpenWeatherMap API anahtarı bulunamadı.");

    const [curRes, fcastRes] = await Promise.all([
      fetch(`${BASE}/weather?q=${encodeURIComponent(city)},TR&units=metric&lang=tr&appid=${API_KEY}`),
      fetch(`${BASE}/forecast?q=${encodeURIComponent(city)},TR&units=metric&lang=tr&cnt=40&appid=${API_KEY}`),
    ]);

    if (!curRes.ok) {
      if (curRes.status === 404) throw new Error(`"${city}" bulunamadı. Farklı bir il adı deneyin.`);
      throw new Error("Hava durumu alınamadı, lütfen tekrar deneyin.");
    }
    if (!fcastRes.ok) throw new Error("Tahmin verisi alınamadı.");

    const cur = await curRes.json();
    const fcast = await fcastRes.json();

    return buildSnapshot(cur, fcast);
  } catch (err) {
    console.warn("Hava durumu API isteği başarısız oldu, demo verisi yükleniyor:", err);
    return buildMockSnapshot(city);
  }
}

/* ── Fetch by lat/lon (for preset locations) ────────────────── */
export async function fetchWeather(
  lat: number,
  lon: number,
  locationLabel: string,
): Promise<WeatherSnapshot> {
  try {
    if (!API_KEY) throw new Error("OpenWeatherMap API anahtarı bulunamadı.");

    const [curRes, fcastRes] = await Promise.all([
      fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${API_KEY}`),
      fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=tr&cnt=40&appid=${API_KEY}`),
    ]);

    if (!curRes.ok) throw new Error("Hava durumu alınamadı.");
    if (!fcastRes.ok) throw new Error("Tahmin verisi alınamadı.");

    const cur = await curRes.json();
    const fcast = await fcastRes.json();
    const snap = buildSnapshot(cur, fcast);
    snap.location = locationLabel;
    return snap;
  } catch (err) {
    console.warn("Hava durumu API isteği başarısız oldu, demo verisi yükleniyor:", err);
    return buildMockSnapshot(locationLabel, lat, lon);
  }
}

/* ── Build unified snapshot from OWM responses ──────────────── */
function buildSnapshot(cur: any, fcast: any): WeatherSnapshot {
  const curWeather = cur.weather?.[0] ?? {};
  const curLabel = owmLabel(curWeather.id ?? 800);
  const curEmoji = owmIconEmoji(curWeather.icon ?? "01d");

  // Aggregate 3-hour slots into daily buckets (Istanbul UTC+3)
  const buckets: Record<string, {
    temps: number[]; ids: number[]; precip: number; winds: number[];
  }> = {};

  for (const slot of fcast.list ?? []) {
    // OWM dt_txt is UTC — shift to UTC+3 for date bucketing
    const utcMs = slot.dt * 1000;
    const istMs = utcMs + 3 * 3600 * 1000;
    const date = new Date(istMs).toISOString().slice(0, 10);
    if (!buckets[date]) buckets[date] = { temps: [], ids: [], precip: 0, winds: [] };
    buckets[date].temps.push(slot.main.temp_min, slot.main.temp_max);
    buckets[date].ids.push(slot.weather?.[0]?.id ?? 800);
    buckets[date].precip += slot.rain?.["3h"] ?? slot.snow?.["3h"] ?? 0;
    buckets[date].winds.push(slot.wind?.speed ?? 0);
  }

  const daily: WeatherSnapshot["daily"] = Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 7)
    .map(([date, b]) => {
      // Most severe (lowest id with precip, then standard sort)
      const dominantId = b.ids.reduce((prev, cur) => {
        const pSev = idSeverity(prev);
        const cSev = idSeverity(cur);
        return cSev > pSev ? cur : prev;
      }, b.ids[0]);
      const label = owmLabel(dominantId);
      const icon = owmIconEmoji(iconForId(dominantId));
      return {
        date,
        minC: Math.min(...b.temps),
        maxC: Math.max(...b.temps),
        code: dominantId,
        description: label.tr,
        emoji: label.emoji,
        icon,
        precipMm: Math.round(b.precip * 10) / 10,
        windKph: Math.round(Math.max(...b.winds) * 3.6),
      };
    });

  return {
    location: cur.name,
    country: cur.sys?.country ?? "TR",
    lat: cur.coord?.lat ?? 0,
    lon: cur.coord?.lon ?? 0,
    current: {
      tempC: cur.main?.temp ?? 0,
      feelsLikeC: cur.main?.feels_like ?? 0,
      code: curWeather.id ?? 800,
      description: curWeather.description
        ? curWeather.description.charAt(0).toUpperCase() + curWeather.description.slice(1)
        : curLabel.tr,
      windKph: Math.round((cur.wind?.speed ?? 0) * 3.6),
      humidity: cur.main?.humidity ?? 0,
      icon: curEmoji,
      emoji: curEmoji,
    },
    daily,
  };
}

function idSeverity(id: number): number {
  if (id >= 200 && id < 300) return 10; // thunderstorm
  if (id >= 500 && id < 600) return 8;  // rain
  if (id >= 300 && id < 400) return 6;  // drizzle
  if (id >= 600 && id < 700) return 7;  // snow
  if (id >= 700 && id < 800) return 4;  // atmosphere
  if (id === 800) return 0;
  if (id > 800) return id - 800;
  return 0;
}

function iconForId(id: number): string {
  if (id >= 200 && id < 300) return "11d";
  if (id >= 300 && id < 400) return "09d";
  if (id >= 500 && id < 600) return id === 500 ? "10d" : "09d";
  if (id >= 510 && id < 520) return "13d";
  if (id >= 600 && id < 700) return "13d";
  if (id >= 700 && id < 800) return "50d";
  if (id === 800) return "01d";
  if (id === 801) return "02d";
  if (id === 802) return "03d";
  return "04d";
}

/* ── Turkish provinces list for autocomplete ─────────────────── */
export const TURKEY_PROVINCES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
  "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum",
  "Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir",
  "Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul",
  "İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kilis",
  "Kırıkkale","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa",
  "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize",
  "Sakarya","Samsun","Şanlıurfa","Siirt","Sinop","Şırnak","Sivas","Tekirdağ",
  "Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];

/* ── Equipment recommendations (unchanged logic, extended) ────── */
export type GearRecommendation = {
  headline: string;
  reason: string;
  items: { title: string; subtitle: string; categorySlug?: string }[];
};

export function recommendGear(snapshot: WeatherSnapshot): GearRecommendation {
  const day = snapshot.daily[1] ?? snapshot.daily[0];
  if (!day) return { headline: "Veri bekleniyor", reason: "", items: [] };

  const min = day.minC;
  const max = day.maxC;
  const wet = day.precipMm > 2;
  const windy = day.windKph > 25;
  const hot = max >= 32;

  const items: GearRecommendation["items"] = [];
  let headline = "";
  let reason = "";

  if (min <= -5) {
    headline = `Yarın ${Math.round(min)}°C — Sert kış koşulları`;
    reason = "Buz noktasının çok altında geceler için 4-mevsim setup şart.";
    items.push(
      { title: "−10°C konforlu uyku tulumu", subtitle: "Sentetik veya 800-fill ördek tüyü", categorySlug: "uyku-tulumlari" },
      { title: "4-mevsim çadır", subtitle: "Geometrik direk, kar etekli", categorySlug: "kamp-cadirlari" },
      { title: "R≥5 kış matı", subtitle: "Kışın yer yalıtımı kritik" },
      { title: "Termos + sıcak içecek", subtitle: "Çekirdek ısı koruması", categorySlug: "termos-ve-sogutucular" },
    );
  } else if (min <= 0) {
    headline = `Yarın ${Math.round(min)}°C — Donma noktası civarı`;
    reason = "Gece sıfır derece civarına düşecek; 0°C konforlu bir tulum şart.";
    items.push(
      { title: "0°C konforlu uyku tulumu", subtitle: "Konfor sıcaklığı ≤ 0°C model", categorySlug: "uyku-tulumlari" },
      { title: "4-mevsim çadır", subtitle: "Sağlam direk yapılı, rüzgâr koruması", categorySlug: "kamp-cadirlari" },
      { title: "R≥4 izolasyonlu mat", subtitle: "Yer soğuğu için" },
      { title: "Sıcak termos", subtitle: "Merino veya yün baz katman ile birlikte", categorySlug: "termos-ve-sogutucular" },
    );
  } else if (min <= 8) {
    headline = `Yarın ${Math.round(min)}–${Math.round(max)}°C — Serin gece koşulları`;
    reason = "Sabaha karşı serin olacak; +5°C konforlu bir tulum güvende olmanı sağlar.";
    items.push(
      { title: "+5°C konforlu uyku tulumu", subtitle: "Yayla geceleri için ideal", categorySlug: "uyku-tulumlari" },
      { title: "3-mevsim çadır", subtitle: "Hafif ve çabuk kurulan", categorySlug: "kamp-cadirlari" },
      { title: "R≈3 mat", subtitle: "Şişme veya kapalı hücreli" },
      { title: "Hafif fleece + yağmurluk", subtitle: "3-katmanlı hazırlık", categorySlug: "outdoor-aksesuarlari" },
    );
  } else if (hot) {
    headline = `Yarın ${Math.round(max)}°C — Sıcak hava uyarısı`;
    reason = "Adana sıcağında taktik kamp kurulumu ve soğutma ekipmanı öncelik.";
    items.push(
      { title: "Soğutucu çanta / kutu", subtitle: "Yiyecek ve içecek soğuk tutma", categorySlug: "termos-ve-sogutucular" },
      { title: "Güneş gözlüğü + şapka", subtitle: "UV koruması zorunlu", categorySlug: "outdoor-aksesuarlari" },
      { title: "Yaz çadırı — tam havalandırmalı", subtitle: "Çift duvarlı, geniş mesh", categorySlug: "kamp-cadirlari" },
      { title: "Su filtresi / büyük bidon", subtitle: "Sıcakta bol su şart" },
    );
  } else {
    headline = `Yarın ${Math.round(min)}–${Math.round(max)}°C — Ideal kamp havası`;
    reason = "Geceler ılıman olacak; hafif setup yeterli, ama nem kontrolü için iç çadır kritik.";
    items.push(
      { title: "+10°C tulum veya battaniye", subtitle: "Yaz konforlu", categorySlug: "uyku-tulumlari" },
      { title: "Yaz çadırı / 3-mevsim", subtitle: "İyi havalandırmalı", categorySlug: "kamp-cadirlari" },
      { title: "Hafif şişme mat", subtitle: "Sıcak gecelerde rahatlık" },
      { title: "Güneş kremi + şapka", subtitle: "Yaz kampı temelleri", categorySlug: "outdoor-aksesuarlari" },
    );
  }

  if (wet) {
    items.push(
      { title: "Su geçirmez tente / overhang", subtitle: "Yağışlı gün için ek koruma", categorySlug: "outdoor-aksesuarlari" },
      { title: "Hardshell yağmurluk", subtitle: "Kuru kalmak için zorunlu" },
    );
    reason += " Yağış bekleniyor — su izolasyonuna dikkat et.";
  }
  if (windy) {
    items.push({ title: "Ekstra kazık + çadır ipi", subtitle: "Rüzgârda sabitleme kritik" });
    reason += " Rüzgâr 25 km/s üzerinde — çadır kurulumunda yön ve sabitleme önemli.";
  }

  return { headline, reason: reason.trim(), items };
}
