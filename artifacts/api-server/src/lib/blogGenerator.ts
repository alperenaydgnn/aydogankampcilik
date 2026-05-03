import { logger } from "./logger";
import { upsertPost, type StoredPost } from "./postStore";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Sen Türkiye'nin Karadeniz bölgesindeki "Sarıçam Aydoğan Kamp & Balık" markası için SEO uyumlu, otantik ve satış odaklı blog içerikleri yazan deneyimli bir outdoor editörüsün. 
Kurallar:
- Tamamen Türkçe yaz, doğal akıcı bir dil kullan, klişelerden kaçın.
- 800-1200 kelime arası, H2/H3 başlıklarla yapılandırılmış Markdown üret.
- En az bir "Önerilen Ekipman" listesi (madde imli) ve bir "Pratik İpuçları" bölümü ekle.
- Doğu Karadeniz / Trabzon coğrafyasından somut detaylar ver (yayla isimleri, mevsim koşulları, yerel tavsiyeler).
- Aşırı satış dilinden kaçın ama uygun yerlerde markamızın ürün kategorilerine doğal bağlantı ver.
- SEO için anahtar kelimeyi başlık + ilk paragraf + en az 2 alt başlıkta kullan.

Çıktıyı SADECE bu JSON şemasında üret (başka hiçbir metin verme):
{
  "title": "string (60 karakter içinde, anahtar kelime başta)",
  "slug": "kebab-case-slug-turkce-karakter-yok",
  "excerpt": "string (150-160 karakter SEO meta description)",
  "category": "kamp|balık|outdoor|ekipman|rehber",
  "tags": ["3-6 etiket"],
  "readingMinutes": 5,
  "keywords": ["seo anahtar kelimeleri 5-8 adet"],
  "coverPrompt": "kısa İngilizce görsel prompt — kamp/doğa/balık temalı, fotoğrafik, sinematik",
  "content": "tam markdown içerik"
}`;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export type GenerateInput = {
  topic: string;
  category?: string;
  tone?: string;
  region?: string;
  productHints?: string[];
};

export async function generateAndSave(
  input: GenerateInput,
  apiKey: string,
): Promise<StoredPost> {
  const { topic, category, tone, region, productHints } = input;

  const userPrompt = [
    `Konu: ${topic}`,
    category ? `Tercih edilen kategori: ${category}` : null,
    tone ? `Ton: ${tone}` : "Ton: rehber",
    region ? `Bölge: ${region}` : "Bölge: Doğu Karadeniz / Trabzon",
    productHints?.length
      ? `Doğal bağlanabilecek ürün kategorileri: ${productHints.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const resp = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.75,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Groq API error ${resp.status}: ${text.slice(0, 300)}`);
  }

  const groqJson = await resp.json() as any;
  const raw = groqJson?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty Groq response");

  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

  const title = String(parsed.title || topic).slice(0, 100);
  const slug = slugify(parsed.slug || title);
  const coverPrompt = String(
    parsed.coverPrompt || `${topic}, photographic, cinematic, golden hour, outdoor camping`,
  );
  const coverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(coverPrompt)}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1e6)}`;

  const post: StoredPost = {
    id: slug,
    slug,
    title,
    excerpt: String(parsed.excerpt || "").slice(0, 200),
    category: parsed.category || category || "rehber",
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : [],
    readingMinutes: Number(parsed.readingMinutes) || 6,
    coverUrl,
    coverPrompt,
    content: String(parsed.content || ""),
    author: "Sarıçam Aydoğan Editör",
    publishedAt: new Date().toISOString(),
    aiModel: GROQ_MODEL,
  };

  upsertPost(post);
  logger.info({ slug, title }, "blogGenerator: post saved");
  return post;
}
