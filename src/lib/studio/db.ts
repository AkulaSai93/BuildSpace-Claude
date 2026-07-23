// Generic server-only Supabase REST helper shared by every BuildSpace
// Studio (admin panel) module added on top of the existing profiles/
// projects/workspace_data/project_content tables. Same pattern as
// src/lib/auth/profile.ts and src/lib/projectsData.ts — plain fetch against
// PostgREST with the service role key, no SDK dependency.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured(): asserts SUPABASE_URL is string {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
}

export async function studioRest<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
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
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase request failed (${res.status}): ${text}`);
  }
  if (res.status === 204) return null as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// Thin generic CRUD factory for simple one-table-one-shape entities. For
// anything with a composite/text primary key (e.g. `label`, `key`, `id`
// text), pass the column name as `idColumn`.
export function makeTableClient<T extends Record<string, unknown>>(table: string, idColumn: string = "id") {
  return {
    async list(query = ""): Promise<T[]> {
      return studioRest<T[]>(`/${table}?select=*${query ? `&${query}` : ""}`);
    },
    async get(id: string): Promise<T | null> {
      const rows = await studioRest<T[]>(`/${table}?${idColumn}=eq.${encodeURIComponent(id)}&select=*`);
      return rows[0] ?? null;
    },
    async create(row: Partial<T>): Promise<T> {
      const rows = await studioRest<T[]>(`/${table}`, { method: "POST", body: JSON.stringify(row) });
      return rows[0];
    },
    async update(id: string, row: Partial<T>): Promise<T> {
      const rows = await studioRest<T[]>(`/${table}?${idColumn}=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(row),
      });
      return rows[0];
    },
    async remove(id: string): Promise<void> {
      await studioRest(`/${table}?${idColumn}=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    },
  };
}

// Fire-and-forget audit log write — never throws, so a logging failure
// never breaks the admin action that triggered it.
export async function logAudit(actorEmail: string | null, action: string, target?: string, metadata?: unknown) {
  try {
    await studioRest("/audit_logs", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ actor_email: actorEmail, action, target, metadata: metadata ?? {} }),
    });
  } catch {
    // best-effort only
  }
}
