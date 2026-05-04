export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DBCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DBProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type DBTag = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  created_at: string;
};

export type DBProduct = {
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
};

export type DBSiteSetting = {
  key: string;
  value: Json;
  description: string;
  updated_at: string;
};

export type DBAdminUser = {
  user_id: string;
  email: string;
  display_name: string | null;
  role: "admin";
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      categories: {
        Row: DBCategory;
        Insert: Partial<DBCategory> & Pick<DBCategory, "name" | "slug">;
        Update: Partial<DBCategory>;
        Relationships: [];
      };
      products: {
        Row: DBProduct;
        Insert: Partial<DBProduct> & Pick<DBProduct, "name" | "slug" | "category_id">;
        Update: Partial<DBProduct>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      product_images: {
        Row: DBProductImage;
        Insert: Partial<DBProductImage> & Pick<DBProductImage, "product_id" | "url">;
        Update: Partial<DBProductImage>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: DBTag;
        Insert: Partial<DBTag> & Pick<DBTag, "name" | "slug">;
        Update: Partial<DBTag>;
        Relationships: [];
      };
      product_tags: {
        Row: { product_id: string; tag_id: string };
        Insert: { product_id: string; tag_id: string };
        Update: { product_id?: string; tag_id?: string };
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_users: {
        Row: DBAdminUser;
        Insert: Partial<DBAdminUser> & Pick<DBAdminUser, "user_id" | "email">;
        Update: Partial<DBAdminUser>;
        Relationships: [];
      };
      site_settings: {
        Row: DBSiteSetting;
        Insert: Partial<DBSiteSetting> & Pick<DBSiteSetting, "key" | "value">;
        Update: Partial<DBSiteSetting>;
        Relationships: [];
      };
      product_reviews: {
        Row: DBProductReview;
        Insert: Pick<DBProductReview, "product_id" | "name" | "surname" | "rating" | "body">;
        Update: Partial<DBProductReview>;
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type DBProductReview = {
  id: string;
  product_id: string;
  name: string;
  surname: string;
  rating: number;
  body: string;
  approved: boolean;
  created_at: string;
};

export type DBProductWithRelations = DBProduct & {
  category?: DBCategory | null;
  product_images?: DBProductImage[];
  product_tags?: { tag: DBTag }[];
};
