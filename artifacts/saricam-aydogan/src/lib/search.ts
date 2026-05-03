import type { Product, Category } from "./mockData";

const DIACRITIC: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g",
  ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s",
  ü: "u", Ü: "u",
};

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (c) => DIACRITIC[c] ?? c)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SYNONYM_GROUPS: string[][] = [
  ["cadir", "tente", "barinak", "barinma"],
  ["uyku tulumu", "tulum", "sleeping bag"],
  ["fener", "lamba", "isik", "aydinlatma", "el feneri", "kamp lambasi"],
  ["kafa lambasi", "kafa feneri", "headlamp"],
  ["olta", "olta kamisi", "kamis", "spin"],
  ["makine", "olta makinesi", "carkifelek"],
  ["yem", "sahte yem", "lure", "balik yemi"],
  ["bicak", "kniv", "kesici", "trekking bicagi"],
  ["sirt cantasi", "canta", "rucksack", "backpack"],
  ["termos", "vakumlu termos", "matara"],
  ["sogutucu", "buzluk", "ice box", "termal kutu"],
  ["ocak", "kamp ocagi", "stove"],
  ["masa", "kamp masasi", "katlanir masa"],
  ["paspas", "mat", "mata", "zemin"],
  ["balik", "balikcilik", "olta takimi"],
  ["su gecirmez", "waterproof", "su gecirmezlik"],
  ["hafif", "kompakt", "ultralight"],
  ["4 mevsim", "kis", "kisluk"],
  ["3 mevsim", "yazlik", "ilkbahar"],
  ["powerbank", "sarjli", "rechargeable"],
];

const SYNONYM_INDEX: Map<string, Set<string>> = (() => {
  const map = new Map<string, Set<string>>();
  for (const group of SYNONYM_GROUPS) {
    const set = new Set(group.map(normalize));
    for (const term of set) {
      const existing = map.get(term);
      if (existing) {
        for (const t of set) existing.add(t);
      } else {
        map.set(term, new Set(set));
      }
    }
  }
  return map;
})();

function expandTerm(token: string): Set<string> {
  const out = new Set<string>([token]);
  const direct = SYNONYM_INDEX.get(token);
  if (direct) for (const t of direct) out.add(t);
  for (const [key, set] of SYNONYM_INDEX) {
    if (token.length >= 4 && (key.includes(token) || token.includes(key))) {
      for (const t of set) out.add(t);
    }
  }
  return out;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

function fuzzyContains(haystack: string, needle: string): { hit: boolean; exact: boolean } {
  if (!needle) return { hit: true, exact: true };
  if (haystack.includes(needle)) return { hit: true, exact: true };
  if (needle.length < 4) return { hit: false, exact: false };
  const tokens = haystack.split(/\s+/);
  const tolerance = needle.length <= 5 ? 1 : 2;
  for (const t of tokens) {
    if (Math.abs(t.length - needle.length) > tolerance) continue;
    if (levenshtein(t, needle) <= tolerance) return { hit: true, exact: false };
  }
  return { hit: false, exact: false };
}

export interface SearchableDoc {
  product: Product;
  haystack: string;
  nameNorm: string;
  brand?: string;
  categoryName?: string;
}

export function buildDoc(product: Product, categoryName?: string): SearchableDoc {
  const brand = product.specs?.["Marka"] || product.specs?.["Brand"];
  const specsText = Object.entries(product.specs || {})
    .map(([k, v]) => `${k} ${v}`)
    .join(" ");
  const tagsText = (product.tags || []).map((t) => t.name).join(" ");
  const haystack = normalize(
    [product.name, product.short_description ?? "", product.description, specsText, tagsText, categoryName ?? "", brand ?? ""].join(" ")
  );
  return { product, haystack, nameNorm: normalize(product.name), brand, categoryName };
}

export interface SmartSearchResult {
  product: Product;
  score: number;
  fuzzy: boolean;
}

export function smartSearch(
  query: string,
  docs: SearchableDoc[],
  opts: { limit?: number } = {},
): SmartSearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const results: SmartSearchResult[] = [];

  for (const doc of docs) {
    let score = 0;
    let anyFuzzy = false;
    let allHit = true;
    for (const token of tokens) {
      const expansions = expandTerm(token);
      let bestHit = false;
      let bestExact = false;
      for (const exp of expansions) {
        const r = fuzzyContains(doc.haystack, exp);
        if (r.hit) {
          bestHit = true;
          if (r.exact) bestExact = true;
          if (doc.nameNorm.includes(exp)) score += 6;
          if (doc.brand && normalize(doc.brand).includes(exp)) score += 4;
          score += r.exact ? 3 : 1;
          if (exp !== token) score += 1;
        }
      }
      if (!bestHit) { allHit = false; break; }
      if (!bestExact) anyFuzzy = true;
    }
    if (allHit) results.push({ product: doc.product, score, fuzzy: anyFuzzy });
  }

  results.sort((a, b) => b.score - a.score);
  return opts.limit ? results.slice(0, opts.limit) : results;
}

export interface CategorySuggestion {
  category: Category;
  matchCount: number;
}

export function suggestCategories(
  query: string,
  results: SmartSearchResult[],
  categories: Category[],
): CategorySuggestion[] {
  const q = normalize(query);
  const counts = new Map<string, number>();
  for (const r of results) {
    counts.set(r.product.category_id, (counts.get(r.product.category_id) ?? 0) + 1);
  }
  const out: CategorySuggestion[] = [];
  for (const cat of categories) {
    const nameNorm = normalize(cat.name);
    const directHit = q && (nameNorm.includes(q) || q.includes(nameNorm));
    const count = counts.get(cat.id) ?? 0;
    if (directHit || count > 0) {
      out.push({ category: cat, matchCount: count + (directHit ? 5 : 0) });
    }
  }
  out.sort((a, b) => b.matchCount - a.matchCount);
  return out.slice(0, 4);
}

export function extractBrands(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const brand = p.specs?.["Marka"] || p.specs?.["Brand"];
    if (brand) set.add(brand.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
}

export function getProductBrand(p: Product): string | undefined {
  return p.specs?.["Marka"] || p.specs?.["Brand"];
}

export function getProductWeightKg(p: Product): number | undefined {
  const raw = p.specs?.["Ağırlık"] || p.specs?.["Boş Ağırlık"];
  if (!raw) return undefined;
  const m = raw.match(/(\d+[.,]?\d*)\s*(kg|gr|g)/i);
  if (!m) return undefined;
  const num = parseFloat(m[1].replace(",", "."));
  const unit = m[2].toLowerCase();
  return unit === "kg" ? num : num / 1000;
}

export function getProductCapacity(p: Product): number | undefined {
  const raw = p.specs?.["Kapasite"];
  if (!raw) return undefined;
  const m = raw.match(/(\d+)\s*(kişilik|kisilik|kişi|kisi)/i);
  if (m) return parseInt(m[1], 10);
  return undefined;
}

export function getProductSeason(p: Product): string | undefined {
  return p.specs?.["Mevsim"];
}

export function getWaterproofMm(p: Product): number | undefined {
  const raw = p.specs?.["Su Geçirmezlik"];
  if (!raw) return undefined;
  const m = raw.match(/(\d{3,5})\s*mm/i);
  if (!m) return undefined;
  return parseInt(m[1], 10);
}
