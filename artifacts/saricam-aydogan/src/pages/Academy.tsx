import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen, Play, BarChart2, ClipboardList, HelpCircle,
  ChevronRight, Download, CheckCircle2, ArrowRight, Youtube,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ─────────────────────────── data ──────────────────────────── */

const GUIDES = [
  {
    slug: "cimir-secimi",
    title: "Doğru Çadırı Nasıl Seçersiniz?",
    emoji: "⛺",
    level: "Başlangıç",
    readMin: 7,
    desc: "Mevsim, kişi sayısı ve ağırlık dengesine göre çadır tipini belirleme rehberi.",
    points: [
      "1–2 kişilik trekking için tunnel veya geodesic çadır tercih edin",
      "3+ kişi için cabin tarzı çift duvar çadır daha rahat eder",
      "Yayla kampı için 3-mevsim, kış için 4-mevsim model zorunlu",
      "Ağırlık: araç kampı → konfor; sırt kampı → her gram önemli",
      "Su sütunu 3000mm altındaki çadırları yağmurda kullanmayın",
    ],
    category: "Çadır",
    href: "/urunler/kamp-cadirlari",
  },
  {
    slug: "uyku-tulumu",
    title: "Uyku Tulum Rehberi",
    emoji: "🛌",
    level: "Başlangıç",
    readMin: 5,
    desc: "Konfor sıcaklığı, dolgu malzemesi ve bakım bilgisi ile doğru tulum seçimi.",
    points: [
      "Konfor sıcaklığı = gecelerin en düşük sıcaklığı − 5°C",
      "Sentetik dolgu: nemde ısıyı korur; tüy dolgu: hafiflik ve sıkıştırılabilirlik",
      "Mumya kesimleri ısı tutmada daha verimli, dörtgen daha rahat",
      "Tulumu ayakta asarak saklayın, torbasında sıkıştırmayın",
    ],
    category: "Uyku",
    href: "/urunler/uyku-tulumlari",
  },
  {
    slug: "olta-kurma",
    title: "İlk Oltanızı Nasıl Kurarşınız?",
    emoji: "🎣",
    level: "Başlangıç",
    readMin: 6,
    desc: "Makara seti, misina seçimi, olta ucuna düğüm atma ve yem hazırlama adım adım.",
    points: [
      "Makara boyutunu hedef balığa göre belirleyin (1000–5000 arası)",
      "Monofilament misina başlangıç için uygun; florokarbon görünmezdir",
      "Palomar düğümü: en güvenilir olta ucu bağlama tekniği",
      "Tatlı su için solucan, sülük, mısır; tuzlu su için kalamar ve hamsi",
      "Saatler: balıklar şafak vakti ve alacakaranlıkta çok daha aktiftir",
    ],
    category: "Balıkçılık",
    href: "/urunler/olta-takimlari",
  },
  {
    slug: "kamp-yeri",
    title: "Kamp Yeri Seçimi ve Kurulum",
    emoji: "🗺️",
    level: "Başlangıç",
    readMin: 5,
    desc: "Doğru konum belirleme, çadır yönü, rüzgar ve nem etkilerine karşı önlemler.",
    points: [
      "Dere yataklarına kurmayın: ani sel riski var",
      "Rüzgara sırtı dönük konumlanın; girişin önü açık kalsın",
      "Ağaç altı → kök üstünde çukur yok, dallı kuru dal riski az",
      "Yüksek nokta seçin: soğuk hava alt noktalara çöker",
      "İnsanlardan ve ateşten 6m mesafede çadır kurun",
    ],
    category: "Planlama",
    href: "/harita",
  },
  {
    slug: "kamp-mutfagi",
    title: "Kamp Mutfağı Temelleri",
    emoji: "🍳",
    level: "Orta",
    readMin: 6,
    desc: "Taşınabilir ocak, yakıt hesabı, hafif yemek tarifleri ve gıda saklama.",
    points: [
      "Gaz ocağı için isobutane/propane karışımı kutular en verimli",
      "Yüksek rakımda kaynama noktası düşer — pişirme süresi uzar",
      "Askı torbalara gıdayı kaldırın: hayvan ve nem koruması",
      "Katı yağ yerine sıvı yağ ambalajı hem hafif hem taşıması kolay",
      "Dondurularak kurutulmuş yiyecekler en hafif ve uzun ömürlü seçenek",
    ],
    category: "Yaşam",
    href: "/urunler",
  },
  {
    slug: "gece-kampinda-guvenlik",
    title: "Gece Kampında Güvenlik",
    emoji: "🔦",
    level: "Orta",
    readMin: 4,
    desc: "Baş feneri, acil kit, yırtıcı hayvanlar karşısında doğru davranış rehberi.",
    points: [
      "Kırmızı ışıklı baş feneri gece görüşünüzü bozmaz",
      "Acil kit: turnike, yara bandı, alüminyum battaniye, ıslık, düdük",
      "Yiyecekleri çadırda bırakmayın; koku hayvan çekebilir",
      "Yılan görürseniz uzaklaşın; ısırırsa hareketsiz tutun ve 112'yi arayın",
      "Hava durumunu her gün kontrol edin — ani fırtınalara hazırlıklı olun",
    ],
    category: "Güvenlik",
    href: "/urunler/outdoor-aksesuarlari",
  },
];

