import { logger } from "./logger";
import { upsertPost, type StoredPost } from "./postStore";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Sen Adana Sarıçam ilçesindeki "Aydoğan Kampçılık" markası adına SEO uyumlu, otantik ve satış odaklı blog içerikleri yazan deneyimli bir outdoor editörüsün.

## Temel kurallar
- Tamamen Türkçe yaz; doğal, akıcı ve samimi bir dil kullan — klişelerden ve yapay AI ifadelerinden kesinlikle kaçın.
- 900-1300 kelime arası, H2/H3 başlıklarla yapılandırılmış Markdown üret.
- İçeriğin okunduğunda bir insan editör tarafından yazılmış gibi hissettirmesi şarttır.
- Makale sonuna AI veya model adı gibi hiçbir teknik atıf ekleme.

## Konu yelpazesi — BU KATEGORILERDEN YAZAR:
Balıkçılık: olta seçimi, makara tipleri, misina, yem teknikleri (jig, spin, sazan, gece avı, kıyı), düğümler, ekipman karşılaştırmaları, mevsim ve saat rehberleri, hava durumu etkisi, güvenlik.
Kamp: çadır seçimi, uyku tulumu, mat, kamp ocağı, aydınlatma, su temini, ateş yakma, kamp alanı seçimi, aile kampı, solo kamp, çanta hazırlama, kamp mutfağı, Toros/Sarıçam/Çukurova rotaları.
Outdoor: trekking, hiking, yön bulma, ayakkabı/yağmurluk/çanta seçimi, katman sistemi, GPS, su arıtma, hayatta kalma, ilk yardım, vahşi hayvan önlemleri, doğaya saygılı kamp, enerji tasarrufu.
Satış odaklı ekipman: en çok satan ürünler, bütçeye göre setler, hediye önerileri, profesyonel ekipman, yeni başlayanlar için uygun fiyatlı alternatifler, yıllık trend ürünler.

## İçerik yapısı
- En az bir "## Önerilen Ekipman" bölümü (madde imli, somut ürün isimleri/özellikleri ile).
- En az bir "## Pratik İpuçları" veya "## Dikkat Edilmesi Gerekenler" bölümü.
- Adana / Sarıçam / Toros / Çukurova / Seyhan / Ceyhan coğrafyasından somut, yerel detaylar ver (kamp noktaları, nehir havzaları, mevsim koşulları, irtifa bilgisi).
- Aşırı satış dilinden kaçın; ama uygun yerlerde "Aydoğan Kampçılık'ta bulabilirsiniz" veya ürün kategorisine doğal bir bağlantı ver.
- SEO anahtar kelimesini: başlık + ilk paragraf + en az 2 alt başlıkta kullan.

Çıktıyı SADECE bu JSON şemasında üret (başka hiçbir metin verme):
{
  "title": "string (60 karakter içinde, anahtar kelime başta)",
  "slug": "kebab-case-slug-turkce-karakter-yok",
  "excerpt": "string (150-160 karakter SEO meta description)",
  "category": "kamp|balık|outdoor|ekipman|rehber",
  "tags": ["3-6 etiket"],
  "readingMinutes": 6,
  "keywords": ["seo anahtar kelimeleri 5-8 adet"],
  "coverPrompt": "kısa İngilizce görsel prompt — kamp/doğa/balık temalı, fotoğrafik, sinematik, altın saat ışığı",
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
    region ? `Bölge: ${region}` : "Bölge: Adana Sarıçam / Toros / Çukurova",
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
    author: "Aydoğan Kampçılık Editör",
    publishedAt: new Date().toISOString(),
    aiModel: GROQ_MODEL,
  };

  upsertPost(post);
  logger.info({ slug, title }, "blogGenerator: post saved");
  return post;
}
