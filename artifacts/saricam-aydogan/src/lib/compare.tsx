import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "./mockData";

const STORAGE_KEY = "saricam-compare-v1";
export const COMPARE_MAX = 3;

interface CompareContextValue {
  slugs: string[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (product: Product) => { added: boolean; reason?: "max" };
  remove: (slug: string) => void;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSlugs(parsed.slice(0, COMPARE_MAX));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs)); } catch {}
  }, [slugs, hydrated]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((p: Product): { added: boolean; reason?: "max" } => {
    let result: { added: boolean; reason?: "max" } = { added: false };
    setSlugs(prev => {
      if (prev.includes(p.slug)) {
        result = { added: false };
        return prev.filter(s => s !== p.slug);
      }
      if (prev.length >= COMPARE_MAX) {
        result = { added: false, reason: "max" };
        return prev;
      }
      result = { added: true };
      return [...prev, p.slug];
    });
    return result;
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs(prev => prev.filter(s => s !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<CompareContextValue>(() => ({
    slugs, count: slugs.length, has, toggle, remove, clear,
    isFull: slugs.length >= COMPARE_MAX,
  }), [slugs, has, toggle, remove, clear]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