/* YouTube video entries — video ID'leri buraya ekleyin */
const VIDEOS: { id: string; title: string; desc: string; thumb?: string }[] = [
  { id: "dQw4w9WgXcQ", title: "Çadır Kurma — Adım Adım", desc: "Tunnel çadır nasıl kurulur, kazık ve halat düzeni." },
  { id: "dQw4w9WgXcQ", title: "Palomar Düğümü Nasıl Atılır?", desc: "En sağlam olta düğümü tekniği — 2 dakikada öğrenin." },
  { id: "dQw4w9WgXcQ", title: "Yem Hazırlama Teknikleri", desc: "Solucan, mısır, ekmek hamuru — her yem için doğru kancalama." },
  { id: "dQw4w9WgXcQ", title: "Uyku Tulumu Seçimi", desc: "Sentetik mi, tüy mü? Konfor sıcaklığı nasıl okunur?" },
  { id: "dQw4w9WgXcQ", title: "Kamp Mutfağı Kurulumu", desc: "Taşınabilir gaz ocağı, tencere sistemi ve yakıt hesabı." },
  { id: "dQw4w9WgXcQ", title: "Doğru Kamp Yeri Bulmak", desc: "Harita okuma, alan değerlendirme ve rüzgar yönü analizi." },
];

const COMPARISONS = [
  {
    title: "Hangi Olta Makinesini Almalıyım?",
    emoji: "🎣",
    options: [
      { name: "Ön Frenli Makara", best: "Genel tatlı su avcılığı", pros: ["Kolay kullanım", "Uygun fiyat", "Geniş misina kapasitesi"], cons: ["Kastinge uygun değil"] },
      { name: "Baitcasting Makara", best: "Predatör & kastinq", pros: ["Hassas fren ayarı", "Güçlü volan", "Mesafe kontrolü"], cons: ["Öğrenme eğrisi yüksek"] },
      { name: "Olta İpi Makarası", best: "Kanyon & derine dal", pros: ["Çok derin su", "Az sarma direnci"], cons: ["Hassas sunumda zayıf"] },
    ],
  },
  {
    title: "3-Mevsim mi, 4-Mevsim Çadır mı?",
    emoji: "⛺",
    options: [
      { name: "3-Mevsim Çadır", best: "İlkbahar–Sonbahar", pros: ["Hafif", "İyi havalandırma", "Uygun fiyat"], cons: ["Yoğun kışa dayanmaz"] },
      { name: "4-Mevsim Çadır", best: "Tüm yıl / Kış / Yüksek irtifa", pros: ["Kar yüküne dayanır", "Rüzgar direnci yüksek"], cons: ["Ağır", "Pahalı", "Yaz aylarında sıcak"] },
    ],
  },
  {
    title: "Şişme Mat mı, Köpük Mat mı?",
    emoji: "🛏️",
    options: [
      { name: "Şişme Mat", best: "Konfor öncelikli kamp", pros: ["Yüksek konfor", "İnce ve kompakt", "R-değeri ayarlanabilir"], cons: ["Delinme riski", "Şişirme gerektirir"] },
      { name: "Kapalı Hücreli Köpük Mat", best: "Dayanıklılık & hafiflik", pros: ["Kırılmaz", "Ucuz", "Nem geçirmez"], cons: ["Kalın ve hacimli", "Daha az konforlu"] },
    ],
  },
];

