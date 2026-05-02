export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: DBCategory;
        Insert: Partial<DBCategory> & Pick<DBCategory, "name" | "slug">;
        Update: Partial<DBCategory>;
      };
      products: {
        Row: DBProduct;
        Insert: Partial<DBProduct> & Pick<DBProduct, "name" | "slug" | "category_id">;
        Update: Partial<DBProduct>;
      };
      product_images: {
        Row: DBProductImage;
        Insert: Partial<DBProductImage> & Pick<DBProductImage, "product_id" | "url">;
        Update: Partial<DBProductImage>;
      };
      tags: {
        Row: DBTag;
        Insert: Partial<DBTag> & Pick<DBTag, "name" | "slug">;
        Update: Partial<DBTag>;
      };
      product_tags: {
        Row: { product_id: string; tag_id: string };
        Insert: { product_id: string; tag_id: string };
        Update: { product_id?: string; tag_id?: string };
      };
      admin_users: {
        Row: DBAdminUser;
        Insert: Partial<DBAdminUser> & Pick<DBAdminUser, "user_id" | "email">;
        Update: Partial<DBAdminUser>;
      };
      site_settings: {
        Row: DBSiteSetting;
        Insert: Partial<DBSiteSetting> & Pick<DBSiteSetting, "key" | "value">;
        Update: Partial<DBSiteSetting>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

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
  specs: Json;
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
  value: Json;
  description: string;
  updated_at: string;
}

export interface DBAdminUser {
  user_id: string;
  email: string;
  display_name: string | null;
  role: "admin";
  created_at: string;
}

export interface DBProductWithRelations extends DBProduct {
  category?: DBCategory | null;
  product_images?: DBProductImage[];
  product_tags?: { tag: DBTag }[];
}
