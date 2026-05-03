import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Mountain, Filter, Fish, Waves, TreePine, Tent, Droplets, X } from "lucide-react";
import { Link } from "wouter";
import { campSpots, getRegions, type CampSpot, type CampSpotKind } from "@/lib/campSpots";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ── Kind → colour + label ──────────────────────────────────── */
const KIND_META: Record<CampSpotKind, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  yayla:  { label: "Yayla",  color: "#16a34a", bg: "#dcfce7", icon: <Mountain className="w-3 h-3" /> },
  göl:    { label: "Göl",    color: "#2563eb", bg: "#dbeafe", icon: <Waves className="w-3 h-3" /> },
  orman:  { label: "Orman",  color: "#166534", bg: "#d1fae5", icon: <TreePine className="w-3 h-3" /> },
  sahil:  { label: "Sahil",  color: "#ea580c", bg: "#ffedd5", icon: <Tent className="w-3 h-3" /> },
  dere:   { label: "Dere",   color: "#0891b2", bg: "#cffafe", icon: <Droplets className="w-3 h-3" /> },
};

/* Leaflet DivIcon HTML for a coloured circle marker */
function markerHtml(color: string, active = false) {
  const size   = active ? 18 : 13;
  const border = active ? 3 : 2;
  return `<div style="
    width:${size}px;height:${size}px;
    background:${color};
    border:${border}px solid white;
    border-radius:50%;
    box-shadow:0 1px 4px rgba(0,0,0,0.35);
    transition:all .15s;
  "></div>`;
}

