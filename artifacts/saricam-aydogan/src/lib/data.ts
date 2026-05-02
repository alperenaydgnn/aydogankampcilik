import { getSupabase } from './supabase';

const DIACRITIC_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g',
  ı: 'i', I: 'i', İ: 'i', i: 'i',
  ö: 'o', Ö: 'o', ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
};

function stripDiacritics(input: string): string {
  // Mirrors Postgres `unaccent()` for the Turkish letters used by our index.
  let s = input.replace(/[çÇğĞıIİöÖşŞüÜ]/g, (c) => DIACRITIC_MAP[c] ?? c);
  // Catch any remaining combining marks (e.g. composed accents from copy-paste).
  s = s.normalize('NFKD').replace(/\p{Diacritic}/gu, '');
  return s.toLowerCase();
}
import {
  mockCategories,
  mockProducts,
  mockSiteSettings,
  Category,
  Product,
  SiteSettings,
  Tag,
  deriveStockStatus,
  formatPriceLabel,
} from './mockData';
import type {
  DBCategory,
  DBProductWithRelations,
  DBSiteSetting,
  DBTag,
} from './database.types';

/* ------------------------------------------------------------------ */
/*  Mappers: DB row → app-level domain object                          */
/* ------------------------------------------------------------------ */

function mapCategory(row: DBCategory): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.image_url,
    sort_order: row.sort_order,
    active: row.active,
    created_at: row.created_at,
  };
}

function mapTag(row: DBTag): Tag {
  return { id: row.id, name: row.name, slug: row.slug, color: row.color };
}

/**
 * Map a Supabase `products` row (with joined `product_images`/`product_tags`)
 * to the app-level `Product` shape. Images are intentionally flattened to a
 * sorted `string[]` (primary first, then by `sort_order`) — every consumer of
 * `Product` only needs the URL list. If a future feature needs per-image
 * metadata (alt, dimensions, role), expose `product_images` as a separate
 * field on `Product` rather than reshaping `images`.
 */
function mapProduct(row: DBProductWithRelations): Product {
  const images = (row.product_images ?? [])
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.sort_order - b.sort_order;
    })
    .map((img) => img.url);

  const tags = (row.product_tags ?? [])
    .map((pt) => pt.tag)
    .filter(Boolean)
    .map(mapTag);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category_id: row.category_id,
    description: row.description,
    short_description: row.short_description,
    specs: (row.specs as Record<string, string>) ?? {},
    price_label: formatPriceLabel(row.price, row.price_label),
    price_numeric: row.price ?? undefined,
    old_price: row.old_price,
    stock: row.stock,
    images,
    featured: row.featured,
    is_new: row.is_new,
    active: row.active,
    stock_status: deriveStockStatus(row.stock),
    whatsapp_message: row.whatsapp_message ?? undefined,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    tags,
    created_at: row.created_at,
  };
}

// `!inner` forces the join to drop rows whose category is inactive, so a
// product under a soft-deleted category never leaks to public listings.
const PRODUCT_SELECT_PUBLIC =
  '*, category:categories!inner(*), product_images(*), product_tags(tag:tags(*))';

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) {
      console.warn('Supabase getCategories failed:', error.message);
      return mockCategories;
    }
    // Supabase is authoritative: return whatever it has, even an empty list.
    return (data ?? []).map((row) => mapCategory(row as DBCategory));
  }
  return mockCategories;
}

/**
 * Admin-only category fetch: bypasses the `active=true` filter so soft-deleted
 * categories remain manageable from the admin panel and product form select.
 */
