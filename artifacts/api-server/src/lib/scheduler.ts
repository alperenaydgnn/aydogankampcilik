import cron from "node-cron";
import { generateAndSave } from "./blogGenerator";
import { loadPosts } from "./postStore";
import { logger } from "./logger";

const TOPICS = [
  { topic: "Kaçkar Yaylalarında Yaz Kampı Rehberi", category: "rehber" },
  { topic: "Karadeniz'de Alabalık Tutmanın Püf Noktaları", category: "balık" },
  { topic: "İlk Kampınızı Kurarken Bilmeniz Gereken 10 Şey", category: "kamp" },
  { topic: "Kış Kampı İçin Uyku Tulumu Seçimi", category: "ekipman" },
  { topic: "Trabzon Uzungöl Çevresinde Kamp Noktaları", category: "rehber" },
  { topic: "Olta Takımı Seçerken Dikkat Edilmesi Gerekenler", category: "ekipman" },
  { topic: "Doğada Su Arıtma Yöntemleri ve Taşınabilir Cihazlar", category: "outdoor" },
  { topic: "Sonbahar Balık Tutma Takvimi — Karadeniz Dereleri", category: "balık" },
  { topic: "Ailecek Kamp İçin Büyük Çadır Önerileri", category: "ekipman" },
  { topic: "Yağmurlu Havada Kamp Kurma Teknikleri", category: "kamp" },
  { topic: "Ayder Yaylasında Hafta Sonu Kampı", category: "rehber" },
  { topic: "Lüfer Sezonunda En İyi Spinning Takımları", category: "balık" },
  { topic: "Karadeniz Yayla Rotaları ve Kamp Güzergahları", category: "rehber" },
  { topic: "Trekking Ayakkabısı Seçimi: Yüksek Rakım ve Kaya", category: "ekipman" },
  { topic: "Sazan Avı için En Etkili Yem ve Yer Seçimi", category: "balık" },
  { topic: "Kamp Mutfağı: Doğada Lezzetli ve Pratik Tarifler", category: "outdoor" },
  { topic: "Gece Gökyüzü Gözlemi için Kamp Noktaları — Karadeniz", category: "outdoor" },
  { topic: "Softshell mi Hardshell mi? Outdoor Ceket Seçimi", category: "ekipman" },
  { topic: "Çay Akarsu Balıkçılığı: Havza ve Sezon Rehberi", category: "balık" },
  { topic: "Çocuklarla İlk Kamp Deneyimi — Güvenli Başlangıç", category: "kamp" },
];

let runIndex = 0;

async function runGeneration(label: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    logger.warn("scheduler: GROQ_API_KEY missing, skipping generation");
    return;
  }

  const existing = loadPosts().map((p) => p.slug);
  const unseen = TOPICS.filter(
    (t) => !existing.some((s) => s.includes(t.topic.slice(0, 8).toLowerCase().replace(/\s+/g, "-"))),
  );
  const pool = unseen.length > 0 ? unseen : TOPICS;
  const entry = pool[runIndex % pool.length];
  runIndex++;

  logger.info({ label, topic: entry.topic }, "scheduler: starting generation");
  try {
    const post = await generateAndSave(
      { topic: entry.topic, category: entry.category },
      apiKey,
    );
    logger.info({ label, slug: post.slug }, "scheduler: generation complete");
  } catch (err) {
    logger.error({ err, label }, "scheduler: generation failed");
  }
}

export function startScheduler() {
  const tz = "Europe/Istanbul";

  cron.schedule("0 9 * * *", () => runGeneration("09:00"), { timezone: tz });
  cron.schedule("0 18 * * *", () => runGeneration("18:00"), { timezone: tz });

  logger.info("scheduler: blog generation scheduled at 09:00 and 18:00 (Europe/Istanbul)");
}
