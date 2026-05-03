import { formatPriceLabel } from "./mockData";

export interface Combo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  productIds: string[];
  discountPct: number;
  badge?: string;
}

export interface ComboMatch {
  combo: Combo;
  discount: number;
  discountLabel: string;
}

/* Pre-defined combo bundles. Discount triggers automatically in the cart
 * when ALL `productIds` are present. */
export const COMBOS: Combo[] = [
  {
    id: "combo-kamp-baslangic",
    name: "Kamp Başlangıç Paketi",
    tagline: "İlk kampını planlıyorsan",
    description: "Alpinist Pro çadır + Kuzey Yıldızı uyku tulumu + Eva köpük paspas seti — birlikte aldığında %10 indirim.",
    productIds: ["p-1", "p-2", "p-14"],
    discountPct: 10,
    badge: "%10 İndirim",
  },
  {
    id: "combo-olta-avci",
    name: "Olta Avcısı Paketi",
    tagline: "Karadeniz levrek avı için",
    description: "Fırtına Karbon Olta Kamışı + Levrek Pro Jigging Seti — birlikte alana %12 indirim.",
    productIds: ["p-3", "p-15"],
    discountPct: 12,
    badge: "%12 İndirim",
  },
  {
    id: "combo-aydinlatma",
    name: "Gece Avı Aydınlatma Seti",
    tagline: "Karanlığa hazırlıklı ol",
    description: "Şarjlı Kamp Feneri + Avcı Pro Kafa Lambası — birlikte alana %15 indirim.",
    productIds: ["p-9", "p-10"],
    discountPct: 15,
    badge: "%15 İndirim",
  },
];

export function findActiveCombo(cartIds: string[], combos: Combo[], subtotal: number): ComboMatch | null {
  if (subtotal <= 0) return null;
  const idSet = new Set(cartIds);
  // Pick the highest discountPct combo whose all productIds are in cart
  const matches = combos.filter(c => c.productIds.every(id => idSet.has(id)));
  if (matches.length === 0) return null;
  const best = matches.sort((a, b) => b.discountPct - a.discountPct)[0];
  const discount = Math.round((subtotal * best.discountPct) / 100);
  return { combo: best, discount, discountLabel: formatPriceLabel(discount) };
}

/** Whether cart contains some — but not all — of a combo's products,
 *  so we can suggest "complete the combo" upsells. */
export function findSuggestedCombos(cartIds: string[], combos: Combo[]): Array<{ combo: Combo; missingIds: string[] }> {
  const idSet = new Set(cartIds);
  return combos
    .map(c => ({ combo: c, missingIds: c.productIds.filter(id => !idSet.has(id)) }))
    .filter(x => x.missingIds.length > 0 && x.missingIds.length < x.combo.productIds.length);
}
