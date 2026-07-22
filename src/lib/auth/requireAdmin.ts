import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/supabaseAuth";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { getProfile } from "@/lib/auth/profile";

// Server-only guard for /api/admin/* routes. Verifies the session cookie
// against Supabase, then checks the profiles.role column. Returns either
// the authenticated admin user, or a ready-to-return NextResponse (401/403).
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: { id: string; email: string | null } } | { response: NextResponse }> {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return { response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  let authUser: { id: string; email: string | null };
  try {
    const u = await getUser(accessToken);
    authUser = { id: u.id, email: u.email };
  } catch {
    return { response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  const profile = await getProfile(authUser.id);
  if (!profile || profile.role !== "admin") {
    return { response: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  }

  return { user: authUser };
}
