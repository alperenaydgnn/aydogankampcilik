#!/usr/bin/env node
// Seeds the very first admin user into public.admin_users.
//
// Usage:
//   SUPABASE_URL=...  SUPABASE_SERVICE_ROLE_KEY=...  \
//     node supabase/scripts/create-admin.mjs --email <email> [--display-name "Name"] [--create]
//
// Flags:
//   --email          (required) Email of the auth user to register as admin.
//   --display-name   (optional) Friendly name stored in admin_users.display_name.
//   --create         (optional) If the auth user does not exist, create it
//                    via the Supabase Admin API with a random password.
//                    The generated password is printed once to stdout.
//   --help, -h       Print this help text.
//
// Requires Node 18+ (uses global fetch). No npm install needed.

import { randomBytes } from "node:crypto";

const HELP = `Seed an admin into public.admin_users.

Usage:
  node supabase/scripts/create-admin.mjs --email <email> [--display-name "Name"] [--create]

Env:
  SUPABASE_URL                Project URL (https://<ref>.supabase.co)
  SUPABASE_SERVICE_ROLE_KEY   Service-role key (NEVER commit / ship to frontend)

Flags:
  --email          Email of the auth user to make admin (required)
  --display-name   Friendly name (optional)
  --create         Also create the auth user if missing (random password)
  --help, -h       Show this help
`;

function parseArgs(argv) {
  const out = { create: false };
  const takeValue = (flag, i) => {
    const v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) {
      console.error(`ERROR: ${flag} requires a value.`);
      process.exit(2);
    }
    return v;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      out.help = true;
    } else if (a === "--create") {
      out.create = true;
    } else if (a === "--email") {
      out.email = takeValue("--email", i);
      i++;
    } else if (a.startsWith("--email=")) {
      out.email = a.slice("--email=".length);
    } else if (a === "--display-name") {
      out.displayName = takeValue("--display-name", i);
      i++;
    } else if (a.startsWith("--display-name=")) {
      out.displayName = a.slice("--display-name=".length);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  if (out.email !== undefined && out.email.trim() === "") {
    console.error("ERROR: --email value is empty.");
    process.exit(2);
  }
  return out;
}

function die(msg, code = 1) {
  console.error(`ERROR: ${msg}`);
  process.exit(code);
}

async function readJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function findUserByEmail(baseUrl, headers, email) {
  // Admin API supports ?email= filter; fall back to scanning a page if needed.
  const direct = await fetch(
    `${baseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers },
  );
  if (direct.ok) {
    const body = await readJson(direct);
    const list = Array.isArray(body) ? body : body?.users ?? [];
    const hit = list.find((u) => (u?.email ?? "").toLowerCase() === email.toLowerCase());
    if (hit) return hit;
  }

  // Fallback: paginate.
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(
      `${baseUrl}/auth/v1/admin/users?page=${page}&per_page=200`,
      { headers },
    );
    if (!res.ok) {
      const body = await readJson(res);
      die(`Failed to list auth users (${res.status}): ${JSON.stringify(body)}`);
    }
    const body = await readJson(res);
    const list = Array.isArray(body) ? body : body?.users ?? [];
    if (!list.length) return null;
    const hit = list.find((u) => (u?.email ?? "").toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (list.length < 200) return null;
  }
  return null;
}

async function createAuthUser(baseUrl, headers, email) {
  const password = randomBytes(18).toString("base64url");
  const res = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  const body = await readJson(res);
  if (!res.ok) {
    die(`Failed to create auth user (${res.status}): ${JSON.stringify(body)}`);
  }
  return { user: body, password };
}

async function upsertAdminRow(baseUrl, headers, { userId, email, displayName }) {
  const res = await fetch(
    `${baseUrl}/rest/v1/admin_users?on_conflict=user_id`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([
        {
          user_id: userId,
          email,
          display_name: displayName ?? null,
        },
      ]),
    },
  );
  const body = await readJson(res);
  if (!res.ok) {
    die(`Failed to upsert admin_users row (${res.status}): ${JSON.stringify(body)}`);
  }
  return Array.isArray(body) ? body[0] : body;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }
  if (!args.email) die("--email is required. Use --help for usage.");

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) die("SUPABASE_URL env var is required.");
  if (!key) die("SUPABASE_SERVICE_ROLE_KEY env var is required.");

  const baseUrl = url.replace(/\/+$/, "");
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  console.log(`→ Looking up auth user for ${args.email} ...`);
  let user = await findUserByEmail(baseUrl, headers, args.email);

  let generatedPassword = null;
  if (!user) {
    if (!args.create) {
      die(
        `Auth user not found for ${args.email}. ` +
          `Create them in Supabase Dashboard → Authentication → Users, ` +
          `or re-run with --create to provision one with a random password.`,
      );
    }
    console.log(`→ Auth user not found, creating one (--create) ...`);
    const created = await createAuthUser(baseUrl, headers, args.email);
    user = created.user;
    generatedPassword = created.password;
  }

  if (!user?.id) die(`Unexpected: auth user has no id. Got: ${JSON.stringify(user)}`);

  console.log(`→ Upserting admin_users row for ${user.id} ...`);
  const row = await upsertAdminRow(baseUrl, headers, {
    userId: user.id,
    email: args.email,
    displayName: args.displayName,
  });

  console.log("");
  console.log("✓ Admin ready:");
  console.log(`    user_id      = ${row?.user_id ?? user.id}`);
  console.log(`    email        = ${row?.email ?? args.email}`);
  console.log(`    display_name = ${row?.display_name ?? args.displayName ?? "(null)"}`);
  if (generatedPassword) {
    console.log("");
    console.log("⚠  A new auth user was created. Save this password — it is shown only once:");
    console.log(`    password     = ${generatedPassword}`);
    console.log("   Have the user sign in once and rotate it from the dashboard.");
  }
}

main().catch((err) => {
  console.error("ERROR:", err?.stack || err);
  process.exit(1);
});