export default function CampMap() {
  const [region, setRegion]         = useState<string>("Hepsi");
  const [kind, setKind]             = useState<CampSpotKind | "tümü">("tümü");
  const [selected, setSelected]     = useState<CampSpot | null>(null);
  const [searchQ, setSearchQ]       = useState("");
  const [MapComponents, setMC]      = useState<any>(null);
  const listRef                     = useRef<HTMLDivElement>(null);
  const regions                     = getRegions();

  /* ── Lazy-load Leaflet ───────────────────────── */
  useEffect(() => {
    let dead = false;
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      // @ts-ignore
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, L]) => {
      if (dead) return;
      setMC({ L, ...rl });
    });
    return () => { dead = true; };
  }, []);

  /* ── Filtered list ───────────────────────────── */
  const filtered = useMemo(() => {
    const q = searchQ.toLowerCase().trim();
    return campSpots
      .filter((s) => region === "Hepsi" || s.region.startsWith(region))
      .filter((s) => kind === "tümü" || s.kind === kind)
      .filter((s) =>
        !q || s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q),
      );
  }, [region, kind, searchQ]);

  /* ── Scroll selected item into view ─────────── */
  useEffect(() => {
    if (!selected || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-id="${selected.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  /* ── Custom icons (built after Leaflet loads) ─ */
  const icons = useMemo(() => {
    if (!MapComponents) return {} as Record<CampSpotKind, any>;
    return Object.fromEntries(
      (Object.keys(KIND_META) as CampSpotKind[]).map((k) => [
        k,
        MapComponents.L.divIcon({
          html: markerHtml(KIND_META[k].color),
          className: "",
          iconSize: [13, 13],
          iconAnchor: [6, 6],
          popupAnchor: [0, -10],
        }),
      ]),
    ) as Record<CampSpotKind, any>;
  }, [MapComponents]);

  const activeIcon = useMemo(() => {
    if (!MapComponents || !selected) return null;
    return MapComponents.L.divIcon({
      html: markerHtml(KIND_META[selected.kind].color, true),
      className: "",
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -12],
    });
  }, [MapComponents, selected]);

  return (
    <>
      <SEO
        title="Türkiye Kamp Alanları Haritası — 100+ Nokta"
        description="Türkiye'nin 100'den fazla kamp alanı interaktif harita üzerinde. Yaylalar, göller, ormanlar ve sahil kampları."
        url="/harita"
      />

      {/* ── Hero ── */}
      <section className="section-md bg-foreground/[0.03] border-b border-foreground/10">
        <div className="container px-6 max-w-5xl">
          <span className="eyebrow inline-flex items-center gap-2 text-secondary">
            <MapPin className="w-3.5 h-3.5" /> İnteraktif Kamp Haritası
          </span>
          <h1 className="editorial-heading text-5xl md:text-6xl lg:text-7xl mt-4">
            Türkiye'nin
            <br />
            <em className="italic font-light text-foreground/65">en iyi kamp noktaları.</em>
          </h1>
          <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg max-w-2xl mt-6">
            {campSpots.length}+ özenle seçilmiş ve koordinatları doğrulanmış kamp noktası — bölge, tip ve sezona göre filtrele, haritada keşfet.
          </p>
        </div>
      </section>

      {/* ── Legend ── */}
      <div className="container px-6 py-4 border-b border-foreground/10">
        <div className="flex flex-wrap gap-3 items-center">
          {(Object.keys(KIND_META) as CampSpotKind[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: KIND_META[k].color }} />
              {KIND_META[k].label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <section className="container px-6 py-4 border-b border-foreground/10">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
            <Filter className="w-3 h-3" /> Bölge:
          </span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="text-xs uppercase tracking-[0.18em] font-bold bg-transparent border border-foreground/15 px-3 py-1.5"
          >
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 ml-2">Tip:</span>
          {(["tümü", ...Object.keys(KIND_META)] as (CampSpotKind | "tümü")[]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={cn(
                "text-[0.6rem] uppercase tracking-[0.18em] font-bold px-2.5 py-1 border transition-colors inline-flex items-center gap-1",
                kind === k
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/15 text-foreground/65 hover:border-secondary hover:text-secondary",
              )}
            >
              {k !== "tümü" && <span className="w-2 h-2 rounded-full" style={{ background: KIND_META[k as CampSpotKind].color }} />}
              {k === "tümü" ? "Hepsi" : KIND_META[k as CampSpotKind].label}
            </button>
          ))}

          {/* Search */}
          <div className="ml-auto relative">
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Ara…"
              className="text-xs pl-3 pr-7 py-1.5 border border-foreground/15 bg-transparent focus:outline-none focus:border-secondary transition-colors w-40"
            />
            {searchQ && (
              <button onClick={() => setSearchQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
            {filtered.length} nokta
          </span>
        </div>
      </section>

      {/* ── Map + side panel ── */}
      <section className="container px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* Map */}
          <div className="h-[640px] border border-foreground/10 overflow-hidden bg-foreground/5 relative">
            {!MapComponents && (
              <div className="h-full flex items-center justify-center text-foreground/45 italic font-light">
                Harita yükleniyor…
              </div>
            )}
            {MapComponents && (
              <MapComponents.MapContainer
                center={[39.0, 35.5] as [number, number]}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom
              >
                {/* CartoDB Voyager — Google Maps benzeri görünüm, ücretsiz */}
                <MapComponents.TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  maxZoom={19}
                />
                {filtered.map((spot) => (
                  <MapComponents.Marker
                    key={spot.id}
                    position={[spot.lat, spot.lon] as [number, number]}
                    icon={selected?.id === spot.id && activeIcon ? activeIcon : icons[spot.kind]}
                    eventHandlers={{ click: () => setSelected(spot) }}
                  >
                    <MapComponents.Popup>
                      <div style={{ minWidth: 160 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{spot.name}</div>
                        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{spot.region}</div>
                        <div style={{ fontSize: 11, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ background: KIND_META[spot.kind].bg, color: KIND_META[spot.kind].color, padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                            {KIND_META[spot.kind].label}
                          </span>
                          {spot.altitude && <span style={{ color: "#888" }}>{spot.altitude} m</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#444", marginTop: 5 }}>{spot.bestSeason}</div>
                      </div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                ))}
              </MapComponents.MapContainer>
            )}
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-4 max-h-[640px]">
            {/* Selected detail */}
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="border-2 p-5 shrink-0"
                style={{ borderColor: KIND_META[selected.kind].color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[0.6rem] uppercase tracking-[0.2em] font-bold px-2 py-0.5"
                    style={{ background: KIND_META[selected.kind].bg, color: KIND_META[selected.kind].color }}
                  >
                    {KIND_META[selected.kind].label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
                      Zorluk: {selected.difficulty}
                    </span>
                    <button onClick={() => setSelected(null)} className="text-foreground/40 hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-serif text-xl text-primary font-medium tracking-tight leading-snug">{selected.name}</h3>
                <div className="text-xs uppercase tracking-[0.14em] text-foreground/55 font-bold mt-1 inline-flex items-center gap-1.5 flex-wrap">
                  <MapPin className="w-3 h-3" /> {selected.region}
                  {selected.altitude && <> · <Mountain className="w-3 h-3" /> {selected.altitude} m</>}
                </div>
                <p className="text-sm text-foreground/75 mt-3 font-light leading-relaxed">{selected.description}</p>
                <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 mt-3">
                  Sezon: <span className="text-foreground">{selected.bestSeason}</span>
                </div>
                <div className="mt-3">
                  <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-secondary mb-1.5">Önerilen Ekipman</div>
                  <ul className="space-y-1">
                    {selected.recommendedGear.map((g) => (
                      <li key={g} className="text-xs text-foreground/85 font-light flex items-baseline gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-secondary mt-1.5 shrink-0" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 text-[0.58rem] uppercase tracking-[0.16em] font-bold">
                  {selected.fishing && <span className="border border-foreground/20 px-1.5 py-0.5 inline-flex items-center gap-1"><Fish className="w-2.5 h-2.5" /> Balık</span>}
                  {selected.water && <span className="border border-foreground/20 px-1.5 py-0.5">Su Var</span>}
                  {selected.parking && <span className="border border-foreground/20 px-1.5 py-0.5">Otopark</span>}
                </div>
                <Link
                  href="/urunler"
                  className="mt-4 block text-center px-4 py-2.5 bg-primary text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary/90 transition"
                >
                  Ekipmanları Gör
                </Link>
              </motion.div>
            ) : (
              <div className="border border-foreground/10 p-5 text-center text-foreground/50 italic font-light text-sm shrink-0">
                Bir noktayı görmek için haritada tıkla veya listeden seç.
              </div>
            )}

            {/* Scrollable list */}
            <div
              ref={listRef}
              className="overflow-y-auto flex-1 space-y-1.5 pr-1"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 mb-2 sticky top-0 bg-background py-1">
                Liste ({filtered.length})
              </div>
              {filtered.map((s) => (
                <button
                  key={s.id}
                  data-id={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    "w-full text-left p-2.5 border transition-colors flex items-start gap-2.5",
                    selected?.id === s.id
                      ? "border-secondary bg-secondary/5"
                      : "border-foreground/10 hover:border-secondary/50",
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-sm mt-1 shrink-0"
                    style={{ background: KIND_META[s.kind].color }}
                  />
                  <div>
                    <div className="font-serif text-sm text-primary tracking-tight">{s.name}</div>
                    <div className="text-[0.6rem] uppercase tracking-[0.14em] text-foreground/50 font-bold mt-0.5">
                      {s.region} · {KIND_META[s.kind].label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
