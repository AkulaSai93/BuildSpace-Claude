// Server-only helpers around Supabase's Auth (GoTrue) REST API.
// Nothing in this file is imported by client components — it is only ever
// called from route handlers under src/app/api/auth/*, so the service role
// key never reaches the browser.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured(): asserts SUPABASE_URL is string {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; email: string | null };
}

async function gotrue(path: string, init: RequestInit) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY!,
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = body?.error_description || body?.msg || body?.error || `Auth request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

export async function signUp(email: string, password: string): Promise<AuthSession> {
  const body = await gotrue("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // If email confirmation is required on the Supabase project, `signup`
  // returns a user with no session. Surface that clearly to the caller.
  if (!body.access_token) {
    throw new Error("Account created — check your email to confirm before signing in.");
  }
  return body as AuthSession;
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const body = await gotrue("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return body as AuthSession;
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const body = await gotrue("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  return body as AuthSession;
}

export async function getUser(accessToken: string) {
  return gotrue("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function signOut(accessToken: string) {
  await gotrue("/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => {
    // Best-effort — cookies get cleared regardless.
  });
}
