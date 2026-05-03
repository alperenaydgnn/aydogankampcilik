import { formatPriceLabel } from "./mockData";

export interface Combo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Stable product slugs — work with both mock IDs and Supabase UUIDs. */
  productSlugs: string[];
  discountPct: number;
  badge?: string;
}

export interface ComboMatch {
  combo: Combo;
  discount: number;
  discountLabel: string;
  /** Subtotal of just the combo items (one of each, not full qty) — used for clarity. */
  comboSubtotal: number;
}

/* Pre-defined combo bundles, keyed by stable slugs. Discount triggers when
 * ALL `productSlugs` are present in cart and is calculated on the combo
 * items only (one of each), not the entire cart subtotal. */
export const COMBOS: Combo[] = [
  {
    id: "combo-kamp-baslangic",
    name: "Kamp Başlangıç Paketi",
    tagline: "İlk kampını planlıyorsan",
    description: "Alpinist Pro çadır + Kuzey Yıldızı uyku tulumu + Eva köpük paspas seti — birlikte aldığında %10 indirim.",
    productSlugs: [
      "alpinist-pro-4-mevsim-kamp-cadiri",
      "kuzey-yildizi-uyku-tulumu",
      "kamp-paspas-seti-eva-kopuk",
    ],
    discountPct: 10,
    badge: "%10 İndirim",
  },
  {
    id: "combo-olta-avci",
    name: "Olta Avcısı Paketi",
    tagline: "Karadeniz levrek avı için",
    description: "Fırtına Karbon Olta Kamışı + Levrek Pro Jigging Seti — birlikte alana %12 indirim.",
    productSlugs: [
      "firtina-karbon-spin-olta-kamisi-270cm",
      "levrek-pro-jigging-olta-seti",
    ],
    discountPct: 12,
    badge: "%12 İndirim",
  },
  {
    id: "combo-aydinlatma",
    name: "Gece Avı Aydınlatma Seti",
    tagline: "Karanlığa hazırlıklı ol",
    description: "Şarjlı Kamp Feneri + Avcı Pro Kafa Lambası — birlikte alana %15 indirim.",
    productSlugs: [
      "golge-sarjli-kamp-feneri",
      "avci-pro-kafa-lambasi",
    ],
    discountPct: 15,
    badge: "%15 İndirim",
  },
];

interface CartLike {
  slug: string;
  price_numeric?: number;
}

/** Find the highest-discount combo whose every product slug appears in the cart.
 * Discount is computed against the price of one of each combo item only,
 * NOT the entire cart subtotal. */
export function findActiveCombo(cart: CartLike[], combos: Combo[] = COMBOS): ComboMatch | null {
  if (cart.length === 0) return null;
  const slugSet = new Set(cart.map(i => i.slug));
  const matches = combos.filter(c => c.productSlugs.every(s => slugSet.has(s)));
  if (matches.length === 0) return null;
  const best = matches.sort((a, b) => b.discountPct - a.discountPct)[0];

  const comboSubtotal = best.productSlugs.reduce((sum, slug) => {
    const item = cart.find(i => i.slug === slug);
    return sum + (item?.price_numeric ?? 0);
  }, 0);

  if (comboSubtotal <= 0) return null;
  const discount = Math.round((comboSubtotal * best.discountPct) / 100);
  return { combo: best, discount, discountLabel: formatPriceLabel(discount), comboSubtotal };
}

/** Whether cart contains some — but not all — of a combo's products,
 *  so we can suggest "complete the combo" upsells. */
export function findSuggestedCombos(cartSlugs: string[], combos: Combo[] = COMBOS): Array<{ combo: Combo; missingSlugs: string[] }> {
  const slugSet = new Set(cartSlugs);
  return combos
    .map(c => ({ combo: c, missingSlugs: c.productSlugs.filter(s => !slugSet.has(s)) }))
    .filter(x => x.missingSlugs.length > 0 && x.missingSlugs.length < x.combo.productSlugs.length);
}
