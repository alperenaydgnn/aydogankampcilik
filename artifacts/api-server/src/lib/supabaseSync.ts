import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger";
import type { StoredPost } from "./postStore";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;
  // Accept both SUPABASE_URL and VITE_SUPABASE_URL so adding a separate
  // non-VITE secret is optional — only SUPABASE_SERVICE_ROLE_KEY is new.
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/** Download cover image from a URL and upload to blog-covers bucket.
 *  Returns the Supabase public CDN URL on success, null on any failure. */
async function uploadCover(
  sb: SupabaseClient,
  slug: string,
  sourceUrl: string,
): Promise<string | null> {
  try {
    const resp = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(20_000),
    });
    if (!resp.ok) return null;

    const buffer = await resp.arrayBuffer();
    const contentType = resp.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const storagePath = `${slug}.${ext}`;

    const { error } = await sb.storage
      .from("blog-covers")
      .upload(storagePath, buffer, { contentType, upsert: true });

    if (error) {
      logger.warn({ err: error.message, slug }, "supabaseSync: cover upload failed");
      return null;
    }

    const { data } = sb.storage.from("blog-covers").getPublicUrl(storagePath);
    logger.info({ slug, storagePath }, "supabaseSync: cover uploaded");
    return data.publicUrl;
  } catch (err) {
    logger.warn({ err, slug }, "supabaseSync: cover fetch/upload error");
    return null;
  }
}

/** Sync a blog post (and its cover image) to Supabase.
 *  Silently no-ops when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are missing. */
export async function syncPostToSupabase(post: StoredPost): Promise<void> {
  const sb = getClient();
  if (!sb) return;

  let coverUrl = post.coverUrl;
  let coverStoragePath: string | null = null;

  const publicUrl = await uploadCover(sb, post.slug, post.coverUrl);
  if (publicUrl) {
    coverUrl = publicUrl;
    const parts = publicUrl.split("/");
    coverStoragePath = parts[parts.length - 1] ?? null;
  }

  const { error } = await sb.from("blog_posts").upsert(
    {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      keywords: post.keywords,
      reading_minutes: post.readingMinutes,
      cover_url: coverUrl,
      cover_storage_path: coverStoragePath,
      content: post.content,
      author: post.author,
      published_at: post.publishedAt,
      ai_model: post.aiModel,
    },
    { onConflict: "slug" },
  );

  if (error) {
    logger.error({ err: error.message, slug: post.slug }, "supabaseSync: upsert failed");
  } else {
    logger.info({ slug: post.slug, coverUrl }, "supabaseSync: post synced");
  }
}

/** Lightweight ping to keep the Supabase free-tier project alive.
 *  Uses the anon key so the service role key is not required for pings. */
export async function pingSupabase(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    logger.debug("supabaseSync: ping skipped — SUPABASE_URL not set");
    return;
  }

  try {
    const resp = await fetch(
      `${url}/rest/v1/site_settings?select=key&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
    logger.info({ status: resp.status }, "supabaseSync: keep-alive ping OK");
  } catch (err) {
    logger.warn({ err }, "supabaseSync: keep-alive ping failed");
  }
}
