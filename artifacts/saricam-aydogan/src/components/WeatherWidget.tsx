import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, ChevronRight, MapPin, Search, X, Droplets, Wind, Thermometer } from "lucide-react";
import { Link } from "wouter";
import {
  fetchWeather,
  fetchWeatherByCity,
  recommendGear,
  TURKEY_PROVINCES,
  type WeatherSnapshot,
} from "@/lib/weather";
import { cn } from "@/lib/utils";

const PRESETS = [
  { name: "Adana Sarıçam", lat: 37.0167, lon: 35.4500 },
  { name: "Pozantı",        lat: 37.4244, lon: 34.8853 },
  { name: "Seyhan Barajı",  lat: 37.1017, lon: 35.3017 },
  { name: "Tufanbeyli",     lat: 38.2706, lon: 36.8256 },
];

export function WeatherWidget({ className }: { className?: string }) {
  const [snap, setSnap]       = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);

  // Search state
  const [query, setQuery]       = useState("");
  const [suggestions, setSugs]  = useState<string[]>([]);
  const [showSugs, setShowSugs] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLUListElement>(null);

  /* ── Load default location on mount ── */
  useEffect(() => {
    loadPreset(PRESETS[0]);
  }, []);

  /* ── Autocomplete filter ── */
  useEffect(() => {
    if (query.length < 1) { setSugs([]); return; }
    const q = query.toLowerCase();
    setSugs(
      TURKEY_PROVINCES.filter((p) =>
        p.toLowerCase().startsWith(q) || p.toLowerCase().includes(q),
      ).slice(0, 7),
    );
  }, [query]);

  function loadPreset(p: { name: string; lat: number; lon: number }) {
    setLoading(true);
    setErr(null);
    setQuery("");
    setSugs([]);
    fetchWeather(p.lat, p.lon, p.name)
      .then(setSnap)
      .catch((e) => setErr(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }

  function loadCity(city: string) {
    setLoading(true);
    setErr(null);
    setQuery(city);
    setSugs([]);
    setShowSugs(false);
    fetchWeatherByCity(city)
      .then(setSnap)
      .catch((e) => setErr(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    loadCity(trimmed);
  }

  function handleSugClick(city: string) {
    loadCity(city);
    inputRef.current?.blur();
  }

  /* ── Close suggestions on outside click ── */
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setShowSugs(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const gear = snap ? recommendGear(snap) : null;

  return (
    <section className={cn("relative", className)}>
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-10 lg:gap-16 items-start">

          {/* ── Left: Forecast card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="bg-foreground/[0.03] border border-foreground/10 p-6 md:p-8"
          >
            {/* Header + search */}
            <div className="flex items-center gap-2 mb-5">
              <Cloud className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="eyebrow">Hava Durumu</span>
            </div>

            {/* Search input */}
            <div className="relative mb-5">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowSugs(true); }}
                    onFocus={() => setShowSugs(true)}
                    placeholder="İl ara… (ör. Konya, Antalya)"
                    className="w-full pl-9 pr-8 py-2 text-xs bg-background border border-foreground/15 focus:border-secondary focus:outline-none transition-colors"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => { setQuery(""); setSugs([]); inputRef.current?.focus(); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0"
                >
                  Git
                </button>
              </form>

              {/* Autocomplete dropdown */}
              <AnimatePresence>
                {showSugs && suggestions.length > 0 && (
                  <motion.ul
                    ref={listRef}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border border-foreground/15 shadow-lg max-h-52 overflow-y-auto"
                  >
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); handleSugClick(s); }}
                          className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-foreground/[0.04] transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-secondary shrink-0" />
                          <span>{s}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>


            {/* Loading / Error / Data */}
            {loading && (
              <div className="h-44 flex items-center justify-center text-foreground/45 italic font-light text-sm">
                Yükleniyor…
              </div>
            )}
            {err && !loading && (
              <div className="text-xs text-foreground/60 bg-foreground/[0.03] border border-foreground/10 px-4 py-3 font-light">
                Hava durumu şu an yüklenemedi. Demo modu gösteriliyor.
              </div>
            )}

            {snap && !loading && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={snap.location}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Location */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs uppercase tracking-[0.18em] font-bold text-foreground/70">
                      {snap.location}
                      {snap.country && snap.country !== "TR" && (
                        <span className="ml-1 text-foreground/40">({snap.country})</span>
                      )}
                    </span>
                  </div>

                  {/* Current temp + icon */}
                  <div className="flex items-end gap-4 mb-5">
                    <span className="text-6xl leading-none">{snap.current.emoji}</span>
                    <div>
                      <div className="font-serif font-light text-5xl text-primary tracking-tight leading-none">
                        {Math.round(snap.current.tempC)}°
                      </div>
                      <div className="text-sm text-foreground/65 mt-1 capitalize">
                        {snap.current.description}
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-5 text-xs text-foreground/55 font-light mb-6">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      Hissedilen {Math.round(snap.current.feelsLikeC)}°
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      {snap.current.windKph} km/s
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      %{snap.current.humidity}
                    </span>
                  </div>

                  {/* 7-day daily strip */}
                  <div className="grid grid-cols-7 gap-1 border-t border-foreground/10 pt-4">
                    {snap.daily.slice(0, 7).map((d) => {
                      const dt  = new Date(d.date + "T12:00:00");
                      const day = dt.toLocaleDateString("tr-TR", { weekday: "short" });
                      return (
                        <div key={d.date} className="flex flex-col items-center text-center gap-0.5">
                          <span className="text-[0.58rem] uppercase tracking-[0.1em] text-foreground/50 font-bold">
                            {day}
                          </span>
                          <span className="text-lg leading-none my-0.5">{d.emoji}</span>
                          <span className="text-[0.64rem] text-foreground/85 font-bold">
                            {Math.round(d.maxC)}°
                          </span>
                          <span className="text-[0.6rem] text-foreground/40">
                            {Math.round(d.minC)}°
                          </span>
                          {d.precipMm > 1 && (
                            <span className="text-[0.55rem] text-blue-500 font-medium">
                              {d.precipMm}mm
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* ── Right: Gear recommendation ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <span className="eyebrow">Akıllı Ekipman Önerisi</span>
            <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl mt-3 mb-4 leading-tight">
              {loading ? (
                <span className="text-foreground/30">Analiz ediliyor…</span>
              ) : (
                gear?.headline ?? "Veri bekleniyor"
              )}
            </h2>

            {gear && !loading && (
              <>
                <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg max-w-xl mb-8">
                  {gear.reason}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gear.items.map((it, i) => (
                    <motion.div
                      key={it.title + i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="border border-foreground/10 p-4 hover:border-secondary/60 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-serif text-base text-primary font-medium tracking-tight leading-snug">
                            {it.title}
                          </div>
                          <div className="text-xs text-foreground/50 mt-1 font-light">
                            {it.subtitle}
                          </div>
                        </div>
                        {it.categorySlug && (
                          <Link
                            href={`/urunler/${it.categorySlug}`}
                            className="text-foreground/30 group-hover:text-secondary transition-colors shrink-0 mt-0.5"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link
                  href="/urunler"
                  className="link-hairline mt-8 hover:text-secondary inline-flex items-center gap-1"
                >
                  Tüm ekipmanlar
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
