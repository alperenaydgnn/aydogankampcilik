import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ onDark }: { onDark: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("header.langToggle")}
      className={cn(
        "inline-flex items-center rounded-full border overflow-hidden text-[0.6rem] font-bold uppercase tracking-[0.18em] transition-colors duration-300",
        onDark ? "border-white/30" : "border-foreground/15",
      )}
    >
      {(["tr", "en"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={code === "tr" ? "Türkçe" : "English"}
            className={cn(
              "px-2.5 py-1.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60",
              active
                ? onDark
                  ? "bg-white text-primary"
                  : "bg-primary text-white"
                : onDark
                  ? "text-white/70 hover:text-white"
                  : "text-foreground/60 hover:text-foreground",
            )}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
