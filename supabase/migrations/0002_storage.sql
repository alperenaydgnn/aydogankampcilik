-- =====================================================================
-- Sarıçam Aydoğan — product-images storage bucket
-- =====================================================================
-- Creates the `product-images` bucket and sets RLS policies:
--   • Public read  → anyone can fetch CDN URLs
--   • Admin write  → only is_admin() users can upload / delete
-- Run after 0001_init.sql (depends on is_admin() function).
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,   -- 5 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public SELECT (CDN / presigned read)
create policy "product_images_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Admin INSERT
create policy "product_images_storage_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

-- Admin UPDATE
create policy "product_images_storage_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

-- Admin DELETE
create policy "product_images_storage_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
