import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, ChevronRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import { fetchWeather, recommendGear, type WeatherSnapshot } from "@/lib/weather";
import { cn } from "@/lib/utils";

const PRESETS = [
  { name: "Trabzon Merkez", lat: 40.992, lon: 39.7202 },
  { name: "Uzungöl", lat: 40.6189, lon: 40.2972 },
  { name: "Ayder Yaylası", lat: 40.9472, lon: 41.0878 },
  { name: "Pokut Yaylası", lat: 40.9047, lon: 41.0231 },
];

export function WeatherWidget({ className }: { className?: string }) {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [snap, setSnap] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    setLoading(true);
    setErr(null);
    fetchWeather(preset.lat, preset.lon, preset.name)
      .then((s) => { if (!dead) setSnap(s); })
      .catch((e) => { if (!dead) setErr(String(e?.message ?? e)); })
      .finally(() => { if (!dead) setLoading(false); });
    return () => { dead = true; };
  }, [preset]);

  const gear = snap ? recommendGear(snap) : null;

  return (
    <section className={cn("relative", className)}>
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-start">

          {/* Forecast card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="bg-foreground/[0.03] border border-foreground/10 p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="eyebrow inline-flex items-center gap-2"><Cloud className="w-3.5 h-3.5" /> Hava Durumu</span>
              <select
                value={preset.name}
                onChange={(e) => {
                  const p = PRESETS.find((x) => x.name === e.target.value);
                  if (p) setPreset(p);
                }}
                className="text-xs uppercase tracking-[0.18em] font-bold bg-transparent border border-foreground/15 px-2 py-1 cursor-pointer"
              >
                {PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {loading && <div className="h-40 flex items-center justify-center text-foreground/50 italic font-light">Yükleniyor…</div>}
            {err && !loading && <div className="text-sm text-red-700">Hata: {err}</div>}

            {snap && !loading && (
              <>
                <div className="flex items-baseline gap-3 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-foreground/55" />
                  <span className="text-xs uppercase tracking-[0.18em] font-bold text-foreground/65">{snap.location}</span>
                </div>
                <div className="flex items-end gap-4 mb-6">
                  <span className="text-7xl">{snap.current.icon}</span>
                  <div>
                    <div className="font-serif font-light text-5xl text-primary tracking-tight leading-none">
                      {Math.round(snap.current.tempC)}°
                    </div>
                    <div className="text-sm text-foreground/65 mt-1">{snap.current.description}</div>
                    <div className="text-xs text-foreground/50 mt-0.5">
                      Hissedilen {Math.round(snap.current.feelsLikeC)}° · Rüzgâr {Math.round(snap.current.windKph)} km/s
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 border-t border-foreground/10 pt-4">
                  {snap.daily.slice(0, 7).map((d) => {
                    const dt = new Date(d.date);
                    const day = dt.toLocaleDateString("tr-TR", { weekday: "short" });
                    return (
                      <div key={d.date} className="flex flex-col items-center text-center">
                        <span className="text-[0.6rem] uppercase tracking-[0.12em] text-foreground/55 font-bold">{day}</span>
                        <span className="text-xl my-1">{d.icon}</span>
                        <span className="text-[0.65rem] text-foreground/85 font-bold">{Math.round(d.maxC)}°</span>
                        <span className="text-[0.65rem] text-foreground/45">{Math.round(d.minC)}°</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>

          {/* Gear recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <span className="eyebrow">Akıllı Ekipman Önerisi</span>
            <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl mt-3 mb-4">
              {gear?.headline ?? "Hazırlanıyor…"}
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg max-w-xl mb-8">
              {gear?.reason}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gear?.items.map((it) => (
                <div key={it.title} className="border border-foreground/10 p-4 hover:border-secondary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-serif text-lg text-primary font-medium tracking-tight">{it.title}</div>
                      <div className="text-xs text-foreground/55 mt-1 font-light">{it.subtitle}</div>
                    </div>
                    {it.categorySlug && (
                      <Link href={`/urunler/${it.categorySlug}`} className="text-secondary hover:text-primary transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/urunler" className="link-hairline mt-8 hover:text-secondary inline-flex">
              Tüm ekipmanlar
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
