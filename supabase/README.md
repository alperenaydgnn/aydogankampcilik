# Supabase Setup — Sarıçam Aydoğan Kamp & Balık

Bu dizin, frontend artifact'inin (`artifacts/saricam-aydogan`) bağlandığı Supabase backend'i için **migration** ve **seed** dosyalarını içerir.

## Yapı

```
supabase/
├── migrations/
│   └── 0001_init.sql   # categories, products, product_images, tags,
│                       # product_tags, site_settings, admin_users + RLS
└── seed.sql            # 7 kategori + 16 ürün + tag/site_settings örneği
```

## Şema özeti

| Tablo            | Amaç                                                        |
|------------------|-------------------------------------------------------------|
| `categories`     | Ürün kategorileri (slug bazlı, sort_order, active)         |
| `products`       | Ana ürün katalogu — soft delete (`active`), full-text search |
| `product_images` | Ürün başına çoklu görsel (sort_order, is_primary)          |
| `tags`           | Etiketler (yeni, indirimli, öne çıkan, …)                  |
| `product_tags`   | Ürün ↔ etiket M2M                                          |
| `site_settings`  | Site geneli key/value config (telefon, hero, sosyal vb.)   |
| `admin_users`    | `auth.users`'a bağlı admin rol kaydı                        |

### Önemli karakteristikler

- **Soft delete**: hiçbir public sorgu sert silmez; `active = false` ile gizleme.
- **Slug indexleri**: `products.slug` ve `categories.slug` `unique`, ek index gerekmez (unique + b-tree).
- **Full-text search**: `products.search_vector` (`name` A, `short_description` B, `description` C) GIN indexli, Türkçe karakterler için `unaccent`.
- **RLS**: anon yalnız `active = true` kayıtları okur; CRUD sadece `is_admin()` (yani `admin_users` tablosunda satırı olan auth user) için açıktır.
- **`updated_at` trigger**: `categories`, `products`, `site_settings` üzerinde otomatik güncellenir.

## Kurulum

### 1. Supabase projesini bağla

```bash
# Yerelde Supabase CLI ile (önerilen)
npx supabase link --project-ref <project-ref>
```

### 2. Migration'ı uygula

```bash
npx supabase db push           # supabase/migrations/*.sql çalıştırır
# veya manuel:
psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_init.sql
```

### 3. Seed verisini yükle

```bash
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

> Seed idempotenttir: ürünler `on conflict (slug) do nothing` ile eklenir; kategori, tag ve `site_settings` upsert'tir; `product_images` ve `product_tags` her seferinde silinip yeniden eklenir.

### 4. İlk admin kullanıcıyı oluştur

Supabase dashboard → **Authentication → Users → Add user** ile bir kullanıcı oluştur (örn. `admin@saricamaydogan.com`) ve sonra SQL editor'de:

```sql
insert into public.admin_users (user_id, email, display_name)
values (
  (select id from auth.users where email = 'admin@saricamaydogan.com'),
  'admin@saricamaydogan.com',
  'Site Yöneticisi'
);
```

Bu satır eklenmeden RLS yazma izinleri kapalıdır — admin paneli kullanılamaz.

### 5. Frontend env değişkenleri

`artifacts/saricam-aydogan/.env` (veya Replit Secrets):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Env değişkenleri yoksa frontend mock veriye düşer; yine de hatasız çalışır.

## Tip üretimi (opsiyonel)

```bash
npx supabase gen types typescript --linked --schema public \
  > artifacts/saricam-aydogan/src/lib/database.types.ts
```

Şu an repo, elle yazılmış sadeleştirilmiş bir `database.types.ts` içerir; auto-generate edildiğinde dosya değiştirilmelidir.

## Genişletme notları

- Sipariş/sepet için yeni `orders`, `order_items` tablolarını ileride aynı RLS pattern'i ile ekleyebilirsin.
- Çoklu dil için `category_translations`, `product_translations` (locale, parent_id) tablolarına geçiş kolaydır.
- Görsel yükleme: `product_images.url` mevcutta dış URL bekler; Supabase Storage entegre edilince yine string URL geleceğinden frontend tarafı değişmez.
