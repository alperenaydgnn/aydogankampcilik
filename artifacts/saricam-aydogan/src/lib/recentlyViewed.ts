import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "saricam-recent-v1";
const MAX_ITEMS = 12;

export interface RecentEntry {
  slug: string;
  name: string;
  image: string;
  price_label: string;
  category_id?: string;
  viewed_at: number;
}

function read(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: RecentEntry[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

export function trackView(entry: Omit<RecentEntry, "viewed_at">) {
  const list = read().filter(e => e.slug !== entry.slug);
  list.unshift({ ...entry, viewed_at: Date.now() });
  write(list.slice(0, MAX_ITEMS));
  window.dispatchEvent(new CustomEvent("recently-viewed-updated"));
}

export function useRecentlyViewed(excludeSlug?: string): RecentEntry[] {
  const [items, setItems] = useState<RecentEntry[]>([]);

  const refresh = useCallback(() => {
    setItems(read());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("recently-viewed-updated", onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("recently-viewed-updated", onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return excludeSlug ? items.filter(i => i.slug !== excludeSlug) : items;
}

export function clearRecentlyViewed() {
  write([]);
  window.dispatchEvent(new CustomEvent("recently-viewed-updated"));
}
