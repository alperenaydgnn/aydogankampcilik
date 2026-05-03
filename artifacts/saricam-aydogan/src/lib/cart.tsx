import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, ReactNode } from "react";
import type { Product, StockStatus } from "./mockData";
import { findActiveCombo, COMBOS, ComboMatch } from "./combos";

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

interface CartContextValue {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: number;
  subtotal: number;
  combo: ComboMatch | null;
  total: number;
  hasNumericPrices: boolean;
  lastAdded: CartItem | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

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

  const add = useCallback((product: Product, qty: number = 1) => {
    if (product.stock_status === "out_of_stock") return;
    const item: CartItem = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || "",
      price_numeric: product.price_numeric,
      price_label: product.price_label,
      qty,
      stock_status: product.stock_status,
      category_id: product.category_id,
    };
    dispatch({ type: "add", item });
    setLastAdded({ ...item });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(o => !o), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + (i.price_numeric ? i.price_numeric * i.qty : 0), 0);
    const combo = findActiveCombo(items.map(i => i.id), COMBOS, subtotal);
    const total = Math.max(0, subtotal - (combo?.discount ?? 0));
    const hasNumericPrices = items.every(i => !!i.price_numeric);
    return { items, add, remove, setQty, clear, isOpen, open, close, toggle, count, subtotal, combo, total, hasNumericPrices, lastAdded };
  }, [items, isOpen, add, remove, setQty, clear, open, close, toggle, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
