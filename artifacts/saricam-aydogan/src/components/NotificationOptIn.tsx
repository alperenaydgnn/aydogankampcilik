import { useEffect, useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPushState, subscribePush, unsubscribePush, type PushState } from "@/lib/pwa";
import { haptics } from "@/lib/haptics";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Compact opt-in card for push notifications. Shows on the catalog or
 * favorites pages to invite users to receive new-product, campaign,
 * and back-in-stock alerts. Auto-hides when subscribed or unsupported.
 */
export function NotificationOptIn({ className, source = "catalog" }: { className?: string; source?: string }) {
  const [state, setState] = useState<PushState>("default");
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("push.dismissed") === "1") setDismissed(true);
    } catch { /* noop */ }
    getPushState().then(setState);
  }, []);

  if (state === "unsupported" || state === "denied" || state === "subscribed" || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative border border-foreground/15 bg-background rounded-2xl p-5 md:p-6",
          "flex flex-col md:flex-row md:items-center gap-4",
          className,
        )}
      >
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/8 text-primary flex items-center justify-center">
          <Bell className="w-5 h-5" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="block text-[0.6rem] font-bold uppercase tracking-[0.22em] text-secondary mb-1">
            Bildirimleri Aç
          </span>
          <h3 className="font-serif text-lg md:text-xl leading-tight text-foreground mb-1">
            Yeni ürün, kampanya ve <em className="italic text-secondary">stok haberleri.</em>
          </h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            İsteğiniz an iptal edebilirsiniz. Reklam yok — yalnızca seçtiğimiz duyurular.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={async () => {
              setBusy(true);
              haptics.tap();
              const next = await subscribePush();
              setState(next);
              setBusy(false);
              trackEvent({ event: next === "subscribed" ? "push_optin" : "push_optout", source });
              if (next === "subscribed") haptics.success();
            }}
            disabled={busy}
            className="btn-cta-amber text-[0.65rem] px-4 py-2 whitespace-nowrap"
          >
            {busy ? "..." : state === "granted" ? "Aboneliği Tamamla" : "Bildirimi Aç"}
          </button>
          <button
            onClick={() => {
              try { localStorage.setItem("push.dismissed", "1"); } catch { /* noop */ }
              setDismissed(true);
            }}
            className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-foreground/45 hover:text-foreground"
          >
            Sonra
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Settings-style toggle row, useful in account/profile views. */
export function NotificationToggle() {
  const [state, setState] = useState<PushState>("default");
  const [busy, setBusy] = useState(false);

  useEffect(() => { getPushState().then(setState); }, []);

  if (state === "unsupported") return null;

  const subscribed = state === "subscribed";

  return (
    <button
      type="button"
      disabled={busy || state === "denied"}
      onClick={async () => {
        setBusy(true);
        haptics.tap();
        if (subscribed) {
          await unsubscribePush();
          setState("granted");
        } else {
          const next = await subscribePush();
          setState(next);
          if (next === "subscribed") haptics.success();
        }
        setBusy(false);
      }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 border text-[0.65rem] uppercase tracking-[0.2em] font-semibold transition-colors",
        subscribed
          ? "border-primary text-primary bg-primary/5"
          : "border-foreground/20 text-foreground hover:border-secondary hover:text-secondary",
      )}
    >
      {subscribed ? <Check className="w-3 h-3" /> : state === "denied" ? <BellOff className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
      {state === "denied" ? "Bildirimler Engellendi" : subscribed ? "Bildirimler Açık" : "Bildirimleri Aç"}
    </button>
  );
}