export async function getAllCategoriesForAdmin(): Promise<Category[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) {
      console.warn('Supabase getAllCategoriesForAdmin failed:', error.message);
      return mockCategories;
    }
    return (data ?? []).map((row) => mapCategory(row as DBCategory));
  }
  return mockCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();
    if (error) {
      console.warn('Supabase getCategoryBySlug failed:', error.message);
      return mockCategories.find((c) => c.slug === slug) ?? null;
    }
    // Supabase is the source of truth; do not substitute mock rows on miss.
    return data ? mapCategory(data as DBCategory) : null;
  }
  return mockCategories.find((c) => c.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */

interface ProductQuery {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

export async function getProducts(options: ProductQuery = {}): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT_PUBLIC)
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (options.categorySlug) {
      const cat = await getCategoryBySlug(options.categorySlug);
      if (!cat) return [];
      query = query.eq('category_id', cat.id);
    }

    if (options.featuredOnly) query = query.eq('featured', true);

    if (options.search?.trim()) {
      // The DB index is built over `unaccent(...)`, so we must strip the
      // same diacritics from the user's query for "çadır" to match "cadir".
      const term = stripDiacritics(options.search.trim());
      query = query.textSearch('search_vector', term, {
        type: 'websearch',
        config: 'simple',
      });
    }

    if (options.limit) {
      const start = options.offset ?? 0;
      query = query.range(start, start + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getProducts failed:', error.message);
      // Fall through to the mock list only when Supabase actually errored.
    } else {
      return (data ?? []).map((row) => mapProduct(row as DBProductWithRelations));
    }
  }

  // ---- mock fallback (Supabase unconfigured or errored) ----------------
  let list = mockProducts.filter((p) => p.active !== false);

  if (options.categorySlug) {
    const cat = mockCategories.find((c) => c.slug === options.categorySlug);
    if (!cat) return [];
    list = list.filter((p) => p.category_id === cat.id);
  }
  if (options.featuredOnly) list = list.filter((p) => p.featured);
  if (options.search?.trim()) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (options.offset !== undefined && options.limit !== undefined) {
    list = list.slice(options.offset, options.offset + options.limit);
  } else if (options.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProducts({ featuredOnly: true, limit });
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT_PUBLIC)
      .eq('active', true)
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(limit);
    if (error) {
      console.warn('Supabase getRelatedProducts failed:', error.message);
    } else {
      return (data ?? []).map((row) => mapProduct(row as DBProductWithRelations));
    }
  }
  return mockProducts
    .filter(
      (p) =>
        p.active !== false &&
        p.category_id === product.category_id &&
        p.id !== product.id,
    )
    .slice(0, limit);
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: Product; category: Category } | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT_PUBLIC)
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();
    if (error) {
      console.warn('Supabase getProductBySlug failed:', error.message);
      // Fall through to the mock lookup only when Supabase actually errored.
    } else if (!data) {
      return null;
    } else {
      const row = data as DBProductWithRelations;
      const product = mapProduct(row);
      // The `!inner` join guarantees `category` is present on a successful row.
      const category = row.category ? mapCategory(row.category) : null;
      return category ? { product, category } : null;
    }
  }

  const product = mockProducts.find((p) => p.slug === slug && p.active !== false);
  if (!product) return null;
  const category = mockCategories.find((c) => c.id === product.category_id);
  if (!category) return null;
  return { product, category };
}

/* ------------------------------------------------------------------ */
/*  Tags                                                               */
/* ------------------------------------------------------------------ */

export async function getTags(): Promise<Tag[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('tags').select('*').order('name');
    if (error) {
      console.warn('Supabase getTags failed:', error.message);
      return [];
    }
    return (data ?? []).map((row) => mapTag(row as DBTag));
  }
  return [];
}

/* ------------------------------------------------------------------ */
/*  Site settings                                                      */
/* ------------------------------------------------------------------ */

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) {
      console.warn('Supabase getSiteSettings failed:', error.message);
      return mockSiteSettings;
    }
    // Supabase is authoritative once configured: an empty table yields {}.
    const out: SiteSettings = {};
    for (const row of (data ?? []) as DBSiteSetting[]) {
      out[row.key] = row.value as never;
    }
    return out;
  }
  return mockSiteSettings;
}

/**
 * Upsert a single site_settings row by key. Stores the value under the
 * `value` JSON column. Returns true on success, false otherwise.
 *
 * Mock mode (no Supabase): no-op success — the change won't persist.
 */
export async function saveSiteSetting(
  key: string,
  value: unknown,
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return true;
  const { error } = await supabase
    .from('site_settings')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert({ key, value: value as any }, { onConflict: 'key' });
  if (error) {
    console.warn('Supabase saveSiteSetting failed:', error.message);
    return false;
  }
  return true;
}
