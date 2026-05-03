/**
 * Open-Meteo (free, no auth) integration + equipment recommendations.
 */

export type WeatherSnapshot = {
  location: string;
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
  };
  daily: Array<{
    date: string; // ISO yyyy-mm-dd
    minC: number;
    maxC: number;
    code: number;
    description: string;
    icon: string;
    precipMm: number;
    windKph: number;
  }>;
};

const WMO: Record<number, { tr: string; icon: string }> = {
  0: { tr: "Açık", icon: "☀️" },
  1: { tr: "Az bulutlu", icon: "🌤️" },
  2: { tr: "Parçalı bulutlu", icon: "⛅" },
  3: { tr: "Bulutlu", icon: "☁️" },
  45: { tr: "Sisli", icon: "🌫️" },
  48: { tr: "Yoğun sis", icon: "🌫️" },
  51: { tr: "Hafif çisenti", icon: "🌦️" },
  53: { tr: "Çisenti", icon: "🌦️" },
  55: { tr: "Yoğun çisenti", icon: "🌦️" },
  61: { tr: "Hafif yağmur", icon: "🌧️" },
  63: { tr: "Yağmur", icon: "🌧️" },
  65: { tr: "Şiddetli yağmur", icon: "🌧️" },
  71: { tr: "Hafif kar", icon: "🌨️" },
  73: { tr: "Kar", icon: "❄️" },
  75: { tr: "Yoğun kar", icon: "❄️" },
  80: { tr: "Sağanak", icon: "🌦️" },
  81: { tr: "Şiddetli sağanak", icon: "⛈️" },
  82: { tr: "Aşırı sağanak", icon: "⛈️" },
  95: { tr: "Gök gürültülü fırtına", icon: "⛈️" },
  96: { tr: "Dolu", icon: "⛈️" },
  99: { tr: "Şiddetli dolu", icon: "⛈️" },
};

function describe(code: number): { description: string; icon: string } {
  const v = WMO[code] ?? { tr: "Bilinmiyor", icon: "🌡️" };
  return { description: v.tr, icon: v.icon };
}

export async function fetchWeather(
  lat: number,
  lon: number,
  locationLabel: string,
): Promise<WeatherSnapshot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
  );
  url.searchParams.set("timezone", "Europe/Istanbul");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("wind_speed_unit", "kmh");

  const r = await fetch(url.toString());
  if (!r.ok) throw new Error("Weather fetch failed");
  const j = await r.json();

  const cur = j.current ?? {};
  const curMeta = describe(cur.weather_code ?? 0);
  const dailyDates: string[] = j.daily?.time ?? [];
  const daily: WeatherSnapshot["daily"] = dailyDates.map((date: string, i: number) => {
    const code = j.daily.weather_code[i];
    const m = describe(code);
    return {
      date,
      minC: j.daily.temperature_2m_min[i],
      maxC: j.daily.temperature_2m_max[i],
      code,
      description: m.description,
      icon: m.icon,
      precipMm: j.daily.precipitation_sum[i] ?? 0,
      windKph: j.daily.wind_speed_10m_max[i] ?? 0,
    };
  });

  return {
    location: locationLabel,
    lat, lon,
    current: {
      tempC: cur.temperature_2m,
      feelsLikeC: cur.apparent_temperature,
      code: cur.weather_code ?? 0,
      description: curMeta.description,
      windKph: cur.wind_speed_10m ?? 0,
      humidity: cur.relative_humidity_2m ?? 0,
      icon: curMeta.icon,
    },
    daily,
  };
}

export type GearRecommendation = {
  headline: string;
  reason: string;
  items: { title: string; subtitle: string; categorySlug?: string }[];
};

