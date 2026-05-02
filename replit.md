# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Sarıçam Aydoğan Kamp & Balık — `artifacts/saricam-aydogan`
Turkish e-commerce storefront for camping & fishing equipment. No online checkout; all CTAs route to WhatsApp.

**Stack:** React + Vite + TypeScript + Wouter + Supabase + react-helmet-async + Framer Motion + Tailwind v4

**Design System (Meridian editorial — applied 2026-05):**
- Fonts: Fraunces (serif, light/300 headings + italic accents) + Inter (sans, body)
- Primary: Deep Pine Green `hsl(149 43% 17%)`, Secondary: Warm Ember `hsl(38 94% 45%)`
- Background: Warm Parchment `hsl(38 30% 93%)`, Foreground: Slate Charcoal `hsl(213 30% 17%)`
- Editorial utility classes (in `src/index.css`): `.eyebrow` (uppercase 0.22em tracking), `.editorial-heading` (Fraunces light), `.link-hairline` (underlined CTA), `.section`/`.section-sm` (24/40 vertical rhythm), `.product-card` (bare 4/5 ratio), `.footer-surface` (#111), `.section-accent-line`
- All page heroes use shared `<PageHero>` (cinematic image bg + gradient overlay + breadcrumb + eyebrow + Fraunces title + italic accent)
- Section headings use shared `<SectionHeading>` (eyebrow + title + italicAccent + subtitle + align)
- Dark CTA bands: `bg-[#111111]` + white text + amber eyebrow + italic Fraunces accent
- Shadow system: `shadow-card` + `shadow-card-hover` CSS vars for elevation
- Utilities: `.glass`, `.glass-dark`, `.glass-primary`, `.gradient-outdoor`, `.gradient-ember`, `.eyebrow`, `.btn-cta`, `.btn-cta-amber`, `.btn-ghost-white`, `.badge-category`, `.product-card`, `.hover-lift`, `.footer-surface`, `.skeleton`
- Animation: Framer Motion `whileInView` fade-up, parallax hero, hover lift (-5px + shadow), micro-interactions on icons, scroll indicator pulse, WhatsApp FAB pulse ring

**Category system:**
- 7 categories: Kamp Çadırları, Olta & Balık Malzemeleri, Kamp Ekipmanları, Aydınlatma, Termos & Soğutucu, Olta Aksesuarları, Outdoor & Trekking
- Category metadata in `src/lib/categoryMeta.ts`: per-slug SEO title, description, hero title/subtitle, info text, WhatsApp message, icon, keyword tags
- `getCategoryMeta(slug?)` helper returns full metadata or fallback for "all products" view
- 25 mock products across 7 categories in `src/lib/mockData.ts`

**Catalog page (`/urunler`, `/urunler/:kategori`):**
- Category hero: image background with dark gradient overlay, breadcrumb, title, subtitle, SEO keyword chips
- Desktop: sticky left sidebar (search, category pills with emoji+count, WhatsApp CTA box)
- Mobile: sticky horizontal scroll category pills + collapsible filter drawer
- Grid/List view toggle, URL-synced pagination (9 per page), debounced search
- SkeletonCard loading state, EmptyState with WhatsApp link
- WhatsApp CTA strip below product grid (category-specific message)
- Category info section with natural-language SEO text + keyword tags

**Storefront routes (Turkish):**
- `/` — Anasayfa (hero, featured products, categories, brand values)
- `/urunler` — Ürün kataloğu (search, grid/list toggle, pagination, URL query-param sync)
- `/urunler/:kategori` — Category-filtered catalog
- `/urun/:slug` — Product detail (gallery, specs, WhatsApp CTA)
- `/hakkimizda` — About page
- `/iletisim` — Contact (3 tiles, OSM map, working hours, directions, LocalBusiness JSON-LD)
- `/sss` — FAQ (5 sections, single-open accordion, FAQPage JSON-LD)
- `/kvkk` + `/gizlilik` — Privacy / KVKK policy (10 sections, plain Turkish, no legalese)
- `/teslimat` — Shipping & order info (4-step process, delivery times, payment options)
- `/magaza-politikasi` — Store policy (3 promise pillars, return matrix, 14-day return window)
- `/kategori/:slug` — Per-category buying guide (6 tips + FAQ + cross-links to /urunler/:slug)
- `*` — 404 fallback

**Corporate page conventions:**
- All corporate pages use the shared `src/components/PageHero.tsx` (breadcrumbs + eyebrow badge + icon + dark-green hero), `<SEO>` component, and `buildBreadcrumbSchema()`.
- Single source of truth for business contact data: `SITE_PHONE_HUMAN`, `SITE_EMAIL`, `SITE_ADDRESS_FULL`, `SITE_HOURS_HUMAN` exported from `src/lib/schemas.ts`. Footer + Contact page use these as fallbacks when `useSiteSettings()` returns empty values; LocalBusiness/Organization JSON-LD use the same constants. Update `schemas.ts` to change defaults everywhere.
- `/kategori/:slug` breadcrumbs use the suffix "— Alım Rehberi" to differentiate from the `/urunler/:kategori` catalog page in search results.

**Admin panel routes:**
- `/admin/login` — Password-protected login (requires `VITE_ADMIN_PASSWORD` env var; shows config error if not set)
- `/admin/urunler` — Product list (search, category filter, featured toggle, inline sort, edit/delete)
- `/admin/urunler/yeni` — New product form
- `/admin/urunler/:id/duzenle` — Edit product form
- `/admin/kategoriler` — Category management (CRUD, image preview)

**Admin features:**
- Auth: Supabase Auth (`signInWithPassword`) gated by `admin_users` membership; falls back to a single `VITE_ADMIN_PASSWORD` shared password when Supabase isn't configured
- Soft delete everywhere: products & categories use `active=false` instead of hard delete (avoids FK conflicts, reversible from the admin UI)
- Status filter (Tümü / Yayında / Gizli) and inline yayın switch on the products table; "Gizli" badge on inactive rows
- Numeric price + old_price + price_label override; stock count (auto-derived `stock_status`: 0 → out_of_stock, 1-10 → low_stock, >10 → in_stock)
- Tag picker (multi-select chips) re-syncs `product_tags` on save; image list re-syncs `product_images` (first image marked `is_primary=true`)
- SEO meta_title / meta_description fields, short_description for catalog cards
- Supabase Storage image upload + sortable URL list, dynamic key-value specs editor
- Confirmation dialogs, toast notifications, responsive sidebar

**Backend (Supabase):**
- Versioned migrations in `supabase/migrations/0001_init.sql` (apply via Dashboard → SQL editor; CLI not used)
- Seed data in `supabase/seed.sql` (7 categories, 17 products, tags, product_images, site_settings)
- Setup walkthrough in `supabase/README.md`
- Tables: `categories`, `products`, `product_images`, `tags`, `product_tags`, `admin_users`, `site_settings` — all with RLS enabled
- RLS model: anon can SELECT only `active=true` rows; full CRUD for users in `admin_users` via `is_admin()` (security definer, granted to anon/authenticated)
- TypeScript types: `src/lib/database.types.ts` mirrors the DB; `src/lib/data.ts` maps DB rows → app `Product`/`Category` shapes via `PRODUCT_SELECT = "*, category:categories(*), product_images(*), product_tags(tag:tags(*))"`

**Environment variables:**
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_WHATSAPP_NUMBER` — WhatsApp number (default: `905551112233`)
- `VITE_ADMIN_PASSWORD` — Dev-only fallback password when Supabase isn't configured

**Supabase Storage:** `product-images` bucket for admin-uploaded images

**Fallback:** When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing, the data layer transparently falls back to rich Turkish mock data (7 categories, 17 products) and the admin login uses the shared `VITE_ADMIN_PASSWORD`.
