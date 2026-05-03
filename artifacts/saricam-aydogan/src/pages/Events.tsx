import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, MapPin, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { events, type CalendarEvent, type EventKind } from "@/lib/events";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const KIND_META: Record<EventKind, { label: string; color: string }> = {
  sezon: { label: "Sezon", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  yasak: { label: "Yasak", color: "text-red-700 border-red-300 bg-red-50" },
  festival: { label: "Festival", color: "text-amber-700 border-amber-300 bg-amber-50" },
  av: { label: "Av", color: "text-foreground border-foreground/20 bg-foreground/5" },
  gözlem: { label: "Doğa Gözlemi", color: "text-blue-700 border-blue-300 bg-blue-50" },
};

function isMonthInRange(m: number, e: CalendarEvent): boolean {
  const start = e.startMonth;
  const end = e.endMonth ?? e.startMonth;
  if (start <= end) return m >= start && m <= end;
  return m >= start || m <= end;
}

export default function Events() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [kindFilter, setKindFilter] = useState<EventKind | "tümü">("tümü");

  const filtered = useMemo(() => {
    return events
      .filter((e) => isMonthInRange(selectedMonth, e))
      .filter((e) => kindFilter === "tümü" || e.kind === kindFilter)
      .sort((a, b) => a.startMonth * 100 + (a.startDay ?? 0) - (b.startMonth * 100 + (b.startDay ?? 0)));
  }, [selectedMonth, kindFilter]);

  return (
    <>
      <SEO
        title="Etkinlik Takvimi — Av yasakları, sezonlar, festivaller"
        description="Adana, Akdeniz ve Türkiye geneli kamp festivalleri, balık-av sezonları, av yasakları takvimi. Mevsim önerileri ve ekipman bağlantıları."
      />

      {/* Hero */}
      <section className="section-md bg-foreground/[0.03] border-b border-foreground/10">
        <div className="container px-6 max-w-5xl">
          <span className="eyebrow inline-flex items-center gap-2 text-secondary">
            <Calendar className="w-3.5 h-3.5" /> Etkinlik Takvimi
          </span>
          <h1 className="editorial-heading text-5xl md:text-6xl lg:text-7xl mt-4">
            Yılın
            <br />
            <em className="italic font-light text-foreground/65">ritmi.</em>
          </h1>
          <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg max-w-2xl mt-6">
            Sezon başlangıçları, av yasakları, yayla şenlikleri ve doğa gözlemleri — Adana ve Toros odağında bir takvim.
          </p>
        </div>
      </section>

      {/* Month selector */}
      <section className="container px-6 py-10 border-b border-foreground/10 sticky top-16 z-30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin">
          {MONTHS.map((m, i) => {
            const idx = i + 1;
            const active = selectedMonth === idx;
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(idx)}
                className={cn(
                  "shrink-0 px-4 py-2 text-xs uppercase tracking-[0.18em] font-bold border transition-colors",
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground/15 text-foreground/65 hover:border-secondary hover:text-secondary",
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
            <Filter className="w-3 h-3" /> Tip:
          </span>
          {(["tümü", "sezon", "yasak", "festival", "gözlem"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKindFilter(k)}
              className={cn(
                "text-[0.6rem] uppercase tracking-[0.18em] font-bold px-3 py-1.5 border transition-colors",
                kindFilter === k
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/15 text-foreground/65 hover:border-secondary hover:text-secondary",
              )}
            >
              {k === "tümü" ? "Hepsi" : k}
            </button>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="container px-6 py-16">
        <h2 className="editorial-heading text-3xl md:text-4xl mb-10">
          {MONTHS[selectedMonth - 1]} <em className="italic font-light text-foreground/55">— bu ay</em>
        </h2>

        {filtered.length === 0 && (
          <div className="text-center text-foreground/55 italic font-light py-16">
            Bu ay için seçili kriterlerde etkinlik yok.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {filtered.map((e, i) => {
            const meta = KIND_META[e.kind];
            return (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.25) }}
                className="border border-foreground/10 p-6 hover:border-secondary transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className={cn("text-[0.6rem] uppercase tracking-[0.2em] font-bold border px-2.5 py-1", meta.color)}>
                    {meta.label}
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55">
                    {MONTHS[e.startMonth - 1].slice(0, 3)}
                    {e.endMonth && e.endMonth !== e.startMonth ? ` → ${MONTHS[e.endMonth - 1].slice(0, 3)}` : ""}
                  </span>
                </div>
                <h3 className="font-serif font-light text-2xl text-primary tracking-tight leading-snug mb-2">
                  {e.title}
                </h3>
                {e.region && (
                  <div className="text-[0.7rem] uppercase tracking-[0.18em] text-foreground/55 font-bold mb-3 inline-flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {e.region}
                  </div>
                )}
                <p className="text-sm text-foreground/65 leading-relaxed font-light">
                  {e.description}
                </p>
                {e.recommendedProducts && e.recommendedProducts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-foreground/10">
                    <Link
                      href={`/urunler/${e.recommendedProducts[0]}`}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] font-bold text-foreground hover:text-secondary transition-colors"
                    >
                      Önerilen Ekipman <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>
    </>
  );
}
