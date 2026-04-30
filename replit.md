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

**Design System:**
- Fonts: Fraunces (serif, headings) + Plus Jakarta Sans (sans, body)
- Primary: Deep Pine Green `hsl(149 43% 17%)`, Secondary: Warm Ember `hsl(38 94% 45%)`
- Background: Warm Parchment `hsl(38 30% 93%)`, Foreground: Slate Charcoal `hsl(213 30% 17%)`
- Base radius: `0.75rem` (scaled up to `rounded-2xl`/`rounded-3xl` for cards & CTAs)
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
- `*` — 404 fallback

**Admin panel routes:**
- `/admin/login` — Password-protected login (requires `VITE_ADMIN_PASSWORD` env var; shows config error if not set)
- `/admin/urunler` — Product list (search, category filter, featured toggle, inline sort, edit/delete)
- `/admin/urunler/yeni` — New product form
- `/admin/urunler/:id/duzenle` — Edit product form
- `/admin/kategoriler` — Category management (CRUD, image preview)

**Admin features:**
- Session-based auth via `sessionStorage` + `VITE_ADMIN_PASSWORD` env var
- Supabase Storage image upload (drag-drop or file picker)
- Dynamic key-value specs editor
- Sortable image URL list with thumbnail preview
- Confirmation dialogs for deletes, toast notifications for all actions
- Responsive sidebar layout (collapsible on mobile)

**Environment variables:**
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_WHATSAPP_NUMBER` — WhatsApp number (default: `905551112233`)
- `VITE_ADMIN_PASSWORD` — Admin panel password (default: `admin123`)

**Supabase tables:** `categories(id, name, slug, description, image_url, created_at)`, `products(id, name, slug, category_id, description, specs jsonb, price_label, images text[], featured bool, whatsapp_message, created_at)`

**Supabase Storage:** `product-images` bucket for admin-uploaded images

**Fallback:** All data falls back to rich Turkish mock data (4 categories, 12 products) when Supabase env vars are missing.
