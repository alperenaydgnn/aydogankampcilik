import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Mountain, Filter, Fish } from "lucide-react";
import { Link } from "wouter";
import { campSpots, getRegions, type CampSpot, type CampSpotKind } from "@/lib/campSpots";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<CampSpotKind, string> = {
  yayla: "Yayla", göl: "Göl", orman: "Orman", sahil: "Sahil", dere: "Dere",
};

export default function CampMap() {
  const [region, setRegion] = useState<string>("Hepsi");
  const [kind, setKind] = useState<CampSpotKind | "tümü">("tümü");
  const [selected, setSelected] = useState<CampSpot | null>(null);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const regions = getRegions();

  useEffect(() => {
    let dead = false;
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      // @ts-ignore
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, L]) => {
      if (dead) return;
      // Fix Leaflet default marker icons
      const DefaultIcon = (L as any).icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      (L as any).Marker.prototype.options.icon = DefaultIcon;
      setMapComponents({ L, ...rl });
    });
    return () => { dead = true; };
  }, []);

  const filtered = useMemo(() => {
    return campSpots
      .filter((s) => region === "Hepsi" || s.region.startsWith(region))
      .filter((s) => kind === "tümü" || s.kind === kind);
  }, [region, kind]);

  return (
    <>
      <SEO
        title="Türkiye Kamp Alanları Haritası — İnteraktif"
        description="Türkiye'nin en güzel kamp alanları interaktif harita üzerinde. Yaylalar, göller, ormanlar ve sahil kampları + her nokta için ekipman önerisi."
      />

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
            {campSpots.length}+ özenle seçilmiş kamp noktası — bölge, tip ve sezona göre filtrele,
            haritada keşfet, ekipman tavsiyesini doğrudan al.
          </p>
        </div>
      </section>

      <section className="container px-6 py-10 border-b border-foreground/10">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
            <Filter className="w-3 h-3" /> Bölge:
          </span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="text-xs uppercase tracking-[0.18em] font-bold bg-transparent border border-foreground/15 px-3 py-2"
          >
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 ml-2">Tip:</span>
          {(["tümü", "yayla", "göl", "orman", "sahil", "dere"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={cn(
                "text-[0.6rem] uppercase tracking-[0.18em] font-bold px-3 py-1.5 border transition-colors",
                kind === k
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/15 text-foreground/65 hover:border-secondary hover:text-secondary",
              )}
            >
              {k === "tümü" ? "Hepsi" : KIND_LABELS[k]}
            </button>
          ))}
          <span className="ml-auto text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
            {filtered.length} nokta
          </span>
        </div>
      </section>

      <section className="container px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="h-[640px] border border-foreground/10 overflow-hidden bg-foreground/5">
            {!MapComponents && (
              <div className="h-full flex items-center justify-center text-foreground/45 italic font-light">
                Harita yükleniyor…
              </div>
            )}
            {MapComponents && (
              <MapComponents.MapContainer
                center={[39.5, 35.5] as [number, number]}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <MapComponents.TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map((spot) => (
                  <MapComponents.Marker
                    key={spot.id}
                    position={[spot.lat, spot.lon] as [number, number]}
                    eventHandlers={{ click: () => setSelected(spot) }}
                  >
                    <MapComponents.Popup>
                      <div className="font-bold text-sm">{spot.name}</div>
                      <div className="text-xs text-gray-600">{spot.region}</div>
                      <div className="text-xs mt-1">{KIND_LABELS[spot.kind]} · {spot.altitude}m</div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                ))}
              </MapComponents.MapContainer>
            )}
          </div>

          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-2 border-secondary p-6 bg-secondary/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-secondary">
                    {KIND_LABELS[selected.kind]}
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
                    Zorluk: {selected.difficulty}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-primary font-medium tracking-tight">{selected.name}</h3>
                <div className="text-xs uppercase tracking-[0.16em] text-foreground/55 font-bold mt-1 inline-flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {selected.region}
                  {selected.altitude && <> · <Mountain className="w-3 h-3" /> {selected.altitude} m</>}
                </div>
                <p className="text-sm text-foreground/75 mt-3 font-light leading-relaxed">{selected.description}</p>
                <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 mt-4">
                  Sezon: <span className="text-foreground">{selected.bestSeason}</span>
                </div>
                <div className="mt-4">
                  <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-secondary mb-2">Önerilen Ekipman</div>
                  <ul className="space-y-1.5">
                    {selected.recommendedGear.map((g) => (
                      <li key={g} className="text-sm text-foreground/85 font-light flex items-baseline gap-2">
                        <span className="w-1 h-1 rounded-full bg-secondary mt-1.5 shrink-0" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 mt-5 text-[0.6rem] uppercase tracking-[0.18em] font-bold">
                  {selected.fishing && <span className="border border-foreground/20 px-2 py-1 inline-flex items-center gap-1"><Fish className="w-3 h-3" /> Balık</span>}
                  {selected.water && <span className="border border-foreground/20 px-2 py-1">Su Var</span>}
                  {selected.parking && <span className="border border-foreground/20 px-2 py-1">Otopark</span>}
                </div>
                <Link
                  href="/urunler"
                  className="mt-6 block text-center px-4 py-3 bg-primary text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary/90 transition"
                >
                  Ekipmanları Gör
                </Link>
              </motion.div>
            ) : (
              <div className="border border-foreground/10 p-6 text-center text-foreground/55 italic font-light">
                Bir noktayı görmek için haritada tıkla veya aşağıdaki listeden seç.
              </div>
            )}

            <div>
              <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 mb-3">Liste ({filtered.length})</div>
              <ul className="space-y-2">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelected(s)}
                      className={cn(
                        "w-full text-left p-3 border transition-colors",
                        selected?.id === s.id
                          ? "border-secondary bg-secondary/5"
                          : "border-foreground/10 hover:border-secondary",
                      )}
                    >
                      <div className="font-serif text-base text-primary tracking-tight">{s.name}</div>
                      <div className="text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55 font-bold mt-0.5">
                        {s.region} · {KIND_LABELS[s.kind]}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
