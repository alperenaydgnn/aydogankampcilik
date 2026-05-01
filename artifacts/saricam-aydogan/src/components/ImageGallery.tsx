import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const total = images.length;

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + total) % total);
  }, [total]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  /* Keyboard navigation */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, go]);

  /* Scroll lock when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) go(diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <>
      {/* ── Main Gallery ─────────────────────────────── */}
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative rounded-2xl overflow-hidden bg-muted border border-border/60 cursor-zoom-in select-none group"
          style={{ aspectRatio: "4/3" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.img
              key={current}
              src={images[current]}
              alt={`${alt} — ${current + 1}/${total}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>

          {/* Counter */}
          {total > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-white text-xs font-semibold">
              {current + 1} / {total}
            </div>
          )}

          {/* Lightbox trigger */}
          <button
            aria-label="Tam ekranda görüntüle"
            onClick={e => { e.stopPropagation(); setLightbox(true); }}
            className="absolute bottom-3 right-3 bg-black/45 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-black/60"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Prev/Next arrows — visible on hover (desktop) / always (multi-image) */}
          {total > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); go(-1); }}
                aria-label="Önceki görsel"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 text-foreground z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); go(1); }}
                aria-label="Sonraki görsel"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 text-foreground z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  "relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                  current === idx
                    ? "border-primary shadow-md scale-[1.04]"
                    : "border-transparent opacity-60 hover:opacity-90 hover:border-primary/40"
                )}
                aria-label={`Görsel ${idx + 1}`}
              >
                <img src={img} alt={`${alt} küçük resim ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Mobile dots */}
        {total > 1 && (
          <div className="flex justify-center gap-1.5 sm:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  current === idx ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/30"
                )}
                aria-label={`Görsel ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightbox(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              aria-label="Kapat"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
              {current + 1} / {total}
            </div>

            {/* Image */}
            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.img
                key={current}
                src={images[current]}
                alt={`${alt} — ${current + 1}/${total}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
                draggable={false}
                onClick={e => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Prev/Next */}
            {total > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); go(-1); }}
                  aria-label="Önceki"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); go(1); }}
                  aria-label="Sonraki"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {total > 1 && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={e => { e.stopPropagation(); goTo(idx); }}
                    className={cn(
                      "shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                      current === idx ? "border-white scale-110" : "border-white/25 opacity-55 hover:opacity-80"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
