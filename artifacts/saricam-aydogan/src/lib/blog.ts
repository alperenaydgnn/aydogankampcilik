import { getSupabase } from "./supabase";

export type BlogCategory = "kamp" | "balık" | "outdoor" | "ekipman" | "rehber";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory | string;
  tags: string[];
  keywords?: string[];
  readingMinutes: number;
  coverUrl: string;
  coverPrompt?: string;
  content: string;
  author: string;
  publishedAt: string;
  aiModel?: string;
};

const STORAGE_KEY = "aydogan.blog.posts.v1";

/* ── Mock seed posts (always available) ─────────────────── */
const seedPosts: BlogPost[] = [
  {
    id: "adana-sariçam-toros-kamp-rotalari",
    slug: "adana-saricam-toros-kamp-rotalari",
    title: "Adana Sarıçam'dan Toros'a Kamp Rotaları: Tam Rehber",
    excerpt:
      "Adana ve Toros eteklerinde kamp rotaları: Pozantı, Tufanbeyli, Aladağlar. Hangi ekipman, hangi rota, hangi mevsim — yerel tavsiyelerle.",
    category: "rehber",
    tags: ["toros", "adana", "yaz kampı", "pozantı", "aladağlar"],
    keywords: ["adana kamp rotaları", "toros kamp", "pozantı yayla kamp", "aladağlar kamp rehberi"],
    readingMinutes: 8,
    coverUrl:
      "https://image.pollinations.ai/prompt/Taurus%20mountains%20camping%20tent%20at%20golden%20hour%2C%20pine%20forest%20Adana%20Turkey%2C%20cinematic%20photography?width=1280&height=720&nologo=true&seed=101",
    content: `## Neden Toros?

Adana'nın hemen kuzeyinde yükselen Toros dağları, yaz kampçılığı için Türkiye'nin en erişilebilir vahşi coğrafyalarından birini sunar. Sarıçam'dan hareket ederek 1-2 saat içinde serin yaylalara ulaşmak mümkün.

### Pozantı Yaylası

Adana'ya 70 km mesafedeki Pozantı, Torosların ilk serin durağı. Yaz ortasında bile 20-22°C olan bu yayla, aile kampı ve doğa yürüyüşleri için idealdir.

### Tufanbeyli Yaylası

Adana'nın kuzeyinde, deniz seviyesinden 1500 m yükseklikte yer alan Tufanbeyli; şehir gürültüsünden uzak, sakin bir kamp deneyimi sunar. Geceleri 12-15°C'ye inen sıcaklık için uyku tulumu şarttır.

## Önerilen Ekipman

- 3 mevsim çadır (havalandırmalı, yaz dostu)
- Konfor sıcaklığı +5°C uyku tulumu
- Hafif şişme mat (R-değeri ≥ 3)
- Güneş kremi + şapka (Adana yazında zorunlu)
- Su arıtma tableti veya filtre
- Kafa lambası + yedek pil
- Trekking ayakkabısı

## Pratik İpuçları

1. Adana yaz sıcağından kaçmak için Haziran-Eylül arası yaylaya çıkın.
2. Çadırı sabah güneşini alacak konuma kurun — sabah serinliği hızlı geçer.
3. Pozantı'da market mevcut; uzak noktalara yeterli erzak taşıyın.
4. Yangın yasak — taşınabilir gaz ocağı kullanın.

## Rota Önerisi

3 günlük rota: 1. gün Pozantı'da yerleşim, 2. gün Toros yürüyüş yollarında trek, 3. gün Aladağlar vadisine uzanma.

> Doğaya saygı her şeyden önce — çöplerinizi mutlaka geri taşıyın.`,
    author: "Aydoğan Kampçılık Editör",
    publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "seyhan-barajinda-sazan-avcilik",
    slug: "seyhan-barajinda-sazan-avcilik",
    title: "Seyhan Barajı'nda Sazan Avcılığının Püf Noktaları",
    excerpt:
      "Adana Seyhan Barajı'nda sazan ve yayın avcılığı için doğru sezon, doğru takım ve yerel teknikler. Adana balıkçılarının sırları.",
    category: "balık",
    tags: ["sazan", "yayın", "baraj balıkçılığı", "adana", "seyhan"],
    keywords: ["seyhan barajı balık", "adana sazan avcılığı", "yayın balığı", "baraj balıkçılığı"],
    readingMinutes: 6,
    coverUrl:
      "https://image.pollinations.ai/prompt/Carp%20fishing%20at%20reservoir%20Adana%20Turkey%2C%20golden%20hour%2C%20calm%20water%2C%20cinematic?width=1280&height=720&nologo=true&seed=202",
    content: `## Sezon

Seyhan Barajı'nda sazan avcılığı yıl boyunca yapılabilir. En verimli aylar nisan-mayıs (üreme öncesi) ve eylül-ekim (sonbahar beslenme dönemi).

## Takım Önerisi

### Sazan
- 3-3.6 m, medium heavy aksiyonlu kamış
- 4000-6000 makara, 0.30-0.35 mm monofilament
- Boilies, mısır ve hamur yemler

### Yayın
- Ağır jigging veya canlı yem takımı
- Güçlü olta makinesi, 0.40 mm misina

## Lokasyonlar

- **Seyhan Barajı Kıyısı**: Adana merkeze 15 dakika, geniş kıyı şeridi.
- **Çatalan Barajı**: Sazan ve yayın avcılığı için ideal, daha az kalabalık.
- **Ceyhan Nehri**: Nehir kenarı avcılığı, yerel rehberle daha verimli.

## Yasal Boy ve Kota

İçsular Yönetmeliği gereği sazan için minimum 20 cm boy şartı vardır. Güncel yasakları Tarım Bakanlığı'ndan doğrulayın.

## Pratik İpuçları

- Sabah erken saatler (05:00-09:00) ve akşamları (17:00-20:00) en verimli zaman.
- Yazın baraj suyu ısındığında sazanlar derine çekilir — derin bölgeleri hedefleyin.
- Adana sıcağında buz dolu soğutucu şarttır — avlanan balığı taze tutun.`,
    author: "Aydoğan Kampçılık Editör",
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "ilk-kampinizi-kurarken",
    slug: "ilk-kampinizi-kurarken",
    title: "İlk Kampınızı Kurarken Bilmeniz Gereken 10 Şey",
    excerpt:
      "Hayatınızdaki ilk kamp deneyimi için pratik, bütçeyi koruyan ve hata yapmadan başlamanızı sağlayan rehber.",
    category: "kamp",
    tags: ["başlangıç", "kamp rehberi", "ekipman"],
    keywords: ["ilk kamp", "kamp rehberi", "yeni başlayan kampçı"],
    readingMinutes: 7,
    coverUrl:
      "https://image.pollinations.ai/prompt/Beginner%20camping%20setup%20in%20pine%20forest%2C%20warm%20evening%20light%2C%20cozy%20tent?width=1280&height=720&nologo=true&seed=303",
    content: `## 1. Lokasyonu Doğru Seç

Eğer ilk kampını yapıyorsan, kalabalığa gitme — ama tamamen ıssız bir yere de gitme. Markete 15-30 dk uzaklıkta, telefon çekiyor olan bir alan ideal.

## 2. Çadırı Eve Kurarak Dene

Çadırını kamp alanında ilk kez kurma. Bahçende veya salonunda bir kez kurup söküyor olman gerekir.

## 3. Kat Kat Giyin

Tek bir kalın hırka yerine, 3 katlı bir sistem (taban + ara + dış kabuk) seni hem üşütmez hem terletmez.

## 4. Uyku Tulumu — Ucuz Olmasın

Kampçılığın en sık vazgeçme sebebi: soğuktan üşüyüp kötü bir gece geçirmek. Konfor sıcaklığı en az +5°C tulum yatırımına değer.

## 5. Mat Olmadan Üşürsün

Bir uyku matı, tulumdan daha önemlidir. Yerden gelen soğuk, tulumun sıcaklığını sıfırlayabilir.

## 6. Ateş ve Yangın Kuralları

Bulunduğun yerin yangın yasakları olabilir. Mutlaka portatif gaz ocağı taşı.

## 7. Yiyecek Saklama

Yiyecekleri çadırın içinde tutma — koku hayvan çeker. Araçta veya asılı bir torbada sakla.

## 8. Su Planı

Kişi başı günde 2.5-3 litre su hesapla. İçme suyunu yakındaki kaynaklardan tedarik edebileceğine güvenme — yedek tablet ya da filtre taşı.

## 9. Acil Durum Çantası

Pansuman, ağrı kesici, yara bantı, bandaj, sarı/kırmızı acil ışık.

## 10. Çöpün Senin

Geldiğinde ne kadar temizdiyse, gittiğinde de o kadar temiz olsun. Hiçbir şey yere gömme — bütün çöplerini geri taşı.

## Önerilen Başlangıç Seti

- 3 mevsim 2-kişilik çadır
- Konfor +5°C uyku tulumu
- Şişme uyku matı
- Far + ek pil
- Tarama gaz ocağı + 1 kartuş
- Çakı veya çok amaçlı alet
- 5 L su bidonu`,
    author: "Aydoğan Kampçılık Editör",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

/* ── Local store for AI-generated posts ─────────────────── */
function readStore(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function writeStore(posts: BlogPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* noop */
  }
}

/* ── Public API ─────────────────────────────────────────── */
async function fetchServerPosts(): Promise<BlogPost[]> {
  try {
    const r = await fetch("/api/blog/posts");
    if (!r.ok) return [];
    const j = await r.json();
    return (j.posts ?? []) as BlogPost[];
  } catch {
    return [];
  }
}

async function fetchServerPost(slug: string): Promise<BlogPost | null> {
  try {
    const r = await fetch(`/api/blog/posts/${encodeURIComponent(slug)}`);
    if (!r.ok) return null;
    const j = await r.json();
    return (j.post ?? null) as BlogPost | null;
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // 1. Server-generated posts (from cron scheduler)
  const serverPosts = await fetchServerPosts();

  // 2. Supabase (if configured)
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("blog_posts" as any)
        .select("*")
        .order("published_at", { ascending: false });
      if (!error && data) {
        const dbPosts: BlogPost[] = data.map(mapDbPost);
        return mergePosts([...serverPosts, ...dbPosts]);
      }
    } catch {
      /* fall through */
    }
  }
  return mergePosts(serverPosts);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Try server first (fast single-post lookup)
  const fromServer = await fetchServerPost(slug);
  if (fromServer) return fromServer;
  // Fall back to full list (covers seed + localStorage posts)
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function saveLocalBlogPost(post: BlogPost) {
  const cur = readStore();
  const next = [post, ...cur.filter((p) => p.slug !== post.slug)].slice(0, 50);
  writeStore(next);
  // Best-effort Supabase insert
  const sb = getSupabase();
  if (sb) {
    try {
      void Promise.resolve(
        sb.from("blog_posts" as any).upsert({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          keywords: post.keywords,
          reading_minutes: post.readingMinutes,
          cover_url: post.coverUrl,
          content: post.content,
          author: post.author,
          published_at: post.publishedAt,
          ai_model: post.aiModel,
        }),
      ).catch(() => {});
    } catch {
      /* noop */
    }
  }
}

export function deleteLocalBlogPost(slug: string) {
  const cur = readStore();
  writeStore(cur.filter((p) => p.slug !== slug));
}

function mergePosts(dbPosts: BlogPost[]): BlogPost[] {
  const local = readStore();
  const seen = new Set<string>();
  const all = [...dbPosts, ...local, ...seedPosts];
  const out: BlogPost[] = [];
  for (const p of all) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

function mapDbPost(row: any): BlogPost {
  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "rehber",
    tags: row.tags ?? [],
    keywords: row.keywords ?? [],
    readingMinutes: row.reading_minutes ?? 6,
    coverUrl: row.cover_url ?? "",
    content: row.content ?? "",
    author: row.author ?? "Aydoğan Kampçılık Editör",
    publishedAt: row.published_at ?? new Date().toISOString(),
    aiModel: row.ai_model,
  };
}

/* ── AI generation client ──────────────────────────────── */
export async function generateBlogPost(input: {
  topic: string;
  category?: BlogCategory;
  tone?: "uzman" | "samimi" | "rehber";
  region?: string;
}): Promise<BlogPost> {
  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("blog_admin_token") ?? "" : "";
  if (!adminToken) {
    throw new Error(
      "Admin token gerekli. localStorage.blog_admin_token içine sunucudaki BLOG_ADMIN_TOKEN değerini yaz.",
    );
  }
  const resp = await fetch("/api/blog/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-token": adminToken,
    },
    body: JSON.stringify(input),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Generation failed (${resp.status})`);
  }
  const json = await resp.json();
  return json.post as BlogPost;
}

export async function fetchTopicSuggestions(): Promise<
  { slug: string; title: string; category: string }[]
> {
  try {
    const r = await fetch("/api/blog/topics");
    if (!r.ok) return [];
    const j = await r.json();
    return j.topics ?? [];
  } catch {
    return [];
  }
}
