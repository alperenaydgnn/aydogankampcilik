import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger";

export type StoredPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  keywords: string[];
  readingMinutes: number;
  coverUrl: string;
  coverPrompt: string;
  content: string;
  author: string;
  publishedAt: string;
  aiModel: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const MAX_POSTS = 100;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadPosts(): StoredPost[] {
  try {
    ensureDir();
    if (!fs.existsSync(POSTS_FILE)) return [];
    const raw = fs.readFileSync(POSTS_FILE, "utf8");
    return JSON.parse(raw) as StoredPost[];
  } catch (err) {
    logger.error({ err }, "postStore: failed to load posts");
    return [];
  }
}

export function upsertPost(post: StoredPost): void {
  try {
    ensureDir();
    const posts = loadPosts();
    const idx = posts.findIndex((p) => p.slug === post.slug);
    if (idx >= 0) {
      posts[idx] = post;
    } else {
      posts.unshift(post);
    }
    const trimmed = posts.slice(0, MAX_POSTS);
    fs.writeFileSync(POSTS_FILE, JSON.stringify(trimmed, null, 2), "utf8");
    logger.info({ slug: post.slug }, "postStore: upserted post");
  } catch (err) {
    logger.error({ err }, "postStore: failed to upsert post");
  }
}

export function getPostBySlug(slug: string): StoredPost | undefined {
  return loadPosts().find((p) => p.slug === slug);
}
