// Server-only wrapper around Supabase's GoTrue Admin API for listing,
// banning/unbanning, and deleting users. Only ever called from
// src/app/api/admin/* routes, which are gated by requireAdmin().

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured(): asserts SUPABASE_URL is string {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
}

export interface AdminUserRecord {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  role?: "user" | "admin";
}

async function admin(path: string, init: RequestInit = {}) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.msg || body?.error_description || `Admin API request failed (${res.status})`);
  }
  return body;
}

export async function listAuthUsers(page = 1, perPage = 200): Promise<AdminUserRecord[]> {
  const body = await admin(`/users?page=${page}&per_page=${perPage}`, { method: "GET" });
  return (body.users ?? []) as AdminUserRecord[];
}

export async function setUserBanned(userId: string, banned: boolean) {
  // "876000h" (100 years) approximates a permanent ban; "none" clears it.
  return admin(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ ban_duration: banned ? "876000h" : "none" }),
  });
}

export async function deleteAuthUser(userId: string) {
  return admin(`/users/${userId}`, { method: "DELETE" });
}
