import { useSiteSettings } from "./useSiteSettings";

const DEFAULT_NUMBER = "905551112233";
const SITE_URL = "https://saricamaydogan.com";

export function getWhatsAppNumberStatic(): string {
  return import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER;
}

/** Hook variant — prefers the live `site_settings.whatsapp` value. */
export function useWhatsAppNumber(): string {
  const settings = useSiteSettings();
  const fromSettings = settings.whatsapp?.replace(/[^0-9]/g, "");
  if (fromSettings && fromSettings.length >= 10) return fromSettings;
  return getWhatsAppNumberStatic();
}

export function buildWhatsAppLink(message: string, number?: string): string {
  const n = number || getWhatsAppNumberStatic();
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function useBuildWhatsAppLink(): (message: string) => string {
  const number = useWhatsAppNumber();
  return (message: string) => buildWhatsAppLink(message, number);
}

/* ── Structured message builders ──────────────────────────────────────── */

export interface ProductMessageOptions {
  name: string;
  price_label: string;
  price_numeric?: number | null;
  stock_status?: string | null;
  slug: string;
  whatsapp_message?: string | null;
}

export interface CategoryMessageOptions {
  name: string;
}

export function buildProductMessage(
  product: ProductMessageOptions,
  category: CategoryMessageOptions
): string {
  const url = `${SITE_URL}/urun/${product.slug}`;
  const stockLine =
    product.stock_status === "low_stock"    ? "⚠️ Stok: Son adet" :
    product.stock_status === "out_of_stock" ? "❌ Stok: Tükendi"  :
                                              "✅ Stok: Mevcut";
  const lines: string[] = [
    "Merhaba! 👋",
    "",
    `📦 *${product.name}* ürünü hakkında bilgi almak istiyorum.`,
    "",
    `📂 Kategori: ${category.name}`,
  ];
  if (product.price_numeric) lines.push(`💰 Fiyat: ${product.price_label}`);
  lines.push(stockLine);
  lines.push("", `🔗 ${url}`);
  lines.push(
    "",
    product.whatsapp_message?.trim() || "Stok teyidi ve kargo bilgisi alabilir miyim?"
  );
  return lines.join("\n");
}

export function buildSearchMessage(query: string, categoryName?: string): string {
  const lines: string[] = ["Merhaba! 👋", ""];
  if (categoryName) lines.push(`*${categoryName}* kategorisinde ürün arıyorum.`);
  else lines.push("Kamp ve balık malzemeleri hakkında bilgi almak istiyorum.");
  if (query.trim()) lines.push("", `🔍 Aradığım: *"${query.trim()}"*`);
  lines.push("", "Bu ürünü bulabilir misiniz?");
  return lines.join("\n");
}

export interface WishlistShareItem {
  name: string;
  slug: string;
  price_label: string;
}

export function buildWishlistShareMessage(items: WishlistShareItem[]): string {
  const lines: string[] = [
    "Merhaba! 👋",
    "",
    `🤍 İstek listemdeki ${items.length} ürün hakkında bilgi almak istiyorum:`,
    "",
  ];
  items.forEach((it, i) => {
    lines.push(`${i + 1}. *${it.name}* — ${it.price_label}`);
    lines.push(`   ${SITE_URL}/urun/${it.slug}`);
  });
  lines.push("", "Stok ve kargo bilgisi alabilir miyim?");
  return lines.join("\n");
}

export interface CompareShareItem {
  name: string;
  slug: string;
  price_label: string;
}

export function buildCompareShareMessage(items: CompareShareItem[]): string {
  const lines: string[] = [
    "Merhaba! 👋",
    "",
    `🔍 Aşağıdaki ${items.length} ürünü karşılaştırıyorum, tavsiye alabilir miyim?`,
    "",
  ];
  items.forEach((it, i) => {
    lines.push(`${i + 1}. *${it.name}* — ${it.price_label}`);
    lines.push(`   ${SITE_URL}/urun/${it.slug}`);
  });
  lines.push("", "Hangisi benim için daha uygun olur?");
  return lines.join("\n");
}

export function buildStockNotifyMessage(productName: string): string {
  return [
    "Merhaba! 👋",
    "",
    `"*${productName}*" ürünü şu an stokta yok.`,
    "",
    "Bu ürün stoka girince haber verir misiniz?",
  ].join("\n");
}
