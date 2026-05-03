import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronLeft, ChevronRight, ShoppingBag, User, Truck, CreditCard, Send } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPriceLabel } from "@/lib/mockData";
import { useBuildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type DeliveryMethod = "kargo" | "magaza";
type PaymentMethod = "havale" | "kapida" | "kart";

const PAYMENT_LABELS: Record<PaymentMethod, { label: string; hint: string }> = {
  havale: { label: "Havale / EFT",       hint: "Sipariş onayında IBAN paylaşılır" },
  kapida: { label: "Kapıda Ödeme",       hint: "Nakit veya kart ile teslimde" },
  kart:   { label: "Kredi Kartı (Link)", hint: "WhatsApp'tan güvenli ödeme linki" },
};

interface CheckoutForm {
  name: string;
  phone: string;
  delivery: DeliveryMethod;
  city: string;
  district: string;
  address: string;
  payment: PaymentMethod;
  note: string;
}

const STEPS = [
  { key: "contact",  label: "İletişim",  icon: User },
  { key: "delivery", label: "Teslimat",  icon: Truck },
  { key: "payment",  label: "Ödeme",     icon: CreditCard },
  { key: "confirm",  label: "Onay",      icon: Send },
] as const;

const FORM_STORAGE = "saricam-checkout-form-v1";

export function CheckoutWizard() {
  const { items, subtotal, combo, total, hasNumericPrices, clear, count, isCheckoutOpen, closeCheckout } = useCart();
  const open = isCheckoutOpen;
  const onClose = closeCheckout;
  const buildWA = useBuildWhatsAppLink();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CheckoutForm>({
    name: "", phone: "", delivery: "kargo", city: "", district: "", address: "", payment: "havale", note: "",
  });

  // Hydrate form from localStorage
  useEffect(() => {
    if (!open) return;
    setStep(0);
    try {
      const raw = localStorage.getItem(FORM_STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm(prev => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
  }, [open]);

  // Persist form
  useEffect(() => {
    try { localStorage.setItem(FORM_STORAGE, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC + focus trap
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
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
    const t = setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && items.length === 0) onClose();
  }, [open, items.length, onClose]);

  if (items.length === 0 && open) {
    return null;
  }

  const canNext = (() => {
    if (step === 0) return form.name.trim().length >= 2 && /^[0-9+\s()-]{10,}$/.test(form.phone.trim());
    if (step === 1) return form.delivery === "magaza" || (form.city.trim().length >= 2 && form.district.trim().length >= 2 && form.address.trim().length >= 5);
    if (step === 2) return !!form.payment;
    return true;
  })();

  const next = () => {
    if (!canNext) return;
    if (step < STEPS.length - 1) {
      trackEvent({ event: "checkout_step", source: "checkout_wizard", step: STEPS[step + 1].key, item_count: count });
      setStep(step + 1);
    }
  };
  const prev = () => setStep(s => Math.max(0, s - 1));

  const buildMessage = (): string => {
    const lines: string[] = [
      "Merhaba! 👋 WhatsApp siparişi vermek istiyorum.",
      "",
      "*🛒 Sipariş İçeriği:*",
    ];
    items.forEach((it, i) => {
      const sub = it.price_numeric ? ` — ${formatPriceLabel(it.price_numeric * it.qty)}` : "";
      lines.push(`${i + 1}. ${it.name} × ${it.qty}${sub}`);
    });
    lines.push("");
    if (hasNumericPrices) {
      lines.push(`Ara Toplam: ${formatPriceLabel(subtotal)}`);
      if (combo) lines.push(`Kombo İndirim (${combo.combo.name}): −${combo.discountLabel}`);
      lines.push(`*Toplam: ${formatPriceLabel(total)}*`);
    } else {
      lines.push("Toplam fiyat WhatsApp'tan teyit edilecek.");
    }
    lines.push("", "*👤 Müşteri Bilgileri:*");
    lines.push(`Ad Soyad: ${form.name}`);
    lines.push(`Telefon: ${form.phone}`);
    lines.push("", "*🚚 Teslimat:*");
    if (form.delivery === "magaza") {
      lines.push("Mağazadan teslim almak istiyorum (Adana Sarıçam).");
    } else {
      lines.push("Kargo ile teslimat istiyorum.");
      lines.push(`Şehir: ${form.city}`);
      lines.push(`İlçe: ${form.district}`);
      lines.push(`Adres: ${form.address}`);
    }
    lines.push("", `*💳 Ödeme Tercihi: ${PAYMENT_LABELS[form.payment].label}*`);
    if (form.note.trim()) {
      lines.push("", "*📝 Not:*");
      lines.push(form.note.trim());
    }
    lines.push("", "Stok teyidi ve kargo bilgisi için iletişime geçer misiniz? Teşekkürler.");
    return lines.join("\n");
  };

  const submit = () => {
    const msg = buildMessage();
    const url = buildWA(msg);
    trackEvent({
      event: "checkout_submit",
      source: "checkout_wizard",
      item_count: count,
      subtotal,
      total,
      delivery: form.delivery,
      payment: form.payment,
      has_combo: !!combo,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    try { localStorage.removeItem(FORM_STORAGE); } catch { /* ignore */ }
    setForm({ name: "", phone: "", delivery: "kargo", city: "", district: "", address: "", payment: "havale", note: "" });
    clear();
    onClose();
  };

  const update = <K extends keyof CheckoutForm>(k: K, v: CheckoutForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-foreground/55 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="bg-background w-full max-w-xl max-h-[92vh] flex flex-col pointer-events-auto shadow-2xl outline-none"
              role="dialog"
              aria-modal="true"
              aria-label="Siparişi tamamla"
            >
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-5 border-b border-foreground/10">
                <div>
                  <span className="eyebrow !mb-0">Sipariş Sihirbazı</span>
                  <h3 className="font-serif font-light text-xl md:text-2xl text-primary tracking-tight mt-1">
                    {STEPS[step].label}<em className="italic text-secondary">.</em>
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Sihirbazı kapat"
                  className="p-2 -mr-2 text-foreground/55 hover:text-foreground transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Stepper */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < step;
                  const active = i === step;
                  return (
                    <div key={s.key} className="flex-1 flex items-center">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] font-bold transition-colors",
                        done && "bg-secondary text-white",
                        active && "border-2 border-secondary text-secondary bg-secondary/10",
                        !done && !active && "border border-foreground/20 text-foreground/40"
                      )}>
                        {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn(
                          "flex-1 h-px mx-2 transition-colors",
                          done ? "bg-secondary" : "bg-foreground/15"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {step === 0 && (
                  <div className="space-y-5">
                    <Field label="Adınız Soyadınız" required>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => update("name", e.target.value)}
                        placeholder="Ör. Ahmet Yılmaz"
                        autoFocus
                        className="checkout-input"
                      />
                    </Field>
                    <Field label="WhatsApp Telefon Numaranız" required hint="Sipariş teyidi için aranacak / yazılacak.">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => update("phone", e.target.value)}
                        placeholder="0555 123 45 67"
                        className="checkout-input"
                      />
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <span className="eyebrow text-foreground/70">Teslimat Yöntemi</span>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {(["kargo", "magaza"] as DeliveryMethod[]).map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => update("delivery", m)}
                            className={cn(
                              "border p-4 text-left transition",
                              form.delivery === m
                                ? "border-secondary bg-secondary/5"
                                : "border-foreground/15 hover:border-foreground/30"
                            )}
                          >
                            <p className="font-serif font-light text-base text-primary">
                              {m === "kargo" ? "Kargo" : "Mağazadan Teslim"}
                            </p>
                            <p className="text-xs text-foreground/55 font-light mt-1">
                              {m === "kargo" ? "Tüm Türkiye, MNG/Aras" : "Adana Sarıçam mağaza"}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.delivery === "kargo" && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Şehir" required>
                            <input
                              type="text"
                              value={form.city}
                              onChange={e => update("city", e.target.value)}
                              placeholder="Ör. Adana"
                              className="checkout-input"
                            />
                          </Field>
                          <Field label="İlçe" required>
                            <input
                              type="text"
                              value={form.district}
                              onChange={e => update("district", e.target.value)}
                              placeholder="Ör. Akçaabat"
                              className="checkout-input"
                            />
                          </Field>
                        </div>
                        <Field label="Açık Adres" required>
                          <textarea
                            value={form.address}
                            onChange={e => update("address", e.target.value)}
                            placeholder="Mahalle, sokak, bina no, daire, ilçe"
                            rows={3}
                            className="checkout-input resize-none"
                          />
                        </Field>
                      </>
                    )}

                    <Field label="Sipariş Notu (opsiyonel)">
                      <textarea
                        value={form.note}
                        onChange={e => update("note", e.target.value)}
                        placeholder="Bilmemiz gereken bir şey var mı?"
                        rows={2}
                        className="checkout-input resize-none"
                      />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <p className="text-xs text-foreground/55 font-light leading-relaxed mb-2">
                      Tercih ettiğiniz ödeme yöntemini seçin. Detaylar WhatsApp üzerinden iletilir.
                    </p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map(m => {
                        const cfg = PAYMENT_LABELS[m];
                        const active = form.payment === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => update("payment", m)}
                            className={cn(
                              "flex items-center justify-between gap-3 border p-4 text-left transition",
                              active
                                ? "border-secondary bg-secondary/5"
                                : "border-foreground/15 hover:border-foreground/30"
                            )}
                          >
                            <div>
                              <p className="font-serif font-light text-base text-primary">{cfg.label}</p>
                              <p className="text-xs text-foreground/55 font-light mt-0.5">{cfg.hint}</p>
                            </div>
                            <span className={cn(
                              "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                              active ? "border-secondary" : "border-foreground/25"
                            )}>
                              {active && <span className="w-2 h-2 rounded-full bg-secondary" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 text-sm">
                    <p className="text-foreground/65 font-light leading-relaxed">
                      Aşağıdaki sipariş bilgileriniz <span className="font-medium text-secondary">WhatsApp üzerinden</span> ekibimize iletilecek. Mesajı görüp düzenleyebilirsiniz; "Gönder" dediğinizde WhatsApp açılır.
                    </p>
                    <div className="border border-foreground/15 bg-foreground/[0.02] p-4 max-h-72 overflow-y-auto">
                      <pre className="font-mono text-[0.7rem] leading-relaxed text-foreground/80 whitespace-pre-wrap break-words">
                        {buildMessage()}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <footer className="border-t border-foreground/10 px-6 py-4 flex items-center justify-between gap-3">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/65 hover:text-foreground transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Geri
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    disabled={!canNext}
                    className="btn-cta-amber btn-cta inline-flex items-center gap-2 !text-[0.7rem] !font-bold !uppercase !tracking-[0.2em] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Devam <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-xs uppercase tracking-[0.18em]"
                    style={{ background: "linear-gradient(135deg, #25D366 0%, #1aaa57 100%)", boxShadow: "0 4px 16px rgba(37,211,102,0.28)" }}
                  >
                    <Send className="w-3.5 h-3.5" /> WhatsApp'ta Aç
                  </button>
                )}
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-foreground/70 mb-1.5 block">
        {label}{required && <span className="text-rose-600 ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="text-[0.7rem] text-foreground/45 mt-1.5 block font-light">{hint}</span>}
    </label>
  );
}
