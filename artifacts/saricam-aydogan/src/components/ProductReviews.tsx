import { useEffect, useState } from "react";
import { Star, Quote, PenLine, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import { getSupabase } from "@/lib/supabase";
import type { DBProductReview } from "@/lib/database.types";

/* ── Stars display ─────────────────────────────────────────── */

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

/* ── Interactive star picker ───────────────────────────────── */

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label="Puan seçin">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= (hovered || value);
        return (
          <button
            key={v}
            type="button"
            aria-label={`${v} yıldız`}
            onMouseEnter={() => setHovered(v)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => { haptics.light(); onChange(v); }}
            className="focus:outline-none"
          >
            <Star
              width={24} height={24}
              className={cn(
                "transition-colors",
                active ? "fill-secondary text-secondary" : "text-foreground/20 hover:text-secondary/60",
              )}
              strokeWidth={1.4}
            />
          </button>
        );
      })}
    </span>
  );
}

/* ── Review form ───────────────────────────────────────────── */

type FormState = { name: string; surname: string; rating: number; body: string };
type SubmitState = "idle" | "loading" | "success" | "error";

function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: (review: DBProductReview) => void;
}) {
  const [form, setForm] = useState<FormState>({ name: "", surname: "", rating: 0, body: "" });
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.rating === 0) { setErrorMsg("Lütfen bir puan seçin."); return; }
    if (form.body.trim().length < 10) { setErrorMsg("Yorumunuz en az 10 karakter olmalı."); return; }
    setErrorMsg("");
    setStatus("loading");

    const sb = getSupabase();
    if (!sb) {
      setStatus("error");
      setErrorMsg("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
      return;
    }

    const { data, error } = await sb
      .from("product_reviews")
      .insert({
        product_id: productId,
        name: form.name.trim(),
        surname: form.surname.trim(),
        rating: form.rating,
        body: form.body.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      setStatus("error");
      setErrorMsg("Yorumunuz kaydedilemedi. Lütfen tekrar deneyin.");
      return;
    }

    setStatus("success");
    onSubmitted(data as DBProductReview);
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-secondary" strokeWidth={1.5} />
        <p className="font-serif text-xl text-foreground">Yorumunuz alındı, teşekkürler!</p>
        <p className="text-sm text-foreground/55 font-light">Yorumunuz diğer müşterilere görünüyor.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="border border-foreground/15 p-6 md:p-8 mt-10 space-y-6"
    >
      <h3 className="font-serif text-xl text-foreground">Yorumunuzu yazın</h3>

      {/* Name + Surname */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/60 mb-2 block">
            İsim <span className="text-secondary">*</span>
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Ahmet"
            className="checkout-input w-full"
          />
        </label>
        <label className="block">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/60 mb-2 block">
            Soyisim <span className="text-secondary">*</span>
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={form.surname}
            onChange={e => set("surname", e.target.value)}
            placeholder="Yılmaz"
            className="checkout-input w-full"
          />
        </label>
      </div>

      {/* Rating */}
      <div>
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/60 mb-3 block">
          Puanınız <span className="text-secondary">*</span>
        </span>
        <StarPicker value={form.rating} onChange={v => set("rating", v)} />
      </div>

      {/* Body */}
      <label className="block">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/60 mb-2 block">
          Yorumunuz <span className="text-secondary">*</span>
        </span>
        <textarea
          required
          minLength={10}
          rows={4}
          value={form.body}
          onChange={e => set("body", e.target.value)}
          placeholder="Ürün hakkındaki deneyiminizi paylaşın…"
          className="checkout-input w-full resize-none"
        />
        <span className="text-[0.65rem] text-foreground/40 font-light mt-1 block">
          En az 10 karakter
        </span>
      </label>

      {/* Error */}
      <AnimatePresence>
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-red-500"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor…</>
          : <><Send className="w-4 h-4" /> Yorumu Gönder</>
        }
      </button>
    </motion.form>
  );
}

/* ── Main component ────────────────────────────────────────── */

export function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [reviews, setReviews] = useState<DBProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const sb = getSupabase();
      if (!sb) { setLoading(false); return; }

      const { data } = await sb
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        setReviews((data as DBProductReview[]) ?? []);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [productId]);

  function handleNewReview(review: DBProductReview) {
    setReviews(prev => [review, ...prev]);
    setShowForm(false);
  }

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    pct: reviews.length
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
      : 0,
  }));

  return (
    <section className="border-t border-foreground/15 pt-16 md:pt-24" aria-labelledby="reviews-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-16">
        <div>
          <span className="eyebrow">Müşteri Yorumları</span>
          <h2 id="reviews-heading" className="editorial-heading text-3xl md:text-5xl">
            Gerçek <em className="italic text-secondary">deneyimler.</em>
          </h2>
        </div>
        {!showForm && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={() => { haptics.tap(); setShowForm(true); }}
            className="btn-outline inline-flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <PenLine className="w-4 h-4" />
            Yorum Yap
          </motion.button>
        )}
      </div>

      {/* Review form (inline) */}
      <AnimatePresence>
        {showForm && (
          <ReviewForm
            productId={productId}
            onSubmitted={handleNewReview}
          />
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border-t border-foreground/10 pt-6 animate-pulse space-y-3">
              <div className="h-3 w-24 bg-foreground/10 rounded" />
              <div className="h-4 w-48 bg-foreground/10 rounded" />
              <div className="h-3 w-full max-w-sm bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Summary + distribution — only if reviews exist */}
      {!loading && reviews.length > 0 && (
        <div className="grid md:grid-cols-3 gap-10 md:gap-16 items-start mb-16 mt-2">
          <div>
            <div className="font-serif text-6xl md:text-7xl text-foreground leading-none">{avg.toFixed(1)}</div>
            <Stars value={Math.round(avg)} size={16} />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/55 mt-3">
              {reviews.length} Yorum
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
      )}

      {/* Empty state */}
      {!loading && reviews.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-16 text-center border border-dashed border-foreground/15"
        >
          <Quote className="w-8 h-8 text-foreground/20" strokeWidth={1.2} />
          <p className="font-serif text-xl text-foreground/60">
            {productName} için henüz yorum yok.
          </p>
          <p className="text-sm text-foreground/40 font-light max-w-xs">
            Bu ürünü satın aldıysanız ilk yorumu siz yapın.
          </p>
          <button
            type="button"
            onClick={() => { haptics.tap(); setShowForm(true); }}
            className="btn-outline inline-flex items-center gap-2 mt-2"
          >
            <PenLine className="w-4 h-4" />
            İlk Yorumu Yaz
          </button>
        </motion.div>
      )}

      {/* Review cards */}
      {!loading && reviews.length > 0 && (
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
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed font-light mb-4">
                <Quote className="inline w-3 h-3 text-secondary -mt-1 mr-1" />
                {r.body}
              </p>
              <div className="flex items-center justify-between text-xs text-foreground/55">
                <span className="font-semibold text-foreground/80">
                  {r.name} {r.surname.charAt(0)}.
                </span>
                <span className="font-light italic">
                  {new Date(r.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