const CHECKLISTS: { season: string; emoji: string; color: string; items: string[] }[] = [
  {
    season: "Yaz Kampı",
    emoji: "☀️",
    color: "#f59e0b",
    items: [
      "Yaz çadırı (çift duvar, geniş mesh)",
      "+10°C konfor tulumu veya kamp battaniyesi",
      "R≤2 şişme mat",
      "Güneş kremi SPF 50+",
      "Güneş gözlüğü ve şapka",
      "Soğutucu çanta ve buz aküleri",
      "Böcek kovucu (DEET veya doğal)",
      "Yeterli su (2 lt/kişi/gün minimum)",
      "Su filtresi veya arıtma tableti",
      "Baş feneri + yedek pil",
      "Çakı veya çok amaçlı alet",
      "İlk yardım kiti",
    ],
  },
  {
    season: "Sonbahar / İlkbahar",
    emoji: "🍂",
    color: "#16a34a",
    items: [
      "3-mevsim çadır (su sütunu ≥3000mm)",
      "+5°C konfor tulumu",
      "R≥3 mat",
      "Hafif yağmurluk (hardshell veya softshell)",
      "Termal baz katman (ıslatmayan polyester)",
      "Fleece orta katman",
      "Trekking botu (su geçirmez)",
      "Gayet sopaları",
      "Termos (sıcak içecek için)",
      "Baş feneri + yedek pil",
      "Acil ısınma folyo battaniye",
      "Tamir bandı + ekstra kazık",
    ],
  },
  {
    season: "Kış Kampı",
    emoji: "❄️",
    color: "#2563eb",
    items: [
      "4-mevsim çadır (kar etekli)",
      "−10°C konfor tulumu",
      "R≥5 yalıtımlı mat",
      "Termal iç çamaşırı (merino veya sentetik)",
      "Down veya PrimaLoft mont",
      "Su geçirmez hardshell",
      "Kış yürüyüş botu + tozluk",
      "Kar kazığı veya uzun kaya kazıkları",
      "Yüksek güç çıkışlı gaz ocağı",
      "Ekstra yakıt (soğukta tüketim artar)",
      "Termos × 2",
      "Uyku tulumu liner (ekstra ısı)",
      "Acil düdük ve el fişeği",
    ],
  },
  {
    season: "Balıkçılık Paketi",
    emoji: "🎣",
    color: "#0891b2",
    items: [
      "Olta takımı ve yedek uçlar",
      "Misina (mono + florokarbon lider)",
      "Çeşitli iğne boyutları (4–12 no arası)",
      "Ağırlıklar ve manşonlar",
      "Yem kutusu (canlı yem bölmeli)",
      "Kancasız pens ve pul terazisi",
      "Balık torpili / kova",
      "Kuru el mendili + el dezenfektanı",
      "Güneş koruyucu ve şapka",
      "Yedek misina makarası",
      "Avlak ruhsatı fotokopisi",
      "Su geçirmez çanta veya kılıf",
    ],
  },
];

/* ── Quiz ──────────────────────────────────────────────────── */
const QUIZ_STEPS = [
  {
    q: "Kamp ortamı nerede?",
    opts: [
      { label: "Yayla / Yüksek Dağ", val: "mountain" },
      { label: "Sahil / Ova", val: "flat" },
      { label: "Orman / Karma", val: "mixed" },
    ],
  },
  {
    q: "Kaç kişilik kamp?",
    opts: [
      { label: "Yalnız veya 2 kişi", val: "solo" },
      { label: "3–4 kişi", val: "group" },
      { label: "5 kişi ve üzeri", val: "large" },
    ],
  },
  {
    q: "Hangi mevsimde çıkacaksınız?",
    opts: [
      { label: "Sadece Yaz", val: "summer" },
      { label: "İlkbahar & Sonbahar", val: "spring" },
      { label: "Kış dahil 4 mevsim", val: "winter" },
    ],
  },
];

