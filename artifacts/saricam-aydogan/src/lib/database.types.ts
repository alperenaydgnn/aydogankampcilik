/**
 * Hand-written, simplified type stubs that mirror the Supabase schema in
 * `supabase/migrations/0001_init.sql`. When the project is linked to a real
 * Supabase instance, regenerate via:
 *
 *   npx supabase gen types typescript --linked --schema public \
 *     > artifacts/saricam-aydogan/src/lib/database.types.ts
 */

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface DBTag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  created_at: string;
}

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  short_description: string;
  specs: Record<string, string>;
  price: number | null;
  old_price: number | null;
  price_label: string | null;
  stock: number;
  is_new: boolean;
  featured: boolean;
  active: boolean;
  whatsapp_message: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBSiteSetting {
  key: string;
  value: unknown;
  description: string;
  updated_at: string;
}

export interface DBAdminUser {
  user_id: string;
  email: string;
  display_name: string | null;
  role: 'admin';
  created_at: string;
}

/** Joined query shapes used by the data layer */
export interface DBProductWithRelations extends DBProduct {
  category?: DBCategory | null;
  product_images?: DBProductImage[];
  product_tags?: { tag: DBTag }[];
}
