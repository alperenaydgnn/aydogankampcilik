-- =====================================================================
-- product_reviews — gerçek müşteri yorum sistemi
-- =====================================================================
-- RLS: herkese onaylı yorum okuma + anonim ekleme, admin tam yetki

create table public.product_reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  name        text not null check (char_length(trim(name))    >= 2),
  surname     text not null check (char_length(trim(surname)) >= 2),
  rating      smallint not null check (rating between 1 and 5),
  body        text not null check (char_length(trim(body))    >= 10),
  approved    boolean not null default true,
  created_at  timestamptz not null default now()
);

create index product_reviews_product_idx
  on public.product_reviews (product_id, approved, created_at desc);

-- RLS
alter table public.product_reviews enable row level security;

create policy "product_reviews_public_read"
  on public.product_reviews for select
  using (approved = true);

create policy "product_reviews_anon_insert"
  on public.product_reviews for insert
  with check (true);

create policy "product_reviews_admin_all"
  on public.product_reviews for all
  using (public.is_admin()) with check (public.is_admin());
