import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

type GenerateBody = {
  topic?: string;
  category?: "kamp" | "balık" | "outdoor" | "ekipman" | "rehber";
  tone?: "uzman" | "samimi" | "rehber";
  region?: string;
  productHints?: string[];
};

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

router.get("/blog/topics", (_req, res) => {
  // Curated SEO-friendly topic ideas for camp/fishing/outdoor
  const topics = [
    { slug: "kackar-yaylalarinda-yaz-kampi-rehberi", title: "Kaçkar Yaylalarında Yaz Kampı Rehberi", category: "rehber" },
    { slug: "karadenizde-alabalik-tutmanin-puf-noktalari", title: "Karadeniz'de Alabalık Tutmanın Püf Noktaları", category: "balık" },
    { slug: "ilk-kampinizi-kurarken-bilmeniz-gereken-10-sey", title: "İlk Kampınızı Kurarken Bilmeniz Gereken 10 Şey", category: "kamp" },
    { slug: "kis-kampi-icin-uyku-tulumu-secimi", title: "Kış Kampı İçin Uyku Tulumu Seçimi", category: "ekipman" },
    { slug: "trabzon-uzungol-ve-cevresinde-kamp-noktalari", title: "Trabzon Uzungöl ve Çevresinde Kamp Noktaları", category: "rehber" },
    { slug: "olta-takimi-secerken-dikkat-edilmesi-gerekenler", title: "Olta Takımı Seçerken Dikkat Edilmesi Gerekenler", category: "ekipman" },
    { slug: "dogada-su-aritma-yontemleri-ve-cihazlar", title: "Doğada Su Arıtma Yöntemleri ve Cihazlar", category: "outdoor" },
    { slug: "sonbahar-balik-tutma-takvimi-karadeniz", title: "Sonbahar Balık Tutma Takvimi — Karadeniz", category: "balık" },
    { slug: "ailecek-kamp-icin-buyuk-cadir-onerileri", title: "Ailecek Kamp İçin Büyük Çadır Önerileri", category: "ekipman" },
    { slug: "yagmurlu-havada-kamp-kurma-teknikleri", title: "Yağmurlu Havada Kamp Kurma Teknikleri", category: "kamp" },
    { slug: "ayder-yaylasinda-haftasonu-kampi", title: "Ayder Yaylasında Hafta Sonu Kampı", category: "rehber" },
    { slug: "lufer-sezonunda-en-iyi-spinning-takimlari", title: "Lüfer Sezonunda En İyi Spinning Takımları", category: "balık" },
  ];
  res.json({ topics });
});

router.post("/blog/generate", async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "GROQ_API_KEY missing on server" });
  }

  // Require admin token to prevent public abuse / API-key drain.
  const adminToken = process.env.BLOG_ADMIN_TOKEN;
  if (!adminToken) {
    return res.status(503).json({
      error: "BLOG_ADMIN_TOKEN not configured on server. Blog generation disabled.",
    });
  }
  const provided =
    (req.headers["x-admin-token"] as string | undefined) ??
    (typeof req.body?.adminToken === "string" ? req.body.adminToken : undefined);
  if (!provided || provided !== adminToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body: GenerateBody = req.body ?? {};
  const topic = (body.topic ?? "").trim();
  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }

  const userPrompt = [
    `Konu: ${topic}`,
    body.category ? `Tercih edilen kategori: ${body.category}` : null,
    body.tone ? `Ton: ${body.tone}` : "Ton: rehber",
    body.region ? `Bölge: ${body.region}` : "Bölge: Doğu Karadeniz / Trabzon",
    body.productHints?.length
      ? `Doğal bağlanabilecek ürün kategorileri: ${body.productHints.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  let groqJson: any;
  try {
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
      logger.error({ status: resp.status, text }, "groq error");
      return res.status(502).json({ error: "Groq API error", detail: text.slice(0, 400) });
    }
    groqJson = await resp.json();
  } catch (err) {
    logger.error({ err }, "groq fetch failed");
    return res.status(502).json({ error: "Groq fetch failed" });
  }

  const raw = groqJson?.choices?.[0]?.message?.content;
  if (!raw) {
    return res.status(502).json({ error: "Empty Groq response" });
  }

  let parsed: any;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return res.status(502).json({ error: "Invalid JSON from model" });
  }

  // Normalize + slugify safety
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

  const title = String(parsed.title || topic).slice(0, 100);
  const slug = slugify(parsed.slug || title);
  const coverPrompt = String(parsed.coverPrompt || `${topic}, photographic, cinematic, golden hour, outdoor camping`);
  // Pollinations.ai — free no-auth image generation
  const coverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(coverPrompt)}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1e6)}`;

  const post = {
    id: slug,
    slug,
    title,
    excerpt: String(parsed.excerpt || "").slice(0, 200),
    category: parsed.category || body.category || "rehber",
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

  res.json({ post });
});

export default router;
