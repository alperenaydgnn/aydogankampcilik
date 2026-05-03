import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Mountain, Calendar } from "lucide-react";
import { campSpots } from "@/lib/campSpots";
import { cn } from "@/lib/utils";

/** Deterministic ISO week number */
function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
}

function pickForThisWeek() {
  const now = new Date();
  const w = isoWeek(now);
  const month = now.getMonth() + 1;
  // Score: prefer spots whose bestSeason includes the current month name
  const monthName = now.toLocaleString("tr-TR", { month: "long" }).toLowerCase();
  const scored = campSpots.map((s) => {
    const seasonText = s.bestSeason.toLowerCase();
    const seasonMatch = seasonText.includes(monthName) ? 2 : 0;
    const isWinter = month <= 2 || month === 12;
    const winterPenalty = isWinter && s.altitude && s.altitude > 1800 ? -3 : 0;
    return { spot: s, score: seasonMatch + winterPenalty };
  });
  const best = scored.filter((x) => x.score >= 2);
  const pool = best.length ? best : scored;
  // Deterministic by week number
  return pool[w % pool.length].spot;
}

export function WeekendPickWidget({ className }: { className?: string }) {
  const spot = pickForThisWeek();
  const weekendDate = (() => {
    const d = new Date();
    const sat = new Date(d);
    sat.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
    return sat.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" });
  })();

  return (
    <section className={cn("section-sm bg-primary text-white", className)}>
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow inline-flex items-center gap-2 text-secondary">
              <Calendar className="w-3.5 h-3.5" /> Bu Hafta Sonu
            </span>
            <h2 className="editorial-heading text-white text-4xl md:text-5xl lg:text-6xl mt-4 mb-6">
              {spot.name}
              <br />
              <em className="italic font-light text-white/60">— {weekendDate}</em>
            </h2>
            <p className="text-white/65 leading-relaxed font-light text-base md:text-lg max-w-xl mb-6">
              {spot.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8 text-[0.65rem] uppercase tracking-[0.18em] font-bold">
              <span className="border border-white/25 text-white/85 px-2.5 py-1">{spot.region}</span>
              <span className="border border-white/25 text-white/85 px-2.5 py-1">{spot.kind}</span>
              {spot.altitude && (
                <span className="border border-white/25 text-white/85 px-2.5 py-1">{spot.altitude} m</span>
              )}
              <span className="border border-secondary/60 text-secondary px-2.5 py-1">
                Sezon: {spot.bestSeason}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/harita"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary text-xs uppercase tracking-[0.2em] font-bold hover:bg-secondary/90 transition"
              >
                Haritada Gör <Mountain className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition"
              >
                Önerilen Ekipman <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white/5 border border-white/10 p-6 md:p-8"
          >
            <div className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-3">
              Yanına Mutlaka Al
            </div>
            <ul className="space-y-3">
              {spot.recommendedGear.map((g) => (
                <li key={g} className="flex items-baseline gap-3 text-sm text-white/85 font-light">
                  <span className="w-1 h-1 rounded-full bg-secondary mt-2 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
