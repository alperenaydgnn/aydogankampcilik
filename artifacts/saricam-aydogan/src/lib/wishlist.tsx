import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "./mockData";

const STORAGE_KEY = "saricam-wishlist-v1";

export interface WishlistEntry {
  id: string;
  slug: string;
  name: string;
  image: string;
  price_label: string;
  price_numeric?: number;
  category_id?: string;
  added_at: number;
}

interface WishlistContextValue {
  items: WishlistEntry[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (product: Product) => boolean;
  add: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function entryFrom(p: Product): WishlistEntry {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: p.images[0] || "",
    price_label: p.price_label,
    price_numeric: p.price_numeric,
    category_id: p.category_id,
    added_at: Date.now(),
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setItems(e.newValue ? JSON.parse(e.newValue) : []);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback((slug: string) => items.some(i => i.slug === slug), [items]);

  const add = useCallback((p: Product) => {
    setItems(prev => prev.some(i => i.slug === p.slug) ? prev : [entryFrom(p), ...prev]);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug));
  }, []);

  const toggle = useCallback((p: Product) => {
    let next = false;
    setItems(prev => {
      if (prev.some(i => i.slug === p.slug)) {
        next = false;
        return prev.filter(i => i.slug !== p.slug);
      }
      next = true;
      return [entryFrom(p), ...prev];
    });
    return next;
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(() => ({
    items, count: items.length, has, toggle, add, remove, clear,
  }), [items, has, toggle, add, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
