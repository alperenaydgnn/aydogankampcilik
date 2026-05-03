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

const STORAGE_KEY = "saricam.blog.posts.v1";

/* ── Mock seed posts (always available) ─────────────────── */
const seedPosts: BlogPost[] = [
  {
    id: "kackar-yaylalarinda-yaz-kampi",
    slug: "kackar-yaylalarinda-yaz-kampi",
    title: "Kaçkar Yaylalarında Yaz Kampı: Tam Rehber",
    excerpt:
      "Kaçkar Dağları'nın yaylalarında haftalık bir kamp planı: Pokut, Sal, Ayder. Hangi ekipman, hangi rota, hangi mevsim — yerel tavsiyelerle.",
    category: "rehber",
    tags: ["kaçkar", "yayla", "yaz kampı", "trekking"],
    keywords: ["kaçkar yayla kampı", "pokut yaylası kamp", "sal yaylası", "rize yayla rehberi"],
    readingMinutes: 8,
    coverUrl:
      "https://image.pollinations.ai/prompt/Kackar%20mountains%20yayla%20camping%20tent%20at%20golden%20hour%2C%20misty%20pine%20forest%2C%20cinematic%20photography?width=1280&height=720&nologo=true&seed=101",
    content: `## Neden Kaçkar?

Kaçkar Yaylaları yaz aylarında Türkiye'nin en güzel kamp coğrafyalarından biridir. Pokut, Sal ve Ayder hattında haftalık bir kamp planı kurmak; deneyimli bir kampçıyı bile heyecanlandırır.

### Pokut Yaylası

Çamlıhemşin'in üst kısmındaki Pokut, sis denizinin üzerinde yüzer gibi durur. Geceleri sıcaklık temmuz ortasında bile 8-10°C'ye düşebilir; bu yüzden konfor sıcaklığı 5°C ve altı bir uyku tulumu önerilir.

### Sal Yaylası

Sal, Pokut'a 1.5 saatlik bir trek mesafesinde. Yamaçlardaki yayla evleri arasında düz alan bulmak kolay; ancak rüzgar koruması için 4 mevsim çadır şart.

## Önerilen Ekipman

- 4 mevsim çadır (rüzgâr direnci yüksek)
- Konfor sıcaklığı 0/5°C uyku tulumu
- Sıcak yalıtımlı mat (R-değeri ≥ 4)
- Yağmurluk + softshell katman sistemi
- Su arıtma tableti veya gravite filtre
- Far + yedek pil
- Trekking ayakkabısı (sırılsıklam çamuru olabilir)

## Pratik İpuçları

1. Yaylalara çıkmadan önce hava durumunu son ana kadar takip edin.
2. Çadırı yaylanın kuzey tarafına kurmayın — sabah güneşi alamaz, soğuk olur.
3. Yaylada market yok; en yakın bakkal Çamlıhemşin'de.
4. Yangın yasak — sadece tarama gaz ocağı kullanın.

## Rota Önerisi

3 günlük rota: 1. gün Pokut'ta yerleşim, 2. gün Sal'a trek + dönüş, 3. gün Hazindağ etekleri ve Ayder iniş.

> Yaylalara saygı her şeyden önce gelir — çöplerinizi mutlaka geri taşıyın.`,
    author: "Sarıçam Aydoğan Editör",
    publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "karadenizde-alabalik-tutma",
    slug: "karadenizde-alabalik-tutma",
    title: "Karadeniz'de Alabalık Tutmanın Püf Noktaları",
    excerpt:
      "Doğu Karadeniz derelerinde alabalık avı için doğru sezon, doğru takım ve yerel teknikler. Trabzon ve Rize derelerinde test edildi.",
    category: "balık",
    tags: ["alabalık", "fly fishing", "spinning", "dere balıkçılığı"],
    keywords: ["alabalık tutma", "karadeniz alabalık", "spinning takım", "dere balıkçılığı"],
    readingMinutes: 6,
    coverUrl:
      "https://image.pollinations.ai/prompt/Mountain%20stream%20trout%20fishing%20in%20Karadeniz%20Turkey%2C%20fly%20rod%2C%20clear%20water%2C%20misty%20morning?width=1280&height=720&nologo=true&seed=202",
    content: `## Sezon

Doğu Karadeniz derelerinde alabalık sezonu nisan başında açılır, ekim ortasında biter. En verimli aylar mayıs-haziran ve eylül.

## Takım Önerisi

### Spinning
- 6-7 ft, ultra-light/light aksiyonlu kamış
- 1000-2500 makara, 0.18-0.22 mm misina
- 2-7 g spinner ve mikro jig

### Fly
- 7'6" 3-4 wt kamış, FLOAT tip line
- Klasik elk hair caddis ve woolly bugger nymphs

## Lokasyonlar

- **Solaklı Vadisi (Of/Trabzon)**: Akarsu yatakları geniş, alabalık popülasyonu sağlıklı.
- **Fırtına Vadisi (Çamlıhemşin)**: Nisan-mayıs dönüşleri muhteşem.
- **Hemşin Deresi**: Yerel rehberle daha verimli.

## Yasal Boy ve Kota

İçsular Yönetmeliği gereği alabalık için minimum 25 cm boy şartı vardır; günlük kota 5 adettir. Yasaklı dönemleri Tarım Bakanlığı sayfasından doğrulayın.

## Pratik İpuçları

- Akıntının orta hızlı olduğu kuyu girişlerini hedefleyin.
- Yağmurdan sonraki bulanık günler avantajlıdır.
- Sabah ilk ışık ve akşam son ışık en verimli zamandır.`,
    author: "Sarıçam Aydoğan Editör",
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
    author: "Sarıçam Aydoğan Editör",
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
    author: row.author ?? "Sarıçam Aydoğan Editör",
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