function getRecommendation(ans: string[]): { title: string; desc: string; gear: string[]; href: string } {
  const [loc, size, season] = ans;
  if (season === "winter") return {
    title: "4-Mevsim Geodesic Çadır + −10°C Tulum",
    desc: "Kış koşulları için en sağlam setup. Yüksek rüzgar ve kar yüküne dayanır.",
    gear: ["4-mevsim geodesic çadır", "−10°C konfor tulumu", "R≥5 şişme mat", "Kar kazıkları"],
    href: "/urunler/kamp-cadirlari",
  };
  if (season === "spring" && loc === "mountain") return {
    title: "3-Mevsim Tunnel Çadır + +5°C Tulum",
    desc: "Yayla geceleri için hafif ama korumalı setup. Yağmura karşı 3000mm+ su sütunu kritik.",
    gear: ["+5°C konfor tulumu", "3-mevsim tunnel çadır", "R≥3 mat", "Yağmurluk"],
    href: "/urunler/kamp-cadirlari",
  };
  if (size === "large") return {
    title: "Büyük Cabin / Dome Çadır + Uyku Takımı",
    desc: "5+ kişi için geniş hacimli cabin çadır; oturma alanı ve konforu yüksek.",
    gear: ["Büyük dome çadır (5+ kişilik)", "+10°C tulum (her kişiye)", "Şişme mat takımı"],
    href: "/urunler/kamp-cadirlari",
  };
  if (loc === "flat" && season === "summer") return {
    title: "Yaz Çift Duvar Çadır + Battaniye Tulum",
    desc: "Sahilde rüzgar ve nem için çift duvar, sıcak geceler için hafif uyku örtüsü yeterli.",
    gear: ["Yaz çadırı (tam mesh iç)", "+10°C battaniye tulum", "Soğutucu çanta"],
    href: "/urunler/kamp-cadirlari",
  };
  return {
    title: "3-Mevsim Tunnel Çadır + +5°C Tulum",
    desc: "Her koşul için güvenilir, dengeli bir başlangıç seti.",
    gear: ["3-mevsim tunnel çadır", "+5°C konfor tulumu", "Şişme mat (R≥3)"],
    href: "/urunler/kamp-cadirlari",
  };
}

