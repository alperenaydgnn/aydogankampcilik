import cron from "node-cron";
import { generateAndSave } from "./blogGenerator";
import { loadPosts } from "./postStore";
import { logger } from "./logger";

const TOPICS: { topic: string; category: string }[] = [
  // ── BALIKÇİLIK ──────────────────────────────────────────────────────────
  { topic: "Yeni başlayanlar için olta seçimi rehberi", category: "balık" },
  { topic: "Spin balıkçılığı nedir? Başlangıç ekipman listesi", category: "balık" },
  { topic: "En iyi sazan avı teknikleri ve yem önerileri", category: "balık" },
  { topic: "Deniz balıkçılığı için olmazsa olmaz ekipmanlar", category: "balık" },
  { topic: "Tatlı su balıkçılığına giriş rehberi", category: "balık" },
  { topic: "Gece balık avı için gerekli ekipmanlar ve taktikler", category: "balık" },
  { topic: "Kıyıdan balık tutma teknikleri", category: "balık" },
  { topic: "Olta makinesi nasıl seçilir? Tür ve özellik karşılaştırması", category: "balık" },
  { topic: "Olta misinası çeşitleri ve farkları", category: "balık" },
  { topic: "Jig balıkçılığı nedir? Nasıl yapılır?", category: "balık" },
  { topic: "En çok yapılan balıkçılık hataları ve çözümleri", category: "balık" },
  { topic: "Kışın balık tutmak: ipuçları ve ekipmanlar", category: "balık" },
  { topic: "Yazın balık avı için en iyi saatler ve noktalar", category: "balık" },
  { topic: "Balık bulucu cihazlar işe yarıyor mu? Detaylı inceleme", category: "balık" },
  { topic: "Yapay yem mi canlı yem mi? Hangisi daha etkili?", category: "balık" },
  { topic: "En iyi balıkçı çantası nasıl seçilir?", category: "balık" },
  { topic: "Balıkçı sandalyeleri ve konfor ekipmanları rehberi", category: "balık" },
  { topic: "Amatör balıkçılar için güvenlik rehberi", category: "balık" },
  { topic: "Balıkçı düğümleri rehberi: en önemli düğümler adım adım", category: "balık" },
  { topic: "Balık tutarken hava durumu neden bu kadar önemli?", category: "balık" },
  { topic: "Seyhan Barajı'nda sazan ve yayın avcılığı rehberi", category: "balık" },
  { topic: "Ceyhan Nehri balıkçılığı: havza ve sezon rehberi", category: "balık" },
  { topic: "Sonbahar balık tutma takvimi — Seyhan ve Ceyhan nehirleri", category: "balık" },
  { topic: "Sazan avı için en etkili yem ve yer seçimi teknikleri", category: "balık" },
  // ── KAMP ────────────────────────────────────────────────────────────────
  { topic: "İlk kez kamp yapacaklar için tam ekipman listesi", category: "kamp" },
  { topic: "Çadır seçerken dikkat edilmesi gereken 7 kriter", category: "kamp" },
  { topic: "Kamp ocağı rehberi: hangi tip size uygun?", category: "kamp" },
  { topic: "Doğada güvenli kamp kurma rehberi", category: "kamp" },
  { topic: "Yaz kampı vs kış kampı ekipman farkları", category: "kamp" },
  { topic: "Kamp uyku tulumu seçme rehberi: sıcaklık ve dolgu", category: "kamp" },
  { topic: "Kamp matı gerçekten gerekli mi? Mat türleri karşılaştırması", category: "kamp" },
  { topic: "Doğada yemek pişirme rehberi: pratik ve hafif tarifler", category: "kamp" },
  { topic: "Kamp için en iyi aydınlatma çözümleri", category: "kamp" },
  { topic: "Kamp çantası nasıl hazırlanır? Paketleme ipuçları", category: "kamp" },
  { topic: "Kamp yaparken en çok yapılan hatalar ve çözümleri", category: "kamp" },
  { topic: "Ailece kamp yapmak için öneriler ve ekipman listesi", category: "kamp" },
  { topic: "Tek başına kamp yapmak güvenli mi? Taktikler ve önlemler", category: "kamp" },
  { topic: "Kamp için en iyi çok amaçlı ekipmanlar", category: "kamp" },
  { topic: "Kamp için termos seçimi rehberi", category: "kamp" },
  { topic: "Kamp bıçakları ve kullanım alanları: hangisini almalısınız?", category: "kamp" },
  { topic: "Kamp yaparken su temini nasıl yapılır?", category: "kamp" },
  { topic: "Kamp alanı seçme rehberi: güvenli ve konforlu yer bulma", category: "kamp" },
  { topic: "Kamp ateşi yakma teknikleri ve güvenlik kuralları", category: "kamp" },
  { topic: "Doğada yön bulma yöntemleri: pusula, harita ve GPS", category: "kamp" },
  { topic: "Adana Sarıçam'dan Toros'a kamp rotaları", category: "kamp" },
  { topic: "Pozantı ve Toros'ta en iyi kamp noktaları", category: "kamp" },
  { topic: "Aladağlar ve Toros kamp güzergahları", category: "kamp" },
  { topic: "Tufanbeyli yaylasında hafta sonu kampı", category: "kamp" },
  { topic: "Adana yazında kamp: sıcakla başa çıkma teknikleri", category: "kamp" },
  { topic: "Çocuklarla ilk kamp deneyimi: güvenli başlangıç rehberi", category: "kamp" },
  // ── OUTDOOR ─────────────────────────────────────────────────────────────
  { topic: "Outdoor ekipman nedir? Nereden ve nasıl başlanmalı?", category: "outdoor" },
  { topic: "Doğa yürüyüşü ekipman rehberi: temel liste", category: "outdoor" },
  { topic: "Trekking ile hiking arasındaki farklar nelerdir?", category: "outdoor" },
  { topic: "Outdoor ayakkabı seçimi rehberi: zemin ve mevsime göre", category: "outdoor" },
  { topic: "Yağmurluk seçimi nasıl yapılır? Hardshell vs softshell", category: "outdoor" },
  { topic: "Doğada hayatta kalma temel bilgileri", category: "outdoor" },
  { topic: "Outdoor çanta seçimi: hacim, sırt uyumu ve malzeme", category: "outdoor" },
  { topic: "Kamp ve doğa için powerbank seçimi rehberi", category: "outdoor" },
  { topic: "Outdoor aktivitelerde güvenlik ekipmanları", category: "outdoor" },
  { topic: "Acil durum çantası nasıl hazırlanır?", category: "outdoor" },
  { topic: "Doğada ilk yardım rehberi: temel müdahale bilgileri", category: "outdoor" },
  { topic: "Outdoor aktiviteler için en iyi çok amaçlı aletler", category: "outdoor" },
  { topic: "Kamp ve doğa için güneş koruması neden önemli?", category: "outdoor" },
  { topic: "Outdoor kıyafet katman sistemi nedir? Nasıl uygulanır?", category: "outdoor" },
  { topic: "Doğada vahşi hayvanlara karşı alınacak önlemler", category: "outdoor" },
  { topic: "Doğa yürüyüşü rotası planlama rehberi", category: "outdoor" },
  { topic: "Outdoor aktiviteler için GPS cihazları karşılaştırması", category: "outdoor" },
  { topic: "Doğada su arıtma yöntemleri ve taşınabilir cihazlar", category: "outdoor" },
  { topic: "Outdoor aktivitelerde enerji tasarrufu ve beslenme", category: "outdoor" },
  { topic: "Doğaya zarar vermeden kamp yapma rehberi: bırak iz yok", category: "outdoor" },
  { topic: "Çukurova'da gece gökyüzü gözlemi için kamp noktaları", category: "outdoor" },
  { topic: "Kamp mutfağı: doğada lezzetli ve pratik tarifler", category: "outdoor" },
  // ── SATIŞ ODAKLI EKİPMAN ────────────────────────────────────────────────
  { topic: "En çok satılan kamp ekipmanları listesi ve neden popüler?", category: "ekipman" },
  { topic: "Yeni başlayanlar için balıkçılık seti önerisi: bütçeye göre", category: "ekipman" },
  { topic: "Kamp için en iyi bütçe dostu ekipmanlar", category: "ekipman" },
  { topic: "Profesyonellerin kullandığı balıkçılık ekipmanları", category: "ekipman" },
  { topic: "Kamp severler için hediye önerileri: her bütçeye uygun", category: "ekipman" },
  { topic: "Balıkçılar için en iyi ekipman kombinasyonları", category: "ekipman" },
  { topic: "2026'nın en popüler kamp ürünleri ve trendleri", category: "ekipman" },
  { topic: "Kamp için minimal ekipman listesi: sadece ne gerekli?", category: "ekipman" },
  { topic: "Yeni başlayanlar için uygun fiyatlı olta setleri", category: "ekipman" },
  { topic: "Balıkçılıkta olmazsa olmaz 10 ürün", category: "ekipman" },
  { topic: "Kış kampı için uyku tulumu seçimi: rakım ve sıcaklık", category: "ekipman" },
  { topic: "Olta takımı seçerken dikkat edilmesi gerekenler", category: "ekipman" },
  { topic: "Trekking ayakkabısı seçimi: yüksek rakım ve kaya zemin", category: "ekipman" },
];

let runIndex = 0;

async function runGeneration(label: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    logger.warn("scheduler: GROQ_API_KEY missing, skipping generation");
    return;
  }

  const existing = loadPosts().map((p) => p.slug);

  // Filter out topics already covered (slug overlap check)
  const unseen = TOPICS.filter(
    (t) => !existing.some((s) =>
      s.includes(
        t.topic
          .slice(0, 12)
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
          .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      ),
    ),
  );

  // When all topics are covered restart the full list (cycle)
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
  cron.schedule("0 9 * * *",  () => runGeneration("09:00"), { timezone: tz });
  cron.schedule("0 18 * * *", () => runGeneration("18:00"), { timezone: tz });
  logger.info("scheduler: blog generation scheduled at 09:00 and 18:00 (Europe/Istanbul)");
}
