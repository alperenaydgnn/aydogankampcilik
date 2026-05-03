import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

const STORAGE_KEY = "saricam_lang_v1";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const _g = globalThis as Record<string, unknown>;
if (!_g.__aydogan_i18n_ctx__) {
  _g.__aydogan_i18n_ctx__ = createContext<I18nContextValue | null>(null);
}
const I18nContext = _g.__aydogan_i18n_ctx__ as ReturnType<typeof createContext<I18nContextValue | null>>;

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "tr";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "tr" || saved === "en") return saved;
  } catch {}
  const nav = (typeof navigator !== "undefined" ? navigator.language : "tr").toLowerCase();
  if (nav.startsWith("en")) return "en";
  return "tr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback((key: TranslationKey) => {
    const dict = translations[lang] ?? translations.tr;
    return dict[key] ?? translations.tr[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so components rendered outside the provider (e.g. error
    // boundaries during early boot) don't throw.
    return { lang: "tr", setLang: () => {}, t: (k) => translations.tr[k] ?? k };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
