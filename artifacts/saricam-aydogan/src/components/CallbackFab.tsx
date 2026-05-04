import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Check } from "lucide-react";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "saricam-callback-dismissed";

const TOPICS = [
  "Genel bilgi",
  "Ürün hakkında",
  "Stok / kargo",
  "Toplu sipariş",
  "Diğer",
] as const;

export function CallbackFab() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [productNote, setProductNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hidden, setHidden] = useState(true);
  const buildWA = useBuildWhatsAppLink();

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    setHidden(false);
  }, []);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (f.length === 0) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const valid = /^[0-9+\s()-]{10,}$/.test(phone.trim());

  const submit = () => {
    if (!valid) return;
    const lines: string[] = [
      "Merhaba! 👋 Geri arama talep ediyorum.",
      "",
      ...(name.trim() ? [`Ad Soyad: ${name.trim()}`] : []),
      `Telefon: ${phone.trim()}`,
      `Konu: ${topic}`,
    ];
    if (productNote.trim()) {
      lines.push(`Ürün / Detay: ${productNote.trim()}`);
    }
    lines.push("", "Lütfen müsait olduğunuzda iletişime geçer misiniz? Teşekkürler.");
    trackEvent({ event: "callback_request", source: "callback_fab", time_window: topic });
    window.open(buildWA(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setName(""); setPhone(""); setTopic(TOPICS[0]); setProductNote("");
    }, 1800);
  };

  const dismissChip = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  };

  if (hidden && !open) return null;

  return (
    <>
      <AnimatePresence>
        {!open && !hidden && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="fixed bottom-24 right-6 z-[60] flex items-center gap-2"
          >
            <button
              onClick={() => { setOpen(true); trackEvent({ event: "callback_open", source: "callback_fab" }); }}
              className="inline-flex items-center gap-2.5 pl-3 pr-5 py-2.5 bg-primary text-white shadow-xl rounded-full text-[0.7rem] font-bold uppercase tracking-[0.18em] hover:bg-primary/90 transition group"
              aria-label="Geri arama talep et"
            >
              <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition">
                <Phone className="w-3.5 h-3.5" strokeWidth={2.2} />
              </span>
              Beni Ara
            </button>
            <button
              onClick={dismissChip}
              aria-label="Geri arama önerisini kapat"
              className="w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/15 flex items-center justify-center text-foreground/55 hover:text-foreground hover:bg-background transition"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-foreground/55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Geri arama talep et"
                className="bg-background w-full max-w-md pointer-events-auto shadow-2xl outline-none"
              >
                <header className="flex items-center justify-between px-6 py-5 border-b border-foreground/10">
                  <div>
                    <span className="eyebrow !mb-0">Geri Arama</span>
                    <h3 className="font-serif font-light text-xl text-primary tracking-tight mt-1">
                      Sizi <em className="italic text-secondary">arayalım.</em>
                    </h3>
                  </div>
                  <button onClick={() => setOpen(false)} className="p-2 -mr-2 text-foreground/55 hover:text-foreground" aria-label="Kapat">
                    <X className="w-5 h-5" />
                  </button>
                </header>

                <div className="px-6 py-6 space-y-4">
                  {submitted ? (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-7 h-7 text-emerald-600" strokeWidth={2.2} />
                      </div>
                      <p className="font-serif text-lg text-primary">Talebiniz alındı!</p>
                      <p className="text-sm text-foreground/55 font-light mt-2">WhatsApp'tan ekibimize iletildi.</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-foreground/55 font-light leading-relaxed">
                        Bilgilerinizi bırakın, en kısa sürede sizi WhatsApp veya telefon ile arayalım.
                      </p>
                      <label className="block">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-foreground/70 mb-1.5 block">Adınız (opsiyonel)</span>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ör. Ahmet Yılmaz" autoFocus className="checkout-input" />
                      </label>
                      <label className="block">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-foreground/70 mb-1.5 block">Telefon</span>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0507 644 23 50" className="checkout-input" />
                      </label>
                      <label className="block">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-foreground/70 mb-1.5 block">Konu</span>
                        <select value={topic} onChange={e => setTopic(e.target.value)} className="checkout-input">
                          {TOPICS.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-foreground/70 mb-1.5 block">
                          Ürün / Detay <span className="text-foreground/45 font-medium">(opsiyonel)</span>
                        </span>
                        <input type="text" value={productNote} onChange={e => setProductNote(e.target.value)} placeholder="Hangi ürün hakkında? Ek bilgi?" className="checkout-input" />
                      </label>
                      <button
                        onClick={submit}
                        disabled={!valid}
                        className={cn(
                          "btn-cta-amber btn-cta w-full justify-center !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em]",
                          !valid && "opacity-50 pointer-events-none"
                        )}
                      >
                        Beni Geri Arayın
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
