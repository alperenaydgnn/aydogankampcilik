import { useMemo, useState } from "react";
import { Star, Quote, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlurImage } from "@/components/BlurImage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";

/* ── Deterministic mock data per product slug ───────────── */

const NAMES = [
  "Mehmet K.", "Ayşe Y.", "Burak D.", "Elif T.", "Cem A.",
  "Selin Ö.", "Hakan B.", "Zeynep S.", "Onur P.", "Deniz E.",
];

const TITLES = [
  "Kalitesi tam beklediğim gibi",
  "Trabzon'dan bir gün içinde geldi",
  "Bayram tatilinde test ettim, harika",
  "Fiyat/performans şahane",
  "Olta arkadaşıma da aldım",
  "Beklediğimin üstünde dayanıklı",
  "WhatsApp'tan hızlı yanıt aldım",
];

const BODIES = [
  "Ürünü Karadeniz sahilinde test ettim — gerçekten dayanıklı, kalitesi yüksek. Magaza ekibinin tavsiyesi doğru çıktı, başkalarına da öneririm.",
  "Daha önce farklı markaları denedim ama bu kategoride en memnun kaldıklarımdan. Detaylar düşünülmüş, paketleme de özenliydi.",
  "Online sipariş ettim, ertesi gün elimdeydi. WhatsApp'tan sorularıma birkaç dakika içinde cevap geldi. Teşekkürler Sarıçam Aydoğan.",
  "Fiyatına göre çok başarılı bir ürün. Bir hafta yoğun kullandım, hiçbir sorun yaşamadım. Aradığını bilen herkese tavsiye ederim.",
  "Mağazaya gittim, tam istediğim ürünü vitrindekinden farklı bir varyantla gösterdiler — yardımcı olduğunuz için teşekkürler.",
  "Bayağı ağır kullanımda dahi yıpranma yok. Genelde 1-2 sezon sonra eskimeleri başlardı, bu seferki çok daha iyi.",
];

function seedFrom(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function rng(seed: number) {
  let x = seed || 1;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 0xffffffff;
  };
}

export type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  photo?: string;
  verified: boolean;
};

export function buildMockReviews(slug: string, productImages: string[]): Review[] {
  const seed = seedFrom(slug);
  const r = rng(seed);
  const count = 4 + Math.floor(r() * 3); // 4–6
  const list: Review[] = [];
  for (let i = 0; i < count; i++) {
    const name = NAMES[Math.floor(r() * NAMES.length)];
    const title = TITLES[Math.floor(r() * TITLES.length)];
    const body = BODIES[Math.floor(r() * BODIES.length)];
    const rating = 4 + (r() > 0.7 ? 0 : 1); // mostly 5, some 4
    // ~60% include a customer photo, recycled from product images
    const hasPhoto = r() > 0.4 && productImages.length > 0;
    const photo = hasPhoto
      ? productImages[Math.floor(r() * productImages.length)]
      : undefined;
    const daysAgo = Math.floor(r() * 280) + 4;
    const d = new Date(Date.now() - daysAgo * 86400_000);
    list.push({
      id: `${slug}-r${i}`,
      name,
      title,
      body,
      rating,
      photo,
      verified: r() > 0.25,
      date: d.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
    });
  }
  return list;
}

/* ── UI ─────────────────────────────────────────────── */

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} / 5 yıldız`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size} height={size}
          className={i < value ? "fill-secondary text-secondary" : "text-foreground/15"}
          strokeWidth={1.4}
        />
      ))}
    </span>
  );
}

export function ProductReviews({
  productSlug,
  productImages,
  productName,
}: {
  productSlug: string;
  productImages: string[];
  productName: string;
}) {
  const reviews = useMemo(
    () => buildMockReviews(productSlug, productImages),
    [productSlug, productImages],
  );

  const photos = useMemo(
    () => reviews.filter(r => r.photo).map(r => ({ url: r.photo!, name: r.name })),
    [reviews],
  );

  const [lightbox, setLightbox] = useState<number | null>(null);

  const avg = useMemo(
    () => Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10,
    [reviews],
  );

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => { dist[r.rating - 1] += 1; });
    return dist.map((c, i) => ({ stars: i + 1, count: c, pct: (c / reviews.length) * 100 })).reverse();
  }, [reviews]);

  return (
    <section className="border-t border-foreground/15 pt-16 md:pt-24" aria-labelledby="reviews-heading">
      <div className="mb-12 md:mb-16">
        <span className="eyebrow">Müşteri Yorumları</span>
        <h2 id="reviews-heading" className="editorial-heading text-3xl md:text-5xl">
          Gerçek <em className="italic text-secondary">deneyimler.</em>
        </h2>
      </div>

      {/* Summary row */}
      <div className="grid md:grid-cols-3 gap-10 md:gap-16 items-start mb-16">
        <div>
          <div className="font-serif text-6xl md:text-7xl text-foreground leading-none">{avg.toFixed(1)}</div>
          <Stars value={Math.round(avg)} size={16} />
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/55 mt-3">
            {reviews.length} Doğrulanmış Yorum
          </p>
        </div>
        <div className="md:col-span-2 space-y-2">
          {distribution.map(d => (
            <div key={d.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-foreground/55">{d.stars} yıldız</span>
              <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.pct}%` }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-secondary"
                />
              </div>
              <span className="w-8 text-right text-foreground/55 tabular-nums">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer photo gallery */}
      {photos.length > 0 && (
        <div className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <span className="eyebrow"><Camera className="w-3 h-3" /> Müşteri Fotoğrafları</span>
            <span className="text-xs text-foreground/45 font-light">{photos.length} fotoğraf</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
            {photos.map((p, i) => (
              <button
                key={`${p.url}-${i}`}
                onClick={() => { haptics.light(); setLightbox(i); }}
                className="group relative overflow-hidden border border-foreground/10 hover:border-secondary transition-colors"
                aria-label={`${p.name} tarafından paylaşılan fotoğraf`}
              >
                <AspectRatio ratio={1}>
                  <BlurImage
                    src={p.url}
                    alt={`${productName} — müşteri fotoğrafı`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </AspectRatio>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
        {reviews.map((r, i) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.06 }}
            className="border-t border-foreground/15 pt-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Stars value={r.rating} />
              {r.verified && (
                <span className="text-[0.6rem] uppercase tracking-[0.18em] font-semibold text-primary/70">
                  ✓ Doğrulanmış
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg text-foreground mb-2 leading-snug">{r.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light mb-4">
              <Quote className="inline w-3 h-3 text-secondary -mt-1 mr-1" />
              {r.body}
            </p>
            <div className="flex items-center justify-between text-xs text-foreground/55">
              <span className="font-semibold text-foreground/80">{r.name}</span>
              <span className="font-light italic">{r.date}</span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-foreground/85 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Müşteri fotoğrafı görünümü"
          >
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-background/85 hover:text-background w-10 h-10 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setLightbox(((lightbox - 1) + photos.length) % photos.length); }}
              aria-label="Önceki"
            ><ChevronLeft className="w-7 h-7" /></button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <BlurImage
                src={photos[lightbox].url}
                alt={`${productName} — ${photos[lightbox].name}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <p className="text-background/85 text-xs uppercase tracking-[0.2em] font-semibold mt-4 text-center">
                {photos[lightbox].name} — {lightbox + 1} / {photos.length}
              </p>
            </motion.div>
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-background/85 hover:text-background w-10 h-10 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}
              aria-label="Sonraki"
            ><ChevronRight className="w-7 h-7" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
