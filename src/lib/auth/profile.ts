// Server-only helpers for the `profiles` table (id, email, role). Only ever
// called from route handlers / server components — talks to Supabase's
// PostgREST with the service role key, which bypasses RLS by design since
// there are no public policies on this table.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export interface Profile {
  id: string;
  email: string | null;
  role: "user" | "admin";
}

function assertConfigured(): asserts SUPABASE_URL is string {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
}

async function rest(path: string, init: RequestInit) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase request failed (${res.status}): ${text}`);
  }
  return res.json();
}

// Called right after a successful login/register so every authenticated
// user has a profiles row. Existing rows (and their role) are left alone —
// this only ever inserts, it never resets an admin back to "user".
export async function ensureProfile(user: { id: string; email: string | null }): Promise<void> {
  await rest("/profiles", {
    method: "POST",
    headers: { Prefer: "return=minimal,resolution=ignore-duplicates" },
    body: JSON.stringify({ id: user.id, email: user.email, role: "user" }),
  }).catch(async () => {
    // ignore-duplicates can still 409 on some PostgREST versions if the
    // unique constraint fires before the ignore kicks in; fall back to a
    // plain upsert of just the email (never touch role).
    await rest(`/profiles?id=eq.${user.id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ email: user.email }),
    }).catch(() => {});
  });
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const rows = (await rest(`/profiles?id=eq.${userId}&select=id,email,role`, {
    method: "GET",
  })) as Profile[];
  return rows[0] ?? null;
}

export async function listProfiles(): Promise<Profile[]> {
  return rest("/profiles?select=id,email,role", { method: "GET" }) as Promise<Profile[]>;
}

export async function deleteProfile(userId: string): Promise<void> {
  await rest(`/profiles?id=eq.${userId}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }).catch(() => {});
}
