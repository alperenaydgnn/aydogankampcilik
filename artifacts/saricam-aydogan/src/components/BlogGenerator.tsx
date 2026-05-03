import { useEffect, useState } from "react";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";
import { generateBlogPost, fetchTopicSuggestions, saveLocalBlogPost, type BlogCategory } from "@/lib/blog";

const CATEGORIES: BlogCategory[] = ["kamp", "balık", "outdoor", "ekipman", "rehber"];

export function BlogGenerator({ onGenerated }: { onGenerated?: () => void }) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<BlogCategory>("rehber");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [topics, setTopics] = useState<{ slug: string; title: string; category: string }[]>([]);
  const [adminToken, setAdminToken] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("blog_admin_token") ?? "" : "",
  );

  useEffect(() => {
    fetchTopicSuggestions().then(setTopics);
  }, []);

  const saveToken = () => {
    if (typeof window === "undefined") return;
    if (adminToken.trim()) {
      localStorage.setItem("blog_admin_token", adminToken.trim());
      setSuccess("Admin token kaydedildi.");
    } else {
      localStorage.removeItem("blog_admin_token");
    }
  };

  const generate = async () => {
    if (!topic.trim()) {
      setError("Konu gir");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const post = await generateBlogPost({ topic: topic.trim(), category });
      saveLocalBlogPost(post);
      setSuccess(`"${post.title}" üretildi ve kaydedildi.`);
      setTopic("");
      onGenerated?.();
    } catch (e: any) {
      setError(e?.message || "Üretim başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-2 border-secondary bg-secondary/5 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-secondary" />
        <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-secondary">
          AI İçerik Üretici (Groq + Pollinations)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_140px] gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Konu / başlık (örn: 'Kış kampı için ısı tutma teknikleri')"
          className="border border-foreground/15 px-4 py-3 text-sm bg-background focus:border-secondary outline-none"
          disabled={busy}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as BlogCategory)}
          className="border border-foreground/15 px-3 py-3 text-xs uppercase tracking-[0.18em] font-bold bg-background"
          disabled={busy}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={generate}
          disabled={busy}
          className="bg-primary text-white px-4 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {busy ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Üretiyor</> : <><Sparkles className="w-3.5 h-3.5" /> Üret</>}
        </button>
      </div>

      {topics.length > 0 && (
        <div className="mt-4">
          <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 mb-2">
            Hazır konu önerileri
          </div>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.slug}
                onClick={() => { setTopic(t.title); setCategory(t.category as BlogCategory); }}
                className="text-[0.65rem] uppercase tracking-[0.16em] font-bold px-3 py-1.5 border border-foreground/15 text-foreground/65 hover:border-secondary hover:text-secondary transition-colors"
                disabled={busy}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 inline-flex items-start gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mt-4 inline-flex items-start gap-2 text-sm text-emerald-700">
          <Check className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-foreground/10">
        <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/55 mb-2">
          Admin Token (sunucu BLOG_ADMIN_TOKEN ile eşleşmeli)
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="BLOG_ADMIN_TOKEN değeri"
            className="flex-1 border border-foreground/15 px-3 py-2 text-sm bg-background"
          />
          <button
            onClick={saveToken}
            className="text-[0.65rem] uppercase tracking-[0.18em] font-bold border border-foreground/15 px-3 py-2 hover:border-secondary hover:text-secondary"
          >
            Kaydet
          </button>
        </div>
      </div>

      <div className="mt-4 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/45">
        Yazılar tarayıcıda kaydedilir. Supabase yapılandırılmışsa veritabanına da yazılır.
      </div>
    </div>
  );
}
