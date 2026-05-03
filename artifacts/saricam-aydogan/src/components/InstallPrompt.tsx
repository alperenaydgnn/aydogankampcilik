import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Download, Share, X, Plus } from "lucide-react";
import { usePWAInstall } from "@/lib/pwa";
import { haptics } from "@/lib/haptics";

/**
 * Editorial "Add to Home Screen" prompt — shows after a short delay
 * when the browser exposes a deferred install prompt (Android Chrome,
 * desktop Edge/Chrome). On iOS Safari, where no programmatic install
 * exists, surfaces a one-time instructional sheet for the Share menu.
 */
export function InstallPrompt() {
  const { available, installed, promptInstall, dismissedRecently, remember, isiOS } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [iosVisible, setIosVisible] = useState(false);

  useEffect(() => {
    if (installed || dismissedRecently) return undefined;
    if (available) {
      const t = window.setTimeout(() => setVisible(true), 8000);
      return () => window.clearTimeout(t);
    }
    if (isiOS) {
      const t = window.setTimeout(() => setIosVisible(true), 12000);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [available, installed, dismissedRecently, isiOS]);

  if (installed) return null;

  return (
    <>
      <AnimatePresence>
        {visible && available && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-labelledby="install-title"
            className="fixed left-1/2 -translate-x-1/2 z-[70]
                       bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)]
                       md:bottom-6 md:left-6 md:translate-x-0
                       w-[min(420px,calc(100%-1.5rem))]
                       bg-background border border-foreground/15 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]
                       rounded-2xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.22em] text-secondary mb-1">
                  Uygulama Olarak Yükle
                </span>
                <h3 id="install-title" className="font-serif text-lg leading-tight text-foreground mb-1">
                  Aydoğan Kampçılık'ı <em className="italic text-secondary">telefonunuza</em> ekleyin
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Tek dokunuşla ulaşın, çevrimdışı gezin.
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={async () => {
                      haptics.tap();
                      const r = await promptInstall();
                      if (r !== "unavailable") setVisible(false);
                      if (r === "dismissed") remember();
                    }}
                    className="btn-cta-amber text-[0.65rem] px-4 py-2"
                  >
                    Yükle
                  </button>
                  <button
                    onClick={() => { haptics.light(); remember(); setVisible(false); }}
                    className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-foreground/55 hover:text-foreground"
                  >
                    Sonra
                  </button>
                </div>
              </div>
              <button
                onClick={() => { remember(); setVisible(false); }}
                aria-label="Kapat"
                className="shrink-0 -mr-1 -mt-1 p-1.5 text-foreground/40 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {iosVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-labelledby="install-ios-title"
            className="fixed left-1/2 -translate-x-1/2 z-[70]
                       bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)]
                       w-[min(420px,calc(100%-1.5rem))]
                       bg-background border border-foreground/15 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]
                       rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.22em] text-secondary mb-1">
                  Ana Ekrana Ekle
                </span>
                <h3 id="install-ios-title" className="font-serif text-base leading-tight text-foreground mb-2">
                  iPhone'unuzda <em className="italic text-secondary">tek dokunuşla</em> erişin
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-1">
                  Safari menüsünde <Share className="inline w-3 h-3 mx-1 -mt-0.5" /> simgesine,
                  ardından <Plus className="inline w-3 h-3 mx-1 -mt-0.5" /> "Ana Ekrana Ekle" seçeneğine dokunun.
                </p>
              </div>
              <button
                onClick={() => { remember(); setIosVisible(false); }}
                aria-label="Kapat"
                className="shrink-0 -mr-1 -mt-1 p-1.5 text-foreground/40 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
