import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Clock, ChevronRight } from "lucide-react";
import { getBlogPosts, type BlogPost, type BlogCategory } from "@/lib/blog";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { BlogGenerator } from "@/components/BlogGenerator";

const CATEGORIES: { slug: BlogCategory | "tümü"; label: string }[] = [
  { slug: "tümü", label: "Tümü" },
  { slug: "kamp", label: "Kamp" },
  { slug: "balık", label: "Balık" },
  { slug: "outdoor", label: "Outdoor" },
  { slug: "ekipman", label: "Ekipman" },
  { slug: "rehber", label: "Rehber" },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("tümü");
  const [showGen, setShowGen] = useState(false);

  const reload = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = filter === "tümü" ? posts : posts.filter((p) => p.category === filter);
  const isAdmin = typeof window !== "undefined" &&
    (localStorage.getItem("admin_session") === "1" ||
     new URLSearchParams(window.location.search).has("admin"));

  return (
    <>
      <SEO
        title="Kampçılık Rehberi — Sarıçam Aydoğan Blog"
        description="Karadeniz kamp ve balıkçılık rehberi. Yayla rotaları, ekipman önerileri, mevsim takvimleri ve uzman tavsiyeleri."
      />

      {/* Hero */}
      <section className="section-md bg-foreground/[0.03] border-b border-foreground/10">
        <div className="container px-6 max-w-5xl">
          <span className="eyebrow inline-flex items-center gap-2 text-secondary">
            <Sparkles className="w-3.5 h-3.5" /> Kampçılık Rehberi
          </span>
          <h1 className="editorial-heading text-5xl md:text-6xl lg:text-7xl mt-4">
            Doğanın
            <br />
            <em className="italic font-light text-foreground/65">sözlüğü.</em>
          </h1>
          <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg max-w-2xl mt-6">
            Karadeniz coğrafyasından somut, denenmiş bilgi. Yayla rotaları, balıkçılık püf noktaları,
            ekipman seçim rehberleri ve mevsim takvimleri.
          </p>
        </div>
      </section>

      {/* Filters + Admin gen */}
      <section className="container px-6 py-12 border-b border-foreground/10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setFilter(c.slug)}
                className={cn(
                  "text-[0.65rem] uppercase tracking-[0.2em] font-bold px-4 py-2 border transition-colors",
                  filter === c.slug
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground/15 text-foreground/65 hover:border-secondary hover:text-secondary",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowGen((v) => !v)}
              className="text-[0.65rem] uppercase tracking-[0.2em] font-bold px-4 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showGen ? "Üreticiyi Kapat" : "Yeni Yazı Üret"}
            </button>
          )}
        </div>

        {showGen && isAdmin && (
          <div className="mt-8">
            <BlogGenerator onGenerated={reload} />
          </div>
        )}
      </section>

      {/* Posts grid */}
      <section className="container px-6 py-16">
        {loading && (
          <div className="text-center text-foreground/55 italic font-light py-16">Yükleniyor…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-foreground/55 italic font-light py-16">
            Bu kategoride henüz yazı yok.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filtered.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: Math.min(i * 0.05, 0.3) }}
              className="group flex flex-col"
            >
              <Link href={`/blog/${p.slug}`} className="block overflow-hidden bg-foreground/5">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.coverUrl}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
              </Link>
              <div className="pt-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] font-bold text-foreground/55 mb-3">
                  <span className="text-secondary">{p.category}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {p.readingMinutes} dk</span>
                </div>
                <Link href={`/blog/${p.slug}`}>
                  <h3 className="font-serif font-light text-2xl md:text-[1.7rem] text-primary tracking-tight leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                    {p.title}
                  </h3>
                </Link>
                <p className="text-sm text-foreground/65 mt-3 line-clamp-3 font-light leading-relaxed flex-1">
                  {p.excerpt}
                </p>
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-bold text-foreground hover:text-secondary transition-colors"
                >
                  Devamını Oku <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