/* ── Checklist download ─────────────────────────────────────── */
function downloadChecklist(cl: typeof CHECKLISTS[0]) {
  const text = [
    `AYDOĞAN KAMPÇILIK — ${cl.season.toUpperCase()} KONTROL LİSTESİ`,
    `${"─".repeat(50)}`,
    "",
    ...cl.items.map((item, i) => `[ ] ${i + 1}. ${item}`),
    "",
    `─`.repeat(50),
    "www.aydogankamcilik.com.tr",
  ].join("\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aydogan-${cl.season.toLowerCase().replace(/\s+/g, "-")}-liste.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Tab types ──────────────────────────────────────────────── */
type Tab = "rehberler" | "videolar" | "karsilastirma" | "listeler" | "quiz";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "rehberler",    label: "Rehberler",      icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "videolar",     label: "Video Kütüphanesi", icon: <Play className="w-3.5 h-3.5" /> },
  { id: "karsilastirma",label: "Karşılaştırma",  icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { id: "listeler",     label: "Kontrol Listeleri", icon: <ClipboardList className="w-3.5 h-3.5" /> },
  { id: "quiz",         label: "Quiz",            icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

/* ════════════════════════════════════════════════════════════ */
export default function Academy() {
  const [tab, setTab] = useState<Tab>("rehberler");
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  /* Quiz state */
  const [step, setStep]     = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof getRecommendation> | null>(null);

  function pickAnswer(val: string) {
    const next = [...answers, val];
    if (step < QUIZ_STEPS.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      setResult(getRecommendation(next));
    }
  }

  function resetQuiz() {
    setStep(0);
    setAnswers([]);
    setResult(null);
  }

  return (
    <>
      <SEO
        title="Kamp Akademisi — Rehberler, Videolar & Quiz"
        description="Çadır seçimi, olta kurma, mevsimlik kontrol listeleri ve kişisel ekipman quiz'i. Aydoğan Kampçılık öğretici içerik merkezi."
        url="/akademi"
      />

      {/* ── Hero ── */}
      <section className="section-md bg-foreground/[0.03] border-b border-foreground/10">
        <div className="container px-6 max-w-5xl">
          <span className="eyebrow inline-flex items-center gap-2 text-secondary">
            <BookOpen className="w-3.5 h-3.5" /> Kamp Akademisi
          </span>
          <h1 className="editorial-heading text-5xl md:text-6xl lg:text-7xl mt-4">
            Bil, hazırlan,
            <br />
            <em className="italic font-light text-foreground/65">doğaya çık.</em>
          </h1>
          <p className="text-foreground/65 leading-relaxed font-light text-base md:text-lg max-w-2xl mt-6">
            Başlangıç rehberlerinden video derslerine, mevsimlik ekipman listelerine ve kişisel öneri quiz'ine — her şey burada.
          </p>
        </div>
      </section>

      {/* ── Tab bar ── */}
      <div className="sticky top-[72px] z-40 bg-background border-b border-foreground/10 shadow-sm">
        <div className="container px-6 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-4 text-[0.65rem] uppercase tracking-[0.18em] font-bold transition-colors border-b-2",
                  tab === t.id
                    ? "border-secondary text-secondary"
                    : "border-transparent text-foreground/55 hover:text-foreground",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >

          {/* ══ REHBERler ══ */}
          {tab === "rehberler" && (
            <section className="section container px-6 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GUIDES.map((g) => (
                  <div key={g.slug} className="border border-foreground/10 hover:border-secondary/50 transition-colors">
                    <button
                      onClick={() => setOpenGuide(openGuide === g.slug ? null : g.slug)}
                      className="w-full text-left p-6"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-3xl">{g.emoji}</span>
                        <span className="text-[0.58rem] uppercase tracking-[0.16em] font-bold border border-foreground/20 px-2 py-0.5 text-foreground/55">
                          {g.level}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-primary font-medium tracking-tight leading-snug mb-2">
                        {g.title}
                      </h3>
                      <p className="text-sm text-foreground/60 font-light leading-relaxed mb-4">{g.desc}</p>
                      <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.16em] font-bold text-foreground/45">
                        <span>{g.readMin} dk okuma</span>
                        <span className={cn("transition-transform duration-200", openGuide === g.slug ? "rotate-90" : "")}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {openGuide === g.slug && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-foreground/10 px-6 py-5">
                            <ul className="space-y-3 mb-5">
                              {g.points.map((pt) => (
                                <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/80 font-light leading-snug">
                                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                  {pt}
                                </li>
                              ))}
                            </ul>
                            <Link
                              href={g.href}
                              className="link-hairline hover:text-secondary inline-flex items-center gap-1 text-[0.65rem]"
                            >
                              İlgili ürünlere bak <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ VİDEOLAR ══ */}
          {tab === "videolar" && (
            <section className="section container px-6 max-w-6xl">
              <div className="flex items-start gap-3 mb-8 p-4 border border-secondary/30 bg-secondary/5">
                <Youtube className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/70 font-light">
                  Video kütüphanesi — kendi YouTube videolarınızı eklemek için video ID'lerini paylaşabilirsiniz.
                  Her kart, YouTube embed olarak doğrudan yüklenir.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VIDEOS.map((v, i) => (
                  <div key={i} className="border border-foreground/10 overflow-hidden group hover:border-secondary/40 transition-colors">
                    <div className="aspect-video bg-foreground/5 relative overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base text-primary font-medium tracking-tight leading-snug mb-1">
                        {v.title}
                      </h3>
                      <p className="text-xs text-foreground/55 font-light">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ KARŞILAŞTIRMA ══ */}
          {tab === "karsilastirma" && (
            <section className="section container px-6 max-w-5xl">
              <div className="space-y-12">
                {COMPARISONS.map((comp) => (
                  <div key={comp.title}>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                      <span className="text-2xl">{comp.emoji}</span>
                      <h2 className="font-serif text-2xl md:text-3xl text-primary font-medium tracking-tight">
                        {comp.title}
                      </h2>
                    </div>
                    <div className={cn(
                      "grid gap-6",
                      comp.options.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3",
                    )}>
                      {comp.options.map((opt) => (
                        <div key={opt.name} className="border border-foreground/10 p-6">
                          <h3 className="font-serif text-lg text-primary font-medium mb-1">{opt.name}</h3>
                          <p className="text-[0.65rem] uppercase tracking-[0.16em] font-bold text-secondary mb-4">
                            En iyi: {opt.best}
                          </p>
                          <div className="mb-3">
                            <div className="text-[0.6rem] uppercase tracking-[0.16em] font-bold text-foreground/50 mb-2">Artıları</div>
                            <ul className="space-y-1.5">
                              {opt.pros.map((p) => (
                                <li key={p} className="flex items-start gap-2 text-sm text-foreground/80 font-light">
                                  <span className="text-green-600 font-bold mt-0.5">+</span> {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-[0.6rem] uppercase tracking-[0.16em] font-bold text-foreground/50 mb-2">Eksileri</div>
                            <ul className="space-y-1.5">
                              {opt.cons.map((c) => (
                                <li key={c} className="flex items-start gap-2 text-sm text-foreground/80 font-light">
                                  <span className="text-red-500 font-bold mt-0.5">−</span> {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ KONTROL LİSTELERİ ══ */}
          {tab === "listeler" && (
            <section className="section container px-6 max-w-5xl">
              <p className="text-foreground/60 font-light mb-10 text-sm max-w-xl">
                Her liste TXT formatında indirilir; dilediğiniz notlar uygulamasına yapıştırabilir veya yazdırabilirsiniz.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CHECKLISTS.map((cl) => (
                  <div key={cl.season} className="border border-foreground/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{cl.emoji}</span>
                      <h3 className="font-serif text-xl text-primary font-medium tracking-tight">{cl.season}</h3>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {cl.items.slice(0, 5).map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/75 font-light">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: cl.color }}
                          />
                          {item}
                        </li>
                      ))}
                      <li className="text-xs text-foreground/40 font-light italic pl-4">
                        + {cl.items.length - 5} madde daha…
                      </li>
                    </ul>
                    <button
                      onClick={() => downloadChecklist(cl)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-foreground/20 text-xs uppercase tracking-[0.16em] font-bold text-foreground/70 hover:border-secondary hover:text-secondary transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Listeyi İndir
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ QUİZ ══ */}
          {tab === "quiz" && (
            <section className="section container px-6 max-w-2xl">
              <div className="border border-foreground/10 p-8 md:p-12">
                {!result ? (
                  <>
                    {/* Progress */}
                    <div className="flex gap-1.5 mb-8">
                      {QUIZ_STEPS.map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 transition-colors duration-300",
                            i <= step ? "bg-secondary" : "bg-foreground/15",
                          )}
                        />
                      ))}
                    </div>

                    <div className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-secondary mb-3">
                      Soru {step + 1} / {QUIZ_STEPS.length}
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-primary font-medium tracking-tight mb-8 leading-tight">
                      {QUIZ_STEPS[step].q}
                    </h2>

                    <div className="space-y-3">
                      {QUIZ_STEPS[step].opts.map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => pickAnswer(opt.val)}
                          className="w-full text-left px-5 py-4 border border-foreground/15 hover:border-secondary hover:bg-secondary/5 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                              {opt.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-secondary transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>

                    {step > 0 && (
                      <button
                        onClick={() => { setStep(s => s - 1); setAnswers(a => a.slice(0, -1)); }}
                        className="mt-6 text-xs uppercase tracking-[0.18em] font-bold text-foreground/45 hover:text-foreground transition-colors"
                      >
                        ← Geri
                      </button>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-secondary mb-3">
                      Önerimiz
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-primary font-medium tracking-tight mb-4 leading-snug">
                      {result.title}
                    </h2>
                    <p className="text-base text-foreground/65 font-light leading-relaxed mb-6">{result.desc}</p>

                    <div className="mb-8">
                      <div className="text-[0.62rem] uppercase tracking-[0.18em] font-bold text-foreground/50 mb-3">
                        Temel Ekipman Listesi
                      </div>
                      <ul className="space-y-2">
                        {result.gear.map((g) => (
                          <li key={g} className="flex items-center gap-2.5 text-sm text-foreground/80 font-light">
                            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={result.href}
                        className="flex-1 text-center px-5 py-3 bg-primary text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary/90 transition"
                      >
                        Ürünleri İncele
                      </Link>
                      <button
                        onClick={resetQuiz}
                        className="flex-1 px-5 py-3 border border-foreground/20 text-xs uppercase tracking-[0.2em] font-bold text-foreground/65 hover:border-secondary hover:text-secondary transition-colors"
                      >
                        Tekrar Dene
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          )}

        </motion.div>
      </AnimatePresence>
    </>
  );
}