/** Recommend equipment from a forecast (uses tomorrow's expected conditions). */
export function recommendGear(snapshot: WeatherSnapshot): GearRecommendation {
  const day = snapshot.daily[1] ?? snapshot.daily[0];
  const min = day.minC;
  const max = day.maxC;
  const wet = day.precipMm > 2;
  const windy = day.windKph > 25;

  const items: GearRecommendation["items"] = [];
  let headline = "";
  let reason = "";

  if (min <= -5) {
    headline = `Yarın ${Math.round(min)}°C — Sert kış kampı koşulları`;
    reason = "Buz noktasının çok altında geceler için 4-mevsim setup şart.";
    items.push(
      { title: "−10°C konforlu uyku tulumu", subtitle: "Sentetik veya 800-fill ördek tüyü", categorySlug: "uyku-tulumlari" },
      { title: "4-mevsim çadır", subtitle: "Geometrik direk, kar etekli", categorySlug: "kamp-cadirlari" },
      { title: "R≥5 kış matı", subtitle: "Kışın yer yalıtımı kritik" },
      { title: "Termos + sıcak içecek", subtitle: "Çekirdek ısı koruması" },
    );
  } else if (min <= 0) {
    headline = `Yarın ${Math.round(min)}°C — Donma noktası civarı`;
    reason = "Gece sıfır derece civarına düşecek; 0°C konforlu bir tulum şart.";
    items.push(
      { title: "0°C konforlu uyku tulumu", subtitle: "Konfor sıcaklığı ≤ 0°C model", categorySlug: "uyku-tulumlari" },
      { title: "4-mevsim çadır", subtitle: "Sağlam direk yapılı, rüzgâr koruması", categorySlug: "kamp-cadirlari" },
      { title: "R≥4 izolasyonlu mat", subtitle: "Yer soğuğu için" },
      { title: "Sıcak iç katman", subtitle: "Merino veya yün baz katman" },
    );
  } else if (min <= 8) {
    headline = `Yarın ${Math.round(min)}-${Math.round(max)}°C — Serin yayla koşulları`;
    reason = "Sabaha karşı serin olacak; +5°C konforlu bir tulum güvende olmanı sağlar.";
    items.push(
      { title: "+5°C konforlu uyku tulumu", subtitle: "Yayla geceleri için ideal", categorySlug: "uyku-tulumlari" },
      { title: "3-mevsim çadır", subtitle: "Hafif ve çabuk kurulan", categorySlug: "kamp-cadirlari" },
      { title: "R≈3 mat", subtitle: "Şişme veya kapalı hücreli" },
      { title: "Hafif fleece + yağmurluk", subtitle: "3-katmanlı hazırlık" },
    );
  } else {
    headline = `Yarın ${Math.round(min)}-${Math.round(max)}°C — Ilıman/sıcak`;
    reason = "Geceler ılıman olacak; hafif setup yeterli, ama nem kontrolü için iç çadır kritik.";
    items.push(
      { title: "+10°C tulum veya battaniye", subtitle: "Yaz konforlu", categorySlug: "uyku-tulumlari" },
      { title: "Yaz çadırı / 3-mevsim", subtitle: "İyi havalandırmalı", categorySlug: "kamp-cadirlari" },
      { title: "Hafif şişme mat", subtitle: "Sıcak gecelerde rahatlık" },
      { title: "Güneş kremi + şapka", subtitle: "Yaz kampı temelleri" },
    );
  }

  if (wet) {
    items.push({ title: "Su geçirmez tente / overhang", subtitle: "Yağışlı gün için ek koruma" });
    items.push({ title: "Hardshell yağmurluk", subtitle: "Kuru kalmak için zorunlu" });
    reason += " Yağışlı bir gün geliyor — su izolasyonunu önemse.";
  }
  if (windy) {
    items.push({ title: "Ekstra çadır kazıkları + ip", subtitle: "Rüzgârda fırtına oklarına ihtiyacın olur" });
    reason += " Rüzgâr 25 km/s üzerinde — kurulumda yön ve sabitleme önemli.";
  }

  return { headline, reason: reason.trim(), items };
}
