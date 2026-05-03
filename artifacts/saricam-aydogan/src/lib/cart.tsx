import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, ReactNode } from "react";
import type { Product, StockStatus } from "./mockData";
import { findActiveCombo, ComboMatch } from "./combos";
import { trackEvent } from "./analytics";

const STORAGE_KEY = "saricam-cart-v1";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price_numeric?: number;
  price_label: string;
  qty: number;
  stock_status?: StockStatus;
  category_id?: string;
};

type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + action.item.qty } : i);
      }
      return [...state, action.item];
    }
    case "setQty":
      return state
        .map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)
        .filter(i => i.qty > 0);
    case "remove":
      return state.filter(i => i.id !== action.id);
    case "clear":
      return [];
    default:
      return state;
  }
}

export interface AddedToast {
  item: CartItem;
  totalCount: number;
  at: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (product: Product | Product[], qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;

  // Drawer
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  // Checkout wizard
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Toast for "added"
  toast: AddedToast | null;
  dismissToast: () => void;

  count: number;
  subtotal: number;
  combo: ComboMatch | null;
  total: number;
  hasNumericPrices: boolean;
}

// Persist the context object across Vite HMR reloads so Provider↔consumer
// references never break during development hot-updates.
const _g = globalThis as Record<string, unknown>;
if (!_g.__aydogan_cart_ctx__) {
  _g.__aydogan_cart_ctx__ = createContext<CartContextValue | null>(null);
}
const CartContext = _g.__aydogan_cart_ctx__ as ReturnType<typeof createContext<CartContextValue | null>>;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<AddedToast | null>(null);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", items: parsed });
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, hydrated]);

  // Cross-tab sync via `storage` event
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", items: parsed });
      } catch { /* ignore */ }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback((product: Product | Product[], qty: number = 1) => {
    const products = Array.isArray(product) ? product : [product];
    const eligible = products.filter(p => p.stock_status !== "out_of_stock");
    if (eligible.length === 0) return;
    const addedQty = qty;
    const newItems: CartItem[] = eligible.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      image: p.images[0] || "",
      price_numeric: p.price_numeric,
      price_label: p.price_label,
      qty: addedQty,
      stock_status: p.stock_status,
      category_id: p.category_id,
    }));
    newItems.forEach(item => dispatch({ type: "add", item }));
    const currentCount = items.reduce((s, i) => s + i.qty, 0);
    const nextCount = currentCount + eligible.length * addedQty;
    setToast({ item: newItems[newItems.length - 1], totalCount: nextCount, at: Date.now() });
  }, [items]);

  const remove = useCallback((id: string) => {
    const it = items.find(i => i.id === id);
    if (it) {
      trackEvent({
        event: "cart_remove",
        source: "cart",
        product_id: it.id,
        product_name: it.name,
      });
    }
    dispatch({ type: "remove", id });
  }, [items]);

  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(o => !o), []);
  const openCheckout = useCallback(() => { setIsOpen(false); setIsCheckoutOpen(true); }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + (i.price_numeric ? i.price_numeric * i.qty : 0), 0);
    const combo = findActiveCombo(items);
    const total = Math.max(0, subtotal - (combo?.discount ?? 0));
    const hasNumericPrices = items.length > 0 && items.every(i => !!i.price_numeric);
    return {
      items, add, remove, setQty, clear,
      isOpen, open, close, toggle,
      isCheckoutOpen, openCheckout, closeCheckout,
      toast, dismissToast,
      count, subtotal, combo, total, hasNumericPrices,
    };
  }, [items, isOpen, isCheckoutOpen, toast, add, remove, setQty, clear, open, close, toggle, openCheckout, closeCheckout, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
