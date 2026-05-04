-- =====================================================================
-- Sarıçam Aydoğan — blog_posts table + blog-covers storage bucket
-- Depends on: 0001_init.sql (set_updated_at trigger, is_admin())
-- =====================================================================

-- ---------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------
create table public.blog_posts (
  slug              text primary key,
  title             text not null,
  excerpt           text not null default '',
  category          text not null default 'rehber',
  tags              text[] not null default '{}',
  keywords          text[] not null default '{}',
  reading_minutes   integer not null default 6,
  cover_url         text not null default '',
  cover_storage_path text,
  content           text not null default '',
  author            text not null default 'Aydoğan Kampçılık Editör',
  published_at      timestamptz not null default now(),
  ai_model          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index blog_posts_published_idx on public.blog_posts (published_at desc);
create index blog_posts_category_idx  on public.blog_posts (category);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

create policy "blog_posts_public_read"
  on public.blog_posts for select
  using (true);

create policy "blog_posts_admin_all"
  on public.blog_posts for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- blog-covers storage bucket
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-covers',
  'blog-covers',
  true,
  3145728,  -- 3 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read
create policy "blog_covers_public_read"
  on storage.objects for select
  using (bucket_id = 'blog-covers');

-- Admin insert (frontend admin + service role bypasses RLS automatically)
create policy "blog_covers_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'blog-covers' and public.is_admin());

create policy "blog_covers_service_insert"
  on storage.objects for insert
  with check (bucket_id = 'blog-covers' and auth.role() = 'service_role');

create policy "blog_covers_admin_update"
  on storage.objects for update
  using (bucket_id = 'blog-covers' and (public.is_admin() or auth.role() = 'service_role'));

create policy "blog_covers_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'blog-covers' and (public.is_admin() or auth.role() = 'service_role'));
