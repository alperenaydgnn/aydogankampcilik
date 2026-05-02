-- =====================================================================
-- Sarıçam Aydoğan Kamp & Balık — initial schema
-- =====================================================================
-- Tables    : categories, products, product_images, tags, product_tags,
--             site_settings, admin_users
-- Strategy  : Soft-delete via `active` flag, slug-based public access,
--             RLS with public-read of `active = true` rows + admin CRUD
--             via `is_admin()` (admin_users-driven).
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";

-- ---------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table public.categories (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  description  text not null default '',
  image_url    text not null default '',
  sort_order   integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index categories_active_idx on public.categories (active);
create index categories_sort_idx   on public.categories (sort_order);
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table public.products (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  category_id       uuid not null references public.categories(id) on delete restrict,
  description       text not null default '',
  short_description text not null default '',
  specs             jsonb not null default '{}'::jsonb,
  price             numeric(12,2),
  old_price         numeric(12,2),
  price_label       text,                       -- override (e.g. "Fiyat için sorunuz")
  stock             integer not null default 0, -- 0 = out, 1-10 = low, >10 = in_stock
  is_new            boolean not null default false,
  featured          boolean not null default false,
  active            boolean not null default true,
  whatsapp_message  text,
  meta_title        text,
  meta_description  text,
  search_vector     tsvector generated always as (
    setweight(to_tsvector('simple', unaccent(coalesce(name, ''))),              'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(short_description, ''))), 'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(description, ''))),       'C')
  ) stored,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index products_slug_idx     on public.products (slug);
create index products_category_idx on public.products (category_id);
create index products_active_idx   on public.products (active);
create index products_featured_idx on public.products (featured) where featured = true;
create index products_created_idx  on public.products (created_at desc);
create index products_search_idx   on public.products using gin (search_vector);
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------
create table public.product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  alt_text    text not null default '',
  sort_order  integer not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index product_images_product_idx on public.product_images (product_id, sort_order);
create unique index product_images_one_primary
  on public.product_images (product_id) where is_primary = true;

-- ---------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------
create table public.tags (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  color      text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- product_tags (M2M)
-- ---------------------------------------------------------------------
create table public.product_tags (
  product_id  uuid not null references public.products(id) on delete cascade,
  tag_id      uuid not null references public.tags(id)     on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (product_id, tag_id)
);
create index product_tags_tag_idx on public.product_tags (tag_id);

-- ---------------------------------------------------------------------
-- site_settings (key/value, JSON value)
-- ---------------------------------------------------------------------
create table public.site_settings (
  key         text primary key,
  value       jsonb not null,
  description text not null default '',
  updated_at  timestamptz not null default now()
);
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- admin_users  (role gate over Supabase Auth users)
-- ---------------------------------------------------------------------
create table public.admin_users (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null default 'admin' check (role in ('admin')),
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- is_admin() helper — used by RLS policies
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.tags            enable row level security;
alter table public.product_tags    enable row level security;
alter table public.site_settings   enable row level security;
alter table public.admin_users     enable row level security;

-- Public (anon + authenticated) — read only ACTIVE rows
create policy "categories_public_read"
  on public.categories for select
  using (active = true);

create policy "products_public_read"
  on public.products for select
  using (active = true);

create policy "product_images_public_read"
  on public.product_images for select
  using (exists (
    select 1 from public.products p
    where p.id = product_id and p.active = true
  ));

create policy "tags_public_read"
  on public.tags for select using (true);

create policy "product_tags_public_read"
  on public.product_tags for select
  using (exists (
    select 1 from public.products p
    where p.id = product_id and p.active = true
  ));

create policy "site_settings_public_read"
  on public.site_settings for select using (true);

-- Admin — full CRUD via is_admin()
create policy "categories_admin_all"
  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy "products_admin_all"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());

create policy "product_images_admin_all"
  on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());

create policy "tags_admin_all"
  on public.tags for all
  using (public.is_admin()) with check (public.is_admin());

create policy "product_tags_admin_all"
  on public.product_tags for all
  using (public.is_admin()) with check (public.is_admin());

create policy "site_settings_admin_all"
  on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- admin_users — read self / admin manages
create policy "admin_users_self_read"
  on public.admin_users for select
  using (auth.uid() = user_id);

create policy "admin_users_admin_all"
  on public.admin_users for all
  using (public.is_admin()) with check (public.is_admin());
