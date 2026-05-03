import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";
import { generateAndSave } from "../lib/blogGenerator";
import { loadPosts, getPostBySlug } from "../lib/postStore";

const router: IRouter = Router();

const CURATED_TOPICS = [
  { slug: "adana-saricam-toros-kamp-rotalari", title: "Adana Sarıçam'dan Toros'a Kamp Rotaları", category: "rehber" },
  { slug: "seyhan-barajinda-sazan-avcilik", title: "Seyhan Barajı'nda Sazan ve Yayın Avcılığı", category: "balık" },
  { slug: "ilk-kampinizi-kurarken-bilmeniz-gereken-10-sey", title: "İlk Kampınızı Kurarken Bilmeniz Gereken 10 Şey", category: "kamp" },
  { slug: "kis-kampi-icin-uyku-tulumu-secimi", title: "Kış Kampı İçin Uyku Tulumu Seçimi", category: "ekipman" },
  { slug: "pozanti-ve-torosta-en-iyi-kamp-noktalari", title: "Pozantı ve Toros'ta En İyi Kamp Noktaları", category: "rehber" },
  { slug: "olta-takimi-secerken-dikkat-edilmesi-gerekenler", title: "Olta Takımı Seçerken Dikkat Edilmesi Gerekenler", category: "ekipman" },
  { slug: "dogada-su-aritma-yontemleri-ve-cihazlar", title: "Doğada Su Arıtma Yöntemleri ve Cihazlar", category: "outdoor" },
  { slug: "sonbahar-balik-tutma-takvimi-seyhan-ceyhan", title: "Sonbahar Balık Tutma Takvimi — Seyhan ve Ceyhan", category: "balık" },
  { slug: "ailecek-kamp-icin-buyuk-cadir-onerileri", title: "Ailecek Kamp İçin Büyük Çadır Önerileri", category: "ekipman" },
  { slug: "adana-yazinda-kamp-sicakla-basa-cikma", title: "Adana Yazında Kamp: Sıcakla Başa Çıkma Teknikleri", category: "kamp" },
  { slug: "tufanbeyli-yaylasinda-haftasonu-kampi", title: "Tufanbeyli Yaylasında Hafta Sonu Kampı", category: "rehber" },
  { slug: "cipura-levrek-sezonunda-en-iyi-spinning-takimlari", title: "Çipura ve Levrek Sezonunda En İyi Spinning Takımları", category: "balık" },
];

/* ── GET /api/blog/topics ─────────────────────────────────── */
router.get("/blog/topics", (_req, res) => {
  res.json({ topics: CURATED_TOPICS });
});

/* ── GET /api/blog/posts ──────────────────────────────────── */
router.get("/blog/posts", (_req, res) => {
  const posts = loadPosts();
  res.json({ posts });
});

/* ── GET /api/blog/posts/:slug ───────────────────────────── */
router.get("/blog/posts/:slug", (req, res) => {
  const post = getPostBySlug(req.params.slug);
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ post });
});

/* ── POST /api/blog/generate (admin-gated, on-demand) ────── */
router.post("/blog/generate", async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) { res.status(503).json({ error: "GROQ_API_KEY missing on server" }); return; }

  const adminToken = process.env.BLOG_ADMIN_TOKEN;
  if (!adminToken) {
    res.status(503).json({ error: "BLOG_ADMIN_TOKEN not configured. Blog generation disabled." });
    return;
  }
  const provided =
    (req.headers["x-admin-token"] as string | undefined) ??
    (typeof req.body?.adminToken === "string" ? req.body.adminToken : undefined);
  if (!provided || provided !== adminToken) { res.status(401).json({ error: "Unauthorized" }); return; }

  const topic = ((req.body?.topic ?? "") as string).trim();
  if (!topic) { res.status(400).json({ error: "topic is required" }); return; }

  try {
    const post = await generateAndSave(
      {
        topic,
        category: req.body?.category,
        tone: req.body?.tone,
        region: req.body?.region,
        productHints: req.body?.productHints,
      },
      apiKey,
    );
    res.json({ post });
  } catch (err) {
    logger.error({ err }, "blog/generate error");
    res.status(502).json({ error: String(err) });
  }
});

export default router;
