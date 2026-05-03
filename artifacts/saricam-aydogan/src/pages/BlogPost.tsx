import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { getBlogPost, type BlogPost } from "@/lib/blog";
import { SEO } from "@/lib/seo";
import NotFound from "@/pages/not-found";

export default function BlogPostPage() {
  const [, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = params?.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getBlogPost(slug).then((p) => {
      setPost(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="container px-6 py-32 text-center text-foreground/55 italic font-light">Yükleniyor…</div>;
  }
  if (!post) return <NotFound />;

  const date = new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <SEO
        title={`${post.title} — Sarıçam Aydoğan Blog`}
        description={post.excerpt}
        image={post.coverUrl}
      />

      <article className="pb-32">
        {/* Hero */}
        <header className="relative">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-foreground/5">
            <img
              src={post.coverUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container px-6 -mt-24 md:-mt-32 relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-background border border-foreground/10 p-8 md:p-12"
            >
              <Link href="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-foreground/55 hover:text-secondary transition-colors mb-6">
                <ArrowLeft className="w-3.5 h-3.5" /> Tüm Yazılar
              </Link>
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] font-bold text-foreground/55 mb-4">
                <span className="text-secondary">{post.category}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingMinutes} dk</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
              </div>
              <h1 className="editorial-heading text-3xl md:text-5xl mb-6">{post.title}</h1>
              <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg">
                {post.excerpt}
              </p>
              {post.aiModel && (
                <div className="mt-6 pt-6 border-t border-foreground/10 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-foreground/45">
                  Yapay zeka destekli içerik · {post.aiModel}
                </div>
              )}
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <div className="container px-6 max-w-3xl mt-16">
          <div className="prose-editorial">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-foreground/10">
              <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.18em] font-bold text-foreground/55">
                <Tag className="w-3.5 h-3.5" /> Etiketler
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="text-xs uppercase tracking-[0.15em] font-bold border border-foreground/15 text-foreground/65 px-3 py-1.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-12 border-t border-foreground/10 text-center">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition text-sm uppercase tracking-[0.2em] font-bold"
            >
              Önerilen Ekipmanları Gör
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
